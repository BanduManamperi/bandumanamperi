"use client"

import { useEffect, useRef } from "react"

/**
 * A horizontal scroll panel that also snaps vertically between its children.
 *
 * Wheel behaviour:
 *  - Not at vertical boundary → scrolls vertically (own the event).
 *  - At bottom + scrolling down → propagates to HorizontalScroll → next section.
 *  - At top + scrolling up   → propagates to HorizontalScroll → previous section.
 *
 * IntersectionObserver:
 *  - Every time HorizontalScroll navigates to this panel it becomes fully visible.
 *  - We reset to the first sub-panel and lock for 850 ms so inertia from the
 *    horizontal swipe doesn't immediately jump to the second sub-panel.
 */
export function VerticalSnapPanel({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    const lockedRef = useRef(true)          // start locked until first intersection
    const currentIndexRef = useRef(0)
    const rafRef = useRef<number | null>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        /* ── Intersection observer: reset + lock on every arrival ── */
        let wasVisible = false

        const observer = new IntersectionObserver(
            ([entry]) => {
                const isVisible = entry.intersectionRatio > 0.95

                if (isVisible && !wasVisible) {
                    // Panel just came into view — reset to top sub-panel
                    if (rafRef.current) cancelAnimationFrame(rafRef.current)
                    el.scrollTop = 0
                    currentIndexRef.current = 0

                    // Lock to absorb inertia bleed from the horizontal scroll
                    lockedRef.current = true
                    setTimeout(() => { lockedRef.current = false }, 850)
                }

                wasVisible = isVisible
            },
            { threshold: [0, 0.95] }
        )

        observer.observe(el)

        /* ── Wheel handler ── */
        const easeInOutCubic = (t: number): number =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

        const animateTo = (targetTop: number, onDone: () => void) => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            const start = el.scrollTop
            const dist = targetTop - start
            const duration = 700
            const t0 = performance.now()

            const step = (now: number) => {
                const p = Math.min((now - t0) / duration, 1)
                el.scrollTop = start + dist * easeInOutCubic(p)
                if (p < 1) {
                    rafRef.current = requestAnimationFrame(step)
                } else {
                    el.scrollTop = targetTop
                    rafRef.current = null
                    onDone()
                }
            }
            rafRef.current = requestAnimationFrame(step)
        }

        const onWheel = (e: WheelEvent) => {
            const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
            if (Math.abs(raw) < 3) return

            const totalPanels = el.children.length
            const atEnd   = currentIndexRef.current >= totalPanels - 1
            const atStart = currentIndexRef.current <= 0

            // At boundary → let HorizontalScroll handle it
            if (raw > 0 && atEnd)   return
            if (raw < 0 && atStart) return

            // Own the event for vertical scrolling
            e.preventDefault()
            e.stopPropagation()

            if (lockedRef.current) return

            const next = Math.max(
                0,
                Math.min(currentIndexRef.current + Math.sign(raw), totalPanels - 1)
            )
            if (next === currentIndexRef.current) return

            lockedRef.current = true
            currentIndexRef.current = next

            animateTo(next * el.clientHeight, () => {
                setTimeout(() => { lockedRef.current = false }, 80)
            })
        }

        el.addEventListener("wheel", onWheel, { passive: false })

        return () => {
            el.removeEventListener("wheel", onWheel)
            observer.disconnect()
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    return (
        <div
            ref={ref}
            className="w-screen flex-shrink-0 h-full overflow-y-scroll overflow-x-hidden"
            style={{ scrollbarWidth: "none" } as React.CSSProperties}
        >
            {children}
        </div>
    )
}
