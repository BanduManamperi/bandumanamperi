import { downloadMedia, listArtworksService, getArtworkBySlugService, ArtworkFilters } from "@/lib/services/artworkservice";


export async function listArtworksController(filters?: ArtworkFilters) {
    try {
        const result = await listArtworksService(filters);
        // console.log(result, "raw result from listArtworksService");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processedResults = await Promise.all(result.map(async (artwork: any) => {
            // Process media array
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let updatedMedia: any[] = [];
            if (artwork.media && Array.isArray(artwork.media) && artwork.media.length > 0) {
                updatedMedia = await Promise.all(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    artwork.media.map(async (mediaPath: any) => {
                        if (mediaPath) {
                            const mediaUrl = await downloadMedia(mediaPath);
                            return { path: mediaPath, url: mediaUrl?.url.href };
                        }
                        return { path: mediaPath };
                    })
                );
            }

            // Determine thumbnail: use thumbnail_path if exists, otherwise use first media item
            let thumbnailUrl: string | null = null;
            if (artwork.thumbnail_path) {
                const thumbnailResult = await downloadMedia(artwork.thumbnail_path);
                thumbnailUrl = thumbnailResult?.url.href || null;
            } else if (updatedMedia.length > 0 && updatedMedia[0].url) {
                thumbnailUrl = updatedMedia[0].url;
            }

            return {
                ...artwork,
                media: updatedMedia,
                thumbnail_url: thumbnailUrl
            };
        }));

        // console.log(processedResults, "processed result in listArtworksController");
        return processedResults;
    } catch (error) {
        console.error("Error in listArtworksController:", error);
        throw error;
    }
}

export async function getArtworkBySlugController(slugOrId: string) {
    try {
        const artwork = await getArtworkBySlugService(slugOrId);

        if (!artwork) {
            return null;
        }

        // Process media array
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let updatedMedia: any[] = [];
        if (artwork.media && Array.isArray(artwork.media) && artwork.media.length > 0) {
            updatedMedia = await Promise.all(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                artwork.media.map(async (mediaPath: any) => {
                    if (mediaPath) {
                        const mediaUrl = await downloadMedia(mediaPath);
                        return { path: mediaPath, url: mediaUrl?.url.href };
                    }
                    return { path: mediaPath };
                })
            );
        }

        // Determine thumbnail: use thumbnail_path if exists, otherwise use first media item
        let thumbnailUrl: string | null = null;
        if (artwork.thumbnail_path) {
            const thumbnailResult = await downloadMedia(artwork.thumbnail_path);
            thumbnailUrl = thumbnailResult?.url.href || null;
        } else if (updatedMedia.length > 0 && updatedMedia[0].url) {
            thumbnailUrl = updatedMedia[0].url;
        }

        return {
            ...artwork,
            media: updatedMedia,
            thumbnail_url: thumbnailUrl
        };
    } catch (error) {
        console.error("Error in getArtworkBySlugController:", error);
        return null;
    }
}
