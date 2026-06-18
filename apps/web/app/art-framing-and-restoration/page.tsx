import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Art Framing & Restoration | Bandu Manamperi',
    description: 'Professional art framing, restoration and conservation services by Bandu Manamperi.',
};

export default function ArtRestorationPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
            <p className="text-sm tracking-widest uppercase text-muted-foreground mb-6">
                Professional Services
            </p>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-6">
                Art Framing &amp; Restoration
            </h1>
            <p className="text-muted-foreground max-w-xl font-light leading-relaxed mb-10">
                Specialized restoration, conservation, and custom framing services. This page is currently being prepared.
            </p>
            <p className="font-heading text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-foreground mb-12">
                Coming Soon
            </p>
            <Link
                href="/contact"
                className="text-sm tracking-widest uppercase border border-border px-8 py-3 text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
                Get in Touch
            </Link>
        </div>
    );
}
