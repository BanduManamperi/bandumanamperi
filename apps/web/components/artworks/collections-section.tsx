"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface CollectionWork {
    id: string;
    image: string;
    alt?: string;
}

export interface Collection {
    id: string;
    title: string;
    media?: string;
    works?: CollectionWork[];
    coverImages?: string[];
    workCount?: number;
}

interface CollectionsSectionProps {
    collections: Collection[];
    totalArtworkCount?: number;
    activeCollectionId?: string | null;
    onSelect?: (collectionId: string) => void;
    onBrowseAll?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function coverImages(c: Collection): { src: string; alt: string }[] {
    const fromWorks = c.works?.map((w) => ({ src: w.image, alt: w.alt ?? c.title })) ?? [];
    const fromCovers = c.coverImages?.map((src) => ({ src, alt: c.title })) ?? [];
    return [...fromWorks, ...fromCovers].slice(0, 4);
}

function workCount(c: Collection): number {
    return c.workCount ?? c.works?.length ?? 0;
}

/* ------------------------------------------------------------------ */
/*  Montage cover                                                       */
/* ------------------------------------------------------------------ */

function MontageCover({ collection }: { collection: Collection }) {
    const images = coverImages(collection);
    const single = images.length === 1;

    return (
        <div className="relative aspect-[3/2] bg-background overflow-hidden">
            {single ? (
                <Image
                    src={images[0].src}
                    alt={images[0].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
            ) : (
                <div className="grid grid-cols-2 grid-rows-2 gap-[3px] p-[5px] h-full">
                    {Array.from({ length: 4 }).map((_, i) => {
                        const img = images[i];
                        return (
                            <div key={i} className="relative overflow-hidden rounded-sm bg-muted">
                                {img && (
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        sizes="(max-width: 768px) 25vw, 160px"
                                        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <span className="absolute top-3 right-3 grid place-items-center w-7 h-7 rounded-full bg-background/90 border border-border text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Card                                                                */
/* ------------------------------------------------------------------ */

export function CollectionCard({
    collection,
    active = false,
    onSelect,
}: {
    collection: Collection;
    active?: boolean;
    onSelect?: (id: string) => void;
}) {
    const count = workCount(collection);

    return (
        <button
            type="button"
            onClick={() => onSelect?.(collection.id)}
            aria-pressed={active}
            className={`group block w-full text-left overflow-hidden rounded-lg border bg-muted/40 transition-colors ${
                active
                    ? "border-foreground ring-1 ring-foreground"
                    : "border-border hover:border-foreground/40"
            }`}
        >
            <MontageCover collection={collection} />
            <div className="px-4 pt-3 pb-4">
                <h3 className="font-heading text-base text-foreground">
                    {collection.title}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                    {count} {count === 1 ? "work" : "works"}
                    {collection.media ? ` · ${collection.media}` : ""}
                </p>
            </div>
        </button>
    );
}

/* ------------------------------------------------------------------ */
/*  Section                                                             */
/* ------------------------------------------------------------------ */

export default function CollectionsSection({
    collections,
    totalArtworkCount,
    activeCollectionId = null,
    onSelect,
    onBrowseAll,
}: CollectionsSectionProps) {
    const reduce = useReducedMotion();
    const totalWorks = totalArtworkCount ?? collections.reduce((sum, c) => sum + workCount(c), 0);

    return (
        <section className="w-full px-10 md:px-20 lg:px-32 xl:px-44 py-16">
            {/* Header */}
            <div className="flex items-end justify-between gap-6 mb-1">
                <h2 className="font-heading text-[clamp(2.25rem,4vw,3.5rem)] font-bold leading-none tracking-tight text-foreground">
                    Collections
                </h2>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {collections.length} {collections.length === 1 ? "collection" : "collections"} · {totalWorks} works
                </span>
            </div>
            <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-muted-foreground">
                Open one to filter the works, or browse everything.
            </p>

            {/* Grid */}
            <div className="mt-8 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
                {collections.map((c, i) => (
                    <motion.div
                        key={c.id}
                        initial={reduce ? false : { opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.05 }}
                    >
                        <CollectionCard
                            collection={c}
                            active={activeCollectionId === c.id}
                            onSelect={onSelect}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Browse all */}
            <button
                type="button"
                onClick={onBrowseAll}
                className="group mt-8 inline-flex items-center gap-2 text-sm tracking-wide text-foreground border-b border-foreground/80 pb-0.5 hover:border-foreground transition-colors"
            >
                Browse all {totalWorks} works
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
        </section>
    );
}
