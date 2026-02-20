import { Exhibition } from '@/lib/types/exhibition'

/**
 * Sample exhibitions data
 * TODO: Replace this with database queries when implementing backend
 */
export const sampleExhibitions: Exhibition[] = [
    {
        id: '1',
        title: 'Identity & Boundaries',
        type: 'solo',
        year: 2024,
        startDate: '2024-03-15',
        endDate: '2024-05-20',
        venue: 'National Art Gallery',
        location: 'Colombo, Sri Lanka',
        curator: 'Dr. Anoma Pieris',
        description: 'A comprehensive solo exhibition exploring themes of identity, cultural boundaries, and the human condition through performance art, installations, and mixed media works.',
        artworksCount: 25,
        featured: true,
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Identity & Boundaries exhibition',
        slug: 'identity-boundaries-2024',
        status: 'past',
        artworks: ['1', '4', '5'], // Bandaged Body, Iron Man, The Last Supper
    },
    {
        id: '2',
        title: 'Contemporary Asian Art Biennale',
        type: 'group',
        year: 2023,
        startDate: '2023-09-01',
        endDate: '2023-11-30',
        venue: 'Asia Art Center',
        location: 'Singapore',
        curator: 'Melissa Tan',
        description: 'A major international group exhibition featuring contemporary artists from across Asia, exploring themes of cultural identity, globalization, and social change.',
        artworksCount: 3,
        featured: true,
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Contemporary Asian Art Biennale',
        slug: 'asian-art-biennale-2023',
        status: 'past',
        artworks: ['2', '3'], // Instant Nirvana, Numbed
    },
    {
        id: '3',
        title: 'Body as Canvas',
        type: 'solo',
        year: 2023,
        startDate: '2023-06-10',
        endDate: '2023-08-15',
        venue: 'Theertha Gallery',
        location: 'Colombo, Sri Lanka',
        description: 'A focused solo exhibition examining the body as a site of artistic expression, featuring performance documentation and interactive installations.',
        artworksCount: 15,
        featured: true,
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Body as Canvas exhibition',
        slug: 'body-as-canvas-2023',
        status: 'past',
        artworks: ['1', '4'], // Bandaged Body, Iron Man
    },
    {
        id: '4',
        title: 'Voices of Resistance',
        type: 'group',
        year: 2022,
        startDate: '2022-11-05',
        endDate: '2023-01-10',
        venue: 'Contemporary Art Museum',
        location: 'Bangkok, Thailand',
        curator: 'Apinan Poshyananda',
        description: 'Group exhibition featuring artists addressing political and social issues through contemporary art practices.',
        artworksCount: 4,
        featured: false,
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Voices of Resistance exhibition',
        slug: 'voices-resistance-2022',
        status: 'past',
    },
    {
        id: '5',
        title: 'Transformations',
        type: 'solo',
        year: 2022,
        startDate: '2022-04-20',
        endDate: '2022-06-30',
        venue: 'Paradise Road Galleries',
        location: 'Colombo, Sri Lanka',
        description: 'A retrospective solo exhibition showcasing transformative works spanning performance art, sculpture, and installation.',
        artworksCount: 30,
        featured: true,
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Transformations exhibition',
        slug: 'transformations-2022',
        status: 'past',
    },
    {
        id: '6',
        title: 'Digital Narratives',
        type: 'online',
        year: 2021,
        startDate: '2021-08-01',
        endDate: '2021-10-31',
        venue: 'Virtual Gallery Platform',
        location: 'Online',
        description: 'An innovative online exhibition exploring digital storytelling and virtual performance art in the post-pandemic era.',
        artworksCount: 12,
        featured: false,
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Digital Narratives online exhibition',
        slug: 'digital-narratives-2021',
        status: 'past',
    },
]

/**
 * Get all exhibitions
 */
export async function getAllExhibitions(): Promise<Exhibition[]> {
    // TODO: Replace with database query
    return sampleExhibitions.sort((a, b) => b.year - a.year)
}

/**
 * Get featured exhibitions
 */
export async function getFeaturedExhibitions(): Promise<Exhibition[]> {
    // TODO: Replace with database query
    return sampleExhibitions.filter(ex => ex.featured).sort((a, b) => b.year - a.year)
}

/**
 * Get exhibition by slug
 */
export async function getExhibitionBySlug(slug: string): Promise<Exhibition | null> {
    // TODO: Replace with database query
    return sampleExhibitions.find(ex => ex.slug === slug) || null
}

/**
 * Get exhibitions by type
 */
export async function getExhibitionsByType(type: Exhibition['type']): Promise<Exhibition[]> {
    // TODO: Replace with database query
    return sampleExhibitions.filter(ex => ex.type === type).sort((a, b) => b.year - a.year)
}

