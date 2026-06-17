"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@/lib/types/artwork";
import { getArtworksByCategory } from "@/lib/data/artworks";
import posthog from "posthog-js";

const PerformancesPage = () => {
    const [performances, setPerformances] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPerformances = async () => {
            setLoading(true);
            const data = await getArtworksByCategory("performance");
            setPerformances(data);
            setLoading(false);
        };
        loadPerformances();
    }, []);

    // PostHog: Track performance click
    const handlePerformanceClick = (performance: Artwork) => {
        posthog.capture('performance_viewed', {
            performance_id: performance.id,
            performance_title: performance.title,
            performance_slug: performance.slug,
            performance_year: performance.year,
            performance_medium: performance.medium,
        });
    };

    return (
        <div className="min-h-full bg-background">
            {/* Hero Section - Centered Minimal */}
            <div className="relative min-h-[50vh] flex items-center justify-center px-6 pt-12 md:pt-16 pb-16">
                <div className="text-center max-w-4xl mx-auto space-y-8">
                    <div>
                        <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-6">
                            Live Art
                        </p>
                        <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-tight leading-[0.9]">
                            Performance
                        </h1>
                    </div>
                    <div className="w-16 h-px bg-border mx-auto" />
                    <p className="text-muted-foreground text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                        Ephemeral explorations of identity, body, and transformation through live intervention
                    </p>
                </div>
            </div>

            <main className="pb-24">
                {/* Single Column, Large Format Gallery */}
                {loading ? (
                    <div className="text-center py-32">
                        <p className="text-muted-foreground">Loading performances...</p>
                    </div>
                ) : performances.length === 0 ? (
                    <div className="text-center py-32">
                        <p className="text-muted-foreground">No performances found.</p>
                    </div>
                ) : (
                    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 space-y-32">
                        {performances.map((performance, index) => (
                            <Link
                                key={performance.id}
                                href={`/artworks/${performance.slug}`}
                                className="block group animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => handlePerformanceClick(performance)}
                            >
                                <div className="space-y-8">
                                    {/* Large Image - Full Width within Container */}
                                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
                                        <Image
                                            src={performance.imageUrl}
                                            alt={performance.imageAlt || performance.title}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.02]"
                                            sizes="(max-width: 1400px) 100vw, 1400px"
                                            priority={index === 0}
                                        />
                                    </div>

                                    {/* Content Below Image */}
                                    <div className="grid md:grid-cols-12 gap-8 md:gap-12">
                                        {/* Left: Number and Year */}
                                        <div className="md:col-span-2 space-y-2">
                                            <p className="text-5xl md:text-6xl font-light text-muted-foreground/30">
                                                {String(index + 1).padStart(2, '0')}
                                            </p>
                                            {performance.year && (
                                                <p className="text-xs tracking-widest uppercase text-muted-foreground">
                                                    {performance.year}
                                                </p>
                                            )}
                                        </div>

                                        {/* Right: Title and Details */}
                                        <div className="md:col-span-10 space-y-6">
                                            <div>
                                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 leading-tight group-hover:text-muted-foreground transition-colors duration-300">
                                                    {performance.title}
                                                </h2>
                                                {performance.medium && (
                                                    <p className="text-sm tracking-wide text-muted-foreground">
                                                        {performance.medium}
                                                    </p>
                                                )}
                                            </div>

                                            {performance.description && (
                                                <p className="text-muted-foreground leading-relaxed text-lg max-w-3xl">
                                                    {performance.description}
                                                </p>
                                            )}

                                            <div className="pt-2">
                                                <span className="inline-flex items-center gap-3 text-sm tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors group-hover:gap-4 transition-all duration-300">
                                                    <span>View Performance</span>
                                                    <span className="text-lg">→</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* About Section */}
                <div className="mt-40 pt-24 border-t border-border/40">
                    <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
                        <div>
                            <h3 className="text-3xl md:text-4xl font-light mb-8 leading-tight">
                                The Ephemeral Nature of Performance
                            </h3>
                            <div className="w-16 h-px bg-border mx-auto" />
                        </div>
                        
                        <div className="space-y-6 text-muted-foreground font-light leading-relaxed text-lg">
                            <p>
                                Performance art exists in the moment—a singular, unrepeatable dialogue between 
                                artist, body, space, and witness. Each work is conceived to challenge perceptions,
                                provoke thought, and create moments of transformation.
                            </p>
                            <p>
                                Through the body as medium, these performances explore themes of identity,
                                vulnerability, endurance, and social commentary, drawing from personal experience
                                and cultural heritage to address universal questions of human existence.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-8 md:gap-12 pt-12">
                            <div>
                                <p className="text-4xl md:text-5xl font-light mb-2">{performances.length}</p>
                                <p className="text-xs tracking-widest uppercase text-muted-foreground">Works</p>
                            </div>
                            <div>
                                <p className="text-4xl md:text-5xl font-light mb-2">15+</p>
                                <p className="text-xs tracking-widest uppercase text-muted-foreground">Years</p>
                            </div>
                            <div>
                                <p className="text-4xl md:text-5xl font-light mb-2">10+</p>
                                <p className="text-xs tracking-widest uppercase text-muted-foreground">Countries</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PerformancesPage;

