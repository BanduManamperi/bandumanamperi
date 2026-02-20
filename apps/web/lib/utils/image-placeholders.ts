/**
 * Image placeholder utilities for development and production
 */

/**
 * Generate a placeholder image URL using a color and text
 * Uses a data URI SVG for instant loading without external requests
 */
export function generatePlaceholder(
    width: number = 800,
    height: number = 600,
    text: string = "No Image",
    backgroundColor: string = "#1a1a1a",
    textColor: string = "#666666"
): string {
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${backgroundColor}"/>
            <text 
                x="50%" 
                y="50%" 
                dominant-baseline="middle" 
                text-anchor="middle" 
                font-family="system-ui, -apple-system, sans-serif" 
                font-size="24" 
                fill="${textColor}"
            >${text}</text>
        </svg>
    `
    
    const base64 = Buffer.from(svg.trim()).toString('base64')
    return `data:image/svg+xml;base64,${base64}`
}

/**
 * Placeholder configurations for different content types
 */
export const PLACEHOLDERS = {
    artwork: {
        url: generatePlaceholder(800, 1000, "Artwork", "#1a1a1a", "#666"),
        blurDataURL: generatePlaceholder(10, 12, "", "#1a1a1a", "#666"),
    },
    exhibition: {
        url: generatePlaceholder(1200, 675, "Exhibition", "#1a1a1a", "#666"),
        blurDataURL: generatePlaceholder(16, 9, "", "#1a1a1a", "#666"),
    },
    thumbnail: {
        url: generatePlaceholder(400, 500, "Thumbnail", "#1a1a1a", "#666"),
        blurDataURL: generatePlaceholder(4, 5, "", "#1a1a1a", "#666"),
    },
    blog: {
        url: generatePlaceholder(1200, 630, "Blog Post", "#1a1a1a", "#666"),
        blurDataURL: generatePlaceholder(16, 9, "", "#1a1a1a", "#666"),
    },
    profile: {
        url: generatePlaceholder(400, 400, "Profile", "#1a1a1a", "#666"),
        blurDataURL: generatePlaceholder(1, 1, "", "#1a1a1a", "#666"),
    },
} as const

/**
 * Get the appropriate placeholder for a content type
 */
export function getPlaceholder(type: keyof typeof PLACEHOLDERS) {
    return PLACEHOLDERS[type]
}

/**
 * Get image URL with fallback to placeholder
 */
export function getImageWithFallback(
    imageUrl: string | null | undefined,
    placeholderType: keyof typeof PLACEHOLDERS = "artwork"
): string {
    if (imageUrl && imageUrl.trim()) {
        return imageUrl
    }
    return PLACEHOLDERS[placeholderType].url
}

