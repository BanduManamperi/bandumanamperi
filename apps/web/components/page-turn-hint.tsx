"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

// A first-visit hint that the site turns sideways like a book. It darkens the
// page for a few seconds with one line on how to turn it: a swipe on a touch
// screen, the scroll wheel or arrow keys elsewhere. It lets every touch, click
// and scroll through to the page beneath, so the visitor can turn the page
// straight away, and it goes as soon as they do anything. It is shown once:
// the visit is remembered in this browser.

const SEEN_KEY = "bm:page-turn-hint"
/** Let the first spread settle before the hint covers it. */
const SHOW_AFTER_MS = 900
const SHOW_FOR_MS = 7000
const FADE_MS = 300

// Also kept in memory, for browsers that refuse storage (some private windows).
let seenThisVisit = false

function hasSeen(): boolean {
    if (seenThisVisit) return true
    try {
        return window.localStorage.getItem(SEEN_KEY) === "1"
    } catch {
        return false
    }
}

function markSeen() {
    seenThisVisit = true
    try {
        window.localStorage.setItem(SEEN_KEY, "1")
    } catch {
        // Remembered for this visit only.
    }
}

type Mode = "touch" | "pointer"

type Props = {
    /** The spread on screen, 0-based. */
    page: number
    /** How many spreads the current route has. */
    pages: number
}

export function PageTurnHint({ page, pages }: Props) {
    const [mode, setMode] = useState<Mode | null>(null)
    const [dismissed, setDismissed] = useState(false)
    /** The spread the hint came up over; turning away from it by any means (the bottom nav, a link to a spread) ends it. */
    const [shownOn, setShownOn] = useState<number | null>(null)
    const pageRef = useRef(page)
    const showing = !dismissed && page === shownOn

    useEffect(() => {
        pageRef.current = page
    }, [page])

    const dismiss = useCallback(() => {
        setDismissed(true)
    }, [])

    // Show it once there is somewhere to turn to.
    useEffect(() => {
        if (pages < 2 || hasSeen()) return
        const timer = window.setTimeout(() => {
            if (hasSeen()) return
            markSeen()
            setShownOn(pageRef.current)
            setMode(window.matchMedia("(pointer: coarse)").matches ? "touch" : "pointer")
        }, SHOW_AFTER_MS)
        return () => window.clearTimeout(timer)
    }, [pages])

    // Go at the first touch, click, scroll or key, or after a few seconds.
    useEffect(() => {
        if (!mode) return
        const options = { capture: true, passive: true } as const
        const events = ["pointerdown", "wheel", "keydown"] as const
        events.forEach((type) => window.addEventListener(type, dismiss, options))
        const timer = window.setTimeout(dismiss, SHOW_FOR_MS)
        return () => {
            events.forEach((type) => window.removeEventListener(type, dismiss, options))
            window.clearTimeout(timer)
        }
    }, [mode, dismiss])

    // Unmount once it has faded out.
    useEffect(() => {
        if (!mode || showing) return
        const timer = window.setTimeout(() => setMode(null), FADE_MS)
        return () => window.clearTimeout(timer)
    }, [mode, showing])

    if (!mode) return null

    return (
        <div
            role="status"
            className={`pointer-events-none fixed inset-0 z-[9980] flex items-center justify-center bg-black/40 px-6 transition-opacity duration-300 ease-out animate-in fade-in motion-reduce:animate-none motion-reduce:transition-none ${
                showing ? "opacity-100" : "opacity-0"
            }`}
        >
            {/* Set on the grey ground the sheets lie on, so it reads over any page. */}
            <div className="flex flex-col items-center gap-5 rounded-[2px] bg-[var(--stage)] px-8 py-7 text-center text-white shadow-[0_24px_60px_-28px_rgb(0_0_0/0.6)]">
                {mode === "touch" ? <Swipe /> : <ArrowKeys />}
                <p className="text-[0.9375rem] font-light leading-snug tracking-[0.01em]">
                    {mode === "touch" ? "Swipe to turn the page" : "Scroll or use the arrow keys to turn the page"}
                </p>
            </div>
        </div>
    )
}

/** A fingertip drawn across from right to left, the way a page is turned forward. */
function Swipe() {
    return (
        <div aria-hidden className="relative flex h-10 w-24 items-center justify-center">
            <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-white/25" />
            <span className="relative size-9 rounded-full border-[1.5px] border-white bg-[#4c4c4c] animate-swipe-hint motion-reduce:animate-none" />
        </div>
    )
}

/** The two arrow keys, the forward one pressed over and over. */
function ArrowKeys() {
    const key = "flex size-9 items-center justify-center rounded-md border border-white/60"
    return (
        <div aria-hidden className="flex gap-2">
            <span className={key}>
                <ArrowLeft className="size-4" strokeWidth={1.5} />
            </span>
            <span className={`${key} animate-key-press motion-reduce:animate-none`}>
                <ArrowRight className="size-4" strokeWidth={1.5} />
            </span>
        </div>
    )
}
