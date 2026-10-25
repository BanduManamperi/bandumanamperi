"use client";

import { useState } from "react";
import Image from "next/image";

export function WorkPicture({ images, title }: { images: string[]; title: string }) {
    const [index, setIndex] = useState(0);
    const src = images[index] ?? images[0];

    if (!src) {
        return <div className="room-picture" />;
    }

    return (
        <div className="room-picture">
            <div className={`absolute inset-0 p-6 sm:p-10 lg:p-14 ${images.length > 1 ? "pb-16" : ""}`}>
                <div className="relative h-full">
                    <Image
                        src={src}
                        alt={images.length > 1 ? `${title}, view ${index + 1}` : title}
                        fill
                        priority={index === 0}
                        sizes="(min-width: 64rem) 50vw, 100vw"
                        className="object-contain"
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
                            className={`h-8 min-w-8 px-2 text-[0.8125rem] tabular-nums ${i === index ? "bg-ink text-paper" : "bg-paper text-ink"}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
