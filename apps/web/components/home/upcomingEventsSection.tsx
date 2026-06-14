import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
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
            return "Solo Exhibition";
        case "group":
            return "Group Exhibition";
        case "online":
            return "Online Exhibition";
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
            className="py-24 md:py-32 bg-secondary/20 border-b border-border/40"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
                    <div className="max-w-2xl">
                        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                            Recent &amp; upcoming
                        </p>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Upcoming Events &amp; Exhibitions
                        </h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Current and forthcoming exhibitions, plus events from
                            the past six months.
                        </p>
                    </div>
                    <Link
                        href="/exhibitions"
                        className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-foreground hover:text-muted-foreground transition-colors group shrink-0"
                    >
                        View all exhibitions
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {exhibitions.map((exhibition) => {
                        const slug = generateExhibitionSlug(
                            exhibition.name,
                            getExhibitionYear(exhibition)
                        );
                        const scheduleStatus = getExhibitionScheduleStatus(exhibition);
                        const scheduleLabel = getHomepageEventLabel(scheduleStatus);
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
                                className="group flex flex-col overflow-hidden border border-border/60 bg-background transition-colors hover:border-border"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                    <Image
                                        src={imageUrl}
                                        alt={exhibition.name}
                                        fill
                                        className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                                            {getTypeLabel(exhibition.type)}
                                        </span>
                                        <span className="text-[10px] font-medium uppercase tracking-widest text-foreground border border-border px-2 py-0.5">
                                            {scheduleLabel}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 group-hover:text-muted-foreground transition-colors">
                                        {exhibition.name}
                                    </h3>
                                    <div className="mt-auto space-y-2 text-sm text-muted-foreground">
                                        <p className="flex items-start gap-2">
                                            <Calendar
                                                className="h-4 w-4 shrink-0 mt-0.5"
                                                aria-hidden
                                            />
                                            {formatExhibitionSchedule(exhibition)}
                                        </p>
                                        {exhibition.venue && (
                                            <p className="flex items-start gap-2">
                                                <MapPin
                                                    className="h-4 w-4 shrink-0 mt-0.5"
                                                    aria-hidden
                                                />
                                                {exhibition.venue}
                                            </p>
                                        )}
                                    </div>
                                    <span className="inline-flex items-center gap-2 mt-6 text-xs font-medium uppercase tracking-widest text-foreground">
                                        Learn more
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
