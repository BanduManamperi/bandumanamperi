import { Artwork } from '@/lib/types/artwork'

/**
 * Sample artwork data
 * TODO: Replace this with database queries when implementing backend
 * Example: const artworks = await fetchArtworksFromDatabase()
 */
export const sampleArtworks: Artwork[] = [
    {
        id: '1',
        title: 'Bandaged Body',
        year: 2022,
        medium: 'Performance Art',
        size: 'Variable dimensions',
        category: 'performance',
        series: 'Body & Identity',
        description: 'A powerful exploration of identity and physical constraints through performance.',
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Bandaged Body performance artwork',
        slug: 'bandaged-body',
        featured: true,
    },
    {
        id: '2',
        title: 'Instant Nirvana Private Limited',
        year: 2023,
        medium: 'Sculpture',
        size: '120 × 80 × 60 cm',
        category: 'sculpture',
        series: 'Consumerism & Spirituality',
        description: 'A thought-provoking sculpture examining contemporary spirituality and consumerism.',
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Instant Nirvana Private Limited sculpture',
        slug: 'instant-nirvana',
        featured: true,
    },
    {
        id: '3',
        title: 'Numbed',
        year: 2022,
        medium: 'Sculpture',
        size: '100 × 100 × 50 cm',
        category: 'sculpture',
        series: 'Emotional States',
        description: 'An exploration of emotional states and human condition through sculptural form.',
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Numbed sculpture',
        slug: 'numbed',
        featured: true,
    },
    {
        id: '4',
        title: 'Iron Man',
        year: 2022,
        medium: 'Performance Art',
        size: 'Variable dimensions',
        category: 'performance',
        series: 'Body & Identity',
        description: 'A performance piece examining strength, vulnerability, and transformation.',
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Iron Man performance artwork',
        slug: 'iron-man',
        featured: true,
    },
    {
        id: '5',
        title: 'The Last Supper',
        year: 2022,
        medium: 'Performance Art',
        size: 'Variable dimensions',
        category: 'performance',
        series: 'Cultural Dialogues',
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'The Last Supper performance artwork',
        slug: 'the-last-supper',
        featured: true,
        description: 'A performance piece examining cultural narratives and collective memory.',
    },
    {
        id: '6',
        title: 'Dissolution',
        year: 2023,
        medium: 'Mixed Media',
        size: '150 × 100 cm',
        category: 'painting',
        series: 'Emotional States',
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Dissolution artwork',
        slug: 'dissolution',
        featured: true,
        description: 'Mixed media work exploring the fragmentation and dissolution of self.',
    },
]

/**
 * Get featured artworks
 * This function can be easily replaced with a database query later
 */
export async function getFeaturedArtworks(): Promise<Artwork[]> {
    // TODO: Replace with actual database query
    // Example: return await db.artworks.findMany({ where: { featured: true } })
    return sampleArtworks.filter(artwork => artwork.featured).slice(0, 6)
}

/**
 * Get all artworks
 * This function can be easily replaced with a database query later
 */
export async function getAllArtworks(): Promise<Artwork[]> {
    // TODO: Replace with actual database query
    // Example: return await db.artworks.findMany()
    return sampleArtworks
}

/**
 * Get artwork by slug
 * This function can be easily replaced with a database query later
 */
export async function getArtworkBySlug(slug: string): Promise<Artwork | null> {
    // TODO: Replace with actual database query
    // Example: return await db.artworks.findUnique({ where: { slug } })
    return sampleArtworks.find(artwork => artwork.slug === slug) || null
}

/**
 * Get artworks by IDs
 * This function can be easily replaced with a database query later
 */
export async function getArtworksByIds(ids: string[]): Promise<Artwork[]> {
    // TODO: Replace with actual database query
    // Example: return await db.artworks.findMany({ where: { id: { in: ids } } })
    return sampleArtworks.filter(artwork => ids.includes(artwork.id))
}

/**
 * Get artworks by category
 * This function can be easily replaced with a database query later
 */
export async function getArtworksByCategory(category: Artwork['category']): Promise<Artwork[]> {
    // TODO: Replace with actual database query
    // Example: return await db.artworks.findMany({ where: { category } })
    return sampleArtworks.filter(artwork => artwork.category === category)
}
