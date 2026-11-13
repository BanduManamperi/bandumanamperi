"use client";

import { useId, useRef } from "react";

// A sheet over the page, for reading or writing at length without leaving
// it: one comfortable column under a title and a Close. Escape, Close, or a
// click outside the sheet closes it, and focus goes back to the button that
// opened it. On a phone the sheet fills the screen. It stays in the page
// while it is closed, so anything typed into it is still there when it
// opens again.
export function Sheet({
    label,
    title,
    subtitle,
    className = "",
    children,
}: {
    /** What the button that opens the sheet says. */
    label: React.ReactNode;
    title: string;
    subtitle?: string | null;
    /** Classes for the button that opens the sheet. */
    className?: string;
    children: React.ReactNode;
}) {
    const dialog = useRef<HTMLDialogElement>(null);
    const opener = useRef<HTMLButtonElement>(null);
    const body = useRef<HTMLDivElement>(null);
    const overflow = useRef("");
    const titleId = useId();

    const open = () => {
        const node = dialog.current;
        if (!node || node.open) return;
        node.showModal();
        overflow.current = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        // Focus starts on the first field to fill in when there is one, and
        // otherwise on the text, so the keys scroll it straight away.
        const start = body.current?.querySelector<HTMLElement>("[data-autofocus]") ?? body.current;
        start?.focus();
    };

    const close = () => dialog.current?.close();

    return (
        <>
            <button ref={opener} type="button" onClick={open} aria-haspopup="dialog" className={className}>
                {label}
            </button>

            <dialog
                ref={dialog}
                aria-labelledby={titleId}
                onClose={() => {
                    document.body.style.overflow = overflow.current;
                    opener.current?.focus();
                }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) close();
                }}
                className="m-0 h-dvh max-h-none w-full max-w-none bg-background p-0 text-foreground backdrop:bg-foreground/40 backdrop:backdrop-blur-[2px] sm:m-auto sm:h-fit sm:max-h-[85dvh] sm:w-[min(40rem,calc(100vw-3rem))] sm:shadow-[0_24px_64px_-24px_rgba(0,0,0,0.45)]"
            >
                <div className="flex h-full flex-col sm:h-auto sm:max-h-[85dvh]">
                    <header className="flex shrink-0 items-start justify-between gap-6 border-b border-foreground/15 px-6 pb-5 pt-6 sm:px-10 sm:pt-9">
                        <div>
                            <h2 id={titleId} className="font-serif text-[1.5rem] leading-[1.1] sm:text-[1.875rem]">
                                {title}
                            </h2>
                            {subtitle && <p className="mt-1 font-serif text-[1rem] text-foreground/65">{subtitle}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={close}
                            className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-foreground/65 transition-colors hover:text-foreground"
                        >
                            Close
                        </button>
                    </header>
                    <div ref={body} tabIndex={-1} className="min-h-0 flex-1 overflow-y-auto px-6 py-6 outline-none sm:px-10 sm:py-8">
                        {children}
                    </div>
                </div>
            </dialog>
        </>
    );
}
