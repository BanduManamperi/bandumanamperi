import React from "react";

// A flat page of the studio's own ledger: no floating card, no dark stage -
// just the warm paper, filling the viewport, scrolling internally. The
// main site turns pages like a monograph; the studio keeps a plain record.
export function LedgerPage({
    children,
    className = "",
    wide = false,
}: {
    children: React.ReactNode;
    className?: string;
    /** A page with more than one column of content needs the room. */
    wide?: boolean;
}) {
    return (
        <main className={`min-h-0 flex-1 overflow-y-auto bg-background text-foreground ${className}`}>
            <div className={`mx-auto w-full px-[clamp(1.25rem,4vw,3rem)] py-12 lg:py-16 ${wide ? "max-w-[72rem]" : "max-w-[46rem]"}`}>
                {children}
            </div>
        </main>
    );
}
