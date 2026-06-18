"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { listArtworksController } from "@/lib/controller/artworkController";
import { getFilterOptions } from "@/lib/services/artworkservice";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { generateSlugFromTitle } from "@/lib/utils";
import { PLACEHOLDERS } from "@/lib/utils/image-placeholders";
import posthog from "posthog-js";
import { motion } from "framer-motion";

interface FilterOptions {
    categories: string[];
    series: string[];
    statuses: string[];
    availabilities: string[];
    tags: string[];
}

export default function ArtworksPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [artworks, setArtworks] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [filteredArtworks, setFilteredArtworks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        categories: [], series: [], statuses: [], availabilities: [], tags: [],
    });
    const [selectedSeries, setSelectedSeries] = useState<string>("");

    const stripRef = useRef<HTMLDivElement>(null);

    // Series grouped with counts + featured image
    const seriesWithCounts = React.useMemo(() => {
        const counts = new Map<string, { count: number; artworks: typeof artworks }>();
        artworks.forEach(artwork => {
            if (artwork.series) {
                const existing = counts.get(artwork.series) || { count: 0, artworks: [] };
                counts.set(artwork.series, {
                    count: existing.count + 1,
                    artworks: [...existing.artworks, artwork],
                });
            }
        });
        return Array.from(counts.entries()).map(([name, data]) => ({
            name,
            count: data.count,
            featuredArtwork: data.artworks[0],
        }));
    }, [artworks]);

    const isPlaceholderTitle = (title: string | null | undefined) => {
        const t = (title || "").trim().toUpperCase();
        return t === "IMG" || /^IMG_\d+/i.test(t);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [artworksData, filterData] = await Promise.all([
                    listArtworksController(),
                    getFilterOptions(),
                ]);
                setArtworks(artworksData);
                setFilteredArtworks(artworksData);
                setFilterOptions(filterData);
            } catch (error) {
                console.error("Error fetching artworks:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Apply series filter
    useEffect(() => {
        let filtered = [...artworks];
        if (selectedSeries) filtered = filtered.filter(a => a.series === selectedSeries);
        setFilteredArtworks(filtered);
    }, [artworks, selectedSeries]);

    // Horizontal film strip — intercept wheel events, hand off at edges
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

    const handleCollectionSelect = useCallback((name: string) => {
        setSelectedSeries(prev => prev === name ? "" : name);
        posthog.capture("collection_selected", { collection_name: name });
    }, []);

    return (
        <div className="flex flex-row h-full w-max flex-shrink-0">

            {/* ── Panel 1: Intro ── */}
            <div
                id="panel-artworks"
                data-panel=""
                data-panel-label="Artworks"
                className="w-screen flex-shrink-0 h-full overflow-hidden flex items-center"
            >
                <motion.div
                    className="w-full px-10 md:px-20 lg:px-32 xl:px-44"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-black uppercase tracking-[-0.03em] text-foreground">
                        Artworks
                    </h1>

                    <div className="mt-6 h-px w-10 bg-foreground/15" />

                    <p className="mt-6 text-[0.9375rem] text-muted-foreground font-light leading-[1.8] max-w-[38rem]">
                        These works do not simply depict — they excavate. Across drawing,
                        sculpture, photography, and installation, Manamperi returns again and
                        again to the sites where history leaves its marks on the body: wounds
                        half-healed, rituals half-remembered, landscapes altered by hands that
                        are no longer present. To move through this collection is to move
                        through a form of reckoning — quiet, precise, and deeply human.
                    </p>

                    <p className="mt-4 text-xs text-muted-foreground/40 font-light">
                        {loading ? "" : `${artworks.length} works in the collection`}
                    </p>
                </motion.div>
            </div>

            {/* ── Panel 2: Collections ── */}
            {!loading && seriesWithCounts.length > 0 && (
                <div
                    id="panel-artworks-collections"
                    data-panel=""
                    data-panel-label="Collections"
                    className="w-screen flex-shrink-0 h-full overflow-hidden flex items-center"
                >
                    <motion.div
                        className="w-full px-10 md:px-20 lg:px-32 xl:px-44"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-baseline justify-between mb-8">
                            <h2 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-bold leading-none tracking-tight text-foreground">
                                Collections
                            </h2>
                            {selectedSeries && (
                                <button
                                    onClick={() => setSelectedSeries("")}
                                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="w-3 h-3" /> Clear
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                            {seriesWithCounts.map((collection) => {
                                const imageUrl =
                                    collection.featuredArtwork?.thumbnail_url ||
                                    collection.featuredArtwork?.media?.[0]?.url ||
                                    PLACEHOLDERS.thumbnail.url;
                                const isActive = selectedSeries === collection.name;

                                return (
                                    <button
                                        key={collection.name}
                                        onClick={() => handleCollectionSelect(collection.name)}
                                        className={`group relative overflow-hidden aspect-[4/3] transition-all duration-300 ${
                                            isActive ? "ring-1 ring-foreground" : ""
                                        }`}
                                    >
                                        <Image
                                            src={imageUrl}
                                            alt={collection.name}
                                            fill
                                            className={`object-cover transition-all duration-700 ${
                                                isActive
                                                    ? "grayscale-0 scale-105"
                                                    : "grayscale group-hover:grayscale-0 group-hover:scale-105"
                                            }`}
                                            sizes="(max-width: 1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-4 text-left">
                                            <h3 className="font-heading text-base lg:text-lg font-bold text-white leading-tight">
                                                {collection.name}
                                            </h3>
                                            <p className="text-xs text-white/50 mt-0.5">
                                                {collection.count} {collection.count === 1 ? "work" : "works"}
                                            </p>
                                        </div>
                                        {isActive && (
                                            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* ── Panel 3: Horizontal film strip ── */}
            <div
                id="panel-artworks-grid"
                data-panel=""
                data-panel-label="Works"
                className="w-screen flex-shrink-0 h-full overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="px-10 md:px-20 lg:px-32 xl:px-44 pt-10 pb-6 shrink-0 flex items-baseline justify-between">
                    <div>
                        <h2 className="font-heading text-[clamp(2rem,3.5vw,3rem)] font-bold leading-none tracking-tight text-foreground">
                            Works
                        </h2>
                        {!loading && (
                            <p className="text-xs text-muted-foreground/50 mt-1">
                                {filteredArtworks.length} {filteredArtworks.length === 1 ? "work" : "works"}
                                {selectedSeries && ` · ${selectedSeries}`}
                            </p>
                        )}
                    </div>
                    {selectedSeries && (
                        <button
                            onClick={() => setSelectedSeries("")}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-3 h-3" /> All works
                        </button>
                    )}
                </div>

                {/* Film strip */}
                <div
                    ref={stripRef}
                    className="flex-1 overflow-x-auto overflow-y-hidden pl-10 md:pl-20 lg:pl-32 xl:pl-44 pr-10 md:pr-20 lg:pr-32 xl:pr-44"
                    style={{ scrollbarWidth: "none" } as React.CSSProperties}
                >
                    {loading ? (
                        <div className="h-full flex items-center">
                            <p className="text-sm text-muted-foreground">Loading…</p>
                        </div>
                    ) : filteredArtworks.length === 0 ? (
                        <div className="h-full flex items-center">
                            <p className="text-sm text-muted-foreground">No works found.</p>
                        </div>
                    ) : (
                        <div className="flex gap-4 h-full items-end pb-16" style={{ width: "max-content" }}>
                            {filteredArtworks.map((artwork) => {
                                const thumbnailUrl =
                                    artwork.thumbnail_url ||
                                    artwork.media?.[0]?.url ||
                                    artwork.media?.[0]?.path ||
                                    PLACEHOLDERS.artwork.url;
                                const slug = artwork.slug || (artwork.title ? generateSlugFromTitle(artwork.title) : artwork.id);
                                const showTitle = !isPlaceholderTitle(artwork.title);

                                return (
                                    <Link
                                        key={artwork.id}
                                        href={`/artworks/${slug}`}
                                        className="group flex flex-col flex-shrink-0"
                                        style={{ height: "calc(100% - 4rem)" }}
                                    >
                                        <div
                                            className="relative overflow-hidden bg-muted flex-1"
                                            style={{ width: "calc((100vh - 12rem) * 4 / 5)", maxWidth: "320px" }}
                                        >
                                            <Image
                                                src={thumbnailUrl}
                                                alt={showTitle ? (artwork.title || "Artwork") : "Artwork"}
                                                fill
                                                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                                sizes="320px"
                                            />
                                        </div>
                                        <div className="mt-2.5 w-full" style={{ maxWidth: "320px" }}>
                                            {showTitle && (
                                                <h3 className="text-xs font-light text-foreground group-hover:text-muted-foreground transition-colors truncate">
                                                    {artwork.title}
                                                </h3>
                                            )}
                                            {artwork.year && (
                                                <p className="text-[10px] text-muted-foreground/40 mt-0.5">{artwork.year}</p>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
