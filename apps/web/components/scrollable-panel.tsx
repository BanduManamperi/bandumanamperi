"use client"

// Wraps a sub-page so it:
// - fills the horizontal scroll container as a w-screen panel
// - scrolls vertically within itself
// - stops wheel events from bubbling up to HorizontalScroll
export function ScrollablePanel({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="w-screen h-full flex-shrink-0 overflow-y-auto overflow-x-hidden"
            onWheel={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    )
}
