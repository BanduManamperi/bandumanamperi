"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Exhibition } from "@/lib/actions/exhibitions";
import {
    formatExhibitionSchedule,
    getExhibitionScheduleStatus,
    getExhibitionYear,
    getHomepageEventLabel,
} from "@bandumanamperi/types";
import {
    generateExhibitionSlug,
    getExhibitionImageUrl,
} from "@/lib/utils/supabase-storage";
import { PLACEHOLDERS } from "@/lib/utils/image-placeholders";

interface UpcomingEventsSectionProps {
    exhibitions: Exhibition[];
}

export function UpcomingEventsSection({ exhibitions }: UpcomingEventsSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (exhibitions.length === 0) return null;

    const active = exhibitions[activeIndex];
    const activeImageUrl =
        getExhibitionImageUrl(active.coverImage) || PLACEHOLDERS.exhibition.url;
    const activeScheduleLabel = getHomepageEventLabel(
        getExhibitionScheduleStatus(active)
    );

    return (
        <section id="upcoming" className="h-full flex bg-background overflow-hidden">

            {/* ── Left: list ── */}
            <div className="flex flex-col justify-center px-10 md:px-20 lg:px-32 xl:px-44 py-10 flex-1 min-w-0 overflow-y-auto">

                {/* Header */}
                <motion.div
                    className="flex items-baseline justify-between mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-bold leading-none tracking-tight text-foreground">
                        Exhibitions
                    </h2>
                    <Link
                        href="/exhibitions"
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group shrink-0"
                    >
                        View all
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </motion.div>

                {/* Exhibition list */}
                <motion.div
                    className="border-t border-border/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    {exhibitions.map((exhibition, index) => {
                        const slug = generateExhibitionSlug(
                            exhibition.name,
                            getExhibitionYear(exhibition)
                        );
                        const schedule = formatExhibitionSchedule(exhibition);
                        const isActive = activeIndex === index;

                        return (
                            <Link
                                key={exhibition.id ?? `${exhibition.name}-${index}`}
                                href={`/exhibitions/${slug}`}
                                onMouseEnter={() => setActiveIndex(index)}
                                className="group flex items-baseline justify-between gap-6 py-4 border-b border-border/40 transition-colors"
                            >
                                <div className="flex items-baseline gap-4 min-w-0">
                                    <span className={`text-[11px] tabular-nums shrink-0 transition-colors duration-300 ${isActive ? "text-foreground" : "text-foreground/20"}`}>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <div className="min-w-0">
                                        <h3 className={`font-heading text-lg lg:text-xl font-bold leading-tight tracking-tight truncate transition-colors duration-300 ${isActive ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/70"}`}>
                                            {exhibition.name}
                                        </h3>
                                        <p className={`text-xs font-light mt-0.5 truncate transition-colors duration-300 ${isActive ? "text-muted-foreground" : "text-muted-foreground/40"}`}>
                                            {[exhibition.venue, schedule].filter(Boolean).join(" · ")}
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight className={`w-3.5 h-3.5 shrink-0 transition-all duration-300 ${isActive ? "text-foreground translate-x-0" : "text-foreground/20 -translate-x-1 group-hover:translate-x-0 group-hover:text-foreground/50"}`} />
                            </Link>
                        );
                    })}
                </motion.div>
            </div>

            {/* ── Right: live preview ── */}
            <div className="hidden lg:block relative w-[42%] xl:w-[45%] shrink-0 mr-10 md:mr-20 lg:mr-32 xl:mr-44 my-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <Image
                            src={activeImageUrl}
                            alt={active.name}
                            fill
                            className="object-cover grayscale"
                            sizes="45vw"
                            priority
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Active exhibition info overlay */}
                <div className="absolute bottom-10 left-8 right-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeIndex}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="text-[10px] uppercase tracking-widest text-white/60 mb-1">
                                {activeScheduleLabel}
                            </p>
                            <p className="text-white font-light text-sm">
                                {active.venue}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

        </section>
    );
}
