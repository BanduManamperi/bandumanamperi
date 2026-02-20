"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Exhibition } from "@/lib/actions/exhibitions";
import { generateSlugFromTitle } from "@/lib/utils";
import { getExhibitionImageUrl, getArtworkImageUrl } from "@/lib/utils/supabase-storage";
import { PLACEHOLDERS } from "@/lib/utils/image-placeholders";

const ExhibitionDetailPage = () => {
    const params = useParams();
    const slug = params.slug as string;
    const [exhibition, setExhibition] = useState<Exhibition | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadExhibition = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/exhibitions');
                if (response.ok) {
                    const exhibitions: Exhibition[] = await response.json();

                    // Find exhibition by matching slug
                    const found = exhibitions.find(ex => {
                        const year = new Date(ex.dates).getFullYear().toString();
                        const exSlug = ex.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "") + `-${year}`;
                        return exSlug === slug;
                    });

                    setExhibition(found || null);
                }
            } catch (error) {
                console.error("Error loading exhibition:", error);
            }
            setLoading(false);
        };

        if (slug) {
            loadExhibition();
        }
    }, [slug]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <p className="text-muted-foreground">Loading exhibition...</p>
            </div>
        );
    }

    if (!exhibition) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-24">
                <p className="text-muted-foreground mb-4">Exhibition not found.</p>
                <Link
                    href="/exhibitions"
                    className="text-sm tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors"
                >
                    Back to Exhibitions
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-24 md:pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {/* Back Navigation */}
                    <Link
                        href="/exhibitions"
                        className="inline-flex items-center gap-2 text-sm tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors mb-12"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Exhibitions
                    </Link>

                    {/* Exhibition Type Badge */}
                    <div className="mb-6">
                        <span className="inline-block text-xs tracking-widest uppercase text-muted-foreground border border-border/40 px-3 py-1">
                            {getTypeLabel(exhibition.type)}
                        </span>
                    </div>

                    {/* Exhibition Title & Meta */}
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
                            {exhibition.name}
                        </h1>
                        <div className="space-y-2 text-lg text-muted-foreground font-light">
                            <p>{formatDate(exhibition.dates)}</p>
                            <p>{exhibition.venue}</p>
                            {exhibition.curator && (
                                <p className="text-base">Curated by {exhibition.curator}</p>
                            )}
                            {exhibition.otherArtists && (
                                <p className="text-base">
                                    Featured Artists: {exhibition.otherArtists}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Hero Image */}
                    {exhibition.coverImage && getExhibitionImageUrl(exhibition.coverImage) && (
                        <div className="relative w-full aspect-[16/9] mb-16 overflow-hidden bg-card">
                            <Image
                                src={getExhibitionImageUrl(exhibition.coverImage)!}
                                alt={exhibition.name}
                                fill
                                className="object-cover"
                                sizes="100vw"
                                priority
                            />
                        </div>
                    )}

                    {/* Exhibition Description */}
                    {exhibition.about && (
                        <div className="max-w-3xl mb-16">
                            <h2 className="text-2xl font-light mb-6">About the Exhibition</h2>
                            <div className="prose prose-lg text-muted-foreground leading-relaxed">
                                <p>{exhibition.about}</p>
                            </div>
                        </div>
                    )}

                    {/* Exhibition Images */}
                    {exhibition.exhibitionImages && exhibition.exhibitionImages.length > 0 && (
                        <div className="mb-16">
                            <h2 className="text-2xl font-light mb-8">Exhibition Views</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {exhibition.exhibitionImages.map((imagePath, index) => {
                                    const imageUrl = getExhibitionImageUrl(imagePath);
                                    if (!imageUrl) return null;

                                    return (
                                        <div
                                            key={index}
                                            className="relative w-full aspect-[4/3] overflow-hidden bg-card"
                                        >
                                            <Image
                                                src={imageUrl}
                                                alt={`Exhibition view ${index + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Featured Works */}
                    {exhibition.artworks && exhibition.artworks.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-light mb-8">
                                Featured Works
                                <span className="text-muted-foreground text-lg ml-3">
                                    ({exhibition.artworks.length})
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {exhibition.artworks.map((artwork) => {
                                    const thumbnailUrl =
                                        getArtworkImageUrl(artwork.thumbnail_path ?? null) ||
                                        getArtworkImageUrl(artwork.imageUrl) ||
                                        PLACEHOLDERS.artwork.url;

                                    const artworkSlug = artwork.slug ||
                                        (artwork.title ? generateSlugFromTitle(artwork.title) : artwork.id);

                                    return (
                                        <Link
                                            key={artwork.id}
                                            href={`/artworks/${artworkSlug}`}
                                            className="group"
                                        >
                                            <div className="overflow-hidden bg-card">
                                                <div className="relative w-full aspect-[4/5] overflow-hidden bg-muted">
                                                    <Image
                                                        src={thumbnailUrl}
                                                        alt={artwork.title || "Artwork"}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <h3 className="font-light text-lg text-foreground group-hover:text-muted-foreground transition-colors">
                                                    {artwork.title || "Untitled"}
                                                </h3>
                                                {artwork.year && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {artwork.year}
                                                    </p>
                                                )}
                                                {artwork.medium && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {artwork.medium}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ExhibitionDetailPage;
