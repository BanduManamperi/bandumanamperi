import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
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
        case "solo":
            return "Solo";
        case "group":
            return "Group";
        case "online":
            return "Online";
        default:
            return "Exhibition";
    }
}

interface UpcomingEventsSectionProps {
    exhibitions: Exhibition[];
}

export function UpcomingEventsSection({ exhibitions }: UpcomingEventsSectionProps) {
    if (exhibitions.length === 0) {
        return null;
    }

    return (
        <section
            id="upcoming"
            className="py-24 md:py-32 bg-background border-b border-border/40"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Header — matches other section headers on the page */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
                    <div>
                        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                            On view &amp; upcoming
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold">
                            Exhibitions
                        </h2>
                    </div>
                    <Link
                        href="/exhibitions"
                        className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-foreground hover:text-muted-foreground transition-colors group shrink-0"
                    >
                        View all exhibitions
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                {/* Exhibition grid with cover images */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {exhibitions.map((exhibition) => {
                        const slug = generateExhibitionSlug(
                            exhibition.name,
                            getExhibitionYear(exhibition)
                        );
                        const scheduleStatus = getExhibitionScheduleStatus(exhibition);
                        const scheduleLabel = getHomepageEventLabel(scheduleStatus);
                        const schedule = formatExhibitionSchedule(exhibition);
                        const imageUrl =
                            getExhibitionImageUrl(exhibition.coverImage) ||
                            PLACEHOLDERS.exhibition.url;

                        return (
                            <Link
                                key={
                                    exhibition.id ??
                                    `${exhibition.name}-${exhibition.startDate}-${exhibition.dates}`
                                }
                                href={`/exhibitions/${slug}`}
                                className="group flex flex-col"
                            >
                                {/* Cover image */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted mb-5">
                                    <Image
                                        src={imageUrl}
                                        alt={exhibition.name}
                                        fill
                                        className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                </div>

                                {/* Meta row */}
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <span className="text-[10px] font-light tracking-widest uppercase text-muted-foreground/60">
                                        {getTypeLabel(exhibition.type)}
                                    </span>
                                    <span className="text-[10px] font-light tracking-widest uppercase text-muted-foreground border border-border/60 px-2 py-0.5">
                                        {scheduleLabel}
                                    </span>
                                </div>

                                {/* Exhibition name */}
                                <h3 className="text-lg font-medium text-foreground leading-snug mb-2 group-hover:text-muted-foreground transition-colors">
                                    {exhibition.name}
                                </h3>

                                {/* Venue + dates */}
                                <div className="mt-auto space-y-0.5">
                                    {exhibition.venue && (
                                        <p className="text-sm font-light text-muted-foreground">
                                            {exhibition.venue}
                                        </p>
                                    )}
                                    <p className="text-sm font-light text-muted-foreground/70">
                                        {schedule}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
