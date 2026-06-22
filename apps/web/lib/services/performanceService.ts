import { supabase } from "@/lib/supabase/client";

export interface PerformanceItem {
    id: string;
    title: string;
    description: string | null;
    venue: string | null;
    location: string | null;
    date: string | null;
    duration: string | null;
    type: string;
    cover_image: string | null;
    coverImageUrl: string | null;
    video_url: string | null;
    slug: string | null;
    status: string;
    featured: boolean;
    sort_order: number;
}

function getCoverImageUrl(path: string | null): string | null {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const { data } = supabase.storage.from("performances").getPublicUrl(path);
    return data.publicUrl || null;
}

export async function getPublishedPerformances(): Promise<PerformanceItem[]> {
    try {
        const { data, error } = await supabase
            .from("performances")
            .select(
                "id, title, description, venue, location, date, duration, type, cover_image, video_url, slug, status, featured, sort_order"
            )
            .eq("status", "published")
            .order("sort_order", { ascending: true })
            .order("date", { ascending: false });

        if (error || !data) return [];

        return data.map((p) => ({
            ...p,
            coverImageUrl: getCoverImageUrl(p.cover_image),
        }));
    } catch {
        return [];
    }
}
