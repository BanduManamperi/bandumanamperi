import { supabase } from "../supabase/client";
import { Artwork, Media } from "../models/artowork";
import { generateSlugFromTitle } from "../utils";

export async function uploadMedia(file: File): Promise<string | undefined> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `media/artworks/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('artworks')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            throw uploadError;
        }

        return filePath;
    } catch (error) {
        console.error("Error uploading media:", error);
        return undefined;
    }
}

export async function downloadMedia(path: string) {
    try {
        const { data, error } = await supabase.storage
            .from('artworks')
            .createSignedUrl(path, 3600);

        if (error) {
            console.error("Error getting signed URL:", error);
            return null;
        }

        return { url: { href: data.signedUrl } };
    } catch (error) {
        console.error("Error downloading media:", error);
        return null;
    }
}

export interface ArtworkFilters {
    category?: string;
    series?: string;
    status?: string;
    availability?: string;
    tags?: string[];
    search?: string;
}

export async function listArtworksService(filters?: ArtworkFilters): Promise<Artwork[]> {
    try {
        let query = supabase
            .from('artworks')
            .select('*');

        // Apply filters
        if (filters?.category) {
            query = query.eq('category', filters.category);
        }
        if (filters?.series) {
            query = query.eq('series', filters.series);
        }
        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.availability) {
            query = query.eq('availability', filters.availability);
        }
        if (filters?.tags && filters.tags.length > 0) {
            query = query.contains('tags', filters.tags);
        }
        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        // Order by sort_order first, then created_at
        query = query.order('sort_order', { ascending: true, nullsFirst: false })
            .order('created_at', { ascending: false });

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching artworks:", error);
            return [];
        }

        console.log(data, "this is at listArtworks function in artwork service");
        return data || [];
    } catch (error) {
        console.error("Error in listArtworksService:", error);
        return [];
    }
}

// Get single artwork by slug or id
export async function getArtworkBySlugService(slugOrId: string): Promise<Artwork | null> {
    try {
        // Check if it looks like a UUID (contains hyphens and is 36 chars) or is a regular slug
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);
        
        let query = supabase
            .from('artworks')
            .select('*')
            .eq('status', 'published');

        if (isUUID) {
            // If it's a UUID, search by ID
            query = query.eq('id', slugOrId);
        } else {
            // Try to find by slug first, then by id
            query = query.or(`slug.eq.${slugOrId},id.eq.${slugOrId}`);
        }

        let { data, error } = await query.single();

        // If not found and it's not a UUID, try to find by title-based slug
        if (error && !isUUID) {
            // Fetch all published artworks and find one where the generated slug matches
            const { data: allArtworks, error: fetchError } = await supabase
                .from('artworks')
                .select('*')
                .eq('status', 'published');

            if (!fetchError && allArtworks) {
                const matchingArtwork = allArtworks.find((artwork: Artwork) => {
                    if (artwork.slug === slugOrId) return true;
                    if (artwork.title) {
                        const titleSlug = generateSlugFromTitle(artwork.title);
                        return titleSlug === slugOrId;
                    }
                    return false;
                });

                if (matchingArtwork) {
                    data = matchingArtwork;
                    error = null;
                }
            }
        }

        if (error || !data) {
            console.error("Error fetching artwork:", error);
            return null;
        }

        return data || null;
    } catch (error) {
        console.error("Error in getArtworkBySlugService:", error);
        return null;
    }
}

// Get unique values for filters
export async function getFilterOptions() {
    try {
        const { data, error } = await supabase
            .from('artworks')
            .select('category, series, status, availability, tags');

        if (error) {
            console.error("Error fetching filter options:", error);
            return {
                categories: [],
                series: [],
                statuses: [],
                availabilities: [],
                tags: []
            };
        }

        const categories = [...new Set(data?.map(a => a.category).filter(Boolean) || [])];
        const series = [...new Set(data?.map(a => a.series).filter(Boolean) || [])];
        const statuses = [...new Set(data?.map(a => a.status).filter(Boolean) || [])];
        const availabilities = [...new Set(data?.map(a => a.availability).filter(Boolean) || [])];
        const allTags = data?.flatMap(a => a.tags || []) || [];
        const tags = [...new Set(allTags)];

        return {
            categories: categories.sort(),
            series: series.sort(),
            statuses: statuses.sort(),
            availabilities: availabilities.sort(),
            tags: tags.sort()
        };
    } catch (error) {
        console.error("Error in getFilterOptions:", error);
        return {
            categories: [],
            series: [],
            statuses: [],
            availabilities: [],
            tags: []
        };
    }
}