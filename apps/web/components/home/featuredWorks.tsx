'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Artwork } from '@/lib/types/artwork'
import { listArtworksController } from '@/lib/controller/artworkController'

interface FeaturedWorksProps {
    artworks?: Artwork[]
}

// Do not display the title when it's a placeholder image name (e.g. IMG, IMG_8614)
function isPlaceholderTitle(title: string | null | undefined): boolean {
    const t = (title || "").trim().toUpperCase();
    return t === "IMG" || /^IMG_\d+/i.test(t);
}

const FeaturedWorks: React.FC<FeaturedWorksProps> = ({ artworks: propArtworks }) => {
    const [selectedWork, setSelectedWork] = useState<Artwork | null>(null)
    const [artworks, setArtworks] = useState<Artwork[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAllArtworks = async () => {
        try {
            setLoading(true);
            const allArtworks = await listArtworksController();

            // Transform the controller data to match the component's Artwork type
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const transformedArtworks: Artwork[] = (allArtworks as any[]).map((artwork: any) => {
                // Get the first media URL as imageUrl
                // Handle both the processed media format from controller and raw format
                const mediaArray = artwork.media || [];
                const firstMedia = Array.isArray(mediaArray) && mediaArray.length > 0 ? mediaArray[0] : null;
                let imageUrl = firstMedia?.url || firstMedia?.path || '/IMG_8614.JPG';

                if (firstMedia) {
                    if (typeof firstMedia === 'object' && 'url' in firstMedia && firstMedia.url) {
                        imageUrl = firstMedia.url;
                    } else if (typeof firstMedia === 'object' && 'path' in firstMedia) {
                        const path = firstMedia.path;
                        imageUrl = typeof path === 'string' ? path : '/IMG_8614.JPG';
                    }
                }

                return {
                    id: artwork.id || '',
                    title: artwork.title || 'Untitled',
                    year: artwork.year || undefined,
                    medium: artwork.medium || undefined,
                    size: artwork.dimensions || undefined,
                    category: (artwork.category as 'painting' | 'sculpture' | 'performance' | 'other') || 'other',
                    description: artwork.description || undefined,
                    imageUrl: imageUrl,
                    imageAlt: `${artwork.title || 'Artwork'} - ${artwork.medium || ''}`,
                    slug: artwork.id || undefined,
                    featured: artwork.featured || false,
                };
            });

            // Filter for featured artworks, or show all if none are featured
            const featuredArtworks = transformedArtworks.filter(art => art.featured);
            setArtworks(featuredArtworks.length > 0 ? featuredArtworks : transformedArtworks);
        } catch (error) {
            console.error('Error fetching artworks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // If artworks are passed as props, use them; otherwise fetch from controller
        fetchAllArtworks();
    }, [propArtworks]);

    if (loading) {
        return (
            <section id="work" className="h-full flex flex-col justify-center py-10 bg-secondary/30">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center">
                        <p className="text-muted-foreground">Loading artworks...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!artworks || artworks.length === 0) {
        return null
    }

    return (
        <>
            <section id="work" className="h-full flex flex-col justify-center py-10 bg-secondary/30 overflow-y-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Featured Work</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            A selection of recent works exploring identity, body, and social constructs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {artworks.map((work, index) => (
                            <div
                                key={work.id || index}
                                className="group cursor-pointer"
                                onClick={() => setSelectedWork(work)}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="overflow-hidden bg-card rounded-lg">
                                    <div className="relative w-full aspect-4/5">
                                        <Image
                                            src={work.imageUrl}
                                            alt={work.imageAlt || work.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            unoptimized={work.imageUrl?.startsWith('http')}
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-between items-start">
                                    <div>
                                        {!isPlaceholderTitle(work.title) && (
                                            <h3 className="font-heading text-lg font-semibold text-foreground">{work.title}</h3>
                                        )}
                                        {work.medium && (
                                            <p className="text-sm text-muted-foreground">{work.medium}</p>
                                        )}
                                    </div>
                                    {work.year && (
                                        <p className="text-sm text-muted-foreground">{work.year}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            href="/artworks"
                            className="inline-flex items-center text-lg font-medium text-primary hover:underline"
                        >
                            View All Artworks
                            <svg
                                className="ml-2 w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedWork && (
                <div
                    className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-6 animate-in fade-in duration-200"
                    onClick={() => setSelectedWork(null)}
                >
                    <div
                        className="max-w-5xl w-full max-h-[90vh] flex flex-col lg:flex-row gap-8 items-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative w-full lg:w-auto max-h-[70vh] lg:max-h-[80vh] shrink-0">
                            <Image
                                src={selectedWork.imageUrl}
                                alt={selectedWork.imageAlt || selectedWork.title}
                                width={800}
                                height={1000}
                                className="w-auto h-full max-h-[70vh] lg:max-h-[80vh] object-contain"
                                sizes="(max-width: 1024px) 90vw, 50vw"
                            />
                        </div>
                        <div className="text-primary-foreground text-center lg:text-left shrink-0">
                            {!isPlaceholderTitle(selectedWork.title) && (
                                <h3 className="font-heading text-3xl font-semibold mb-2">{selectedWork.title}</h3>
                            )}
                            {selectedWork.year && (
                                <p className="text-primary-foreground/70 mb-1">{selectedWork.year}</p>
                            )}
                            {selectedWork.medium && (
                                <p className="text-primary-foreground/70 mb-1">{selectedWork.medium}</p>
                            )}
                            {selectedWork.size && (
                                <p className="text-primary-foreground/70 mb-1">{selectedWork.size}</p>
                            )}
                            {selectedWork.description && (
                                <p className="text-primary-foreground/70 mt-4 max-w-md">{selectedWork.description}</p>
                            )}
                            <button
                                className="mt-6 text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                                onClick={() => setSelectedWork(null)}
                            >
                                Close ×
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default FeaturedWorks
