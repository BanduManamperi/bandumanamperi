import { Metadata } from "next";
import { CVSection } from "@/components/about/CVSection";
import { VerticalScrollPanel } from "@/components/vertical-scroll-panel";

export const metadata: Metadata = {
    title: 'About | Bandu Manamperi',
    description: 'About Bandu Manamperi - Biography, artistic practice, and curriculum vitae',
}

const practice = [
    {
        title: "Performance Art",
        body: "Manamperi's performance works engage directly with audiences, creating intimate and often challenging encounters that address themes of vulnerability, identity, and social critique.",
    },
    {
        title: "Drawings & Installations",
        body: "Through drawings and installations, he explores the intersection of personal narrative and collective memory, using minimalist aesthetics to convey complex emotional landscapes.",
    },
    {
        title: "Mixed Media",
        body: "His diverse use of materials reflects a commitment to experimentation, combining traditional techniques with contemporary approaches to create visually striking and conceptually rich works.",
    },
];

export default function About() {
    const panel = "w-screen flex-shrink-0 h-full overflow-hidden";

    return (
        <div className="flex flex-row h-full w-max flex-shrink-0">

            {/* ── Panel 1: Artistic Practice ── */}
            <div id="panel-practice" data-panel data-panel-label="Practice" className={panel}>
                <section className="h-full flex items-center bg-background">
                    <div className="max-w-7xl mx-auto w-full px-8 lg:px-20 py-12">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                            Get to Know
                        </p>
                        <h1 className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,6vw,5.5rem)] font-normal leading-none tracking-tight text-foreground">
                            Artistic Practice
                        </h1>

                        <div className="w-12 h-px bg-foreground/20 my-8" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
                            {practice.map((p) => (
                                <div key={p.title}>
                                    <h2 className="font-serif text-xl lg:text-2xl text-foreground mb-4">
                                        {p.title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                        {p.body}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>

            {/* ── Panel 2: Curriculum Vitae (scrolls vertically) ── */}
            <VerticalScrollPanel label="CV">
                <div className="min-h-full bg-background">
                    <main className="pt-16 md:pt-24 pb-24">
                        <div className="max-w-7xl mx-auto px-6 lg:px-12">
                            <div className="text-center mb-16">
                                <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
                                    Background
                                </p>
                                <h2 className="text-4xl md:text-5xl font-serif mb-4">
                                    Curriculum Vitae
                                </h2>
                            </div>
                            <CVSection />
                        </div>
                    </main>
                </div>
            </VerticalScrollPanel>

        </div>
    );
}
