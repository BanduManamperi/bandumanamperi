export interface Artwork {
    id?: string;
    title: string | null;
    year: string | null;
    media: Media[] | null;
    description: string | null;
    link?: string;
    featured?: boolean;
    category?: string | null;
    medium?: string | null;
    // Dimensions
    width?: number | null;
    height?: number | null;
    depth?: number | null;
    unit?: string | null; // Unit of measurement (cm, m, in, ft, etc.)
    // SEO and URL
    slug?: string | null;
    // Status and visibility
    status?: 'published' | 'draft' | 'archived' | null;
    // Organization and categorization
    tags?: string[] | null;
    series?: string | null;
    // Additional details
    materials?: string | null;
    technique?: string | null;
    // Location and availability
    location?: string | null;
    availability?: 'available' | 'sold' | 'on_loan' | 'private_collection' | 'nfs' | null;
    // Pricing
    price?: number | null;
    currency?: string | null;
    // Display and ordering
    sort_order?: number | null;
    thumbnail_path?: string | null;
    // Additional information
    artist_notes?: string | null;
    date_created?: string | null; // ISO date string
    // Exhibition history
    exhibition_history?: Exhibition[] | null;
    // Analytics
    views_count?: number | null;
}

export interface Exhibition {
    name: string;
    location?: string;
    date?: string; // ISO date string
    curator?: string;
    notes?: string;
}

export interface Media {
    url?: string;
    path?: string;
}
