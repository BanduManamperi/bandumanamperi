"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { listArtworksController, getFeaturedArtworksController } from "@/lib/controller/artworkController";
import { getFilterOptions } from "@/lib/services/artworkservice";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight, Image as ImageIcon, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import CollectionsSection, { type Collection } from "@/components/artworks/collections-section";
import { generateSlugFromTitle } from "@/lib/utils";
import { PLACEHOLDERS } from "@/lib/utils/image-placeholders";
import posthog from "posthog-js";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface FilterOptions {
    categories: string[];
    series: string[];
    statuses: string[];
    availabilities: string[];
    tags: string[];
}

/* ------------------------------------------------------------------ */
/*  Lightbox                                                           */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Lightbox({ works, index, onClose, onStep }: { works: any[]; index: number; onClose: () => void; onStep: (d: number) => void }) {
    const w = works[index];
    const reduce = useReducedMotion();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") onStep(1);
            if (e.key === "ArrowLeft") onStep(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose, onStep]);

    const caption = [w?.year, w?.medium, w?.series].filter(Boolean).join(" · ");

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
        >
            <button
                className="absolute top-5 right-5 grid place-items-center w-9 h-9 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                onClick={onClose}
                aria-label="Close"
            >
                <X className="w-4 h-4" />
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); onStep(-1); }}
                aria-label="Previous"
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-white/5 border border-white/15 text-white/80 hover:bg-white/10 transition-colors z-10"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); onStep(1); }}
                aria-label="Next"
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 grid place-items-center w-11 h-11 rounded-full bg-white/5 border border-white/15 text-white/80 hover:bg-white/10 transition-colors z-10"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            <div
                className="relative w-full h-full max-w-5xl p-12"
                onClick={(e) => e.stopPropagation()}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        className="relative w-full h-full"
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Image
                            src={w?.thumbnail_url || w?.media?.[0]?.url || PLACEHOLDERS.artwork.url}
                            alt={w?.title || "Artwork"}
                            fill
                            sizes="100vw"
                            className="object-contain"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center px-6 pointer-events-none">
                <div className="font-heading text-base md:text-lg text-white">
                    {w?.title ?? "Untitled"}
                </div>
                {caption && <div className="text-xs text-white/55 mt-1">{caption}</div>}
                <div className="font-mono text-[11px] text-white/35 mt-2 tabular-nums">
                    {index + 1} / {works.length}
                </div>
            </div>
        </motion.div>
    );
}

/* ------------------------------------------------------------------ */
/*  FilterChip                                                         */
/* ------------------------------------------------------------------ */

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`text-xs rounded-full px-3.5 py-1.5 transition-colors whitespace-nowrap ${
                active
                    ? "bg-foreground text-background"
                    : "text-muted-foreground border border-border hover:border-foreground/40"
            }`}
        >
            {label}
        </button>
    );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

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

    // Stage / reel state
    const [activeIndex, setActiveIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Refs
    const filmstripRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const thumbnailRefs = useRef<(HTMLElement | null)[]>([]);
    const isScrollingProg = useRef(false);
    const scrollDebounce = useRef<ReturnType<typeof setTimeout>>();
    const stageWheelAccum = useRef(0);
    const stageWheelResetTimer = useRef<ReturnType<typeof setTimeout>>();
    // Drag state
    const dragging = useRef(false);
    const moved = useRef(false);
    const dragStartX = useRef(0);
    const dragStartScroll = useRef(0);

    /* -------------------------------------------------------------- */
    /*  Computed                                                       */
    /* -------------------------------------------------------------- */

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

    const activeArtwork = filteredArtworks[activeIndex];
    const activeSlug = activeArtwork
        ? (activeArtwork.slug || (activeArtwork.title ? generateSlugFromTitle(activeArtwork.title) : activeArtwork.id))
        : null;

    const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

    /* -------------------------------------------------------------- */
    /*  Data fetch                                                     */
    /* -------------------------------------------------------------- */

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

    useEffect(() => {
        let filtered = [...artworks];
        if (selectedSeries) filtered = filtered.filter(a => a.series === selectedSeries);
        setFilteredArtworks(filtered);
    }, [artworks, selectedSeries]);

    useEffect(() => { setMounted(true); }, []);

    /* -------------------------------------------------------------- */
    /*  Reel navigation                                                */
    /* -------------------------------------------------------------- */

    const goTo = useCallback((index: number) => {
        const next = clamp(index, 0, Math.max(0, filteredArtworks.length - 1));
        setActiveIndex(next);
        // Center the thumbnail — defer until refs are painted
        requestAnimationFrame(() => {
            const strip = filmstripRef.current;
            const thumb = thumbnailRefs.current[next] as HTMLElement | null;
            if (!strip || !thumb) return;
            isScrollingProg.current = true;
            strip.scrollTo({
                left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2,
                behavior: "smooth",
            });
            setTimeout(() => { isScrollingProg.current = false; }, 700);
        });
    }, [filteredArtworks.length]); // eslint-disable-line react-hooks/exhaustive_deps

    const step = useCallback((delta: number) => {
        setActiveIndex(prev => {
            const next = clamp(prev + delta, 0, Math.max(0, filteredArtworks.length - 1));
            requestAnimationFrame(() => {
                const strip = filmstripRef.current;
                const thumb = thumbnailRefs.current[next] as HTMLElement | null;
                if (!strip || !thumb) return;
                isScrollingProg.current = true;
                strip.scrollTo({
                    left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2,
                    behavior: "smooth",
                });
                setTimeout(() => { isScrollingProg.current = false; }, 700);
            });
            return next;
        });
    }, [filteredArtworks.length]); // eslint-disable-line react-hooks/exhaustive_deps

    // Reset when filter changes
    useEffect(() => {
        setActiveIndex(0);
        requestAnimationFrame(() => {
            const strip = filmstripRef.current;
            const thumb = thumbnailRefs.current[0] as HTMLElement | null;
            if (!strip || !thumb) return;
            strip.scrollTo({ left: 0, behavior: "auto" });
        });
    }, [selectedSeries]);

    /* -------------------------------------------------------------- */
    /*  Filmstrip wheel — horizontal scroll, prevent page scroll      */
    /* -------------------------------------------------------------- */

    useEffect(() => {
        const el = filmstripRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            el.scrollLeft += delta;
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    /* -------------------------------------------------------------- */
    /*  Filmstrip scroll → snap to nearest thumb                      */
    /* -------------------------------------------------------------- */

    const handleFilmstripScroll = useCallback(() => {
        if (isScrollingProg.current) return;
        clearTimeout(scrollDebounce.current);
        scrollDebounce.current = setTimeout(() => {
            const strip = filmstripRef.current;
            if (!strip) return;
            const viewCenter = strip.scrollLeft + strip.clientWidth / 2;
            let closestIdx = 0;
            let closestDist = Infinity;
            thumbnailRefs.current.forEach((thumb, i) => {
                if (!thumb) return;
                const el = thumb as HTMLElement;
                const center = el.offsetLeft + el.offsetWidth / 2;
                const dist = Math.abs(viewCenter - center);
                if (dist < closestDist) { closestDist = dist; closestIdx = i; }
            });
            setActiveIndex(closestIdx);
        }, 150);
    }, []);

    /* -------------------------------------------------------------- */
    /*  Filmstrip pointer drag                                         */
    /* -------------------------------------------------------------- */

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        const strip = filmstripRef.current;
        if (!strip) return;
        dragging.current = true;
        moved.current = false;
        dragStartX.current = e.clientX;
        dragStartScroll.current = strip.scrollLeft;
        strip.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!dragging.current || !filmstripRef.current) return;
        const dx = e.clientX - dragStartX.current;
        if (Math.abs(dx) > 4) moved.current = true;
        filmstripRef.current.scrollLeft = dragStartScroll.current - dx;
    };

    const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
        dragging.current = false;
        filmstripRef.current?.releasePointerCapture(e.pointerId);
    };

    /* -------------------------------------------------------------- */
    /*  Stage wheel → step through works                              */
    /* -------------------------------------------------------------- */

    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;

        // One "step" requires this many normalised pixels of scroll intent.
        // Lower = more sensitive; 100–150 is comfortable for most devices.
        const THRESHOLD = 120;
        // Cap how many works a single flick can jump to avoid skipping too far.
        const MAX_STEPS_PER_GESTURE = 6;

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            // Normalise across deltaMode (pixel / line / page)
            let raw = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (e.deltaMode === 1) raw *= 40;   // lines → pixels
            if (e.deltaMode === 2) raw *= 800;  // pages → pixels

            stageWheelAccum.current += raw;

            // Reset accumulator when the gesture pauses so momentum doesn't bleed into the next flick
            clearTimeout(stageWheelResetTimer.current);
            stageWheelResetTimer.current = setTimeout(() => {
                stageWheelAccum.current = 0;
            }, 200);

            // Fire steps for each full threshold crossed
            if (Math.abs(stageWheelAccum.current) >= THRESHOLD) {
                const steps = clamp(
                    Math.trunc(stageWheelAccum.current / THRESHOLD),
                    -MAX_STEPS_PER_GESTURE,
                    MAX_STEPS_PER_GESTURE,
                );
                stageWheelAccum.current -= steps * THRESHOLD; // keep remainder
                step(steps);
            }
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [step]);

    /* -------------------------------------------------------------- */
    /*  Stage keyboard handler                                        */
    /* -------------------------------------------------------------- */

    const onStageKey = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
        if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setLightboxOpen(true); }
    };

    /* -------------------------------------------------------------- */
    /*  Collection select                                              */
    /* -------------------------------------------------------------- */

    const handleCollectionSelect = useCallback((name: string) => {
        setSelectedSeries(prev => prev === name ? "" : name);
        posthog.capture("collection_selected", { collection_name: name });
    }, []);

    /* ============================================================== */
    /*  Render                                                         */
    /* ============================================================== */

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

                            <button
                                onClick={() => {
                                    document.getElementById("panel-artworks-grid")?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
                                }}
                                className="mt-8 inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
                            >
                                Browse all works
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Right: image preview + stats */}
                        <div className="hidden lg:flex flex-col gap-3 h-[60vh]">
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

            {/* ── Panel 3: Stage + Filmstrip ── */}
            <div
                id="panel-artworks-grid"
                data-panel=""
                data-panel-label="Works"
                className="w-screen flex-shrink-0 h-full overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="px-10 md:px-16 pt-8 pb-3 shrink-0 flex items-baseline justify-between">
                    <h2 className="font-heading text-[clamp(1.75rem,2.5vw,2.5rem)] font-bold leading-none tracking-tight text-foreground">
                        Works
                    </h2>
                    <span className="text-sm text-muted-foreground tracking-widest uppercase">
                        {selectedSeries || "All"} · {filteredArtworks.length} works
                    </span>
                </div>

                {/* Collection filter chips */}
                {!loading && collections.length > 0 && (
                    <div className="px-10 md:px-16 pb-4 shrink-0 flex flex-wrap gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                        <FilterChip
                            label="All"
                            active={!selectedSeries}
                            onClick={() => setSelectedSeries("")}
                        />
                        {collections.map(c => (
                            <FilterChip
                                key={c.id}
                                label={c.title}
                                active={selectedSeries === c.id}
                                onClick={() => setSelectedSeries(prev => prev === c.id ? "" : c.id)}
                            />
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Loading…</p>
                    </div>
                ) : filteredArtworks.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">No works found.</p>
                    </div>
                ) : (
                    <>
                        {/* ── Stage ── */}
                        <div
                            ref={stageRef}
                            tabIndex={0}
                            onKeyDown={onStageKey}
                            className="relative mx-10 md:mx-16 flex-1 min-h-0 rounded-xl overflow-hidden bg-[#0f0f11] outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                        >
                            {/* Crossfading image */}
                            <AnimatePresence>
                                {activeArtwork && (() => {
                                    const src = activeArtwork.thumbnail_url || activeArtwork.media?.[0]?.url || PLACEHOLDERS.artwork.url;
                                    return (
                                        <motion.button
                                            key={activeIndex}
                                            className="absolute inset-0 flex items-center justify-center p-8 md:p-12 cursor-zoom-in"
                                            style={{ zIndex: 1 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.35, ease: "easeOut" }}
                                            onClick={() => setLightboxOpen(true)}
                                            aria-label="Open fullscreen"
                                        >
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={src}
                                                    alt={activeArtwork.title || "Artwork"}
                                                    fill
                                                    className="object-contain"
                                                    sizes="(max-width: 768px) 100vw, 80vw"
                                                    priority
                                                />
                                            </div>
                                        </motion.button>
                                    );
                                })()}
                            </AnimatePresence>

                            {/* Left chevron */}
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm grid place-items-center text-white hover:bg-black/60 transition-colors z-20"
                                onClick={() => step(-1)}
                                aria-label="Previous work"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* Right chevron */}
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm grid place-items-center text-white hover:bg-black/60 transition-colors z-20"
                                onClick={() => step(1)}
                                aria-label="Next work"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Expand button — top right */}
                            <button
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm grid place-items-center text-white/70 hover:text-white hover:bg-black/50 transition-colors z-20"
                                onClick={() => setLightboxOpen(true)}
                                aria-label="Expand"
                            >
                                <Expand className="w-3.5 h-3.5" />
                            </button>

                            {/* Bottom-left: title + meta */}
                            <div className="pointer-events-none absolute bottom-5 left-6 z-20">
                                {activeArtwork && !isPlaceholderTitle(activeArtwork.title) && (
                                    <div className="pointer-events-auto">
                                        <Link
                                            href={`/artworks/${activeSlug}`}
                                            className="font-heading text-white text-xl md:text-2xl font-semibold hover:opacity-75 transition-opacity"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {activeArtwork.title}
                                        </Link>
                                    </div>
                                )}
                                {activeArtwork && (
                                    <p className="text-white/50 text-sm mt-0.5">
                                        {[activeArtwork.year, activeArtwork.medium, activeArtwork.series]
                                            .filter(Boolean)
                                            .join(" · ")}
                                    </p>
                                )}
                            </div>

                            {/* Bottom-right: counter */}
                            <div className="pointer-events-none absolute bottom-5 right-6 z-20 text-white/50 text-sm tabular-nums font-mono">
                                {activeIndex + 1} / {filteredArtworks.length}
                            </div>
                        </div>

                        {/* ── Filmstrip ── */}
                        <div
                            ref={filmstripRef}
                            className="shrink-0 overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing"
                            style={{
                                scrollbarWidth: "none",
                                height: 148,
                                scrollSnapType: "x mandatory",
                            } as React.CSSProperties}
                            onScroll={handleFilmstripScroll}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onPointerCancel={onPointerUp}
                        >
                            <div
                                className="flex items-center gap-2 h-full"
                                style={{ paddingLeft: "calc(50vw - 32px)", paddingRight: "calc(50vw - 32px)" }}
                            >
                                {filteredArtworks.map((artwork, i) => {
                                    const src = artwork.thumbnail_url || artwork.media?.[0]?.url || PLACEHOLDERS.thumbnail.url;
                                    const isActive = i === activeIndex;

                                    return (
                                        <button
                                            key={artwork.id}
                                            ref={el => { thumbnailRefs.current[i] = el; }}
                                            onClick={() => { if (!moved.current) goTo(i); }}
                                            aria-label={artwork.title ?? `Work ${i + 1}`}
                                            aria-current={isActive}
                                            className={`relative flex-shrink-0 overflow-hidden rounded-[3px] bg-muted transition-all duration-200 ${
                                                isActive
                                                    ? "w-16 h-[84px] ring-2 ring-foreground opacity-100"
                                                    : "w-12 h-16 opacity-50 hover:opacity-85"
                                            }`}
                                            style={{ scrollSnapAlign: "center" }}
                                        >
                                            <Image
                                                src={src}
                                                alt=""
                                                fill
                                                sizes="64px"
                                                className="object-cover pointer-events-none"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── Scrub rail ── */}
                        <div
                            className="mx-10 md:mx-16 mb-6 mt-1 shrink-0 relative h-[2px] bg-border rounded-full cursor-pointer"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const ratio = (e.clientX - rect.left) / rect.width;
                                goTo(Math.round(ratio * (filteredArtworks.length - 1)));
                            }}
                        >
                            <div
                                className="absolute inset-y-0 left-0 bg-foreground rounded-full transition-all duration-300"
                                style={{ width: `${(activeIndex / Math.max(filteredArtworks.length - 1, 1)) * 100}%` }}
                            />
                            <div
                                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-foreground border-2 border-background shadow transition-all duration-300"
                                style={{ left: `${(activeIndex / Math.max(filteredArtworks.length - 1, 1)) * 100}%` }}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* ── Lightbox (portal) ── */}
            {mounted && lightboxOpen && activeArtwork && createPortal(
                <AnimatePresence>
                    <Lightbox
                        works={filteredArtworks}
                        index={activeIndex}
                        onClose={() => setLightboxOpen(false)}
                        onStep={(d) => step(d)}
                    />
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
