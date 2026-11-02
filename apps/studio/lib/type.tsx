import React from "react";
import Link from "next/link";

// Shared type for the studio's pages. Anton carries the page headlines -
// tall, condensed, set once per page. Noto Sans carries everything else.

/** The largest title on a page: names, section titles. Set once per page. */
export const display = "font-display text-[clamp(3rem,7vw,7rem)] font-normal uppercase leading-[0.88] tracking-[-0.01em] text-foreground";

/** A work or section title. */
export const title = "font-display text-[clamp(1.75rem,3.5vw,3.5rem)] font-normal uppercase leading-[0.92] tracking-[-0.01em] text-foreground";

/** A heading inside a page. */
export const heading = "text-[1.0625rem] font-bold leading-tight text-foreground";

export const body = "text-[0.9375rem] leading-[1.6] text-foreground/80";

export const caption = "text-[0.6875rem] text-muted-foreground";

export const textLink = "text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export type Fact = { label: string; value: React.ReactNode };

/** Studio facts, set like a wall label. Empty values are dropped. */
export function Facts({ items, labelWidth = "6.5rem", className = "" }: { items: Fact[]; labelWidth?: string; className?: string }) {
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

/** An underlined text link with a trailing arrow, the studio's one link style. */
export function TextLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
    return (
        <Link href={href} className={`inline-flex items-baseline gap-1.5 ${textLink} ${className}`}>
            {children}
            <span aria-hidden>&rarr;</span>
        </Link>
    );
}
