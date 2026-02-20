export interface Artwork {
    id: string
    title: string
    year?: number | string
    medium?: string
    size?: string // Legacy field - can be derived from width, height, depth, unit
    width?: number | null
    height?: number | null
    depth?: number | null
    unit?: string | null // Unit of measurement (cm, m, in, ft, etc.)
    category?: 'painting' | 'sculpture' | 'performance' | 'other'
    description?: string
    imageUrl: string
    imageAlt?: string
    slug?: string
    featured?: boolean
    // Additional fields
    status?: 'published' | 'draft' | 'archived'
    tags?: string[]
    series?: string
    materials?: string
    technique?: string
    location?: string
    availability?: 'available' | 'sold' | 'on_loan' | 'private_collection' | 'nfs'
    price?: number | null
    currency?: string
    sort_order?: number
    thumbnail_path?: string
    artist_notes?: string
    date_created?: string
    exhibition_history?: Array<{
        name: string
        location?: string
        date?: string
        curator?: string
        notes?: string
    }>
    views_count?: number
}
