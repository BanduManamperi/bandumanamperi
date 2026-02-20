import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Incoming contact form messages are sent to this address
const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "bandumanamperi@yahoo.com";
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL;

export async function POST(request: Request) {
    if (!process.env.RESEND_API_KEY || !RESEND_FROM_EMAIL) {
        return NextResponse.json(
            {
                error: "Contact form is not configured. Missing RESEND_API_KEY or RESEND_FROM_EMAIL.",
            },
            { status: 503 }
        );
    }

    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        if (!name || typeof name !== "string" || !name.trim()) {
            return NextResponse.json({ error: "Name is required." }, { status: 400 });
        }
        if (!email || typeof email !== "string" || !email.trim()) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 });
        }
        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json({ error: "Message is required." }, { status: 400 });
        }

        const subjectLine = subject && typeof subject === "string" && subject.trim()
            ? subject.trim()
            : "Contact form submission";

        const { error } = await resend.emails.send({
            from: RESEND_FROM_EMAIL,
            to: CONTACT_EMAIL,
            replyTo: email.trim(),
            subject: `[Bandu Manamperi] ${subjectLine}`,
            html: `
                <h2>New contact form message</h2>
                <p><strong>From:</strong> ${escapeHtml(name.trim())} &lt;${escapeHtml(email.trim())}&gt;</p>
                ${subjectLine !== "Contact form submission" ? `<p><strong>Subject:</strong> ${escapeHtml(subjectLine)}</p>` : ""}
                <h3>Message</h3>
                <p>${escapeHtml(message.trim()).replace(/\n/g, "<br>")}</p>
            `,
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json(
                { error: "Failed to send message. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Contact API error:", err);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
