export interface BlogPost {
    id: string
    title: string
    slug: string
    excerpt: string
    content?: string
    author: string
    date: string // ISO date string
    category: string
    tags?: string[]
    imageUrl: string
    imageAlt?: string
    readTime?: string // e.g., "5 min read"
    featured?: boolean
    published?: boolean
}

