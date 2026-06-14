import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Exhibition } from "@/lib/actions/exhibitions";
import { generateExhibitionSlug } from "@/lib/utils/supabase-storage";
import {
    formatExhibitionSchedule,
    getExhibitionScheduleLabel,
    getExhibitionScheduleStatus,
    getExhibitionYear,
} from "@bandumanamperi/types";

interface ExhibitionBannerProps {
    exhibitions: Exhibition[];
}

function ExhibitionBannerItem({ exhibition }: { exhibition: Exhibition }) {
    const slug = generateExhibitionSlug(
        exhibition.name,
        getExhibitionYear(exhibition)
    );
    const scheduleStatus = getExhibitionScheduleStatus(exhibition);
    const statusLabel = getExhibitionScheduleLabel(scheduleStatus);
    const schedule = formatExhibitionSchedule(exhibition);
    const href = `/exhibitions/${slug}`;

    return (
        <Link
            href={href}
            className="group flex items-center justify-between gap-8 px-6 py-2.5 lg:px-12 hover:bg-muted/30 transition-colors"
            aria-label={`View ${exhibition.name}`}
        >
            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                {/* Status badge — inverted fill for strong visibility */}
                <span className="shrink-0 inline-flex items-center gap-1.5 bg-foreground text-background text-[10px] font-medium tracking-widest uppercase px-2 py-0.5">
                    <span className="w-1 h-1 rounded-full bg-background opacity-70" aria-hidden />
                    {statusLabel}
                </span>
                {/* Exhibition name */}
                <span className="text-sm font-medium text-foreground truncate">
                    {exhibition.name}
                </span>
                {exhibition.venue && (
                    <span className="hidden md:inline text-sm font-light text-muted-foreground truncate">
                        — {exhibition.venue}
                    </span>
                )}
                <span className="hidden lg:inline text-sm font-light text-muted-foreground/70 shrink-0">
                    {schedule}
                </span>
            </div>
            {/* Link — matches "View all exhibitions" section link style */}
            <span className="inline-flex items-center gap-1.5 shrink-0 text-sm font-medium uppercase tracking-wider text-foreground group-hover:text-muted-foreground transition-colors">
                View
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
        </Link>
    );
}

export function ExhibitionBanner({ exhibitions }: ExhibitionBannerProps) {
    if (exhibitions.length === 0) {
        return null;
    }

    return (
        <div
            className="w-full border-b border-border/40 bg-background/90 backdrop-blur-md divide-y divide-border/40"
            aria-label="Exhibition announcements"
            data-site-banner
        >
            {exhibitions.map((exhibition) => (
                <ExhibitionBannerItem
                    key={
                        exhibition.id ??
                        `${exhibition.name}|${exhibition.venue}|${exhibition.startDate}|${exhibition.dates}`
                    }
                    exhibition={exhibition}
                />
            ))}
        </div>
    );
}
