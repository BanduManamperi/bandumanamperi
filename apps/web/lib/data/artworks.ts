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
    /** The series record, once the series migration has run: for links, numbering and its description */
    seriesInfo: { slug: string; name: string; number: number | null } | null;
    category: string | null;
    dimensions: string | null;
    /** The work's own description */
    description: string | null;
    /** The series description, shown when the work has none of its own */
    seriesDescription: string | null;
    /** This work is an edition or version of another */
    relation: { type: "edition" | "version"; number: number | null; editionSize: number | null; originalId: string } | null;
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
    // Present once database-schema-series.sql has run
    series_id?: string | null;
    series_number?: number | null;
    parent_artwork_id?: string | null;
    relation_type?: "edition" | "version" | null;
    relation_number?: number | null;
    edition_size?: number | null;
    source_filename?: string | null;
};

export type SeriesRecord = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    coverImage: string | null;
    sortOrder: number;
};

const BASE_COLUMNS =
    "id, title, slug, year, medium, series, category, description, width, height, depth, unit, media, thumbnail_path, sort_order, created_at";
const SERIES_COLUMNS = "series_id, series_number, parent_artwork_id, relation_type, relation_number, edition_size, source_filename";

/** Postgres "undefined column" / "undefined table": the series migration hasn't run yet. */
function isMissingSchema(error: { code?: string } | null): boolean {
    return error?.code === "42703" || error?.code === "42P01" || error?.code === "PGRST204" || error?.code === "PGRST205";
}

/** Published series, or none if the series table doesn't exist yet. */
export const getSeriesRecords = cache(async (): Promise<SeriesRecord[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("series")
        .select("id, name, slug, description, cover_image, sort_order")
        .eq("status", "published")
        .order("sort_order", { ascending: true });
    if (error) {
        if (!isMissingSchema(error)) console.error("Error loading series:", error);
        return [];
    }
    return (data ?? []).map((s) => ({
        id: s.id,
        name: withoutDashes(s.name),
        slug: s.slug,
        description: s.description?.trim() || null,
        coverImage: s.cover_image,
        sortOrder: s.sort_order ?? 0,
    }));
});

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
    const query = (columns: string) =>
        supabase.from("artworks").select(columns).eq("status", "published").order("created_at", { ascending: true });

    // Ask for the series columns; fall back to the old shape if the migration hasn't run
    let { data, error } = await query(`${BASE_COLUMNS}, ${SERIES_COLUMNS}`);
    if (isMissingSchema(error)) ({ data, error } = await query(BASE_COLUMNS));
    const seriesById = new Map((await getSeriesRecords()).map((s) => [s.id, s]));

    if (error || !data) {
        console.error("Error loading catalogue:", error);
        return [];
    }

    const publicUrl = (path: string) =>
        path.startsWith("http") ? path : supabase.storage.from("artworks").getPublicUrl(path).data.publicUrl;

    const rows = data as unknown as ArtworkRow[];
    const editionSizeOf = new Map(rows.map((r) => [r.id, r.edition_size ?? null]));

    const numbered = rows.map((r, i) => {
        const rawTitle = r.title?.trim() ?? "";
        const isUntitled = !rawTitle || CAMERA_FILE.test(rawTitle);
        const paths = [...(r.media ?? [])];
        if (r.thumbnail_path && !paths.includes(r.thumbnail_path)) paths.unshift(r.thumbnail_path);
        const year = clean(r.year);
        const seriesRecord = r.series_id ? seriesById.get(r.series_id) ?? null : null;
        const cameraRef = isUntitled && rawTitle && CAMERA_FILE.test(rawTitle) ? rawTitle : null;

        return {
            id: r.id,
            number: i + 1,
            label: String(i + 1).padStart(3, "0"),
            href: `/artworks/${r.slug || r.id}`,
            title: isUntitled ? "Untitled" : withoutDashes(rawTitle),
            isUntitled,
            // The CMS keeps the camera file name; older works only have it as their title
            sourceRef: r.source_filename?.trim() || cameraRef,
            year,
            date: year ?? "n.d.",
            medium: clean(r.medium),
            series: seriesRecord?.name ?? clean(r.series),
            seriesInfo: seriesRecord ? { slug: seriesRecord.slug, name: seriesRecord.name, number: r.series_number ?? null } : null,
            category: clean(r.category),
            dimensions: formatDimensions(r),
            description: clean(r.description),
            seriesDescription: seriesRecord?.description ? withoutDashes(seriesRecord.description) : null,
            relation:
                r.parent_artwork_id && r.relation_type
                    ? {
                          type: r.relation_type,
                          number: r.relation_number ?? null,
                          editionSize: editionSizeOf.get(r.parent_artwork_id) ?? null,
                          originalId: r.parent_artwork_id,
                      }
                    : null,
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

/** "Edition 2 of 5", "Version 2", or null for an independent work. */
export function relationLabel(entry: CatalogueEntry): string | null {
    if (!entry.relation) return null;
    const { type, number, editionSize } = entry.relation;
    if (type === "version") return number ? `Version ${number}` : "Version";
    return `Edition${number ? ` ${number}` : ""}${editionSize ? ` of ${editionSize}` : ""}`;
}

/** The description to show: the work's own, else its series'. */
export function displayDescription(entry: CatalogueEntry): string | null {
    return entry.description ?? entry.seriesDescription;
}

/** Works related to this one: its original, the original's other editions/versions, and its series. */
export async function getRelatedWorks(entry: CatalogueEntry) {
    const catalogue = await getCatalogue();
    const originalId = entry.relation?.originalId ?? entry.id;
    const family = catalogue.filter(
        (e) => e.id !== entry.id && (e.id === originalId || e.relation?.originalId === originalId)
    );
    const seriesMates = entry.seriesInfo
        ? catalogue
              .filter((e) => e.id !== entry.id && e.seriesInfo?.slug === entry.seriesInfo!.slug && !family.includes(e))
              .sort((a, b) => (a.seriesInfo?.number ?? Infinity) - (b.seriesInfo?.number ?? Infinity) || a.number - b.number)
        : [];
    return { family, seriesMates };
}

/** A published series and its works in series order, or null. */
export async function getSeriesWithWorks(slug: string) {
    const series = (await getSeriesRecords()).find((s) => s.slug === slug);
    if (!series) return null;
    const works = (await getCatalogue())
        .filter((e) => e.seriesInfo?.slug === slug)
        .sort((a, b) => (a.seriesInfo?.number ?? Infinity) - (b.seriesInfo?.number ?? Infinity) || a.number - b.number);
    return { series, works };
}
