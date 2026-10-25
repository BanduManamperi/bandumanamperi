import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { withoutDashes } from "@/lib/text";

/** How many of the most recently added works /artworks shows; the rest live in /archive. */
export const LATEST_COUNT = 15;

export type CatalogueEntry = {
    id: string;
    /** Position in order of entry, oldest first. Stable as long as works aren't deleted. */
    number: number;
    /** "038": the number as printed. */
    label: string;
    href: string;
    title: string;
    isUntitled: boolean;
    /** The original file name when the title is only a camera file name (archival "Ref."). */
    sourceRef: string | null;
    /** Year as given, or null when undated. */
    year: string | null;
    /** "2022" or "n.d." */
    date: string;
    medium: string | null;
    series: string | null;
    category: string | null;
    dimensions: string | null;
    description: string | null;
    images: string[];
    /** Where the work sits: among the latest works or in the archive. */
    shelf: "latest" | "archive";
};

type ArtworkRow = {
    id: string;
    title: string | null;
    slug: string | null;
    year: string | null;
    medium: string | null;
    series: string | null;
    category: string | null;
    description: string | null;
    width: number | null;
    height: number | null;
    depth: number | null;
    unit: string | null;
    media: string[] | null;
    thumbnail_path: string | null;
    sort_order: number | null;
    created_at: string;
};

const CAMERA_FILE = /^IMG[_\s-]?\d*$/i;

function clean(value: string | null | undefined): string | null {
    const v = value?.trim();
    return v ? withoutDashes(v) : null;
}

function formatDimensions(r: ArtworkRow): string | null {
    const sides = [r.height, r.width, r.depth].filter((n): n is number => typeof n === "number" && n > 0);
    if (sides.length < 2) return null;
    return `${sides.join(" × ")} ${r.unit ?? "cm"}`;
}

/**
 * Every published work, newest first, numbered in order of entry.
 * Cached per request so the list, archive and detail pages share one query.
 */
export const getCatalogue = cache(async (): Promise<CatalogueEntry[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("artworks")
        .select("id, title, slug, year, medium, series, category, description, width, height, depth, unit, media, thumbnail_path, sort_order, created_at")
        .eq("status", "published")
        .order("created_at", { ascending: true });

    if (error || !data) {
        console.error("Error loading catalogue:", error);
        return [];
    }

    const publicUrl = (path: string) =>
        path.startsWith("http") ? path : supabase.storage.from("artworks").getPublicUrl(path).data.publicUrl;

    const numbered = (data as ArtworkRow[]).map((r, i) => {
        const rawTitle = r.title?.trim() ?? "";
        const isUntitled = !rawTitle || CAMERA_FILE.test(rawTitle);
        const paths = [...(r.media ?? [])];
        if (r.thumbnail_path && !paths.includes(r.thumbnail_path)) paths.unshift(r.thumbnail_path);
        const year = clean(r.year);

        return {
            id: r.id,
            number: i + 1,
            label: String(i + 1).padStart(3, "0"),
            href: `/artworks/${r.slug || r.id}`,
            title: isUntitled ? "Untitled" : withoutDashes(rawTitle),
            isUntitled,
            sourceRef: isUntitled && rawTitle ? rawTitle : null,
            year,
            date: year ?? "n.d.",
            medium: clean(r.medium),
            series: clean(r.series),
            category: clean(r.category),
            dimensions: formatDimensions(r),
            description: clean(r.description),
            images: paths.map(publicUrl),
            sortOrder: r.sort_order ?? 0,
        };
    });

    // Newest first; a curator-set sort_order (lower first) still wins over recency.
    const ordered = numbered.sort((a, b) => a.sortOrder - b.sortOrder || b.number - a.number);

    return ordered.map((entry, i) => {
        const { sortOrder, ...rest } = entry;
        void sortOrder;
        return { ...rest, shelf: i < LATEST_COUNT ? "latest" : "archive" };
    });
});

/** One work plus its neighbours on the same shelf, for previous/next links. */
export async function getCatalogueEntry(slugOrId: string) {
    const catalogue = await getCatalogue();
    const entry = catalogue.find((e) => e.id === slugOrId || e.href === `/artworks/${slugOrId}`);
    if (!entry) return null;

    const shelf = catalogue.filter((e) => e.shelf === entry.shelf);
    const i = shelf.indexOf(entry);
    return {
        entry,
        previous: shelf[i - 1] ?? null,
        next: shelf[i + 1] ?? null,
        position: i + 1,
        shelfSize: shelf.length,
    };
}
