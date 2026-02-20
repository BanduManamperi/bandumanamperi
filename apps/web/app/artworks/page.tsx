import { Metadata } from "next";
import Artworks from "@/components/artworks";

export const metadata: Metadata = {
    title: "Artworks",
    description: "Explore the diverse collection of artworks by Bandu Manamperi, featuring paintings, sculptures, installations, and mixed media pieces that explore themes of identity, conflict, and human nature.",
    openGraph: {
        title: "Artworks | Bandu Manamperi",
        description: "Explore the diverse collection of artworks by Bandu Manamperi, featuring paintings, sculptures, installations, and mixed media pieces.",
        type: "website",
    },
};

export default function ArtworksPage() {
    return (
        <div>
            <Artworks />
        </div>
    )
}