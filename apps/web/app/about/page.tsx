import { Metadata } from "next";
import Image from "next/image";
import { CVSection } from "@/components/about/CVSection";

export const metadata: Metadata = {
    title: 'About | Bandu Manamperi',
    description: 'About Bandu Manamperi - Biography, artistic practice, and curriculum vitae',
}

export default function About() {
    return (
        <div className="min-h-screen bg-background">
            <main className="pt-24 md:pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">Get to Know</p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4">About the Artist</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto mt-6">
                            An exploration into the life, work, and artistic journey of Bandu Manamperi
                        </p>
                    </div>

                    {/* About Section */}
                    <section className="mb-24">
                        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
                            <div>
                                <p className="text-2xl font-bold mb-4">Biography</p>
                                <h2 className="text-4xl md:text-5xl font-serif mb-8">Bandu Manamperi</h2>
                                <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
                                    <p>
                                        <strong className="font-bold text-foreground">Bandu Manamperi</strong> is an artist whose work transcends traditional boundaries to explore themes of identity, conflict, and the complexities of human nature, making a significant mark on the global art scene. His multifaceted approach to art, which incorporates performances, drawings, and installations, challenges viewers to confront their perceptions and engage in a deeper dialogue with the subject matter.
                                    </p>
                                    <p>
                                        Drawing from his own experiences and cultural heritage, Manamperi&apos;s pieces offer a poignant reflection on the societal and personal impacts of political turmoil. His work serves as both a mirror reflecting societal issues and a bridge connecting diverse audiences through the universal language of creativity and emotion.
                                    </p>
                                    <p>
                                        As a founding member and Vice Chairman of <strong className="font-bold text-foreground">Theertha International Artists&apos; Collective</strong> in Sri Lanka, he has been pivotal in promoting contemporary art and fostering a community for artists to collaborate and express themselves freely. The collective has become an important platform for artistic expression and cultural dialogue in the region.
                                    </p>
                                    <p>
                                        As an acclaimed figure in contemporary art, Bandu Manamperi continues to inspire and provoke thought, cementing his place as a visionary artist whose work resonates across cultures and generations. His commitment to exploring challenging themes while maintaining artistic integrity has earned him recognition both locally and internationally.
                                    </p>
                                </div>

                            </div>

                            <div>
                                <div className="relative w-full h-full">
                                    <div className="absolute -top-4 -left-4 w-full h-full border border-border" />
                                    <Image
                                        src="/IMG_8614.JPG"
                                        alt="Bandu Manamperi"
                                        width={1000}
                                        height={1000}
                                        className="w-full h-full object-contain relative"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Artistic Practice */}
                        <div className="mt-16 pt-16 border-t border-border">
                            <h3 className="text-3xl font-serif mb-8">Artistic Practice</h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div>
                                    <h4 className="text-xl font-semibold mb-4">Performance Art</h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Manamperi&apos;s performance works engage directly with audiences, creating intimate and often challenging encounters that address themes of vulnerability, identity, and social critique.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold mb-4">Drawings & Installations</h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Through drawings and installations, he explores the intersection of personal narrative and collective memory, using minimalist aesthetics to convey complex emotional landscapes.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xl font-semibold mb-4">Mixed Media</h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        His diverse use of materials reflects a commitment to experimentation, combining traditional techniques with contemporary approaches to create visually striking and conceptually rich works.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Curriculum Vitae Section */}
                    <section id="cv" className="pt-24 md:pt-32 border-t border-border">
                        <div className="text-center mb-16">
                            <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">Background</p>
                            <h2 className="text-4xl md:text-5xl font-serif mb-4">Curriculum Vitae</h2>
                        </div>
                        <CVSection />
                    </section>
                </div>
            </main>
        </div>
    );
}