"use server"

import { createClient } from "@/lib/supabase/server"
import type { Artwork } from "@/lib/types/artwork"
import {
    formatExhibitionSchedule,
    getExhibitionIdentityKey,
    getExhibitionScheduleStatus,
    isExhibitionInHomepageEventsWindow,
    sortExhibitionsForDisplay,
    sortHomepageEventsExhibitions,
} from "@bandumanamperi/types"

const STANDALONE_EXHIBITIONS_TABLE = "standalone_exhibitions"

interface StandaloneExhibitionRow {
    id: string
    name: string
    venue: string
    about: string
    curator: string
    dates: string | null
    start_date: string | null
    end_date: string | null
    start_time: string | null
    end_time: string | null
    cover_image: string | null
    exhibition_images: string[] | null
    type: string
    other_artists: string | null
    highlight_on_homepage: boolean
    status: string
}

function mapExhibitionFromHistory(raw: Record<string, unknown>, artwork: Artwork): Exhibition {
    const schedule = {
        startDate: (raw.startDate as string | undefined) ?? null,
        endDate: (raw.endDate as string | null | undefined) ?? null,
        startTime: (raw.startTime as string | null | undefined) ?? null,
        endTime: (raw.endTime as string | null | undefined) ?? null,
        dates: (raw.dates as string | undefined) ?? null,
    }

    return {
        name: String(raw.name || ""),
        venue: String(raw.venue || ""),
        about: String(raw.about || ""),
        curator: String(raw.curator || ""),
        startDate: String(raw.startDate || ""),
        endDate: (raw.endDate as string | null | undefined) ?? null,
        startTime: (raw.startTime as string | null | undefined) ?? null,
        endTime: (raw.endTime as string | null | undefined) ?? null,
        dates: schedule.dates ?? formatExhibitionSchedule(schedule),
        coverImage: (raw.coverImage as string | null) || null,
        exhibitionImages: (raw.exhibitionImages as string[]) || [],
        type: (raw.type as "solo" | "group" | "online") || "solo",
        otherArtists: (raw.otherArtists as string | null) || null,
        highlightOnHomepage: raw.highlightOnHomepage === true,
        artworks: [artwork],
    }
}

function rowToExhibition(row: StandaloneExhibitionRow): Exhibition {
    const schedule = {
        startDate: row.start_date,
        endDate: row.end_date,
        startTime: row.start_time,
        endTime: row.end_time,
        dates: row.dates,
    }

    return {
        id: row.id,
        isStandalone: true,
        name: row.name,
        venue: row.venue,
        about: row.about,
        curator: row.curator,
        startDate: row.start_date || "",
        endDate: row.end_date,
        startTime: row.start_time,
        endTime: row.end_time,
        dates: row.dates ?? formatExhibitionSchedule(schedule),
        coverImage: row.cover_image,
        exhibitionImages: row.exhibition_images || [],
        type: (row.type as "solo" | "group" | "online") || "solo",
        otherArtists: row.other_artists,
        highlightOnHomepage: row.highlight_on_homepage === true,
        artworks: [],
    }
}

async function fetchPublishedStandaloneExhibitions(
    supabase: Awaited<ReturnType<typeof createClient>>
): Promise<StandaloneExhibitionRow[]> {
    const { data, error } = await supabase
        .from(STANDALONE_EXHIBITIONS_TABLE)
        .select("*")
        .eq("status", "published")
        .order("updated_at", { ascending: false })

    if (error) {
        if (error.code === "42P01" || error.code === "PGRST205") {
            return []
        }

        console.error("Failed to fetch standalone exhibitions:", error)
        return []
    }

    return (data as StandaloneExhibitionRow[]) || []
}

export interface Exhibition {
    id?: string
    isStandalone?: boolean
    name: string
    venue: string
    about: string
    curator: string
    dates: string
    startDate: string
    endDate?: string | null
    startTime?: string | null
    endTime?: string | null
    coverImage: string | null
    exhibitionImages: string[]
    type: "solo" | "group" | "online"
    otherArtists: string | null
    highlightOnHomepage?: boolean
    artworks: Artwork[]
}

/**
 * Get all exhibitions from artworks' exhibition_history and standalone records.
 */
export async function getExhibitions(): Promise<Exhibition[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("artworks")
        .select("*")
        .not("exhibition_history", "is", null)
        .eq("status", "published")
        .order("updated_at", { ascending: false })

    if (error) {
        console.error("Failed to fetch exhibitions:", error)
        return []
    }

    const exhibitionsMap = new Map<string, Exhibition>()

    data?.forEach((artworkDB) => {
        const artwork = artworkDB as Artwork
        const exhibitions = (artworkDB.exhibition_history as Array<Record<string, unknown>>) || []

        exhibitions.forEach((exhibition) => {
            const mapped = mapExhibitionFromHistory(exhibition, artwork)
            const key = getExhibitionIdentityKey(mapped)

            if (exhibitionsMap.has(key)) {
                exhibitionsMap.get(key)!.artworks.push(artwork)
            } else {
                exhibitionsMap.set(key, mapped)
            }
        })
    })

    const standaloneRows = await fetchPublishedStandaloneExhibitions(supabase)
    for (const row of standaloneRows) {
        const mapped = rowToExhibition(row)
        const key = getExhibitionIdentityKey(mapped)
        if (!exhibitionsMap.has(key)) {
            exhibitionsMap.set(key, mapped)
        }
    }

    return sortExhibitionsForDisplay(Array.from(exhibitionsMap.values()))
}

/**
 * Exhibitions marked for the homepage banner (ongoing / highlighted).
 */
export async function getHighlightedExhibitions(): Promise<Exhibition[]> {
    const exhibitions = await getExhibitions()
    return exhibitions.filter(
        (exhibition) =>
            exhibition.highlightOnHomepage === true &&
            getExhibitionScheduleStatus(exhibition) !== "past"
    )
}

/**
 * Exhibitions for the homepage events section:
 * ongoing, upcoming, or ended within the past 6 months.
 */
export async function getUpcomingExhibitions(): Promise<Exhibition[]> {
    const exhibitions = await getExhibitions()
    return sortHomepageEventsExhibitions(
        exhibitions.filter((exhibition) =>
            isExhibitionInHomepageEventsWindow(exhibition)
        )
    )
}
