"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Offer } from "@/lib/inventory";

// A horizontal filmstrip of plain thumbnails on a phone - the work itself
// stays the focus, no room for a dense titled list. On a wide screen, a
// tall contact sheet of large thumbnails: the catalogue number sits in the
// corner always, the title only surfaces on hover or on the current work,
// so the rail reads as pictures first, not a column of repeated titles
// ("Untitled" appears for most of the catalogue).
export function WorkIndex({ works, currentId }: { works: Offer[]; currentId: string }) {
    const currentRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        currentRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
    }, [currentId]);

    return (
        <nav className="room-index" aria-label="Works">
            <ul className="flex gap-2 overflow-x-auto px-4 py-3 lg:block lg:gap-0 lg:overflow-visible lg:px-0 lg:py-0">
                {works.map((work) => {
                    const current = work.id === currentId;
                    const captionClass = [
                        "pointer-events-none hidden lg:flex lg:absolute lg:inset-x-0 lg:bottom-0 lg:items-end lg:bg-gradient-to-t lg:from-black/75 lg:to-transparent lg:p-3 lg:transition-opacity",
                        current ? "lg:opacity-100" : "lg:opacity-0 lg:group-hover:opacity-100",
                    ].join(" ");

                    return (
                        <li key={work.id} className="shrink-0 lg:border-b lg:border-room-line lg:last:border-b-0">
                            <Link
                                ref={current ? currentRef : undefined}
                                href={work.href}
                                aria-current={current ? "page" : undefined}
                                aria-label={`${work.label}, ${work.title}`}
                                className={`group relative block lg:aspect-square lg:overflow-hidden ${
                                    current ? "lg:ring-2 lg:ring-inset lg:ring-room-ink" : ""
                                }`}
                            >
                                {work.images[0] ? (
                                    <Image
                                        src={work.images[0]}
                                        alt=""
                                        width={192}
                                        height={192}
                                        className={`h-16 w-16 shrink-0 bg-room-well object-cover ring-room-ink transition-opacity lg:h-full lg:w-full lg:opacity-100 lg:ring-0 lg:transition-transform lg:duration-300 lg:group-hover:scale-105 ${
                                            current ? "opacity-100 ring-2" : "opacity-60 ring-0 hover:opacity-100"
                                        }`}
                                    />
                                ) : (
                                    <span className="block h-16 w-16 shrink-0 bg-room-well lg:h-full lg:w-full" />
                                )}

                                <span className="hidden lg:absolute lg:left-0 lg:top-0 lg:block lg:bg-room-paper/90 lg:px-2 lg:py-1 lg:text-[0.6875rem] lg:tabular-nums lg:text-room-ink">
                                    {work.label}
                                </span>

                                <span className={captionClass}>
                                    <span className="line-clamp-2 text-[0.8125rem] text-white">{work.title}</span>
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
