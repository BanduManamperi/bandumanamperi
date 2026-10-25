import React from "react";
import { SheetHeader } from "./sheet-header";

type SpreadProps = {
    /** Shown in the top-right running head, like a chapter title. */
    section: React.ReactNode;
    /** 1-based position of this spread; drives the page numbers. */
    index: number;
    children: React.ReactNode;
};

// One printed spread: a sheet of paper on a grey ground, with running heads
// along the top and page numbers along the bottom. The horizontal scroll turns
// these like pages of a monograph.
export function Spread({ section, index, children }: SpreadProps) {
    return (
        <section className="h-full bg-[var(--stage)] lg:p-[clamp(1rem,2.2vw,2.25rem)]">
            <div
                data-sheet
                className="relative flex h-full flex-col lg:rounded-[2px] lg:shadow-[0_1px_2px_rgb(0_0_0/0.06),0_24px_60px_-28px_rgb(0_0_0/0.35)]"
            >
                <SheetHeader section={section} />

                <div className="min-h-0 flex-1 overflow-y-auto px-[var(--sheet-pad)] lg:overflow-hidden">{children}</div>

                <footer
                    aria-hidden
                    className="flex shrink-0 items-baseline justify-between px-[var(--sheet-pad)] pb-4 text-[0.6875rem] tabular-nums text-muted-foreground"
                >
                    <span>{index * 2 - 1}</span>
                    <span>{index * 2}</span>
                </footer>
            </div>
        </section>
    );
}

type SpreadPanelProps = SpreadProps & {
    /** Anchor id, so "/page#id" lands on this spread. */
    id: string;
    /** Name the scroller reports for this panel. */
    label: string;
};

// A spread as one screen-wide panel of a horizontally paged route.
export function SpreadPanel({ id, label, ...spread }: SpreadPanelProps) {
    return (
        <div id={id} data-panel data-panel-label={label} className="h-full w-screen flex-shrink-0 overflow-hidden">
            <Spread {...spread} />
        </div>
    );
}

// The row that holds a route's spreads side by side.
export function SpreadRow({ children }: { children: React.ReactNode }) {
    return <div className="flex h-full w-max flex-shrink-0 flex-row">{children}</div>;
}

// The standard two-page grid inside a spread: a narrow text page on the left,
// a wide image page on the right. Stacks on small screens.
export function SpreadGrid({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full">
            <div className="grid min-h-full grid-cols-1 gap-y-8 py-6 lg:grid-cols-12 lg:gap-x-[clamp(1.5rem,3vw,3.5rem)] lg:py-8">
                {children}
            </div>
        </div>
    );
}

export const leftPage = "flex min-w-0 flex-col lg:col-span-5 lg:h-full lg:overflow-y-auto xl:col-span-4";
export const rightPage = "order-first flex min-h-0 min-w-0 flex-col lg:order-none lg:col-span-7 lg:h-full xl:col-span-8";
/**
 * A right page whose picture runs off the sheet's right edge, as a photograph
 * bleeds off a printed page. Desktop only; on phones the picture stays inset.
 */
export const rightPageBleed = `${rightPage} lg:-mr-[var(--sheet-pad)]`;
/** A right page that follows the text on small screens, for indexes rather than pictures. */
export const rightPageAfterText = "flex min-h-0 min-w-0 flex-col lg:col-span-7 lg:h-full xl:col-span-8";
