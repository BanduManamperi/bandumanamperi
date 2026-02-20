"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/lib/types/blog";
import { getAllBlogPosts } from "@/lib/data/blog";
import { Calendar, Clock } from "lucide-react";
import posthog from "posthog-js";

const BlogPage = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadBlogPosts = async () => {
            setLoading(true);
            const data = await getAllBlogPosts();
            setBlogPosts(data);
            setFilteredPosts(data);
            setLoading(false);
        };
        loadBlogPosts();
    }, []);

    // Get unique categories
    const categories = ["all", ...Array.from(new Set(blogPosts.map(post => post.category)))];

    // Filter posts by category
    useEffect(() => {
        if (selectedCategory === "all") {
            setFilteredPosts(blogPosts);
        } else {
            setFilteredPosts(blogPosts.filter(post => post.category === selectedCategory));
        }
    }, [selectedCategory, blogPosts]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // PostHog: Track category filter changes
    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        posthog.capture('blog_category_filtered', {
            category: category,
            results_count: category === "all" ? blogPosts.length : blogPosts.filter(p => p.category === category).length,
        });
    };

    // PostHog: Track blog post click
    const handleBlogPostClick = (post: BlogPost) => {
        posthog.capture('blog_post_clicked', {
            post_id: post.id,
            post_title: post.title,
            post_slug: post.slug,
            post_category: post.category,
            post_date: post.date,
        });
    };

    return (
        <div className="relative min-h-screen bg-background">
            <main className="pt-24 md:pt-32 pb-24 blur-sm pointer-events-none select-none">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
                            Insights & Stories
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6">
                            Blog
                        </h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
                            Thoughts on art, restoration techniques, exhibitions, and the creative process
                        </p>
                    </div>

                    {/* Category Filters */}
                    <div className="mb-12 flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryFilter(category)}
                                className={`px-6 py-2 text-sm tracking-widest uppercase transition-all duration-300 border ${
                                    selectedCategory === category
                                        ? "bg-foreground text-background border-foreground"
                                        : "bg-transparent text-muted-foreground border-border hover:border-foreground hover:text-foreground"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Blog Posts Grid */}
                    {loading ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">Loading posts...</p>
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">No posts found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                            {filteredPosts.map((post, index) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="group animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                    onClick={() => handleBlogPostClick(post)}
                                >
                                    {/* Featured Image */}
                                    <div className="relative overflow-hidden bg-card aspect-[4/3] mb-6">
                                        <Image
                                            src={post.imageUrl}
                                            alt={post.imageAlt || post.title}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                        
                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-block text-xs tracking-widest uppercase bg-background/90 backdrop-blur-sm text-foreground px-3 py-1">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="space-y-3">
                                        {/* Meta Information */}
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                <span>{formatDate(post.date)}</span>
                                            </div>
                                            {post.readTime && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{post.readTime}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-xl md:text-2xl font-light leading-tight group-hover:text-muted-foreground transition-colors duration-300">
                                            {post.title}
                                        </h2>

                                        {/* Excerpt */}
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        {/* Read More */}
                                        <div className="pt-2">
                                            <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors group-hover:gap-3 transition-all duration-300">
                                                <span>Read More</span>
                                                <span>→</span>
                                            </span>
                                        </div>

                                        {/* Tags */}
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {post.tags.slice(0, 3).map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs text-muted-foreground/60"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Results Count */}
                    {!loading && (
                        <div className="text-center mt-12 text-sm text-muted-foreground">
                            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
                        </div>
                    )}
                </div>
            </main>
            {/* Coming Soon overlay */}
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-md">
                <p className="text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-foreground">
                    Coming Soon
                </p>
            </div>
        </div>
    );
};

export default BlogPage;

