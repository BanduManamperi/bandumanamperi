"use client";

import { useState } from "react";
import Image from "next/image";
import posthog from "posthog-js";
import type { BlogPost } from "@/lib/types/blog";
import { body, caption, display } from "@/components/sheet/type";

function formatDate(iso: string) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

// The blog as a journal: entries listed newest first, filterable by category.
// Entries don't link anywhere yet because individual post pages don't exist.
export function Journal({ posts }: { posts: BlogPost[] }) {
    const [category, setCategory] = useState("all");
    const categories = ["all", ...new Set(posts.map((p) => p.category))];
    const shown = category === "all" ? posts : posts.filter((p) => p.category === category);

    const choose = (c: string) => {
        setCategory(c);
        posthog.capture("blog_category_filtered", {
            category: c,
            results_count: c === "all" ? posts.length : posts.filter((p) => p.category === c).length,
        });
    };

    return (
        <div className="mx-auto max-w-[72rem] pt-8 lg:pt-12">
            <h1 className={display}>Journal</h1>
            <p className={`mt-6 max-w-[34rem] ${body}`}>
                Notes on performance, restoration, and the life of exhibitions.
            </p>

            {categories.length > 2 && (
                <div role="group" aria-label="Category" className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y border-border py-3 text-[0.8125rem]">
                    <span className="text-muted-foreground">Category</span>
                    {categories.map((c) => (
                        <button
                            key={c}
                            type="button"
                            aria-pressed={category === c}
                            onClick={() => choose(c)}
                            className={`capitalize underline-offset-4 transition-colors focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 ${
                                category === c ? "text-foreground underline" : "text-foreground/50 hover:text-foreground"
                            }`}
                        >
                            {c === "all" ? "All" : c}
                        </button>
                    ))}
                </div>
            )}

            {shown.length === 0 ? (
                <p className={`mt-10 ${body}`}>No entries in this category yet.</p>
            ) : (
                <ol>
                    {shown.map((post) => (
                        <li key={post.id} className="grid grid-cols-1 gap-x-[clamp(1.5rem,3vw,3.5rem)] gap-y-4 border-b border-border py-8 md:grid-cols-12">
                            <div className={`md:col-span-2 ${caption}`}>
                                <time dateTime={post.date}>{formatDate(post.date)}</time>
                                <span className="mt-1 block capitalize">{post.category}</span>
                            </div>
                            <div className="md:col-span-6">
                                <h2 className="font-display text-[1.5rem] font-light leading-tight text-foreground">{post.title}</h2>
                                <p className={`mt-3 max-w-[36rem] ${body}`}>{post.excerpt}</p>
                                {post.readTime && <p className={`mt-3 ${caption}`}>{post.readTime}</p>}
                            </div>
                            {post.imageUrl && (
                                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--sheet-rule)] md:col-span-4">
                                    <Image src={post.imageUrl} alt={post.imageAlt ?? ""} fill className="object-cover" sizes="(min-width: 768px) 28vw, 100vw" />
                                </div>
                            )}
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
}
