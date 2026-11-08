import { Metadata } from "next";
import { getCatalogue, LATEST_COUNT } from "@/lib/data/artworks";
import { DocumentSheet } from "@/components/sheet/document-sheet";
import { ArchiveCatalogue } from "@/components/archive/archive-catalogue";

export const metadata: Metadata = {
    title: "Archive",
    description: "The archive of artworks by Bandu Manamperi, catalogued in order of entry.",
};

export default async function ArchivePage() {
    const catalogue = await getCatalogue();
    return (
        <DocumentSheet>
            <ArchiveCatalogue entries={catalogue.filter((e) => e.shelf === "archive")} latestCount={LATEST_COUNT} />
        </DocumentSheet>
    );
}
