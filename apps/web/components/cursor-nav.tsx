"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

// px from each edge that activates the nav cursor
const EDGE_ZONE = 80

type Props = {
    canPrev: boolean
    canNext: boolean
    onPrev: () => void
    onNext: () => void
}

export function CursorNav({ canPrev, canNext, onPrev, onNext }: Props) {
    const [enabled, setEnabled] = useState(false)
    const [visible, setVisible] = useState(false)
    const [dir, setDir] = useState<"left" | "right">("right")

    const elRef = useRef<HTMLDivElement>(null)
    const pos = useRef({ x: 0, y: 0 })
    const target = useRef({ x: 0, y: 0 })
    const down = useRef<{ x: number; y: number } | null>(null)

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

            const inLeftZone = e.clientX <= EDGE_ZONE
            const inRightZone = e.clientX >= window.innerWidth - EDGE_ZONE

            if (inLeftZone && canPrev) {
                setDir("left")
                setVisible(true)
            } else if (inRightZone && canNext) {
                setDir("right")
                setVisible(true)
            } else {
                setVisible(false)
            }
        }

        const onDown = (e: PointerEvent) => {
            down.current = { x: e.clientX, y: e.clientY }
        }

        const onClick = (e: MouseEvent) => {
            const d = down.current
            if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 10) return

            const inLeftZone = e.clientX <= EDGE_ZONE
            const inRightZone = e.clientX >= window.innerWidth - EDGE_ZONE

            if (inLeftZone && canPrev) onPrev()
            else if (inRightZone && canNext) onNext()
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

    useEffect(() => {
        if (!enabled) return
        document.body.style.cursor = visible ? "none" : ""
        return () => { document.body.style.cursor = "" }
    }, [visible, enabled])

    if (!enabled) return null

    return (
        <div
            ref={elRef}
            aria-hidden
            className={`pointer-events-none fixed left-0 top-0 z-[9990] flex h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-background/60 text-foreground backdrop-blur-md transition-[opacity,scale] duration-200 ${
                visible ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
        >
            {dir === "right" ? (
                <ArrowRight className="h-4 w-4" />
            ) : (
                <ArrowLeft className="h-4 w-4" />
            )}
        </div>
    )
}
