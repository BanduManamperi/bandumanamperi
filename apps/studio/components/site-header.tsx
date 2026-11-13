import Link from "next/link";
import { Monogram } from "@/components/brand/monogram";

type Section = "about" | "paintings" | "framing";

const PRIMARY: { section: Section; href: string; label: string }[] = [
    { section: "paintings", href: "/paintings-and-drawings", label: "Paintings and Drawings" },
    { section: "framing", href: "/framing-and-restoration", label: "Framing and Restoration" },
    { section: "about", href: "/about", label: "About" },
];

export function SiteHeader({ section }: { section?: Section }) {
    return (
        <header className="shrink-0 border-b border-border bg-background">
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-5">
                <Link href="/" className="flex items-center gap-2.5 text-foreground transition-colors hover:text-foreground/70">
                    <Monogram className="h-4 w-auto shrink-0" />
                    <span className="flex items-baseline gap-2 font-serif italic">
                        <span>Bandu Manamperi</span>
                        <span className="hidden text-[0.75rem] text-muted-foreground not-italic sm:inline">Home &amp; Studio</span>
                    </span>
                </Link>
                <nav aria-label="Sections" className="flex items-center gap-5 text-[0.8125rem]">
                    {PRIMARY.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            aria-current={section === item.section ? "page" : undefined}
                            className={section === item.section ? "underline decoration-foreground underline-offset-4" : "text-muted-foreground hover:text-foreground"}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}
