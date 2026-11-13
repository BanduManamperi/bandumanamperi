"use client";

import { startTransition, useActionState, useEffect, useId, useRef } from "react";
import { Sheet } from "@/components/sheet";
import { STUDIO_EMAIL, WRITE_TOPICS, mailStudio } from "@/lib/studio";
import { sendMessage, type WriteState } from "@/lib/write";

// Writing to the studio from the page, on a sheet over it: who is writing,
// what it is about, and the message, sent on to the studio by email. The
// studio's own address stays beside the form for anyone who would rather
// write from their own mail.

/** The field labels, in the label's small spaced capitals. */
const caps = "block font-mono text-[0.625rem] uppercase tracking-[0.16em] text-foreground/65";
/** The focus ring sits on the field's own edge rather than standing off it, so the two read as one line. */
const field =
    "mt-2 block w-full border border-foreground/25 bg-room-paper px-3 py-2.5 text-[0.9375rem] text-foreground transition-colors outline-offset-0 hover:border-foreground/50 focus:border-foreground";

const initial: WriteState = {};

function WriteForm({ about }: { about: string }) {
    const [state, send, pending] = useActionState(sendMessage, initial);
    const thanks = useRef<HTMLDivElement>(null);
    const id = useId();

    // The form gives way to the thanks, so focus follows it there.
    useEffect(() => {
        if (state.ok) thanks.current?.focus();
    }, [state.ok]);

    if (state.ok) {
        return (
            <div ref={thanks} tabIndex={-1} role="status" className="outline-none">
                <p className="font-serif text-[1.5rem] leading-[1.15]">Thank you</p>
                <p className="mt-3 max-w-[30rem] text-[0.9375rem] leading-relaxed text-foreground/80">
                    Your message is with the studio, and it will reply by email.
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={(e) => {
                // Sent by hand rather than as the form's action, so a message
                // that fails to send stays in the fields instead of being cleared.
                e.preventDefault();
                const data = new FormData(e.currentTarget);
                startTransition(() => send(data));
            }}
            className="space-y-6"
        >
            <p className="hidden" aria-hidden="true">
                <label htmlFor={`${id}-company`}>Company</label>
                <input id={`${id}-company`} name="company" tabIndex={-1} autoComplete="off" />
            </p>

            <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
                <div>
                    <label htmlFor={`${id}-name`} className={caps}>
                        Name
                    </label>
                    <input id={`${id}-name`} name="name" required autoComplete="name" maxLength={200} data-autofocus className={field} />
                </div>
                <div>
                    <label htmlFor={`${id}-email`} className={caps}>
                        Email
                    </label>
                    <input id={`${id}-email`} name="email" type="email" required autoComplete="email" maxLength={200} className={field} />
                </div>
            </div>

            <fieldset>
                <legend className={caps}>About</legend>
                <div className="mt-3 flex flex-col gap-2.5">
                    {WRITE_TOPICS.map((topic) => (
                        <label key={topic} className="flex w-fit cursor-pointer items-center gap-3 text-[0.9375rem] text-foreground/85">
                            <input type="radio" name="topic" value={topic} className="size-4 cursor-pointer accent-foreground" />
                            {topic}
                        </label>
                    ))}
                </div>
            </fieldset>

            <div>
                <label htmlFor={`${id}-message`} className={caps}>
                    Message
                </label>
                <textarea id={`${id}-message`} name="message" required rows={6} maxLength={4000} className={`${field} resize-y leading-relaxed`} />
            </div>

            {state.error && (
                <p role="alert" className="text-[0.875rem] leading-relaxed text-foreground">
                    {state.error}
                </p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-1">
                <button
                    type="submit"
                    disabled={pending}
                    className="bg-foreground px-6 py-3 text-[0.875rem] font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
                >
                    {pending ? "Sending…" : "Send"}
                </button>
                <p className="text-[0.8125rem] leading-relaxed text-foreground/65">
                    Or write to{" "}
                    <a href={mailStudio(about)} className="text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground">
                        {STUDIO_EMAIL}
                    </a>
                </p>
            </div>
        </form>
    );
}

/** The button that opens the sheet, and the sheet with the form on it. */
export function WriteToStudio({ about, className = "" }: { about: string; className?: string }) {
    return (
        <Sheet
            label={
                <>
                    Write to the studio <span aria-hidden="true">→</span>
                </>
            }
            title="Write to the studio"
            subtitle={about}
            className={className}
        >
            <WriteForm about={about} />
        </Sheet>
    );
}
