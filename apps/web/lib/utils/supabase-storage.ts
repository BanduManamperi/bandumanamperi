import { supabase } from "@/lib/supabase/client"

/**
 * Get public URL for an image from Supabase storage
 */
export function getStorageUrl(bucket: string, path: string | null): string | null {
    if (!path) return null
    
    // Handle full URLs
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path
    }
    
    // Get public URL from specified bucket
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)
    
    return data.publicUrl
}

/**
 * Get exhibition image URL
 */
export function getExhibitionImageUrl(path: string | null): string | null {
    return getStorageUrl("exhibitions", path)
}

/**
 * Get artwork image URL
 */
export function getArtworkImageUrl(path: string | null): string | null {
    return getStorageUrl("artworks", path)
}

/**
 * Generate slug from exhibition name and year
 */
export function generateExhibitionSlug(name: string, year?: string): string {
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    
    if (year) {
        return `${slug}-${year}`
    }
    
    return slug
}

