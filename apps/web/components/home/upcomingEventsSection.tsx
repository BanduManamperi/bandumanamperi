"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Exhibition } from "@/lib/actions/exhibitions";
import {
    formatExhibitionSchedule,
    getExhibitionScheduleStatus,
    getExhibitionScheduleLabel,
    getExhibitionYear,
    type ExhibitionScheduleStatus,
} from "@bandumanamperi/types";
import {
    generateExhibitionSlug,
    getExhibitionImageUrl,
} from "@/lib/utils/supabase-storage";
import { PLACEHOLDERS } from "@/lib/utils/image-placeholders";

interface UpcomingEventsSectionProps {
    exhibitions: Exhibition[];
}

function statusDotClass(status: ExhibitionScheduleStatus): string {
    switch (status) {
        case "ongoing":
            return "bg-emerald-500 dark:bg-emerald-400";
        case "upcoming":
            return "bg-amber-500 dark:bg-amber-400";
        default:
            return "bg-muted-foreground/40";
    }
}

export function UpcomingEventsSection({ exhibitions }: UpcomingEventsSectionProps) {
    if (exhibitions.length === 0) return null;

    const featured = exhibitions[0];
    const rest = exhibitions.slice(1, 5);

    const featuredStatus = getExhibitionScheduleStatus(featured);
    const featuredLabel = getExhibitionScheduleLabel(featuredStatus);
    const featuredImage =
        getExhibitionImageUrl(featured.coverImage) || PLACEHOLDERS.exhibition.url;
    const featuredSlug = generateExhibitionSlug(
        featured.name,
        getExhibitionYear(featured)
    );
    const featuredMeta = [
        formatExhibitionSchedule(featured),
        featured.venue,
    ]
        .filter(Boolean)
        .join(" · ");

    return (
        <section className="h-full flex items-center bg-background overflow-hidden">
            <motion.div
                className="w-full px-10 md:px-20 lg:px-32 xl:px-44"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Eyebrow */}
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">
                    Events
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] items-center">

                    {/* ── Left: featured ── */}
                    <div>
                        {/* Status badge */}
                        <div className="inline-flex items-center gap-2 mb-4">
                            <span className={`h-2 w-2 rounded-full ${statusDotClass(featuredStatus)}`} />
                            <span className="text-xs uppercase tracking-[0.2em] text-foreground">
                                {featuredLabel}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-heading text-[clamp(2rem,3.5vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-foreground">
                            {featured.name}
                        </h2>

                        {/* Meta */}
                        {featuredMeta && (
                            <p className="mt-3 text-base text-muted-foreground font-light">
                                {featuredMeta}
                            </p>
                        )}

                        {/* Hero image */}
                        <Link
                            href={`/exhibitions/${featuredSlug}`}
                            className="group mt-6 block relative aspect-[16/9] overflow-hidden rounded-xl bg-muted max-h-[40vh]"
                        >
                            <Image
                                src={featuredImage}
                                alt={featured.name}
                                fill
                                className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03]"
                                sizes="(max-width: 1024px) 90vw, 55vw"
                                priority
                            />
                        </Link>

                        {/* CTA */}
                        <Link
                            href={`/exhibitions/${featuredSlug}`}
                            className="group mt-5 inline-flex items-center gap-2 text-sm tracking-wide text-foreground border-b border-foreground/40 pb-0.5 hover:border-foreground transition-colors"
                        >
                            View exhibition
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                    {/* ── Right: other exhibitions ── */}
                    {rest.length > 0 && (
                        <motion.div
                            className="flex flex-col justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex items-baseline justify-between pb-3 border-b border-border mb-1">
                                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                                    More
                                </span>
                                <Link
                                    href="/exhibitions"
                                    className="group inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    View all
                                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </div>

                            {rest.map((exhibition, i) => {
                                const slug = generateExhibitionSlug(
                                    exhibition.name,
                                    getExhibitionYear(exhibition)
                                );
                                const year = getExhibitionYear(exhibition);
                                const status = getExhibitionScheduleStatus(exhibition);

                                return (
                                    <Link
                                        key={exhibition.id ?? `${exhibition.name}-${i}`}
                                        href={`/exhibitions/${slug}`}
                                        className="group flex items-baseline gap-3 py-3 border-b border-border/50 hover:border-border transition-colors"
                                    >
                                        <span className="text-xs tabular-nums text-muted-foreground/50 w-9 shrink-0">
                                            {year || "—"}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-foreground truncate">
                                                {exhibition.name}
                                            </p>
                                            {exhibition.venue && (
                                                <p className="text-xs text-muted-foreground/60 font-light truncate mt-0.5">
                                                    {exhibition.venue}
                                                </p>
                                            )}
                                        </div>
                                        {status !== "past" && (
                                            <span className={`h-1.5 w-1.5 rounded-full shrink-0 mt-1 ${statusDotClass(status)}`} />
                                        )}
                                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-muted-foreground/30 group-hover:text-foreground transition-colors" />
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}

                </div>
            </motion.div>
        </section>
    );
}
