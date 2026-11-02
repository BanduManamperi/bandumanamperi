import Link from "next/link";

// A numbered line in the studio's ledger - the same zero-padded numbering
// lib/inventory.ts already gives every work, used here for the studio's own
// catalogue of sections and services.
export function LedgerRow({
    number,
    title,
    description,
    href,
}: {
    number: string;
    title: string;
    description: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="group grid grid-cols-[2.75rem_1fr] items-baseline gap-x-4 border-b border-border py-5 first:border-t focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
            <span className="text-[0.8125rem] tabular-nums text-muted-foreground">No. {number}</span>
            <span>
                <span className="block text-[1.25rem] font-bold leading-tight text-foreground underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-foreground">
                    {title}
                </span>
                <span className="mt-1 block text-[0.8125rem] text-muted-foreground">{description}</span>
            </span>
        </Link>
    );
}
