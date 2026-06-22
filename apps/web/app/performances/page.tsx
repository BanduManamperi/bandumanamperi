"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, VolumeX, Volume2 } from "lucide-react";
import posthog from "posthog-js";
import { getPublishedPerformances, PerformanceItem } from "@/lib/services/performanceService";

const PerformancesPage = () => {
    const [performances, setPerformances] = useState<PerformanceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [muted, setMuted] = useState(true);
    const stripRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getPublishedPerformances().then((data) => {
            setPerformances(data);
            setLoading(false);
        });
    }, []);

    // Intercept wheel on programme strip
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

    const active = performances[activeIndex] ?? null;

    const years = performances
        .map((p) => (p.date ? new Date(p.date).getFullYear() : null))
        .filter(Boolean) as number[];
    const minYear = years.length ? Math.min(...years) : null;

    const handleSelect = (idx: number) => {
        setActiveIndex(idx);
        const p = performances[idx];
        if (p) {
            posthog.capture("performance_viewed", {
                performance_id: p.id,
                performance_title: p.title ?? "",
                performance_slug: p.slug ?? "",
            });
        }
    };

    return (
        <div className="flex flex-row h-full w-max flex-shrink-0">

            {/* ── Panel 1: INTRO + NOW SHOWING ── */}
            <div
                id="panel-performances"
                data-panel=""
                data-panel-label="Performance"
                className="w-screen flex-shrink-0 h-full overflow-hidden flex flex-col"
            >
                <div className="flex-1 min-h-0 flex flex-col px-10 md:px-16 lg:px-24 pt-12 pb-10">

                    {/* Meta row */}
                    <div className="flex items-start justify-between mb-8 shrink-0">
                        <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                            Intro
                        </p>
                        {!loading && minYear && (
                            <p className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground">
                                {performances.length} Performances · {minYear}–Present
                            </p>
                        )}
                    </div>

                    {/* Heading + description */}
                    <motion.div
                        className="shrink-0 mb-8"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-heading text-[clamp(3rem,6vw,5rem)] font-black leading-none tracking-tight text-foreground mb-5">
                            Performance
                        </h1>
                        <p className="text-[0.9375rem] text-muted-foreground font-light leading-[1.8] max-w-[36rem]">
                            The body as site, duration as medium, presence as material.
                            Each action unfolds in real time, demanding witness. They are
                            not documents of events. They are the events themselves.
                        </p>
                    </motion.div>

                    {/* NOW SHOWING player */}
                    {!loading && (
                        <motion.div
                            className="flex-1 min-h-0 relative rounded-xl overflow-hidden bg-neutral-900 cursor-pointer group"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            onClick={() => {
                                if (active?.video_url) window.open(active.video_url, "_blank");
                            }}
                        >
                            {/* Cover image */}
                            {active?.coverImageUrl && (
                                <Image
                                    src={active.coverImageUrl}
                                    alt={active.title}
                                    fill
                                    className="object-cover opacity-50"
                                    sizes="100vw"
                                />
                            )}

                            {/* Overlays */}
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/80 to-transparent" />

                            {/* Mute toggle */}
                            <button
                                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white/80 hover:bg-black/70 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMuted((m) => !m);
                                }}
                            >
                                {muted
                                    ? <VolumeX className="w-4 h-4" />
                                    : <Volume2 className="w-4 h-4" />
                                }
                            </button>

                            {/* Play button */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {active?.video_url ? (
                                    <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                        <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                        <div className="w-5 h-5 rounded-full bg-white/20" />
                                    </div>
                                )}
                            </div>

                            {/* Bottom info */}
                            <div className="absolute bottom-0 inset-x-0 px-6 pb-6 flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1.5">
                                        Now Showing
                                    </p>
                                    <p className="text-base font-medium text-white leading-snug">
                                        {active?.title ?? "—"}
                                    </p>
                                </div>
                                {active?.duration && (
                                    <p className="text-sm font-mono text-white/60">{active.duration}</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* ── Panel 2: PROGRAMME ── */}
            <div
                id="panel-performances-programme"
                data-panel=""
                data-panel-label="Programme"
                className="w-screen flex-shrink-0 h-full overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="px-10 md:px-16 lg:px-24 pt-12 pb-6 shrink-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-3">
                        Programme
                    </p>
                    <h2 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-bold leading-none tracking-tight text-foreground">
                        All Works
                    </h2>
                    {!loading && (
                        <p className="text-xs text-muted-foreground/50 mt-1">
                            {performances.length}{" "}
                            {performances.length === 1 ? "performance" : "performances"}
                        </p>
                    )}
                </div>

                {/* Scrollable strip */}
                <div
                    ref={stripRef}
                    className="flex-1 overflow-x-auto overflow-y-hidden pl-10 md:pl-16 lg:pl-24 pr-10"
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
                        <div
                            className="flex gap-3 h-full items-end pb-16"
                            style={{ width: "max-content" }}
                        >
                            {performances.map((p, idx) => (
                                <button
                                    key={p.id}
                                    onClick={() => handleSelect(idx)}
                                    className="group flex flex-col flex-shrink-0 text-left"
                                    style={{ height: "calc(100% - 4rem)" }}
                                >
                                    <div
                                        className={`relative overflow-hidden rounded-lg flex-1 transition-all duration-300 bg-neutral-900 ${
                                            idx === activeIndex
                                                ? "ring-1 ring-foreground/40"
                                                : "ring-0"
                                        }`}
                                        style={{
                                            width: "calc((100vh - 14rem) * 3 / 4)",
                                            maxWidth: "240px",
                                        }}
                                    >
                                        {p.coverImageUrl ? (
                                            <Image
                                                src={p.coverImageUrl}
                                                alt={p.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                sizes="240px"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-neutral-800" />
                                        )}

                                        {/* Active overlay */}
                                        {idx === activeIndex && (
                                            <div className="absolute inset-0 bg-white/5" />
                                        )}

                                        {/* Duration badge */}
                                        {p.duration && (
                                            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[10px] font-mono text-white/80">
                                                {p.duration}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-2.5" style={{ maxWidth: "240px" }}>
                                        <p
                                            className={`text-xs font-light truncate transition-colors ${
                                                idx === activeIndex
                                                    ? "text-foreground"
                                                    : "text-muted-foreground group-hover:text-foreground"
                                            }`}
                                        >
                                            {p.title}
                                        </p>
                                        {p.date && (
                                            <p className="text-[10px] text-muted-foreground/40 mt-0.5">
                                                {new Date(p.date).getFullYear()}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerformancesPage;
