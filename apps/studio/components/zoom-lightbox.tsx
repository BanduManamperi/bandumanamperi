"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

// A full-screen, lights-down inspection view - click to zoom in on the
// brushwork at the point you clicked, click again to back out. Deliberately
// plain black, independent of the room's own palette: this is the one
// moment the surroundings should disappear entirely.
export function ZoomLightbox({
    images,
    index,
    title,
    onIndexChange,
    onClose,
}: {
    images: string[];
    index: number;
    title: string;
    onIndexChange: (index: number) => void;
    onClose: () => void;
}) {
    const [zoomed, setZoomed] = useState(false);
    const [origin, setOrigin] = useState("50% 50%");
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        closeRef.current?.focus();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    const goTo = (next: number) => {
        setZoomed(false);
        onIndexChange(next);
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight" && index < images.length - 1) {
                setZoomed(false);
                onIndexChange(index + 1);
            }
            if (e.key === "ArrowLeft" && index > 0) {
                setZoomed(false);
                onIndexChange(index - 1);
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [index, images.length, onIndexChange, onClose]);

    const src = images[index];
    if (!src) return null;

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setOrigin(`${x}% ${y}%`);
        setZoomed((z) => !z);
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`${title}, enlarged`}
            className="fixed inset-0 z-50 flex flex-col bg-black"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="flex shrink-0 items-center justify-between px-5 py-4 text-[0.8125rem] text-white/70 sm:px-6">
                <span className="truncate">{title}</span>
                <button
                    ref={closeRef}
                    type="button"
                    onClick={onClose}
                    className="shrink-0 text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                    Close
                </button>
            </div>

            <div
                className={`relative flex-1 overflow-hidden ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                onClick={handleImageClick}
            >
                <Image
                    src={src}
                    alt={images.length > 1 ? `${title}, view ${index + 1}` : title}
                    fill
                    sizes="100vw"
                    className="object-contain transition-transform duration-300 ease-out"
                    style={{ transform: zoomed ? "scale(2.2)" : "scale(1)", transformOrigin: origin }}
                />
            </div>

            {images.length > 1 && (
                <div className="flex shrink-0 items-center justify-center gap-2 px-5 py-4">
                    {images.map((image, i) => (
                        <button
                            key={image}
                            type="button"
                            aria-label={`View ${i + 1} of ${images.length}`}
                            aria-current={i === index ? "true" : undefined}
                            onClick={() => goTo(i)}
                            className={`h-1.5 w-1.5 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/30 hover:bg-white/60"}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
