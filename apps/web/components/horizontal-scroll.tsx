"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { CursorNav } from "@/components/cursor-nav"
import { registerGoToPanel, setActivePanelId } from "@/components/horizontal-scroll-store"

const easeInOutCubic = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export function HorizontalScroll({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null)
    const lockedRef = useRef(false)
    // tracks where we ARE (or heading), not read from scrollLeft during animation
    const currentPanelRef = useRef(0)
    const rafRef = useRef<number | null>(null)

    const [activeIndex, setActiveIndex] = useState(0)
    const [panelCount, setPanelCount] = useState(1)

    // This component lives in the root layout (mounted once), while listeners are
    // set up only on mount — keep route info in refs so handlers see current values.
    const pathname = usePathname()
    const router = useRouter()
    const pathnameRef = useRef(pathname)
    const routerRef = useRef(router)
    pathnameRef.current = pathname
    routerRef.current = router

    const animateTo = useCallback((targetLeft: number, onDone: () => void) => {
        const el = ref.current
        if (!el) return
        if (rafRef.current) cancelAnimationFrame(rafRef.current)

        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        if (reduce) {
            el.scrollLeft = targetLeft
            onDone()
            return
        }

        const start = el.scrollLeft
        const dist = targetLeft - start
        const duration = 700
        const t0 = performance.now()

        const step = (now: number) => {
            const p = Math.min((now - t0) / duration, 1)
            el.scrollLeft = start + dist * easeInOutCubic(p)
            if (p < 1) {
                rafRef.current = requestAnimationFrame(step)
            } else {
                el.scrollLeft = targetLeft
                rafRef.current = null
                onDone()
            }
        }

        rafRef.current = requestAnimationFrame(step)
    }, [])

    const goTo = useCallback((index: number) => {
        const el = ref.current
        if (!el) return
        const pw = el.clientWidth
        if (!pw) return
        const count = Math.max(1, Math.round(el.scrollWidth / pw))
        const clamped = Math.max(0, Math.min(index, count - 1))
        if (clamped === currentPanelRef.current && el.scrollLeft === clamped * pw) return

        lockedRef.current = true
        currentPanelRef.current = clamped
        setActiveIndex(clamped)
        animateTo(clamped * pw, () => {
            setTimeout(() => { lockedRef.current = false }, 80)
        })
    }, [animateTo])

    const goHome = useCallback(() => {
        const el = ref.current
        if (el) el.scrollLeft = 0
        lockedRef.current = true
        routerRef.current.push("/")
        setTimeout(() => { lockedRef.current = false }, 500)
    }, [])

    const goPrev = useCallback(() => {
        if (currentPanelRef.current === 0 && pathnameRef.current !== "/") {
            goHome()
        } else {
            goTo(currentPanelRef.current - 1)
        }
    }, [goTo, goHome])

    const goNext = useCallback(() => {
        goTo(currentPanelRef.current + 1)
    }, [goTo])

    const goToPanelId = useCallback((id: string) => {
        const el = ref.current
        if (!el) return
        const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-panel]"))
        const idx = panels.findIndex((p) => p.id === id)
        if (idx >= 0) goTo(idx)
    }, [goTo])

    // Expose panel navigation to the bottom nav (sibling of this component).
    useEffect(() => {
        registerGoToPanel(goToPanelId)
    }, [goToPanelId])

    // Publish the currently-visible panel id so the nav can highlight it.
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const panels = el.querySelectorAll<HTMLElement>("[data-panel]")
        setActivePanelId(panels[activeIndex]?.id || null)
    }, [activeIndex, panelCount, pathname])

    // On every route change: re-measure panels, then either jump to the panel in
    // the URL hash (e.g. "/#panel-work") or reset to the first panel. Runs on each
    // navigation because this component is mounted once in the root layout.
    useEffect(() => {
        const el = ref.current
        if (!el) return

        const measure = () => setPanelCount(el.querySelectorAll("[data-panel]").length || 1)

        const applyRoute = () => {
            measure()
            const pw = el.clientWidth || 1
            const hash = window.location.hash.slice(1)
            const panel = hash ? document.getElementById(hash) : null

            if (panel) {
                const targetLeft =
                    el.scrollLeft +
                    panel.getBoundingClientRect().left -
                    el.getBoundingClientRect().left
                el.scrollLeft = targetLeft
                const idx = Math.round(targetLeft / pw)
                currentPanelRef.current = idx
                setActiveIndex(idx)
            } else {
                el.scrollLeft = 0
                currentPanelRef.current = 0
                setActiveIndex(0)
            }
        }

        const id = requestAnimationFrame(applyRoute)
        window.addEventListener("resize", measure)
        return () => {
            cancelAnimationFrame(id)
            window.removeEventListener("resize", measure)
        }
    }, [pathname])

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const onScroll = () => {
            if (rafRef.current || !el.clientWidth) return
            const idx = Math.round(el.scrollLeft / el.clientWidth)
            currentPanelRef.current = idx
            setActiveIndex(idx)
        }
        el.addEventListener("scroll", onScroll, { passive: true })

        const onWheel = (e: WheelEvent) => {
            e.preventDefault()
            if (lockedRef.current) return

            const raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
            if (Math.abs(raw) < 3) return

            const pw = el.clientWidth
            if (!pw) return

            const total = Math.round(el.scrollWidth / pw)
            const dir = Math.sign(raw)
            const next = Math.max(0, Math.min(currentPanelRef.current + dir, total - 1))

            if (next === currentPanelRef.current) {
                // Overscrolling left from the first panel of a sub-page → go home.
                if (dir < 0 && currentPanelRef.current === 0 && pathnameRef.current !== "/") {
                    goHome()
                }
                return
            }

            goTo(next)
        }
        el.addEventListener("wheel", onWheel, { passive: false })

        const onKey = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement | null
            if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
                return
            }
            if (e.key === "ArrowRight" || e.key === "PageDown") {
                e.preventDefault()
                goNext()
            } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
                e.preventDefault()
                goPrev()
            }
        }
        window.addEventListener("keydown", onKey)

        return () => {
            el.removeEventListener("scroll", onScroll)
            el.removeEventListener("wheel", onWheel)
            window.removeEventListener("keydown", onKey)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [goTo, goHome, goNext, goPrev])

    const canPrev = activeIndex > 0 || pathname !== "/"
    const canNext = activeIndex < panelCount - 1

    return (
        <>
            <div
                id="main-scroll"
                ref={ref}
                className="flex h-dvh w-screen flex-row overflow-x-scroll overflow-y-hidden pb-[var(--bottom-nav-height)]"
                style={{ scrollbarWidth: "none" } as React.CSSProperties}
            >
                {children}
            </div>
            <CursorNav
                canPrev={canPrev}
                canNext={canNext}
                onPrev={goPrev}
                onNext={goNext}
            />
        </>
    )
}
