"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/lib/types/artwork";
import { getArtworksByCategory } from "@/lib/data/artworks";
import posthog from "posthog-js";
import { motion } from "framer-motion";

const PerformancesPage = () => {
    const [performances, setPerformances] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);
    const stripRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadPerformances = async () => {
            setLoading(true);
            const data = await getArtworksByCategory("performance");
            setPerformances(data);
            setLoading(false);
        };
        loadPerformances();
    }, []);

    // Horizontal film strip — intercept wheel events, hand off at edges
    useEffect(() => {
        const el = stripRef.current;
        if (!el) return;

        const onWheel = (e: WheelEvent) => {
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            const atLeft = el.scrollLeft <= 0;
            const atRight = Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth;
            const goingRight = delta > 0;

            if ((goingRight && !atRight) || (!goingRight && !atLeft)) {
                e.stopPropagation();
                e.preventDefault();
                el.scrollLeft += delta;
            }
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    const handlePerformanceClick = (performance: Artwork) => {
        posthog.capture("performance_viewed", {
            performance_id: performance.id,
            performance_title: performance.title,
            performance_slug: performance.slug,
            performance_year: performance.year,
            performance_medium: performance.medium,
        });
    };

    return (
        <div className="flex flex-row h-full w-max flex-shrink-0">

            {/* ── Panel 1: Intro ── */}
            <div
                id="panel-performances"
                data-panel=""
                data-panel-label="Performance"
                className="w-screen flex-shrink-0 h-full overflow-hidden flex items-center"
            >
                <motion.div
                    className="w-full px-10 md:px-20 lg:px-32 xl:px-44"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-black uppercase tracking-[-0.03em] text-foreground">
                        Performance
                    </h1>

                    <div className="mt-6 h-px w-10 bg-foreground/15" />

                    <p className="mt-6 text-[0.9375rem] text-muted-foreground font-light leading-[1.8] max-w-[38rem]">
                        The body as site, duration as medium, and presence as material —
                        Manamperi's performances unfold in real time, demanding witness. Drawing
                        on ritual, cultural memory, and physical endurance, each action carves a
                        temporary space where the personal becomes political and the transient
                        becomes monument. These are not documents of events. They are the events
                        themselves.
                    </p>

                    <p className="mt-4 text-xs text-muted-foreground/40 font-light">
                        {loading ? "" : `${performances.length} performances`}
                    </p>
                </motion.div>
            </div>

            {/* ── Panel 2: Horizontal film strip ── */}
            <div
                id="panel-performances-works"
                data-panel=""
                data-panel-label="Works"
                className="w-screen flex-shrink-0 h-full overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="px-10 md:px-20 lg:px-32 xl:px-44 pt-10 pb-6 shrink-0">
                    <h2 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-bold leading-none tracking-tight text-foreground">
                        Works
                    </h2>
                    {!loading && (
                        <p className="text-xs text-muted-foreground/50 mt-1">
                            {performances.length} {performances.length === 1 ? "performance" : "performances"}
                        </p>
                    )}
                </div>

                {/* Film strip */}
                <div
                    ref={stripRef}
                    className="flex-1 overflow-x-auto overflow-y-hidden pl-10 md:pl-20 lg:pl-32 xl:pl-44 pr-10 md:pr-20 lg:pr-32 xl:pr-44"
                    style={{ scrollbarWidth: "none" } as React.CSSProperties}
                >
                    {loading ? (
                        <div className="h-full flex items-center">
                            <p className="text-sm text-muted-foreground">Loading…</p>
                        </div>
                    ) : performances.length === 0 ? (
                        <div className="h-full flex items-center">
                            <p className="text-sm text-muted-foreground">No performances found.</p>
                        </div>
                    ) : (
                        <div className="flex gap-4 h-full items-end pb-16" style={{ width: "max-content" }}>
                            {performances.map((performance) => (
                                <Link
                                    key={performance.id}
                                    href={`/artworks/${performance.slug}`}
                                    className="group flex flex-col flex-shrink-0"
                                    style={{ height: "calc(100% - 4rem)" }}
                                    onClick={() => handlePerformanceClick(performance)}
                                >
                                    <div
                                        className="relative overflow-hidden bg-muted flex-1"
                                        style={{ width: "calc((100vh - 12rem) * 4 / 5)", maxWidth: "320px" }}
                                    >
                                        <Image
                                            src={performance.imageUrl}
                                            alt={performance.imageAlt || performance.title}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                            sizes="320px"
                                        />
                                    </div>
                                    <div className="mt-2.5 w-full" style={{ maxWidth: "320px" }}>
                                        <h3 className="text-xs font-light text-foreground group-hover:text-muted-foreground transition-colors truncate">
                                            {performance.title}
                                        </h3>
                                        {performance.year && (
                                            <p className="text-[10px] text-muted-foreground/40 mt-0.5">{performance.year}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default PerformancesPage;
