"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
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

function getTypeLabel(type: string) {
    switch (type.toLowerCase()) {
        case "solo":   return "Solo";
        case "group":  return "Group";
        case "online": return "Online";
        default:       return "Exhibition";
    }
}

const listVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const rowVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

interface UpcomingEventsSectionProps {
    exhibitions: Exhibition[];
}

export function UpcomingEventsSection({ exhibitions }: UpcomingEventsSectionProps) {
    if (exhibitions.length === 0) return null;

    return (
        <section
            id="upcoming"
            className="h-full flex flex-col justify-center bg-background py-10"
        >
            <div className="max-w-7xl mx-auto w-full px-8 lg:px-20">

                {/* Top row — label + link */}
                <motion.div
                    className="flex items-center justify-between mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        On View &amp; Upcoming
                    </p>
                    <Link
                        href="/exhibitions"
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        View all
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </motion.div>

                {/* Giant headline */}
                <motion.h2
                    className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,8vw,7rem)] font-normal leading-none tracking-tight text-foreground mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    Exhibitions
                </motion.h2>

                {/* Editorial numbered list */}
                <motion.div
                    className="border-t border-border divide-y divide-border"
                    variants={listVariants}
                    initial="hidden"
                    animate="show"
                >
                    {exhibitions.map((exhibition, index) => {
                        const slug = generateExhibitionSlug(
                            exhibition.name,
                            getExhibitionYear(exhibition)
                        );
                        const scheduleStatus = getExhibitionScheduleStatus(exhibition);
                        const scheduleLabel   = getHomepageEventLabel(scheduleStatus);
                        const schedule        = formatExhibitionSchedule(exhibition);
                        const imageUrl        =
                            getExhibitionImageUrl(exhibition.coverImage) ||
                            PLACEHOLDERS.exhibition.url;

                        return (
                            <motion.div key={exhibition.id ?? `${exhibition.name}-${index}`} variants={rowVariants}>
                                <Link
                                    href={`/exhibitions/${slug}`}
                                    className="group flex items-center gap-5 lg:gap-8 py-5 transition-colors"
                                >
                                    {/* Index number — large muted Playfair */}
                                    <span className="font-[family-name:var(--font-playfair)] text-[clamp(2rem,4vw,3.5rem)] leading-none text-foreground/10 w-14 shrink-0 select-none">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    {/* Name + meta */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-[family-name:var(--font-playfair)] text-[clamp(1.1rem,2.2vw,1.75rem)] font-normal leading-tight text-foreground group-hover:text-muted-foreground transition-colors duration-300 truncate">
                                            {exhibition.name}
                                        </h3>
                                        <p className="text-xs text-muted-foreground/70 mt-1 font-light tracking-wide truncate">
                                            {[exhibition.venue, schedule].filter(Boolean).join(" · ")}
                                        </p>
                                    </div>

                                    {/* Type + status badges */}
                                    <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground border border-border px-2 py-0.5">
                                            {scheduleLabel}
                                        </span>
                                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">
                                            {getTypeLabel(exhibition.type)}
                                        </span>
                                    </div>

                                    {/* Thumbnail */}
                                    <div className="relative w-14 h-18 lg:w-16 lg:h-20 shrink-0 overflow-hidden bg-muted">
                                        <Image
                                            src={imageUrl}
                                            alt={exhibition.name}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                            sizes="80px"
                                        />
                                    </div>

                                    {/* Arrow */}
                                    <ArrowRight className="w-4 h-4 shrink-0 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300" />
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}
