"use client";

import Link from "next/link";
import Image from "next/image";

const workCategories = [
    {
        title: "Artworks",
        description: "Paintings, mixed media, and works on paper",
        link: "/artworks",
        image: "/JBP06256.jpg",
    },
    {
        title: "Performances",
        description: "Live art performances and interventions",
        link: "/performances",
        image: "/Bandaged_Body_1.jpg",
    },
    {
        title: "Art Framing, Restoration, and Conservation",
        description: "Art framing and restoration of artworks and sculptures",
        link: "/art-framing-and-restoration",
        image: "/IMG_8614.JPG",
    },
];

const Work = () => {
    return (
        <div className="min-h-full bg-background">
            <main className="pt-12 md:pt-16 pb-24">
                <div className="max-w-[1900px] mx-auto px-6 lg:px-12">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">Explore</p>
                        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4">Work</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto mt-6">
                            Discover the full breadth of artistic practice spanning paintings,
                            performances, and exhibitions across international venues.
                        </p>
                    </div>

                    {/* Navigation Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {workCategories.map((category, index) => (
                            <Link
                                key={category.title}
                                href={category.link}
                                className="group block animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className=" relative overflow-hidden bg-card aspect-3/4">
                                    <Image
                                        src={category.image}
                                        alt={category.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform grayscale group-hover:grayscale-0 group-hover:brightness-50 group-hover:contrast-100 group-hover:saturate-100  ease-in-out duration-1000 "
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                                <div className="mt-6 text-center">
                                    <h2 className="font-heading text-2xl text-foreground group-hover:text-primary transition-colors">
                                        {category.title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {category.description}
                                    </p>
                                    <span className="inline-block mt-4 text-sm tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                                        View →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Work;
