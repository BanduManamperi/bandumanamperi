"use server";

import { Resend } from "resend";
import { escapeHtml } from "@/lib/text";

export type ContactState = {
    error?: string;
    ok?: boolean;
};

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "bandumanamperi@yahoo.com";

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
    if (String(formData.get("company") ?? "").trim()) {
        return { ok: true };
    }

    const topic = String(formData.get("topic") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || name.length > 200) return { error: "Enter your name." };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
        return { error: "Enter an email address the studio can reply to." };
    }
    if (!message || message.length > 4000) return { error: "Write a short message and send it again." };

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !from) {
        return { error: `The enquiry could not be sent. Write to the studio at ${CONTACT_EMAIL}.` };
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
        from,
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: topic ? `Studio enquiry: ${topic}` : "Studio enquiry",
        html: `
            <h2>Studio enquiry</h2>
            ${topic ? `<p><strong>Topic:</strong> ${escapeHtml(topic)}</p>` : ""}
            <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
            <h3>Message</h3><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        `,
    });

    if (error) {
        console.error("Studio contact failed:", error);
        return { error: `The enquiry could not be sent. Write to the studio at ${CONTACT_EMAIL}.` };
    }

    return { ok: true };
}
