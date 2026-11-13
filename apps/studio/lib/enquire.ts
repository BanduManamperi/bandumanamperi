"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import { getRoom } from "@/lib/inventory";
import { offerLine } from "@/lib/price";
import { STUDIO_EMAIL } from "@/lib/studio";
import { escapeHtml } from "@/lib/text";

export type EnquireState = {
    error?: string;
    ok?: boolean;
};

// An empty setting falls back to the studio, as an unset one does.
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || STUDIO_EMAIL;

export async function sendEnquiry(_prev: EnquireState, formData: FormData): Promise<EnquireState> {
    if (String(formData.get("company") ?? "").trim()) {
        return { ok: true };
    }

    const slug = String(formData.get("slug") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || name.length > 200) return { error: "Enter your name." };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
        return { error: "Enter an email address the studio can reply to." };
    }
    if (message.length > 4000) return { error: "Shorten the message and send it again." };

    const room = await getRoom(slug);
    if (!room || room.work.availability !== "available") {
        return { error: "This work is not open for enquiry." };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !from) {
        return { error: `The enquiry could not be sent. Write to the studio at ${CONTACT_EMAIL}.` };
    }

    const { work } = room;
    const price = offerLine(work);
    const h = await headers();
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("host");
    const page = host ? `${proto}://${host}${work.href}` : work.href;
    const facts = [work.year, work.medium, work.dimensions, price?.text].filter(Boolean).join(", ");

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
        from,
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: `Studio enquiry: ${work.title} (${work.label})`,
        html: `
            <h2>Studio enquiry</h2>
            <p><strong>Work:</strong> ${escapeHtml(work.title)} (${escapeHtml(work.label)})</p>
            ${facts ? `<p><strong>Details:</strong> ${escapeHtml(facts)}</p>` : ""}
            <p><strong>Page:</strong> ${escapeHtml(page)}</p>
            <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
            ${message ? `<h3>Message</h3><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>` : ""}
        `,
    });

    if (error) {
        console.error("Studio enquiry failed:", error);
        return { error: `The enquiry could not be sent. Write to the studio at ${CONTACT_EMAIL}.` };
    }

    return { ok: true };
}
