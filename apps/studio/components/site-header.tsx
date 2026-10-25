import Link from "next/link";
import type { Shelf } from "@/lib/inventory";

export function SiteHeader({ shelf }: { shelf?: Shelf }) {
    const item = (name: Shelf, href: string, label: string) => {
        const current = shelf === name;
        return (
            <Link
                href={href}
                aria-current={current ? "page" : undefined}
                className={current ? "underline decoration-ink underline-offset-4" : "text-mute hover:text-ink"}
            >
                {label}
            </Link>
        );
    };

    return (
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-4 py-3 sm:px-5">
            <Link href="/" className="flex items-baseline gap-3">
                <span>Studio</span>
                <span className="hidden text-mute sm:inline">Bandu Manamperi</span>
            </Link>
            <nav aria-label="Inventory" className="flex items-center gap-5">
                {item("available", "/", "Available")}
                {item("sold", "/sold", "Sold")}
            </nav>
        </header>
    );
}
