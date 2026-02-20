import { RestorationProject } from '@/lib/types/restoration'

/**
 * Sample restoration projects data
 * TODO: Replace this with database queries when implementing backend
 */
export const sampleRestorations: RestorationProject[] = [
    {
        id: '1',
        title: 'Colonial Era Oil Painting Restoration',
        client: 'National Museum of Colombo',
        year: 2024,
        category: 'painting',
        originalArtist: 'Unknown Colonial Artist',
        period: '19th Century',
        description: 'Complete restoration of a large-scale colonial era oil painting suffering from extensive craquelure, paint loss, and yellowed varnish. The work required careful cleaning, consolidation, and inpainting to restore its original brilliance while maintaining historical integrity.',
        condition: 'Severe craquelure, paint flaking, yellowed varnish, water damage in lower right corner',
        techniques: ['Surface cleaning', 'Varnish removal', 'Consolidation', 'Inpainting', 'Protective varnish application'],
        materials: ['Conservation-grade solvents', 'Rabbit skin glue', 'Archival pigments', 'Dammar varnish'],
        duration: '4 months',
        imageUrl: '/IMG_8614.JPG',
        beforeImage: '/IMG_8614.JPG',
        afterImage: '/IMG_8614.JPG',
        imageAlt: 'Colonial era painting restoration',
        slug: 'colonial-oil-painting-restoration',
        featured: true,
        status: 'completed',
        testimonial: {
            text: 'The restoration exceeded our expectations. The painting has been returned to its former glory while respecting its historical context.',
            author: 'Dr. Nimal Silva',
            role: 'Chief Curator, National Museum'
        }
    },
    {
        id: '2',
        title: 'Buddhist Sculpture Conservation',
        client: 'Private Collector',
        year: 2023,
        category: 'sculpture',
        period: '18th Century',
        description: 'Conservation of an 18th-century wooden Buddhist sculpture with significant woodworm damage, structural instability, and deteriorated gilding. Treatment focused on pest eradication, structural reinforcement, and careful restoration of the gold leaf finish.',
        condition: 'Active woodworm infestation, structural cracks, 60% gilding loss, surface grime',
        techniques: ['Pest treatment', 'Structural reinforcement', 'Wood consolidation', 'Gilding restoration', 'Protective coating'],
        materials: ['Timber consolidants', 'Gold leaf', 'Traditional gesso', 'Conservation adhesives'],
        duration: '5 months',
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Buddhist sculpture conservation',
        slug: 'buddhist-sculpture-conservation',
        featured: true,
        status: 'completed',
        testimonial: {
            text: 'Remarkable craftsmanship and attention to detail. The sculpture has been stabilized beautifully.',
            author: 'Anonymous Collector'
        }
    },
    {
        id: '3',
        title: 'Contemporary Canvas Restoration',
        client: 'Saskia Fernando Gallery',
        year: 2024,
        category: 'painting',
        originalArtist: 'Contemporary Sri Lankan Artist',
        period: 'Contemporary (2010s)',
        description: 'Emergency restoration of a contemporary acrylic painting damaged during transportation. Work included tear repair, color matching, and surface treatment to restore the work to exhibition quality.',
        condition: 'Large tear in canvas, surface abrasion, frame damage',
        techniques: ['Canvas tear repair', 'Lining', 'Color matching', 'Surface cleaning', 'Reframing'],
        materials: ['Acrylic restoration paints', 'Canvas lining material', 'Conservation adhesives'],
        duration: '3 weeks',
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Contemporary canvas restoration',
        slug: 'contemporary-canvas-restoration',
        featured: true,
        status: 'completed'
    },
    {
        id: '4',
        title: 'Antique Frame Restoration & Gilding',
        year: 2023,
        category: 'framing',
        period: 'Victorian Era',
        description: 'Complete restoration of an ornate Victorian-era picture frame with extensive gesso loss, broken ornamentation, and degraded gilding. The project required skilled carpentry, gesso casting, and traditional water gilding techniques.',
        condition: 'Multiple breaks, 40% gesso loss, oxidized gilding, woodworm damage',
        techniques: ['Structural repair', 'Gesso casting', 'Water gilding', 'Patination', 'Wax finishing'],
        materials: ['Traditional gesso', '23.5k gold leaf', 'Conservation-grade wood glue', 'Natural pigments'],
        duration: '6 weeks',
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Victorian frame restoration',
        slug: 'victorian-frame-restoration',
        featured: true,
        status: 'completed',
        testimonial: {
            text: 'The frame restoration was executed with exceptional skill. It looks magnificent.',
            author: 'Heritage Homes Colombo'
        }
    },
    {
        id: '5',
        title: 'Mural Conservation Project',
        client: 'Historic Building Trust',
        year: 2022,
        category: 'conservation',
        period: 'Early 20th Century',
        description: 'On-site conservation of a deteriorating wall mural in a heritage building. Treatment addressed moisture damage, paint loss, and structural issues while working within the constraints of the historic structure.',
        condition: 'Moisture damage, efflorescence, paint delamination, structural cracks',
        techniques: ['Moisture barrier installation', 'Salt removal', 'Paint consolidation', 'Inpainting', 'Protective coating'],
        materials: ['Lime-based mortars', 'Mineral pigments', 'Conservation consolidants', 'Breathable sealers'],
        duration: '8 months',
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Mural conservation',
        slug: 'historic-mural-conservation',
        featured: false,
        status: 'completed'
    },
    {
        id: '6',
        title: 'Modern Sculpture Repair',
        year: 2024,
        category: 'sculpture',
        originalArtist: 'Contemporary Artist',
        period: 'Contemporary (2020s)',
        description: 'Repair and stabilization of a modern mixed-media sculpture with structural damage and surface deterioration. Work required innovative approaches to match contemporary materials and techniques.',
        condition: 'Broken armature, surface cracking, color fading',
        techniques: ['Structural reinforcement', 'Color restoration', 'Surface treatment', 'Protective coating'],
        materials: ['Modern adhesives', 'Compatible polymers', 'UV-resistant coatings'],
        duration: '1 month',
        imageUrl: '/IMG_8614.JPG',
        imageAlt: 'Modern sculpture repair',
        slug: 'modern-sculpture-repair',
        featured: false,
        status: 'completed'
    },
]

/**
 * Get all restoration projects
 */
export async function getAllRestorations(): Promise<RestorationProject[]> {
    // TODO: Replace with database query
    return sampleRestorations.sort((a, b) => b.year - a.year)
}

/**
 * Get featured restoration projects
 */
export async function getFeaturedRestorations(): Promise<RestorationProject[]> {
    // TODO: Replace with database query
    return sampleRestorations.filter(project => project.featured).sort((a, b) => b.year - a.year)
}

/**
 * Get restoration project by slug
 */
export async function getRestorationBySlug(slug: string): Promise<RestorationProject | null> {
    // TODO: Replace with database query
    return sampleRestorations.find(project => project.slug === slug) || null
}

/**
 * Get restorations by category
 */
export async function getRestorationsByCategory(category: RestorationProject['category']): Promise<RestorationProject[]> {
    // TODO: Replace with database query
    return sampleRestorations.filter(project => project.category === category).sort((a, b) => b.year - a.year)
}

