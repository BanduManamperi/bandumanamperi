"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
    {
        title: "Artworks",
        description: "Paintings, mixed media & works on paper",
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
        title: "Art Restoration",
        description: "Framing, restoration and conservation",
        link: "/art-framing-and-restoration",
        image: "/IMG_8614.JPG",
    },
];

export function WorkSection() {
    return (
        <section className="h-full flex flex-col bg-background overflow-hidden">

            {/* ── Header strip ── */}
            <motion.div
                className="flex items-end justify-between gap-8 px-8 lg:px-20 pt-10 pb-5 shrink-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-2xl">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                        Get to Know
                    </p>
                    <h2 className="font-[family-name:var(--font-playfair)] text-[clamp(3rem,8vw,7rem)] font-normal leading-none tracking-tight text-foreground">
                        Practice
                    </h2>
                    <p className="mt-4 text-sm text-muted-foreground font-light leading-relaxed">
                        Performance, installation, and drawing — a practice that moves across
                        media to confront identity, conflict, and memory.
                    </p>
                </div>
                <Link
                    href="/work"
                    className="inline-flex shrink-0 items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group mb-2"
                >
                    Explore all
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </motion.div>

            {/* ── Image grid — fills remaining height ── */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 px-8 lg:px-20 pb-12 lg:pb-16 min-h-0">
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
                                <h3 className="font-[family-name:var(--font-playfair)] text-white text-xl lg:text-2xl font-normal leading-tight mb-1">
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
