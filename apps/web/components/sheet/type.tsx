import React from "react";
import Link from "next/link";

// Shared type for the sheets. One family (Noto Sans); hierarchy comes from
// size and the Light weight the monogram is drawn in, not from bold.

/** The largest title on a page: names, section titles. */
export const display = "font-display text-[clamp(3rem,4.8vw,6rem)] font-light leading-[0.95] tracking-[-0.02em] text-foreground";

/** A work or exhibition title. */
export const title = "font-display text-[clamp(2rem,3vw,3.5rem)] font-light leading-[1.02] tracking-[-0.02em] text-foreground";

/** A heading inside a document. */
export const heading = "font-display text-[1.375rem] font-light leading-tight text-foreground";

export const body = "text-[0.9375rem] leading-[1.6] text-foreground/80";

export const caption = "text-[0.6875rem] text-muted-foreground";

export const textLink =
    "text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export type Fact = { label: string; value: React.ReactNode };

/** Project data set like the facts on a portfolio page. Empty values are dropped. */
export function Facts({ items, labelWidth = "5.5rem", className = "" }: { items: Fact[]; labelWidth?: string; className?: string }) {
    const shown = items.filter((f) => f.value !== null && f.value !== undefined && f.value !== "");
    if (shown.length === 0) return null;
    return (
        <dl
            className={`grid gap-x-4 gap-y-2 text-[0.75rem] leading-[1.5] ${className}`}
            style={{ gridTemplateColumns: `${labelWidth} 1fr` }}
        >
            {shown.map((f) => (
                <React.Fragment key={f.label}>
                    <dt className="text-muted-foreground">{f.label}</dt>
                    <dd className="text-foreground">{f.value}</dd>
                </React.Fragment>
            ))}
        </dl>
    );
}

/** An underlined text link, the only link style the sheets use. */
export function TextLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
    return (
        <Link href={href} className={`${textLink} ${className}`}>
            {children}
        </Link>
    );
}
