"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { listArtworksController, getFeaturedArtworksController } from "@/lib/controller/artworkController";
import { getFilterOptions } from "@/lib/services/artworkservice";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight, Image as ImageIcon } from "lucide-react";
import CollectionsSection, { type Collection } from "@/components/artworks/collections-section";
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
    const [featuredArtworks, setFeaturedArtworks] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [filteredArtworks, setFilteredArtworks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        categories: [], series: [], statuses: [], availabilities: [], tags: [],
    });
    const [selectedSeries, setSelectedSeries] = useState<string>("");

    const stripRef = useRef<HTMLDivElement>(null);

    // Series grouped with counts + up to 4 artworks for the montage cover
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
            artworks: data.artworks,
            featuredArtwork: data.artworks[0],
        }));
    }, [artworks]);

    const goToWorks = useCallback(() => {
        document.getElementById("panel-artworks-grid")?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }, []);

    // Map series to Collection shape for CollectionsSection
    const collections = React.useMemo<Collection[]>(() =>
        seriesWithCounts.map(s => ({
            id: s.name,
            title: s.name,
            workCount: s.count,
            works: s.artworks.slice(0, 4).map(a => ({
                id: a.id,
                image: a.thumbnail_url || a.media?.[0]?.url || PLACEHOLDERS.thumbnail.url,
                alt: a.title || s.name,
            })),
        })),
    [seriesWithCounts]);

    const isPlaceholderTitle = (title: string | null | undefined) => {
        const t = (title || "").trim().toUpperCase();
        return t === "IMG" || /^IMG_\d+/i.test(t);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [artworksData, filterData, featuredData] = await Promise.all([
                    listArtworksController(),
                    getFilterOptions(),
                    getFeaturedArtworksController(),
                ]);
                setArtworks(artworksData);
                setFilteredArtworks(artworksData);
                setFilterOptions(filterData);
                setFeaturedArtworks(featuredData);
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                        {/* Left: text */}
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">
                                Intro
                            </p>

                            <h1 className="font-heading text-[clamp(3rem,6vw,5rem)] font-bold leading-none tracking-tight text-foreground">
                                Artworks
                            </h1>

                            <div className="mt-5 h-px w-10 bg-foreground/15" />

                            <p className="mt-6 text-base text-muted-foreground font-light leading-relaxed">
                                These works do not simply depict, they excavate. Across painting,
                                drawing, sculpture, photography, and installation, Manamperi returns
                                again and again to the sites where history leaves its marks on the
                                body: wounds half-healed, rituals half-remembered, landscapes altered
                                by hands that are no longer present. To move through the collection
                                is to move through a form of reckoning, quiet, precise, and deeply human.
                            </p>

                            {/* Spanning */}
                            {filterOptions.categories.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
                                        Spanning
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {filterOptions.categories.map(cat => (
                                            <span
                                                key={cat}
                                                className="px-3.5 py-1.5 rounded-full border border-border text-sm text-foreground"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA */}
                            <button
                                onClick={() => {
                                    const el = document.getElementById("panel-artworks-grid");
                                    el?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
                                }}
                                className="mt-8 inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                Browse all works
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Right: image preview + stats */}
                        <div className="hidden lg:flex flex-col gap-3 h-[60vh]">
                            {/* Large top image — uses featured artworks, falls back to all artworks */}
                            {(() => {
                                const previewArtworks = featuredArtworks.length > 0 ? featuredArtworks : artworks;
                                const p0 = previewArtworks[0];
                                const p1 = previewArtworks[1];
                                const p2 = previewArtworks[2];
                                return (
                                    <>
                                        <div className="relative flex-[2] overflow-hidden rounded-xl bg-muted">
                                            {p0 && (
                                                <Image
                                                    src={p0.thumbnail_url || p0.media?.[0]?.url || PLACEHOLDERS.artwork.url}
                                                    alt={p0.title || "Featured work"}
                                                    fill
                                                    className="object-cover"
                                                    sizes="40vw"
                                                />
                                            )}
                                            {!p0 && !loading && (
                                                <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/40">
                                                    <ImageIcon className="w-8 h-8" />
                                                    <span className="text-xs">a featured work</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Two smaller images */}
                                        <div className="flex gap-3 flex-1">
                                            <div className="relative flex-1 overflow-hidden rounded-xl bg-muted">
                                                {p1 && (
                                                    <Image
                                                        src={p1.thumbnail_url || p1.media?.[0]?.url || PLACEHOLDERS.artwork.url}
                                                        alt={p1.title || "Artwork"}
                                                        fill
                                                        className="object-cover"
                                                        sizes="20vw"
                                                    />
                                                )}
                                            </div>
                                            <div className="relative flex-1 overflow-hidden rounded-xl bg-muted">
                                                {p2 && (
                                                    <Image
                                                        src={p2.thumbnail_url || p2.media?.[0]?.url || PLACEHOLDERS.artwork.url}
                                                        alt={p2.title || "Artwork"}
                                                        fill
                                                        className="object-cover"
                                                        sizes="20vw"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}

                            {/* Stats */}
                            {!loading && artworks.length > 0 && (
                                <div className="pt-2 border-t border-border">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-heading text-5xl font-bold text-foreground leading-none">
                                            {artworks.length}
                                        </span>
                                        <span className="text-sm text-muted-foreground">works in the collection</span>
                                    </div>
                                    {(filterOptions.categories.length > 0 || seriesWithCounts.length > 0) && (
                                        <p className="text-xs text-muted-foreground/60 mt-1">
                                            {[
                                                filterOptions.categories.length > 0 && `${filterOptions.categories.length} media`,
                                                seriesWithCounts.length > 0 && `${seriesWithCounts.length} collections`,
                                            ].filter(Boolean).join(" and ")}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </motion.div>
            </div>

            {/* ── Panel 2: Collections ── */}
            {!loading && collections.length > 0 && (
                <div
                    id="panel-artworks-collections"
                    data-panel=""
                    data-panel-label="Collections"
                    className="w-screen flex-shrink-0 h-full overflow-y-auto overflow-x-hidden"
                    onWheel={(e) => e.stopPropagation()}
                >
                    <CollectionsSection
                        collections={collections}
                        totalArtworkCount={artworks.length}
                        activeCollectionId={selectedSeries || null}
                        onSelect={(id) => {
                            handleCollectionSelect(id);
                            goToWorks();
                        }}
                        onBrowseAll={() => {
                            setSelectedSeries("");
                            goToWorks();
                        }}
                    />
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
                                                className="object-cover group-hover:scale-105 transition-all duration-700"
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
