"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Exhibition } from "@/lib/actions/exhibitions";
import { getExhibitionImageUrl, getArtworkImageUrl, generateExhibitionSlug } from "@/lib/utils/supabase-storage";
import { PLACEHOLDERS } from "@/lib/utils/image-placeholders";
import {
    formatExhibitionSchedule,
    getExhibitionScheduleLabel,
    getExhibitionScheduleStatus,
    getExhibitionYear,
} from "@bandumanamperi/types";
import posthog from "posthog-js";
import { motion } from "framer-motion";

const ExhibitionsPage = () => {
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [filter, setFilter] = useState<"all" | "solo" | "group" | "online">("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadExhibitions = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/exhibitions");
                if (response.ok) {
                    const data = await response.json();
                    setExhibitions(data);
                }
            } catch (error) {
                console.error("Error loading exhibitions:", error);
            }
            setLoading(false);
        };
        loadExhibitions();
    }, []);

    const filteredExhibitions =
        filter === "all"
            ? exhibitions
            : exhibitions.filter((ex) => ex.type === filter);

    const getTypeLabel = (type: string) => {
        switch (type.toLowerCase()) {
            case "solo": return "Solo";
            case "group": return "Group";
            case "online": return "Online";
            default: return "Exhibition";
        }
    };

    const handleFilterChange = (newFilter: typeof filter) => {
        setFilter(newFilter);
        posthog.capture("exhibition_filtered", {
            filter_type: newFilter,
            results_count: newFilter === "all"
                ? exhibitions.length
                : exhibitions.filter((ex) => ex.type === newFilter).length,
        });
    };

    const handleExhibitionClick = (exhibition: Exhibition) => {
        posthog.capture("exhibition_clicked", {
            exhibition_name: exhibition.name,
            exhibition_type: exhibition.type,
            exhibition_venue: exhibition.venue,
            exhibition_year: getExhibitionYear(exhibition),
            artworks_count: exhibition.artworks.length,
        });
    };

    return (
        <div className="flex flex-row h-full w-max flex-shrink-0">

            {/* ── Panel 1: Intro ── */}
            <div
                id="panel-exhibitions"
                data-panel=""
                data-panel-label="Exhibitions"
                className="w-screen flex-shrink-0 h-full overflow-hidden flex items-center"
            >
                <motion.div
                    className="w-full px-10 md:px-20 lg:px-32 xl:px-44"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-black uppercase tracking-[-0.03em] text-foreground">
                        Exhibitions
                    </h1>

                    <div className="mt-6 h-px w-10 bg-foreground/15" />

                    <p className="mt-6 text-[0.9375rem] text-muted-foreground font-light leading-[1.8] max-w-[38rem]">
                        Across solo presentations and collaborative group projects, Manamperi's
                        exhibitions have occupied galleries, alternative spaces, and public sites
                        from Colombo to Copenhagen. Each context reshapes the work — the same
                        gesture meaning differently in different rooms, different latitudes,
                        different histories. What follows is a record of those encounters: places
                        where art and audience met, briefly, and were both altered.
                    </p>

                    <p className="mt-4 text-xs text-muted-foreground/40 font-light">
                        {loading ? "" : `${exhibitions.length} exhibitions`}
                    </p>
                </motion.div>
            </div>

            {/* ── Panel 2: Exhibition list ── */}
            <div
                id="panel-exhibitions-list"
                data-panel=""
                data-panel-label="All Exhibitions"
                className="w-screen flex-shrink-0 h-full overflow-hidden flex flex-col"
            >
                {/* Header + filters */}
                <div className="px-10 md:px-20 lg:px-32 xl:px-44 pt-10 pb-6 shrink-0">
                    <div className="flex items-baseline justify-between">
                        <div>
                            <h2 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-bold leading-none tracking-tight text-foreground">
                                All Exhibitions
                            </h2>
                            {!loading && (
                                <p className="text-xs text-muted-foreground/50 mt-1">
                                    {filteredExhibitions.length}{" "}
                                    {filteredExhibitions.length === 1 ? "exhibition" : "exhibitions"}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-1">
                            {(["all", "solo", "group", "online"] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => handleFilterChange(f)}
                                    className={`text-[9px] tracking-widest uppercase px-3 py-1.5 transition-colors duration-200 ${
                                        filter === f
                                            ? "bg-foreground text-background"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {f === "all" ? "All" : f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scrollable list */}
                <div
                    className="flex-1 overflow-y-auto overflow-x-hidden px-10 md:px-20 lg:px-32 xl:px-44 pb-16"
                    style={{ scrollbarWidth: "none" } as React.CSSProperties}
                >
                    {loading ? (
                        <p className="text-sm text-muted-foreground">Loading…</p>
                    ) : filteredExhibitions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No exhibitions found.</p>
                    ) : (
                        <div>
                            {filteredExhibitions.map((exhibition, index) => {
                                const slug = generateExhibitionSlug(
                                    exhibition.name,
                                    getExhibitionYear(exhibition)
                                );
                                const scheduleStatus = getExhibitionScheduleStatus(exhibition);
                                const scheduleLabel = getExhibitionScheduleLabel(scheduleStatus);
                                const imageUrl =
                                    getExhibitionImageUrl(exhibition.coverImage) ||
                                    getArtworkImageUrl(exhibition.artworks[0]?.thumbnail_path ?? null) ||
                                    getArtworkImageUrl(exhibition.artworks[0]?.imageUrl ?? null) ||
                                    PLACEHOLDERS.exhibition.url;

                                return (
                                    <Link
                                        key={exhibition.id ?? `${exhibition.name}-${index}`}
                                        href={`/exhibitions/${slug}`}
                                        className="group flex items-center gap-6 py-5 border-b border-foreground/[0.08] hover:border-foreground/20 transition-colors duration-300"
                                        onClick={() => handleExhibitionClick(exhibition)}
                                    >
                                        {/* Thumbnail */}
                                        <div className="relative w-16 h-12 flex-shrink-0 overflow-hidden bg-muted">
                                            <Image
                                                src={imageUrl}
                                                alt={exhibition.name}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                sizes="64px"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-3">
                                                <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-foreground truncate group-hover:text-muted-foreground transition-colors duration-300">
                                                    {exhibition.name}
                                                </h3>
                                                {scheduleStatus !== "past" && (
                                                    <span className="text-[9px] tracking-widest uppercase text-foreground/50 flex-shrink-0">
                                                        {scheduleLabel}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground/60 mt-0.5">
                                                {formatExhibitionSchedule(exhibition)} · {exhibition.venue}
                                            </p>
                                        </div>

                                        {/* Type */}
                                        <span className="text-[9px] tracking-widest uppercase text-muted-foreground/40 flex-shrink-0">
                                            {getTypeLabel(exhibition.type)}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ExhibitionsPage;
