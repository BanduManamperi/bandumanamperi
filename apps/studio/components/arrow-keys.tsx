"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The left and right arrow keys turn to the previous and next work in the
// catalogue, as the Previous and Next links do. They leave the keys alone
// while someone is typing, holding a modifier (browser shortcuts), or has
// the full-screen view or a sheet open: in the full-screen view the arrows
// step through the work's views.
export function ArrowKeys({ previous, next }: { previous?: string; next?: string }) {
    const router = useRouter();

    useEffect(() => {
        if (previous) router.prefetch(previous);
        if (next) router.prefetch(next);
    }, [router, previous, next]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
            const target = e.target as HTMLElement | null;
            if (target?.closest("input, textarea, select, [contenteditable]")) return;
            if (document.querySelector('[aria-modal="true"], dialog[open]')) return;

            const href = e.key === "ArrowLeft" ? previous : e.key === "ArrowRight" ? next : undefined;
            if (!href) return;
            e.preventDefault();
            router.push(href);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [router, previous, next]);

    return null;
}
