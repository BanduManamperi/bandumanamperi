import React from "react";
import Link from "next/link";
import { Monogram } from "@/components/brand/monogram";

// Running head shared by every sheet: the monogram and name on the left (the
// way home, as on any site), the section on the right.
export function SheetHeader({ section }: { section: React.ReactNode }) {
    return (
        <header className="flex shrink-0 items-center justify-between gap-6 px-[var(--sheet-pad)] pt-4 text-[0.6875rem] text-muted-foreground">
            <Link
                href="/"
                className="flex items-center gap-2 transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
                <Monogram className="h-3.5 w-auto text-foreground" />
                Bandu Manamperi
            </Link>
            <div className="truncate">{section}</div>
        </header>
    );
}
