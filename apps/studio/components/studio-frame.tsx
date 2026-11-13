import Link from "next/link";
import { mailStudio } from "@/lib/studio";

// The studio's frame: a single screen with the way in set in small capitals
// along the top and bottom edges, and the page itself held between them, a
// hairline above the bottom row. The landing page fills it with two pictures;
// the catalogue scrolls inside it. On a phone each row folds onto two lines:
// the middle link across the top, the outer two beneath it at either side.

/** `short` stands in for the label on the narrowest screens, for labels that cannot wrap. */
type Slot = { href: string; label: string; short?: string; external?: boolean };

const TOP: [Slot, Slot, Slot] = [
    { href: "/paintings-and-drawings", label: "Paintings and Drawings" },
    { href: "/", label: "Bandu Manamperi Home & Studio" },
    { href: "/framing-and-restoration", label: "Framing and Restoration" },
];

const BOTTOM: [Slot, Slot, Slot] = [
    { href: "/about", label: "About" },
    { href: mailStudio("Studio visit"), label: "Visits by appointment", external: true },
    { href: "https://bandumanamperi.com", label: "bandumanamperi.com", short: "Portfolio", external: true },
];

const slotText = "text-[0.6875rem] uppercase leading-snug tracking-[0.08em] text-foreground sm:text-[0.75rem]";

function SlotLink({ slot, align, current }: { slot: Slot; align: "start" | "center" | "end"; current: boolean }) {
    // The outer slots wrap when space runs short; the middle one keeps to one
    // line, on its own row on a phone.
    const placement = {
        start: "col-start-1 row-start-2 justify-self-start text-left max-w-[14rem] md:row-start-1",
        center: "col-span-2 row-start-1 justify-self-center text-center whitespace-nowrap md:col-span-1 md:col-start-2",
        end: "col-start-2 row-start-2 justify-self-end text-right max-w-[14rem] md:col-start-3 md:row-start-1",
    }[align];
    const underline = current ? "decoration-foreground" : "decoration-transparent hover:decoration-foreground";
    const className = `${slotText} ${placement} underline underline-offset-4 transition-colors ${underline}`;
    const label = slot.short ? (
        <>
            <span className="min-[360px]:hidden">{slot.short}</span>
            <span className="hidden min-[360px]:inline">{slot.label}</span>
        </>
    ) : (
        slot.label
    );
    return slot.external ? (
        <a href={slot.href} className={className}>
            {label}
        </a>
    ) : (
        <Link href={slot.href} aria-current={current ? "page" : undefined} className={className}>
            {label}
        </Link>
    );
}

function Row({ slots, as: Tag, current }: { slots: [Slot, Slot, Slot]; as: "header" | "footer"; current?: string }) {
    return (
        <Tag
            className={`grid shrink-0 grid-cols-2 items-center gap-x-4 gap-y-2 py-[clamp(0.875rem,2vw,1.25rem)] md:grid-cols-[1fr_auto_1fr] ${Tag === "footer" ? "border-t border-border" : ""}`}
        >
            {(["start", "center", "end"] as const).map((align, i) => (
                <SlotLink key={align} slot={slots[i]} align={align} current={slots[i].href === current && slots[i].href !== "/"} />
            ))}
        </Tag>
    );
}

export function StudioFrame({
    current,
    className = "",
    children,
}: {
    /** The section being shown, underlined in the frame. */
    current?: string;
    /** Classes for the space between the two rows. */
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-dvh flex-col bg-background px-[clamp(1rem,4.5vw,3rem)]">
            <Row slots={TOP} as="header" current={current} />
            <main className={`min-h-0 flex-1 ${className}`}>{children}</main>
            <Row slots={BOTTOM} as="footer" current={current} />
        </div>
    );
}
