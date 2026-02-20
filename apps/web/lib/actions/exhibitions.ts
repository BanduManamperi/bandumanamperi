"use server"

import { createClient } from "@/lib/supabase/server"
import type { Artwork } from "@/lib/types/artwork"

export interface Exhibition {
    // Basic Information
    name: string                    // Exhibition title
    venue: string                   // Location/gallery name
    about: string                   // Exhibition description
    curator: string                 // Curator name
    dates: string                   // Date range (e.g., "Jan 15 - Feb 28, 2024")
    
    // Images
    coverImage: string | null       // Cover/banner image path
    exhibitionImages: string[]      // Array of exhibition space photo paths
    
    // Type & Participants
    type: "solo" | "group" | "online"  // Exhibition type
    otherArtists: string | null     // Comma-separated list (only for group exhibitions)
    
    // Related Content
    artworks: Artwork[]             // Array of artworks in this exhibition
}

/**
 * Get all exhibitions from artworks' exhibition_history
 */
export async function getExhibitions(): Promise<Exhibition[]> {
    const supabase = await createClient()

    // Get all artworks with exhibition history (no auth required for public viewing)
    const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .not("exhibition_history", "is", null)
        .eq("status", "published") // Only get published artworks
        .order("updated_at", { ascending: false })

    if (error) {
        console.error("Failed to fetch exhibitions:", error)
        return []
    }

    // Group artworks by exhibition
    const exhibitionsMap = new Map<string, Exhibition>()

    data?.forEach((artworkDB) => {
        const artwork = artworkDB as Artwork
        const exhibitions = (artworkDB.exhibition_history as any[]) || []

        exhibitions.forEach((exhibition) => {
            const key = `${exhibition.name}|${exhibition.venue}|${exhibition.dates}`

            if (exhibitionsMap.has(key)) {
                exhibitionsMap.get(key)!.artworks.push(artwork)
            } else {
                exhibitionsMap.set(key, {
                    name: exhibition.name || "",
                    venue: exhibition.venue || "",
                    about: exhibition.about || "",
                    curator: exhibition.curator || "",
                    dates: exhibition.dates || "",
                    coverImage: exhibition.coverImage || null,
                    exhibitionImages: exhibition.exhibitionImages || [],
                    type: (exhibition.type as "solo" | "group" | "online") || "solo",
                    otherArtists: exhibition.otherArtists || null,
                    artworks: [artwork],
                })
            }
        })
    })

    // Convert map to array and sort by dates (most recent first)
    return Array.from(exhibitionsMap.values()).sort((a, b) => {
        try {
            return new Date(b.dates).getTime() - new Date(a.dates).getTime()
        } catch {
            return 0
        }
    })
}


