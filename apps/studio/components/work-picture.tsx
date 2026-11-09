"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomLightbox } from "@/components/zoom-lightbox";

// The work itself, never cropped and centred in its box, with a switcher
// between its views underneath when it has several.
// Click to inspect it full screen.
export function WorkPicture({
    images,
    title,
    sizes = "(min-width: 64rem) 75vw, 100vw",
}: {
    images: string[];
    title: string;
    sizes?: string;
}) {
    const [index, setIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const src = images[index] ?? images[0];

    if (!src) {
        return <div className="h-full bg-border" />;
    }

    return (
        <div className="relative h-full">
            <div
                role="button"
                tabIndex={0}
                aria-label={`View ${title} enlarged`}
                onClick={() => setLightboxOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setLightboxOpen(true);
                    }
                }}
                className={`absolute inset-x-0 top-0 ${images.length > 1 ? "bottom-7" : "bottom-0"} cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background`}
            >
                <Image
                    src={src}
                    alt={images.length > 1 ? `${title}, view ${index + 1}` : title}
                    fill
                    priority={index === 0}
                    sizes={sizes}
                    className="object-contain"
                />
            </div>

            {images.length > 1 && (
                <div
                    className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-3 font-mono text-[0.6875rem] tabular-nums"
                >
                    {images.map((image, i) => (
                        <button
                            key={image}
                            type="button"
                            aria-label={`View ${i + 1} of ${images.length}`}
                            aria-current={i === index ? "true" : undefined}
                            onClick={() => setIndex(i)}
                            className={`underline underline-offset-4 ${i === index ? "decoration-foreground" : "text-foreground/60 decoration-transparent hover:text-foreground"}`}
                        >
                            {String(i + 1).padStart(2, "0")}
                        </button>
                    ))}
                </div>
            )}

            {lightboxOpen && (
                <ZoomLightbox
                    images={images}
                    index={index}
                    title={title}
                    onIndexChange={setIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </div>
    );
}
