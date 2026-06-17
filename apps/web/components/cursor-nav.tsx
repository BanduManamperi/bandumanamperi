"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

// Elements where the arrow cursor should stand down (so links/buttons/forms and
// read-heavy panels behave normally and clicks there don't navigate).
const INTERACTIVE =
    'a, button, input, textarea, select, label, [role="button"], [data-no-cursor-nav], [data-no-cursor-nav] *'

type Props = {
    canPrev: boolean
    canNext: boolean
    onPrev: () => void
    onNext: () => void
}

export function CursorNav({ canPrev, canNext, onPrev, onNext }: Props) {
    const [enabled, setEnabled] = useState(false) // only on fine pointers (desktop)
    const [visible, setVisible] = useState(false)
    const [dir, setDir] = useState<"left" | "right">("right")

    const elRef = useRef<HTMLDivElement>(null)
    const pos = useRef({ x: 0, y: 0 })
    const target = useRef({ x: 0, y: 0 })
    const down = useRef<{ x: number; y: number } | null>(null)

    // Detect a precise pointer; bail entirely on touch devices.
    useEffect(() => {
        const mq = window.matchMedia("(pointer: fine)")
        const update = () => setEnabled(mq.matches)
        update()
        mq.addEventListener("change", update)
        return () => mq.removeEventListener("change", update)
    }, [])

    useEffect(() => {
        if (!enabled) return

        let raf = 0
        const follow = () => {
            const p = pos.current
            const t = target.current
            p.x += (t.x - p.x) * 0.25
            p.y += (t.y - p.y) * 0.25
            if (elRef.current) {
                elRef.current.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`
            }
            raf = requestAnimationFrame(follow)
        }
        raf = requestAnimationFrame(follow)

        const onMove = (e: PointerEvent) => {
            target.current = { x: e.clientX, y: e.clientY }
            const overInteractive = !!(e.target as Element | null)?.closest(INTERACTIVE)
            const side = e.clientX > window.innerWidth / 2 ? "right" : "left"
            setDir(side)
            const canGo = side === "right" ? canNext : canPrev
            setVisible(!overInteractive && canGo)
        }

        const onDown = (e: PointerEvent) => {
            down.current = { x: e.clientX, y: e.clientY }
        }

        const onClick = (e: MouseEvent) => {
            if ((e.target as Element | null)?.closest(INTERACTIVE)) return
            const d = down.current
            // Ignore drags / text selection.
            if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10) return
            const side = e.clientX > window.innerWidth / 2 ? "right" : "left"
            if (side === "right" && canNext) onNext()
            else if (side === "left" && canPrev) onPrev()
        }

        const onLeave = () => setVisible(false)

        window.addEventListener("pointermove", onMove, { passive: true })
        window.addEventListener("pointerdown", onDown, { passive: true })
        window.addEventListener("click", onClick)
        window.addEventListener("blur", onLeave)
        document.documentElement.addEventListener("pointerleave", onLeave)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerdown", onDown)
            window.removeEventListener("click", onClick)
            window.removeEventListener("blur", onLeave)
            document.documentElement.removeEventListener("pointerleave", onLeave)
        }
    }, [enabled, canPrev, canNext, onPrev, onNext])

    // Hide the native cursor only while our arrow is active over navigable space.
    useEffect(() => {
        if (!enabled) return
        document.body.style.cursor = visible ? "none" : ""
        return () => {
            document.body.style.cursor = ""
        }
    }, [visible, enabled])

    if (!enabled) return null

    return (
        <div
            ref={elRef}
            aria-hidden
            className={`pointer-events-none fixed left-0 top-0 z-[9990] flex h-16 w-16 items-center justify-center rounded-full border border-foreground/15 bg-background/40 text-foreground backdrop-blur-md transition-[opacity,scale] duration-200 ${
                visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
        >
            {dir === "right" ? (
                <ArrowRight className="h-5 w-5" />
            ) : (
                <ArrowLeft className="h-5 w-5" />
            )}
        </div>
    )
}
