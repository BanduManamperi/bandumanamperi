"use client";

import { useActionState } from "react";
import { sendEnquiry, type EnquireState } from "@/lib/enquire";

const initial: EnquireState = {};

export function EnquireForm({ slug, title }: { slug: string; title: string }) {
    const [state, action, pending] = useActionState(sendEnquiry, initial);

    if (state.ok) {
        return (
            <p className="text-[1.25rem] font-light leading-snug">
                Enquiry sent about {title}. The studio will reply by email.
            </p>
        );
    }

    return (
        <form action={action} className="space-y-5">
            <input type="hidden" name="slug" value={slug} />
            <p className="hidden" aria-hidden>
                <label htmlFor="company">Company</label>
                <input id="company" name="company" tabIndex={-1} autoComplete="off" />
            </p>

            <div>
                <label htmlFor="name" className="block text-[0.8125rem] text-mute">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    maxLength={200}
                    className="mt-1 w-full border border-line bg-paper px-3 py-2"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-[0.8125rem] text-mute">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    maxLength={200}
                    className="mt-1 w-full border border-line bg-paper px-3 py-2"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-[0.8125rem] text-mute">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    maxLength={4000}
                    className="mt-1 w-full border border-line bg-paper px-3 py-2"
                />
            </div>

            {state.error && <p className="text-[0.9375rem]">{state.error}</p>}

            <button
                type="submit"
                disabled={pending}
                className="bg-ink px-4 py-2.5 text-paper disabled:opacity-50"
            >
                {pending ? "Sending" : "Send enquiry"}
            </button>
        </form>
    );
}
