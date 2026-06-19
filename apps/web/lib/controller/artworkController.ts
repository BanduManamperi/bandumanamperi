import { supabase } from "@/lib/supabase/client";
import { listArtworksService, listFeaturedArtworksService, getArtworkBySlugService, ArtworkFilters } from "@/lib/services/artworkservice";

function getPublicUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const { data } = supabase.storage.from("artworks").getPublicUrl(path);
    return data.publicUrl || null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function processArtwork(artwork: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedMedia = (Array.isArray(artwork.media) ? artwork.media : []).map((mediaPath: any) => ({
        path: mediaPath,
        url: getPublicUrl(mediaPath),
    }));

    const thumbnailUrl =
        getPublicUrl(artwork.thumbnail_path) ||
        updatedMedia[0]?.url ||
        null;

    return { ...artwork, media: updatedMedia, thumbnail_url: thumbnailUrl };
}

export async function listArtworksController(filters?: ArtworkFilters) {
    try {
        const result = await listArtworksService(filters);
        return result.map(processArtwork);
    } catch (error) {
        console.error("Error in listArtworksController:", error);
        return [];
    }
}

export async function getFeaturedArtworksController() {
    try {
        const result = await listFeaturedArtworksService();
        return result.map(processArtwork);
    } catch (error) {
        console.error("Error in getFeaturedArtworksController:", error);
        return [];
    }
}

export async function getArtworkBySlugController(slugOrId: string) {
    try {
        const artwork = await getArtworkBySlugService(slugOrId);
        if (!artwork) return null;
        return processArtwork(artwork);
    } catch (error) {
        console.error("Error in getArtworkBySlugController:", error);
        return null;
    }
}
