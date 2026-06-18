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
            return "bg-emerald-500";
        case "upcoming":
            return "bg-amber-500";
        default:
            return "bg-muted-foreground/40";
    }
}

export function UpcomingEventsSection({ exhibitions }: UpcomingEventsSectionProps) {
    if (exhibitions.length === 0) return null;

    const featured = exhibitions[0];
    const rest = exhibitions.slice(1);

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
        <section className="min-h-full bg-background">
            <div className="w-full max-w-[1100px] mx-auto px-10 md:px-20 lg:px-28 py-14 lg:py-20">

                {/* ── Eyebrow ── */}
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
                    Events
                </p>

                {/* ── Featured exhibition ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className={`h-2 w-2 rounded-full ${statusDotClass(featuredStatus)}`} />
                        <span className="text-xs uppercase tracking-[0.2em] text-foreground">
                            {featuredLabel}
                        </span>
                    </div>

                    <h2 className="font-heading text-[clamp(2.25rem,4.5vw,4rem)] font-bold leading-[1.05] tracking-tight text-foreground max-w-3xl">
                        {featured.name}
                    </h2>

                    {featuredMeta && (
                        <p className="mt-4 text-base text-muted-foreground font-light">
                            {featuredMeta}
                        </p>
                    )}

                    {/* Hero image */}
                    <Link
                        href={`/exhibitions/${featuredSlug}`}
                        className="group mt-8 block relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted"
                    >
                        <Image
                            src={featuredImage}
                            alt={featured.name}
                            fill
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03]"
                            sizes="(max-width: 1024px) 90vw, 1100px"
                            priority
                        />
                    </Link>

                    <Link
                        href={`/exhibitions/${featuredSlug}`}
                        className="group mt-6 inline-flex items-center gap-2 text-sm tracking-wide text-foreground border-b border-foreground/40 pb-1 hover:border-foreground transition-colors"
                    >
                        View exhibition
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </motion.div>

                {/* ── More exhibitions ── */}
                {rest.length > 0 && (
                    <motion.div
                        className="mt-16 pt-10 border-t border-border"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
                        <div className="flex items-baseline justify-between mb-2">
                            <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                                More exhibitions
                            </h3>
                            <Link
                                href="/exhibitions"
                                className="group inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                            >
                                View all
                                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>

                        <div>
                            {rest.map((exhibition, index) => {
                                const slug = generateExhibitionSlug(
                                    exhibition.name,
                                    getExhibitionYear(exhibition)
                                );
                                const year = getExhibitionYear(exhibition);

                                return (
                                    <Link
                                        key={exhibition.id ?? `${exhibition.name}-${index}`}
                                        href={`/exhibitions/${slug}`}
                                        className="group flex items-baseline gap-5 py-4 border-b border-border transition-colors"
                                    >
                                        <span className="text-xs tabular-nums text-muted-foreground/70 w-12 shrink-0">
                                            {year || "—"}
                                        </span>
                                        <p className="flex-1 min-w-0 text-foreground leading-snug truncate">
                                            <span className="font-heading italic text-lg">
                                                {exhibition.name}
                                            </span>
                                            {exhibition.venue && (
                                                <span className="text-muted-foreground font-light">
                                                    {" "}— {exhibition.venue}
                                                </span>
                                            )}
                                        </p>
                                        <ArrowUpRight className="w-4 h-4 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

            </div>
        </section>
    );
}
