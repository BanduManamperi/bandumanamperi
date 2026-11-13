"use client";

import React, { useEffect, useRef } from "react";
import { SheetHeader } from "./sheet-header";

type DocumentSheetProps = {
    /** Anchor id when the sheet sits in a row of panels. */
    id?: string;
    /**
     * When the sheet sits beside spreads, hand the wheel back to the pager at
     * the top and bottom so the reader can keep turning pages. Off for
     * standalone pages, where overscrolling up would otherwise jump home.
     */
    handoff?: boolean;
    children: React.ReactNode;
};

// A long sheet for reading pages (CV, archive, exhibition records). Same paper
// and running head as a spread, but the paper scrolls vertically inside the
// frame instead of turning sideways, so the running head stays in view.
export function DocumentSheet({ id, handoff = false, children }: DocumentSheetProps) {
    const ref = useRef<HTMLDivElement>(null);

    // A native listener, so stopPropagation reliably beats the pager's own
    // wheel listener on an ancestor.
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
            if (!handoff) {
                e.stopPropagation();
                return;
            }
            const atTop = el.scrollTop <= 0;
            const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
            const goingDown = e.deltaY > 0;
            if ((goingDown && !atBottom) || (!goingDown && !atTop)) e.stopPropagation();
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [handoff]);

    return (
        <div id={id} data-panel className="h-full w-screen flex-shrink-0 bg-[var(--stage)] lg:p-[clamp(1rem,2.2vw,2.25rem)]">
            <div
                data-sheet
                className="flex h-full flex-col lg:rounded-[2px] lg:shadow-[0_1px_2px_rgb(0_0_0/0.06),0_24px_60px_-28px_rgb(0_0_0/0.35)]"
            >
                <SheetHeader />
                <div ref={ref} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-[var(--sheet-pad)] pb-16">
                    {children}
                </div>
            </div>
        </div>
    );
}
