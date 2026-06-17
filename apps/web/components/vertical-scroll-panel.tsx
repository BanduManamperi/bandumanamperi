"use client"

import { useEffect, useRef } from "react"

// A full-screen panel inside HorizontalScroll that scrolls vertically on its own,
// then hands the wheel back to HorizontalScroll once it reaches the top/bottom edge
// (so you can keep swiping to the next/previous horizontal panel).
//
// Uses a NATIVE wheel listener so stopPropagation reliably prevents the
// HorizontalScroll listener (attached to an ancestor) from firing.
export function VerticalScrollPanel({
    children,
    label,
    id,
}: {
    children: React.ReactNode
    label?: string
    id?: string
}) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const onWheel = (e: WheelEvent) => {
            // Horizontal-intent gestures always belong to HorizontalScroll.
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return

            const atTop = el.scrollTop <= 0
            const atBottom =
                Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight
            const goingDown = e.deltaY > 0

            // If there's still room to scroll vertically, keep the event here.
            if ((goingDown && !atBottom) || (!goingDown && !atTop)) {
                e.stopPropagation()
            }
            // Otherwise let it bubble to HorizontalScroll for panel navigation.
        }

        el.addEventListener("wheel", onWheel, { passive: false })
        return () => el.removeEventListener("wheel", onWheel)
    }, [])

    return (
        <div
            ref={ref}
            id={id}
            data-panel=""
            data-panel-label={label}
            data-no-cursor-nav=""
            className="w-screen h-full flex-shrink-0 overflow-y-auto overflow-x-hidden"
            style={{ scrollbarWidth: "none" } as React.CSSProperties}
        >
            {children}
        </div>
    )
}
