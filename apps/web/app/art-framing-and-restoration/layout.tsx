import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Art Framing & Restoration",
    description: "Professional art restoration, conservation, and custom framing services by Bandu Manamperi. Specialized restoration for paintings, sculptures, and frames combining traditional craftsmanship with contemporary techniques.",
    keywords: ["art restoration", "art conservation", "custom framing", "painting restoration", "sculpture restoration", "art framing", "Sri Lanka"],
    openGraph: {
        title: "Art Framing & Restoration | Bandu Manamperi",
        description: "Professional art restoration, conservation, and custom framing services by Bandu Manamperi.",
        type: "website",
    },
};

export default function ArtRestorationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

