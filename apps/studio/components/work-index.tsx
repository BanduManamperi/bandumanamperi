"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Offer } from "@/lib/inventory";

export function WorkIndex({ works, currentId }: { works: Offer[]; currentId: string }) {
    const currentRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const link = currentRef.current;
        const list = link?.closest("nav");
        if (!link || !list) return;
        const nextTop = link.offsetTop - list.clientHeight / 2 + link.clientHeight / 2;
        list.scrollTop = Math.max(0, nextTop);
    }, [currentId]);

    return (
        <nav className="room-index relative" aria-label="Works">
            <ul>
                {works.map((work) => {
                    const current = work.id === currentId;
                    return (
                        <li key={work.id}>
                            <Link
                                ref={current ? currentRef : undefined}
                                href={work.href}
                                aria-current={current ? "page" : undefined}
                                className={`flex items-center gap-3 px-3 py-2 ${current ? "bg-paper text-ink" : "text-mute hover:text-ink"}`}
                            >
                                {work.images[0] ? (
                                    <Image
                                        src={work.images[0]}
                                        alt=""
                                        width={88}
                                        height={88}
                                        className="h-11 w-11 shrink-0 bg-well object-cover"
                                    />
                                ) : (
                                    <span className="h-11 w-11 shrink-0 bg-well" />
                                )}
                                <span className="min-w-0">
                                    <span className="flex items-baseline gap-2">
                                        <span className="w-7 shrink-0 text-[0.75rem] tabular-nums">{work.label}</span>
                                        <span className="line-clamp-2">{work.title}</span>
                                    </span>
                                    {work.isUntitled && work.series && (
                                        <span className="block truncate pl-9 text-[0.75rem]">{work.series}</span>
                                    )}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
