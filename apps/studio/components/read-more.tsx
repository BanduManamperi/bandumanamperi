"use client";

import { useEffect, useRef, useState } from "react";

// The description of a work, kept behind a button so it never takes room from
// the picture, and opened as a page of its own to read: one comfortable
// column of larger type, on a sheet over the work. Escape, the close button,
// or a click outside the sheet closes it. On a phone the sheet fills the
// screen.
export function ReadMore({ title, year, text, className = "" }: { title: string; year?: string | null; text: string; className?: string }) {
    const [open, setOpen] = useState(false);
    const dialog = useRef<HTMLDialogElement>(null);
    const opener = useRef<HTMLButtonElement>(null);
    const body = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const node = dialog.current;
        node?.showModal();
        // Focus starts on the text, not the close button, so the keys scroll it straight away.
        body.current?.focus();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    const close = () => {
        dialog.current?.close();
        setOpen(false);
        opener.current?.focus();
    };

    return (
        <>
            <button
                ref={opener}
                type="button"
                onClick={() => setOpen(true)}
                aria-haspopup="dialog"
                className={`text-left underline decoration-foreground/30 underline-offset-[5px] transition-colors hover:decoration-foreground ${className}`}
            >
                Read about the work
            </button>

            {open && (
                <dialog
                    ref={dialog}
                    aria-modal="true"
                    aria-labelledby="read-more-title"
                    onCancel={(e) => {
                        e.preventDefault();
                        close();
                    }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) close();
                    }}
                    className="m-0 h-dvh max-h-none w-full max-w-none bg-background p-0 text-foreground backdrop:bg-foreground/40 backdrop:backdrop-blur-[2px] sm:m-auto sm:h-fit sm:max-h-[85dvh] sm:w-[min(40rem,calc(100vw-3rem))] sm:shadow-[0_24px_64px_-24px_rgba(0,0,0,0.45)]"
                >
                    <div className="flex h-full flex-col sm:h-auto sm:max-h-[85dvh]">
                        <header className="flex shrink-0 items-start justify-between gap-6 border-b border-foreground/15 px-6 pb-5 pt-6 sm:px-10 sm:pt-9">
                            <div>
                                <h2 id="read-more-title" className="font-serif text-[1.5rem] leading-[1.1] sm:text-[1.875rem]">
                                    {title}
                                </h2>
                                {year && <p className="mt-1 font-serif text-[1rem] text-foreground/50">{year}</p>}
                            </div>
                            <button
                                type="button"
                                onClick={close}
                                className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-foreground/60 transition-colors hover:text-foreground"
                            >
                                Close
                            </button>
                        </header>
                        <div ref={body} tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto px-6 py-6 outline-none sm:px-10 sm:py-8">
                            <p className="max-w-[34rem] text-[1rem] leading-[1.8] text-foreground/85 sm:text-[1.0625rem]">{text}</p>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
}
