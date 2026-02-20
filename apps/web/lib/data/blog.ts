import { BlogPost } from '@/lib/types/blog'
import { PLACEHOLDERS } from '@/lib/utils/image-placeholders'

/**
 * Sample blog posts data
 * TODO: Replace this with database queries when implementing backend
 */
export const sampleBlogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'The Role of Performance Art in Contemporary Society',
        slug: 'performance-art-contemporary-society',
        excerpt: 'Exploring how performance art challenges societal norms and creates spaces for dialogue about identity, culture, and the human condition.',
        author: 'Bandu Manamperi',
        date: '2024-01-15',
        category: 'Performance Art',
        tags: ['Performance', 'Contemporary Art', 'Society'],
        imageUrl: PLACEHOLDERS.blog.url,
        imageAlt: 'Performance art documentation',
        readTime: '8 min read',
        featured: true,
        published: true,
    },
    {
        id: '2',
        title: 'Restoration Techniques for Colonial Era Paintings',
        slug: 'restoration-colonial-paintings',
        excerpt: 'A detailed look at the specialized techniques and materials used in restoring 19th-century oil paintings, preserving historical integrity while ensuring longevity.',
        author: 'Bandu Manamperi',
        date: '2024-01-02',
        category: 'Restoration',
        tags: ['Restoration', 'Conservation', 'Techniques'],
        imageUrl: PLACEHOLDERS.blog.url,
        imageAlt: 'Painting restoration process',
        readTime: '12 min read',
        featured: true,
        published: true,
    },
    {
        id: '3',
        title: 'Reflections on Identity & Boundaries Exhibition',
        slug: 'identity-boundaries-exhibition',
        excerpt: 'Behind the scenes of my recent solo exhibition at the National Art Gallery, exploring themes of cultural identity and personal boundaries.',
        author: 'Bandu Manamperi',
        date: '2023-12-20',
        category: 'Exhibitions',
        tags: ['Exhibition', 'Identity', 'Process'],
        imageUrl: PLACEHOLDERS.blog.url,
        imageAlt: 'Exhibition view',
        readTime: '6 min read',
        featured: true,
        published: true,
    },
    {
        id: '4',
        title: 'The Ephemeral Nature of Live Art',
        slug: 'ephemeral-nature-live-art',
        excerpt: 'Discussing the unique challenges and opportunities of performance art as a time-based medium that exists only in the moment of its creation.',
        author: 'Bandu Manamperi',
        date: '2023-11-18',
        category: 'Theory',
        tags: ['Performance', 'Theory', 'Documentation'],
        imageUrl: PLACEHOLDERS.blog.url,
        imageAlt: 'Live art performance',
        readTime: '10 min read',
        featured: false,
        published: true,
    },
    {
        id: '5',
        title: 'Traditional Gilding Methods in Frame Restoration',
        slug: 'traditional-gilding-frame-restoration',
        excerpt: 'An in-depth guide to water gilding techniques used in restoring antique picture frames, from gesso application to burnishing.',
        author: 'Bandu Manamperi',
        date: '2023-10-25',
        category: 'Restoration',
        tags: ['Gilding', 'Framing', 'Traditional Techniques'],
        imageUrl: PLACEHOLDERS.blog.url,
        imageAlt: 'Gold leaf application',
        readTime: '15 min read',
        featured: false,
        published: true,
    },
    {
        id: '6',
        title: 'Art and Activism: Finding My Voice',
        slug: 'art-activism-finding-voice',
        excerpt: 'Personal reflections on using art as a form of social commentary and activism, drawing from experiences growing up in Sri Lanka.',
        author: 'Bandu Manamperi',
        date: '2023-09-30',
        category: 'Personal',
        tags: ['Activism', 'Personal', 'Culture'],
        imageUrl: PLACEHOLDERS.blog.url,
        imageAlt: 'Activist art',
        readTime: '7 min read',
        featured: false,
        published: true,
    },
]

/**
 * Get all published blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
    // TODO: Replace with database query
    return sampleBlogPosts.filter(post => post.published).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
}

/**
 * Get featured blog posts
 */
export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
    // TODO: Replace with database query
    return sampleBlogPosts
        .filter(post => post.published && post.featured)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    // TODO: Replace with database query
    return sampleBlogPosts.find(post => post.slug === slug && post.published) || null
}

/**
 * Get blog posts by category
 */
export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    // TODO: Replace with database query
    return sampleBlogPosts
        .filter(post => post.published && post.category === category)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

