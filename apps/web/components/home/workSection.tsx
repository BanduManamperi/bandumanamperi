"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
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

export function WorkSection() {
    return (
        <section className="h-full flex flex-col bg-background overflow-hidden">

            {/* ── Header strip ── */}
            <motion.div
                className="px-10 md:px-20 lg:px-32 xl:px-44 pt-10 pb-5 shrink-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-2xl">
                    <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">Explore</p>
                    <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground">
                        Work
                    </h2>
                    <div className="mt-4 h-px w-10 bg-foreground/15" />
                    <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed">
                        Performance, installation, and drawing — a practice that moves across
                        media to confront identity, conflict, and memory.
                    </p>
                </div>
            </motion.div>

            {/* ── Image grid — fills remaining height ── */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 px-10 md:px-20 lg:px-32 xl:px-44 pb-12 lg:pb-16 min-h-0">
                {categories.map((cat, i) => (
                    <motion.div
                        key={cat.title}
                        className="relative overflow-hidden rounded-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                    >
                        <Link href={cat.link} className="group block h-full">
                            {/* Full-height image */}
                            <Image
                                src={cat.image}
                                alt={cat.title}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                            {/* Content — pinned to bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-7 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="font-heading text-white text-xl lg:text-2xl font-bold uppercase leading-tight tracking-[-0.02em] mb-1">
                                    {cat.title}
                                </h3>
                                <p className="text-white/60 text-xs font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {cat.description}
                                </p>
                                <span className="inline-flex items-center gap-1 mt-2 text-[10px] uppercase tracking-widest text-white/50 group-hover:text-white/80 transition-colors duration-300">
                                    View <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

        </section>
    );
}
