import ArtworkDetail from "@/components/artworks/artworkDetail";
import { getArtworkBySlugController } from "@/lib/controller/artworkController";
import { Metadata } from "next";

function isPlaceholderTitle(title: string | null | undefined): boolean {
    const t = (title || "").trim().toUpperCase();
    return t === "IMG" || /^IMG_\d+/i.test(t);
}

function displayTitle(title: string | null | undefined): string {
    return title && !isPlaceholderTitle(title) ? title : "Untitled";
}

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const artwork = await getArtworkBySlugController(slug);

    if (!artwork) {
        return {
            title: 'Artwork Not Found',
            description: 'The requested artwork could not be found.',
        };
    }

    const imageUrl = artwork.thumbnail_url || artwork.media?.[0]?.path || '/IMG_8614.JPG';

    const titleForMeta = displayTitle(artwork.title);
    return {
        title: `${titleForMeta} - Bandu Manamperi`,
        description: artwork.description || `View ${titleForMeta} by Bandu Manamperi. ${artwork.medium ? `Medium: ${artwork.medium}.` : ''} ${artwork.year ? `Year: ${artwork.year}.` : ''}`,
        openGraph: {
            title: `${titleForMeta} - Bandu Manamperi`,
            description: artwork.description || `View ${titleForMeta} by Bandu Manamperi.`,
            images: [imageUrl],
        },
    };
}

export default async function ArtworkDetailPage({ params }: PageProps) {
    const { slug } = await params;
    return <ArtworkDetail slug={slug} />;
}

