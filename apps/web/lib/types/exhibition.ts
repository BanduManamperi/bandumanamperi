export interface Exhibition {
    id: string
    title: string
    type: 'solo' | 'group' | 'online'
    year: number
    startDate?: string
    endDate?: string
    venue: string
    location: string // City, Country
    curator?: string
    description?: string
    artworksCount?: number
    featured?: boolean
    imageUrl: string
    imageAlt?: string
    slug: string
    // Additional details
    organizer?: string
    website?: string
    catalog?: string
    press?: Array<{
        title: string
        publication: string
        url?: string
        date?: string
    }>
    artworks?: string[] // Array of artwork IDs
    status?: 'upcoming' | 'ongoing' | 'past'
}

