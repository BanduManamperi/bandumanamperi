import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
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

export function ExhibitionBanner({ exhibitions }: ExhibitionBannerProps) {
    if (exhibitions.length === 0) {
        return null;
    }

    return (
        <div
            className="border-b border-border/60 bg-muted/50"
            aria-label="Current exhibitions"
        >
            {exhibitions.map((exhibition, index) => {
                const slug = generateExhibitionSlug(
                    exhibition.name,
                    getExhibitionYear(exhibition)
                );
                const scheduleStatus = getExhibitionScheduleStatus(exhibition);
                const statusLabel = getExhibitionScheduleLabel(scheduleStatus);

                return (
                    <div
                        key={exhibition.id ?? `${exhibition.name}|${exhibition.venue}|${exhibition.startDate}|${exhibition.dates}`}
                        className={
                            index > 0 ? "border-t border-border/40" : undefined
                        }
                    >
                        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-3">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-1 min-w-0">
                                    <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest text-foreground">
                                        {statusLabel}
                                    </span>
                                    <span className="font-medium text-foreground truncate">
                                        {exhibition.name}
                                    </span>
                                    {exhibition.venue && (
                                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-0">
                                            <MapPin
                                                className="h-3.5 w-3.5 shrink-0"
                                                aria-hidden
                                            />
                                            <span className="truncate">
                                                {exhibition.venue}
                                            </span>
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Calendar
                                            className="h-3.5 w-3.5 shrink-0"
                                            aria-hidden
                                        />
                                        {formatExhibitionSchedule(exhibition)}
                                    </span>
                                </div>
                                <Link
                                    href={`/exhibitions/${slug}`}
                                    className="inline-flex shrink-0 items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground transition-colors hover:text-muted-foreground group"
                                >
                                    View exhibition
                                    <ArrowRight
                                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                                        aria-hidden
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
