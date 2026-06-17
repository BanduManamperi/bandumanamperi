import { Metadata } from "next";
import { ScrollablePanel } from "@/components/scrollable-panel";

export const metadata: Metadata = {
    title: 'Artworks',
    description: 'Artworks By Bandu Manamperi - Paintings, Sculptures, and Performances',
}

export default function ArtworksLayout({ children }: { children: React.ReactNode }) {
    return <ScrollablePanel>{children}</ScrollablePanel>
}
