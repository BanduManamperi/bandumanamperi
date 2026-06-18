import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Artworks',
    description: 'Artworks By Bandu Manamperi - Paintings, Sculptures, and Performances',
}

export default function ArtworksLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
