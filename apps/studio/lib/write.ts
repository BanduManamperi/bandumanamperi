"use server";

import { Resend } from "resend";
import { STUDIO_EMAIL, WRITE_TOPICS } from "@/lib/studio";
import { escapeHtml } from "@/lib/text";

export type WriteState = {
    error?: string;
    ok?: boolean;
};

// An empty setting falls back to the studio, as an unset one does.
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || STUDIO_EMAIL;

/** A message written to the studio from the site, sent on by email with the writer as the reply-to. */
export async function sendMessage(_prev: WriteState, formData: FormData): Promise<WriteState> {
    // The hidden field only a bot fills in: thank it and send nothing.
    if (String(formData.get("company") ?? "").trim()) {
        return { ok: true };
    }

    const asked = String(formData.get("topic") ?? "").trim();
    const topic = WRITE_TOPICS.find((t) => t === asked) ?? null;
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || name.length > 200) return { error: "Enter your name." };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
        return { error: "Enter an email address the studio can reply to." };
    }
    if (!message) return { error: "Write a message to send." };
    if (message.length > 4000) return { error: "Shorten the message and send it again." };

    const failed = `The message could not be sent. Write to the studio at ${CONTACT_EMAIL}.`;
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL;
    if (!apiKey || !from) return { error: failed };

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
        from,
        to: CONTACT_EMAIL,
        replyTo: email,
        subject: topic ? `Studio message: ${topic}` : "Studio message",
        html: `
            <h2>Studio message</h2>
            ${topic ? `<p><strong>About:</strong> ${escapeHtml(topic)}</p>` : ""}
            <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
            <h3>Message</h3><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
        `,
    });

    if (error) {
        console.error("Studio message failed:", error);
        return { error: failed };
    }

    return { ok: true };
}
