import { Metadata } from "next";
import { getCatalogue } from "@/lib/data/artworks";
import { ArtworksSpreads } from "@/components/artworks/artworks-spreads";

export const metadata: Metadata = {
    title: "Artworks",
    description: "Recent artworks by Bandu Manamperi: painting, drawing, sculpture, and works on paper exploring identity, conflict, and memory.",
    openGraph: {
        title: "Artworks | Bandu Manamperi",
        description: "Recent artworks by Bandu Manamperi: painting, drawing, sculpture, and works on paper.",
        type: "website",
    },
};

// The work that opens the page, with a photo cropped to the paper (the archive
// photo shows it on a black backdrop). Pinned by id so a retitle doesn't break it.
const INTRO_WORK = {
    id: "d9c7f200-e7e8-422f-91bb-6ffdb761b1a0",
    image: "/artworks/intro-cat-027.jpg",
};

export default async function ArtworksPage() {
    const catalogue = await getCatalogue();
    const latest = catalogue.filter((e) => e.shelf === "latest");
    const pinned = catalogue.find((e) => e.id === INTRO_WORK.id);

    // If the pinned work is ever unpublished, open with the newest work instead
    const intro = pinned
        ? { entry: pinned, image: INTRO_WORK.image }
        : latest[0] && { entry: latest[0], image: latest[0].images[0] };

    return (
        <ArtworksSpreads
            latest={latest}
            archive={catalogue.filter((e) => e.shelf === "archive")}
            intro={intro || undefined}
        />
    );
}
