"use client";

import React, { useState, useEffect, useRef } from "react";
import { getArtworkBySlugController } from "@/lib/controller/artworkController";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Palette, Ruler, MapPin, Tag, Layers, Info } from "lucide-react";
import { Exhibition } from "@/lib/models/artowork";
import posthog from "posthog-js";

interface ArtworkDetailProps {
    slug: string;
}

// Do not display the title when it's a placeholder image name (e.g. IMG, IMG_8614)
function isPlaceholderTitle(title: string | null | undefined): boolean {
    const t = (title || "").trim().toUpperCase();
    return t === "IMG" || /^IMG_\d+/i.test(t);
}

export default function ArtworkDetail({ slug }: ArtworkDetailProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [artwork, setArtwork] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const viewTrackedRef = useRef(false);

    useEffect(() => {
        const fetchArtwork = async () => {
            try {
                setLoading(true);
                const data = await getArtworkBySlugController(slug);
                setArtwork(data);

                // PostHog: Track artwork view when data is loaded (only once per component mount)
                if (data && !viewTrackedRef.current) {
                    viewTrackedRef.current = true;
                    posthog.capture('artwork_viewed', {
                        artwork_id: data.id,
                        artwork_title: data.title || 'Untitled',
                        artwork_slug: slug,
                        artwork_category: data.category,
                        artwork_series: data.series,
                        artwork_medium: data.medium,
                        artwork_year: data.year,
                        artwork_availability: data.availability,
                    });
                }
            } catch (error) {
                console.error("Error fetching artwork:", error);
                // PostHog: Track error when fetching artwork fails
                posthog.captureException(error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtwork();
    }, [slug]);

    // PostHog: Track image selection
    const handleImageSelect = (index: number) => {
        setSelectedImageIndex(index);
        if (artwork) {
            posthog.capture('artwork_image_selected', {
                artwork_id: artwork.id,
                artwork_title: artwork.title || 'Untitled',
                artwork_slug: slug,
                image_index: index,
                total_images: artwork.media?.length || 1,
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading artwork...</p>
                </div>
            </div>
        );
    }

    if (!artwork) {
        return (
            <div className="min-h-full flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Artwork not found</p>
                    <Link
                        href="/artworks"
                        className="px-6 py-2 text-sm tracking-widest uppercase border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-300 inline-block"
                    >
                        Back to Artworks
                    </Link>
                </div>
            </div>
        );
    }

    const images = artwork.media || [];
    const mainImage = images[selectedImageIndex]?.url || artwork.thumbnail_url || images[selectedImageIndex]?.path || '/IMG_8614.JPG';

    // Format dimensions
    const formatDimensions = () => {
        if (artwork.width && artwork.height) {
            const width = artwork.width;
            const height = artwork.height;
            const depth = artwork.depth;
            const unit = artwork.unit || 'cm';

            if (depth) {
                return `${width} × ${height} × ${depth} ${unit}`;
            }
            return `${width} × ${height} ${unit}`;
        }
        return artwork.dimensions || null;
    };

    const dimensions = formatDimensions();

    // Format availability
    const formatAvailability = (availability: string) => {
        const availabilityMap: Record<string, string> = {
            'available': 'Available',
            'sold': 'Sold',
            'on_loan': 'On Loan',
            'private_collection': 'Private Collection',
            'nfs': 'Not For Sale'
        };
        return availabilityMap[availability] || availability;
    };

    return (
        <div className="min-h-full bg-background">
            <main className="pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Back Button */}
                    <div className="mb-8 animate-fade-in">
                        <Link
                            href="/artworks"
                            className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Artworks
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        {/* Image Gallery */}
                        <div className="animate-fade-in">
                            {/* Main Image */}
                            <div className="relative w-full aspect-[4/5] overflow-hidden bg-muted mb-4">
                                <Image
                                    src={mainImage}
                                    alt={isPlaceholderTitle(artwork.title) ? "Artwork" : (artwork.title || "Artwork")}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority
                                />
                            </div>

                            {/* Thumbnail Gallery */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {images.map((image: { url?: string; path?: string }, index: number) => {
                                        const imageUrl = image.url || image.path || '/IMG_8614.JPG';
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleImageSelect(index)}
                                                className={`relative aspect-square overflow-hidden border-2 transition-all ${selectedImageIndex === index
                                                        ? "border-foreground"
                                                        : "border-transparent hover:border-border"
                                                    }`}
                                            >
                                                <Image
                                                    src={imageUrl}
                                                    alt={isPlaceholderTitle(artwork.title) ? `Artwork - View ${index + 1}` : `${artwork.title} - View ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 1024px) 25vw, 12.5vw"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Artwork Information */}
                        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
                            {/* Title and Year */}
                            <div className="mb-8">
                                {!isPlaceholderTitle(artwork.title) && (
                                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4">
                                        {artwork.title || "Untitled"}
                                    </h1>
                                )}
                                {artwork.year && (
                                    <p className="text-sm tracking-widest uppercase text-muted-foreground">
                                        {artwork.year}
                                    </p>
                                )}
                            </div>

                            {/* Details Grid */}
                            <div className="space-y-6 mb-8">
                                {artwork.medium && (
                                    <div className="flex items-start gap-4">
                                        <Palette className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                                                Medium
                                            </p>
                                            <p className="text-foreground">{artwork.medium}</p>
                                        </div>
                                    </div>
                                )}

                                {dimensions && (
                                    <div className="flex items-start gap-4">
                                        <Ruler className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                                                Dimensions
                                            </p>
                                            <p className="text-foreground">{dimensions}</p>
                                        </div>
                                    </div>
                                )}

                                {artwork.category && (
                                    <div className="flex items-start gap-4">
                                        <Layers className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                                                Category
                                            </p>
                                            <p className="text-foreground capitalize">{artwork.category}</p>
                                        </div>
                                    </div>
                                )}

                                {artwork.series && (
                                    <div className="flex items-start gap-4">
                                        <Layers className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                                                Series
                                            </p>
                                            <p className="text-foreground">{artwork.series}</p>
                                        </div>
                                    </div>
                                )}

                                {artwork.materials && (
                                    <div className="flex items-start gap-4">
                                        <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                                                Materials
                                            </p>
                                            <p className="text-foreground">{artwork.materials}</p>
                                        </div>
                                    </div>
                                )}

                                {artwork.technique && (
                                    <div className="flex items-start gap-4">
                                        <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                                                Technique
                                            </p>
                                            <p className="text-foreground">{artwork.technique}</p>
                                        </div>
                                    </div>
                                )}

                                {artwork.location && (
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                                                Location
                                            </p>
                                            <p className="text-foreground">{artwork.location}</p>
                                        </div>
                                    </div>
                                )}

                                {artwork.availability && (
                                    <div className="flex items-start gap-4">
                                        <Tag className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1">
                                                Availability
                                            </p>
                                            <p className="text-foreground">{formatAvailability(artwork.availability)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {artwork.description && (
                                <div className="mb-8 pt-8 border-t border-border">
                                    <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                                        Description
                                    </p>
                                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                                        {artwork.description}
                                    </p>
                                </div>
                            )}

                            {/* Artist Notes */}
                            {artwork.artist_notes && (
                                <div className="mb-8 pt-8 border-t border-border">
                                    <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                                        Artist Notes
                                    </p>
                                    <p className="text-foreground leading-relaxed whitespace-pre-line">
                                        {artwork.artist_notes}
                                    </p>
                                </div>
                            )}

                            {/* Tags */}
                            {artwork.tags && artwork.tags.length > 0 && (
                                <div className="mb-8 pt-8 border-t border-border">
                                    <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                                        Tags
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {artwork.tags.map((tag: string, index: number) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 text-xs border border-border text-muted-foreground"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Exhibition History */}
                            {artwork.exhibition_history && artwork.exhibition_history.length > 0 && (
                                <div className="mb-8 pt-8 border-t border-border">
                                    <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
                                        Exhibition History
                                    </p>
                                    <div className="space-y-4">
                                        
                                        {artwork.exhibition_history.map((exhibition: Exhibition, index: number) => (
                                            <div key={index} className="space-y-1">
                                                <p className="text-foreground font-medium">{exhibition.name}</p>
                                                {exhibition.location && (
                                                    <p className="text-sm text-muted-foreground">{exhibition.location}</p>
                                                )}
                                                {exhibition.date && (
                                                    <p className="text-sm text-muted-foreground">{exhibition.date}</p>
                                                )}
                                                {exhibition.curator && (
                                                    <p className="text-xs text-muted-foreground">Curated by {exhibition.curator}</p>
                                                )}
                                                {exhibition.notes && (
                                                    <p className="text-sm text-muted-foreground mt-2">{exhibition.notes}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

