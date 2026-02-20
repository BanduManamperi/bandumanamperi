"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Exhibition } from "@/lib/actions/exhibitions";
import { getExhibitionImageUrl, getArtworkImageUrl, generateExhibitionSlug } from "@/lib/utils/supabase-storage";
import { PLACEHOLDERS } from "@/lib/utils/image-placeholders";
import posthog from "posthog-js";

const ExhibitionsPage = () => {
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [filter, setFilter] = useState<"all" | "solo" | "group" | "online">("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadExhibitions = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/exhibitions');
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
            case "solo":
                return "Solo Exhibition";
            case "group":
                return "Group Exhibition";
            case "online":
                return "Online Exhibition";
            default:
                return "Exhibition";
        }
    };

    const getExhibitionYear = (dates: string) => {
        try {
            const date = new Date(dates);
            return date.getFullYear().toString();
        } catch {
            return "";
        }
    };

    // PostHog: Track filter changes
    const handleFilterChange = (newFilter: typeof filter) => {
        setFilter(newFilter);
        posthog.capture('exhibition_filtered', {
            filter_type: newFilter,
            results_count: newFilter === "all" ? exhibitions.length : exhibitions.filter(ex => ex.type === newFilter).length,
        });
    };

    // PostHog: Track exhibition click
    const handleExhibitionClick = (exhibition: Exhibition) => {
        posthog.capture('exhibition_clicked', {
            exhibition_name: exhibition.name,
            exhibition_type: exhibition.type,
            exhibition_venue: exhibition.venue,
            exhibition_year: getExhibitionYear(exhibition.dates),
            artworks_count: exhibition.artworks.length,
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-24 md:pt-32 pb-24">
                <div className="max-w-[1900px] mx-auto px-6 lg:px-12">
                    {/* Header */}
                    <div className="mb-16">
                        <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
                            Exhibition History
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
                            Exhibitions
                        </h1>
                        <p className="text-muted-foreground max-w-3xl text-lg font-light leading-relaxed">
                            A curated selection of solo and group exhibitions spanning international venues,
                            showcasing works that explore identity, performance, and contemporary artistic practice.
                        </p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="mb-12 flex flex-wrap gap-3">
                        {[
                            { value: "all", label: "All Exhibitions" },
                            { value: "solo", label: "Solo" },
                            { value: "group", label: "Group" },
                            { value: "online", label: "Online" },
                        ].map((item) => (
                            <button
                                key={item.value}
                                onClick={() => handleFilterChange(item.value as typeof filter)}
                                className={`
                                    px-6 py-2.5 text-sm font-light tracking-wide
                                    border border-border/40 rounded-none
                                    transition-all duration-300
                                    ${filter === item.value
                                        ? "bg-foreground text-background"
                                        : "bg-transparent text-muted-foreground hover:text-foreground hover:border-foreground/60"
                                    }
                                `}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Exhibitions Grid */}
                    {loading ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">Loading exhibitions...</p>
                        </div>
                    ) : filteredExhibitions.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">No exhibitions found.</p>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {filteredExhibitions.map((exhibition, index) => {
                                const slug = generateExhibitionSlug(exhibition.name, getExhibitionYear(exhibition.dates));
                                return (
                                    <Link
                                        key={`${exhibition.name}-${exhibition.venue}-${exhibition.dates}`}
                                        href={`/exhibitions/${slug}`}
                                        className="block group animate-fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                        onClick={() => handleExhibitionClick(exhibition)}
                                    >
                                        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start cursor-pointer">
                                            {/* Image */}
                                            <div
                                                className={`relative overflow-hidden bg-card aspect-[4/3] ${index % 2 === 0 ? "md:order-1" : "md:order-2"
                                                    }`}
                                            >
                                                <Image
                                                    src={
                                                        getExhibitionImageUrl(exhibition.coverImage) ||
                                                        getArtworkImageUrl(exhibition.artworks[0]?.thumbnail_path ?? null) ||
                                                        getArtworkImageUrl(exhibition.artworks[0]?.imageUrl ?? null) ||
                                                        PLACEHOLDERS.exhibition.url
                                                    }
                                                    alt={exhibition.name}
                                                    fill
                                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div
                                                className={`flex flex-col justify-center space-y-4 ${index % 2 === 0 ? "md:order-2" : "md:order-1"
                                                    }`}
                                            >
                                                {/* Type Badge */}
                                                <div className="inline-flex">
                                                    <span className="text-xs tracking-widest uppercase text-muted-foreground border border-border/40 px-3 py-1">
                                                        {getTypeLabel(exhibition.type)}
                                                    </span>
                                                </div>

                                                {/* Title & Year */}
                                                <h2 className="text-3xl md:text-4xl font-light group-hover:text-muted-foreground transition-colors duration-300">
                                                    {exhibition.name}
                                                </h2>

                                                {/* Meta Information */}
                                                <div className="space-y-2 text-muted-foreground font-light">
                                                    <p className="text-lg">{getExhibitionYear(exhibition.dates)}</p>
                                                    <p>{exhibition.venue}</p>
                                                    {exhibition.curator && (
                                                        <p className="text-sm">
                                                            Curated by {exhibition.curator}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Description */}
                                                {exhibition.about && (
                                                    <p className="text-muted-foreground leading-relaxed pt-2">
                                                        {exhibition.about}
                                                    </p>
                                                )}

                                                {/* Artworks Count */}
                                                {exhibition.artworks.length > 0 && (
                                                    <p className="text-sm text-muted-foreground pt-2">
                                                        {exhibition.artworks.length} {exhibition.artworks.length === 1 ? 'artwork' : 'artworks'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        {index < filteredExhibitions.length - 1 && (
                                            <div className="mt-16 border-b border-border/20" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ExhibitionsPage;

