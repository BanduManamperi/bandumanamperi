"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomLightbox } from "@/components/zoom-lightbox";

export function WorkPicture({ images, title }: { images: string[]; title: string }) {
    const [index, setIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const src = images[index] ?? images[0];

    if (!src) {
        return <div className="room-picture" />;
    }

    return (
        <div className="room-picture">
            <div className={`absolute inset-0 p-6 sm:p-10 lg:p-14 ${images.length > 1 ? "pb-16" : ""}`}>
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
                    className="relative h-full cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-room-ink/50 focus-visible:ring-offset-2 focus-visible:ring-offset-room-well"
                >
                    <Image
                        src={src}
                        alt={images.length > 1 ? `${title}, view ${index + 1}` : title}
                        fill
                        priority={index === 0}
                        sizes="(min-width: 64rem) 50vw, 100vw"
                        className="object-contain drop-shadow-[0_18px_40px_rgba(0,0,0,0.22)]"
                    />
                </div>
            </div>
            {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {images.map((image, i) => (
                        <button
                            key={image}
                            type="button"
                            aria-label={`View ${i + 1} of ${images.length}`}
                            aria-current={i === index ? "true" : undefined}
                            onClick={() => setIndex(i)}
                            className={`h-8 min-w-8 px-2 text-[0.8125rem] tabular-nums ${i === index ? "bg-room-ink text-room-paper" : "bg-room-paper text-room-ink"}`}
                        >
                            {i + 1}
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
