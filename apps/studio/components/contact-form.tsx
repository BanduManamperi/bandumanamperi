"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/lib/contact";

const TOPICS = ["Custom framing", "Conservation and restoration", "Something else"];

const initial: ContactState = {};

export function ContactForm() {
    const [state, action, pending] = useActionState(sendContact, initial);

    if (state.ok) {
        return (
            <p className="text-[1.25rem] font-light leading-snug text-foreground">
                Enquiry sent. The studio will reply by email.
            </p>
        );
    }

    return (
        <form action={action} className="max-w-[28rem] space-y-5">
            <p className="hidden" aria-hidden>
                <label htmlFor="company">Company</label>
                <input id="company" name="company" tabIndex={-1} autoComplete="off" />
            </p>

            <div>
                <label htmlFor="name" className="block text-[0.8125rem] text-muted-foreground">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    maxLength={200}
                    className="mt-1 w-full border border-border bg-background px-3 py-2 text-foreground"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-[0.8125rem] text-muted-foreground">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={200}
                    className="mt-1 w-full border border-border bg-background px-3 py-2 text-foreground"
                />
            </div>

            <div>
                <label htmlFor="topic" className="block text-[0.8125rem] text-muted-foreground">
                    Topic
                </label>
                <select
                    id="topic"
                    name="topic"
                    defaultValue=""
                    className="mt-1 w-full cursor-pointer appearance-none border border-border bg-background px-3 py-2 text-foreground"
                >
                    <option value="" disabled>
                        Choose a topic
                    </option>
                    {TOPICS.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="message" className="block text-[0.8125rem] text-muted-foreground">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    maxLength={4000}
                    className="mt-1 w-full border border-border bg-background px-3 py-2 text-foreground"
                />
            </div>

            {state.error && <p className="text-[0.9375rem] text-foreground">{state.error}</p>}

            <button
                type="submit"
                disabled={pending}
                className="bg-foreground px-4 py-2.5 text-background disabled:opacity-50"
            >
                {pending ? "Sending" : "Send enquiry"}
            </button>
        </form>
    );
}
