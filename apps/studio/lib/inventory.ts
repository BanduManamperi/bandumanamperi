import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import type { ArtworkAvailability } from "@bandumanamperi/types";
import { withoutDashes } from "@/lib/text";

const CAMERA_FILE = /^IMG[_\s-]?\d*$/i;

export type Shelf = "available" | "sold";

export type Offer = {
    id: string;
    slug: string;
    href: string;
    /** Stable catalogue number, oldest entry first. */
    number: number;
    label: string;
    title: string;
    isUntitled: boolean;
    sourceRef: string | null;
    year: string | null;
    medium: string | null;
    materials: string | null;
    series: string | null;
    dimensions: string | null;
    description: string | null;
    images: string[];
    availability: Shelf;
    price: number | null;
    currency: string;
    priceUponRequest: boolean;
};

type ArtworkRow = {
    id: string;
    title: string | null;
    slug: string | null;
    year: string | null;
    medium: string | null;
    materials: string | null;
    series: string | null;
    description: string | null;
    width: number | null;
    height: number | null;
    depth: number | null;
    unit: string | null;
    media: string[] | null;
    thumbnail_path: string | null;
    sort_order: number | null;
    created_at: string;
    availability: ArtworkAvailability;
    price: number | string | null;
    currency: string | null;
    price_upon_request: boolean | null;
};

function db() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key =
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
        throw new Error("Missing Supabase environment variables.");
    }
    return createClient(url, key);
}

function publicNote(value: string | null): string | null {
    if (!value) return null;
    // Some sold records store a collector attribution in the description. That stays in the CMS.
    if (/^collector\s*name\b/i.test(value)) return null;
    return value;
}

function clean(value: string | null | undefined): string | null {
    const v = value?.trim();
    return v ? withoutDashes(v) : null;
}

function money(value: number | string | null): number | null {
    if (value == null || value === "") return null;
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : null;
}

function formatDimensions(r: ArtworkRow): string | null {
    const sides = [r.height, r.width, r.depth].filter((n): n is number => typeof n === "number" && n > 0);
    if (sides.length < 2) return null;
    return `${sides.join(" × ")} ${r.unit ?? "cm"}`;
}

/**
 * Published works the studio can offer or has sold.
 * Not-for-sale, on loan, and private-collection works stay out of the room.
 * Price is optional: a work can be listed with a figure, as price on request, or with no price.
 */
export const getInventory = cache(async (): Promise<Offer[]> => {
    const supabase = db();
    const { data, error } = await supabase
        .from("artworks")
        .select(
            "id, title, slug, year, medium, materials, series, description, width, height, depth, unit, media, thumbnail_path, sort_order, created_at, availability, price, currency, price_upon_request",
        )
        .eq("status", "published")
        .in("availability", ["available", "sold"])
        .order("created_at", { ascending: true });

    if (error || !data) {
        throw new Error(error?.message ?? "The studio inventory could not be loaded.");
    }

    const publicUrl = (path: string) =>
        path.startsWith("http") ? path : supabase.storage.from("artworks").getPublicUrl(path).data.publicUrl;

    const numbered = (data as ArtworkRow[]).map((r, i) => {
        const rawTitle = r.title?.trim() ?? "";
        const isUntitled = !rawTitle || CAMERA_FILE.test(rawTitle);
    const paths = (Array.isArray(r.media) ? r.media : []).filter((path): path is string => typeof path === "string" && path.length > 0);
        if (r.thumbnail_path && !paths.includes(r.thumbnail_path)) paths.unshift(r.thumbnail_path);
        const slug = r.slug || r.id;
        const availability: Shelf = r.availability === "sold" ? "sold" : "available";

        return {
            id: r.id,
            slug,
            href: `/works/${slug}`,
            number: i + 1,
            label: String(i + 1).padStart(3, "0"),
            title: isUntitled ? "Untitled" : withoutDashes(rawTitle),
            isUntitled,
            sourceRef: isUntitled && rawTitle ? rawTitle : null,
            year: clean(r.year),
            medium: clean(r.medium),
            materials: clean(r.materials),
            series: clean(r.series),
            dimensions: formatDimensions(r),
            description: publicNote(clean(r.description)),
            images: paths.map(publicUrl),
            availability,
            price: money(r.price),
            currency: r.currency?.trim() || "USD",
            priceUponRequest: Boolean(r.price_upon_request),
            sortOrder: r.sort_order ?? 0,
        };
    });

    return numbered
        .sort((a, b) => a.sortOrder - b.sortOrder || b.number - a.number)
        .map(({ sortOrder, ...offer }) => {
            void sortOrder;
            return offer;
        });
});

export async function getShelf(shelf: Shelf): Promise<Offer[]> {
    const inventory = await getInventory();
    return inventory.filter((work) => work.availability === shelf);
}

export async function getRoom(slug: string) {
    const inventory = await getInventory();
    const work = inventory.find((entry) => entry.slug === slug || entry.id === slug);
    if (!work) return null;
    const shelf = inventory.filter((entry) => entry.availability === work.availability);
    return { work, shelf };
}
