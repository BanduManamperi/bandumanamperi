"use client";

import React, { useState, useEffect, useRef } from "react";
import { listArtworksController } from "@/lib/controller/artworkController";
import { getFilterOptions } from "@/lib/services/artworkservice";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Filter } from "lucide-react";
import { generateSlugFromTitle } from "@/lib/utils";
import { PLACEHOLDERS } from "@/lib/utils/image-placeholders";
import posthog from "posthog-js";

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
        categories: [],
        series: [],
        statuses: [],
        availabilities: [],
        tags: []
    });

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedSeries, setSelectedSeries] = useState<string>("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [selectedAvailability, setSelectedAvailability] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showFilters, setShowFilters] = useState(false);

    // Calculate series with artwork counts
    const seriesWithCounts = React.useMemo(() => {
        const counts = new Map<string, { count: number; artworks: typeof artworks }>();
        artworks.forEach(artwork => {
            if (artwork.series) {
                const existing = counts.get(artwork.series) || { count: 0, artworks: [] };
                counts.set(artwork.series, {
                    count: existing.count + 1,
                    artworks: [...existing.artworks, artwork]
                });
            }
        });
        return Array.from(counts.entries()).map(([name, data]) => ({
            name,
            count: data.count,
            featuredArtwork: data.artworks[0]
        }));
    }, [artworks]);

    // Do not display the title when it's a placeholder image name (e.g. IMG, IMG_8614)
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
                    getFilterOptions()
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

    // Apply filters
    useEffect(() => {
        let filtered = [...artworks];

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(a => a.category === selectedCategory);
        }

        // Series filter
        if (selectedSeries) {
            filtered = filtered.filter(a => a.series === selectedSeries);
        }

        // Status filter
        if (selectedStatus) {
            filtered = filtered.filter(a => a.status === selectedStatus);
        }

        // Availability filter
        if (selectedAvailability) {
            filtered = filtered.filter(a => a.availability === selectedAvailability);
        }

        // Tags filter
        if (selectedTags.length > 0) {
            filtered = filtered.filter(a => {
                const artworkTags = a.tags || [];
                return selectedTags.some(tag => artworkTags.includes(tag));
            });
        }

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(a => {
                const title = (a.title || "").toLowerCase();
                const description = (a.description || "").toLowerCase();
                const medium = (a.medium || "").toLowerCase();
                return title.includes(query) || description.includes(query) || medium.includes(query);
            });
        }

        setFilteredArtworks(filtered);
    }, [artworks, selectedCategory, selectedSeries, selectedStatus, selectedAvailability, selectedTags, searchQuery]);

    const handleTagToggle = (tag: string) => {
        const newTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
        setSelectedTags(newTags);

        // PostHog: Track filter applied
        posthog.capture('artworks_filtered', {
            filter_type: 'tags',
            filter_value: newTags,
            results_count: filteredArtworks.length,
        });
    };

    const clearFilters = () => {
        setSelectedCategory("");
        setSelectedSeries("");
        setSelectedStatus("");
        setSelectedAvailability("");
        setSelectedTags([]);
        setSearchQuery("");
    };

    const hasActiveFilters = selectedCategory || selectedSeries || selectedStatus || selectedAvailability || selectedTags.length > 0 || searchQuery;

    // PostHog: Debounced search tracking
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Track search after user stops typing (500ms debounce)
        if (query.trim()) {
            searchTimeoutRef.current = setTimeout(() => {
                posthog.capture('artworks_searched', {
                    search_query: query,
                    results_count: filteredArtworks.length,
                });
            }, 500);
        }
    };

    // PostHog: Track category filter
    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        posthog.capture('artworks_filtered', {
            filter_type: 'category',
            filter_value: category || 'all',
            results_count: filteredArtworks.length,
        });
    };

    // PostHog: Track collection/series selection
    const handleCollectionSelect = (collectionName: string) => {
        setSelectedSeries(collectionName);
        setShowFilters(false);
        posthog.capture('collection_selected', {
            collection_name: collectionName,
            collection_artwork_count: seriesWithCounts.find(s => s.name === collectionName)?.count || 0,
        });
    };

    // PostHog: Track series filter change
    const handleSeriesFilter = (series: string) => {
        setSelectedSeries(series);
        posthog.capture('artworks_filtered', {
            filter_type: 'series',
            filter_value: series || 'all',
            results_count: filteredArtworks.length,
        });
    };

    // PostHog: Track status filter change
    const handleStatusFilter = (status: string) => {
        setSelectedStatus(status);
        posthog.capture('artworks_filtered', {
            filter_type: 'status',
            filter_value: status || 'all',
            results_count: filteredArtworks.length,
        });
    };

    // PostHog: Track availability filter change
    const handleAvailabilityFilter = (availability: string) => {
        setSelectedAvailability(availability);
        posthog.capture('artworks_filtered', {
            filter_type: 'availability',
            filter_value: availability || 'all',
            results_count: filteredArtworks.length,
        });
    };

    if (loading) {
        return (
            <div className="min-h-full flex items-center justify-center pt-12">
                <div className="text-center">
                    <p className="text-muted-foreground">Loading artworks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-background">
            <main className="pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16 animate-fade-in">
                        <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
                            Portfolio
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">
                            Artworks
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Explore the collection of {artworks.length} artworks
                        </p>
                    </div>

                    {/* Collections Showcase */}
                    {seriesWithCounts.length > 0 && (
                        <div className="mb-20">
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-light text-center mb-2">Collections</h2>
                                <p className="text-sm text-center text-muted-foreground">Browse artworks by series</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {seriesWithCounts.map((collection, index) => (
                                    <button
                                        key={collection.name}
                                        onClick={() => handleCollectionSelect(collection.name)}
                                        className={`group relative overflow-hidden border transition-all duration-300 animate-fade-in ${
                                            selectedSeries === collection.name
                                                ? 'border-foreground'
                                                : 'border-border hover:border-foreground/60'
                                        }`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Background Image */}
                                        <div className="relative aspect-4/3 overflow-hidden">
                                            {collection.featuredArtwork && (
                                                <Image
                                                    src={collection.featuredArtwork.thumbnail_url || collection.featuredArtwork.media?.[0]?.url || collection.featuredArtwork.media?.[0]?.path || PLACEHOLDERS.thumbnail.url}
                                                    alt={collection.name}
                                                    fill
                                                    className={`object-cover transition-all duration-700 ${
                                                        selectedSeries === collection.name
                                                            ? 'scale-105 grayscale-0'
                                                            : 'scale-100 grayscale group-hover:grayscale-0 group-hover:scale-105'
                                                    }`}
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                />
                                            )}
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                            <h3 className="text-xl font-light mb-2 group-hover:translate-y-[-4px] transition-transform duration-300">
                                                {collection.name}
                                            </h3>
                                            <p className="text-sm text-white/70">
                                                {collection.count} {collection.count === 1 ? 'artwork' : 'artworks'}
                                            </p>
                                        </div>

                                        {/* Selected Indicator */}
                                        {selectedSeries === collection.name && (
                                            <div className="absolute top-4 right-4 w-3 h-3 bg-foreground rounded-full" />
                                        )}
                                    </button>
                                ))}
                                
                                {/* View All Button */}
                                {selectedSeries && (
                                    <button
                                        onClick={() => setSelectedSeries("")}
                                        className="group relative overflow-hidden border border-border hover:border-foreground transition-all duration-300 flex items-center justify-center"
                                    >
                                        <div className="text-center p-6">
                                            <p className="text-lg font-light mb-2">View All</p>
                                            <p className="text-sm text-muted-foreground">
                                                {artworks.length} artworks
                                            </p>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Search and Filter Bar */}
                    <div className="mb-12 space-y-6">
                        {/* Search Bar */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search artworks by title, description, or medium..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="w-full pl-12 pr-12 py-4 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Filter Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 text-sm tracking-widest uppercase border transition-all duration-300 ${showFilters || hasActiveFilters
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                                    }`}
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                            </button>

                            {/* Category Filters */}
                            {filterOptions.categories.length > 0 && (
                                <>
                                    <button
                                        onClick={() => handleCategoryFilter("")}
                                        className={`px-6 py-2 text-sm tracking-widest uppercase transition-all duration-300 border ${!selectedCategory
                                            ? "bg-foreground text-background border-foreground"
                                            : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                                            }`}
                                    >
                                        All
                                    </button>
                                    {filterOptions.categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => handleCategoryFilter(category)}
                                            className={`px-6 py-2 text-sm tracking-widest uppercase transition-all duration-300 border ${selectedCategory === category
                                                ? "bg-foreground text-background border-foreground"
                                                : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </>
                            )}

                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Clear all
                                </button>
                            )}
                        </div>

                        {/* Advanced Filters (Collapsible) */}
                        {showFilters && (
                            <div className="max-w-4xl mx-auto pt-6 border-t border-border animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Series Filter */}
                                    {filterOptions.series.length > 0 && (
                                        <div>
                                            <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                                                Series
                                            </label>
                                            <select
                                                value={selectedSeries}
                                                onChange={(e) => handleSeriesFilter(e.target.value)}
                                                className="w-full px-4 py-2 border border-border bg-background text-foreground focus:outline-none focus:border-foreground transition-colors"
                                            >
                                                <option value="">All Series</option>
                                                {filterOptions.series.map(series => (
                                                    <option key={series} value={series}>{series}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Status Filter */}
                                    {filterOptions.statuses.length > 0 && (
                                        <div>
                                            <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                                                Status
                                            </label>
                                            <select
                                                value={selectedStatus}
                                                onChange={(e) => handleStatusFilter(e.target.value)}
                                                className="w-full px-4 py-2 border border-border bg-background text-foreground focus:outline-none focus:border-foreground transition-colors"
                                            >
                                                <option value="">All Statuses</option>
                                                {filterOptions.statuses.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Availability Filter */}
                                    {filterOptions.availabilities.length > 0 && (
                                        <div>
                                            <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                                                Availability
                                            </label>
                                            <select
                                                value={selectedAvailability}
                                                onChange={(e) => handleAvailabilityFilter(e.target.value)}
                                                className="w-full px-4 py-2 border border-border bg-background text-foreground focus:outline-none focus:border-foreground transition-colors"
                                            >
                                                <option value="">All</option>
                                                {filterOptions.availabilities.map(avail => (
                                                    <option key={avail} value={avail}>{avail}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* Tags Filter */}
                                    {filterOptions.tags.length > 0 && (
                                        <div>
                                            <label className="text-xs tracking-widest uppercase text-muted-foreground mb-2 block">
                                                Tags
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {filterOptions.tags.slice(0, 3).map(tag => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => handleTagToggle(tag)}
                                                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedTags.includes(tag)
                                                            ? "bg-foreground text-background border-foreground"
                                                            : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                                                            }`}
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Results Count */}
                        <div className="text-center text-sm text-muted-foreground">
                            Showing {filteredArtworks.length} of {artworks.length} artworks
                        </div>
                    </div>

                    {/* Artworks Grid */}
                    {filteredArtworks.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-muted-foreground mb-4">No artworks found matching your filters.</p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 text-sm tracking-widest uppercase border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-all duration-300"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                            {filteredArtworks.map((artwork, index) => {
                                const thumbnailUrl = artwork.thumbnail_url || artwork.media?.[0]?.url || artwork.media?.[0]?.path || PLACEHOLDERS.artwork.url;
                                // Use slug if available, otherwise generate from title, fallback to id
                                const slug = artwork.slug || (artwork.title ? generateSlugFromTitle(artwork.title) : artwork.id);

                                return (
                                    <Link
                                        key={artwork.id}
                                        href={`/artworks/${slug}`}
                                        className="group cursor-pointer animate-fade-in"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="overflow-hidden bg-card">
                                            <div className="relative w-full aspect-[4/5] overflow-hidden bg-muted">
                                                {thumbnailUrl && (
                                                    <Image
                                                        src={thumbnailUrl}
                                                        alt={isPlaceholderTitle(artwork.title) ? "Artwork" : (artwork.title || "Artwork")}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex justify-between items-start">
                                            <div>
                                                {!isPlaceholderTitle(artwork.title) && (
                                                    <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors">
                                                        {artwork.title || "Untitled"}
                                                    </h3>
                                                )}
                                                {artwork.medium && (
                                                    <p className="text-sm text-muted-foreground mt-1">{artwork.medium}</p>
                                                )}
                                                {artwork.dimensions && (
                                                    <p className="text-xs text-muted-foreground mt-1">{artwork.dimensions}</p>
                                                )}
                                            </div>
                                            {artwork.year && (
                                                <p className="text-sm tracking-widest uppercase text-muted-foreground">{artwork.year}</p>
                                            )}
                                        </div>
                                        {artwork.series && (
                                            <p className="text-xs text-primary mt-2 uppercase tracking-wider">{artwork.series}</p>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
