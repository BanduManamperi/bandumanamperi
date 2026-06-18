import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CVSection } from "@/components/about/CVSection";

export const metadata: Metadata = {
    title: "Background | Bandu Manamperi",
    description:
        "Full background of Bandu Manamperi — education, exhibitions, work experience, workshops, residencies, and invited lectures.",
};

export default function BackgroundPage() {
    return (
        <div data-no-cursor-nav className="min-h-full bg-background">

            {/* ── Sticky back bar ── */}
            <div className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4">
                    <Link
                        href="/#panel-background"
                        className="group inline-flex items-center gap-2 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                        Back
                    </Link>
                </div>
            </div>

            <main className="pt-12 md:pt-16 pb-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
                            Background
                        </p>
                        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                            Curriculum Vitae
                        </h1>
                    </div>
                    <CVSection />
                </div>
            </main>
        </div>
    );
}
