export interface RestorationProject {
    id: string
    title: string
    client?: string // Client name (can be anonymous)
    year: number
    category: 'painting' | 'sculpture' | 'framing' | 'conservation' | 'other'
    originalArtist?: string
    period?: string // Time period of original artwork (e.g., "19th Century", "Contemporary")
    description: string
    
    // Restoration details
    condition?: string // Condition before restoration
    techniques?: string[] // Techniques used
    materials?: string[] // Materials used
    duration?: string // Time taken (e.g., "3 months", "6 weeks")
    
    // Images
    beforeImage?: string
    afterImage?: string
    processImages?: string[] // Images showing the process
    imageUrl: string // Main display image
    imageAlt?: string
    
    // Additional info
    featured?: boolean
    slug: string
    status?: 'completed' | 'in_progress'
    testimonial?: {
        text: string
        author: string
        role?: string
    }
}

