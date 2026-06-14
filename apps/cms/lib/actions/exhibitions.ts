"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/verify-auth"
import { parseSupabaseError, AppError, ErrorType, ErrorMessages, logError } from "@/lib/utils/error-handler"
import type { Artwork, ArtworkDB, ExhibitionHistory, ExhibitionType } from "@/lib/types/artwork"
import {
    buildExhibitionSchedulePayload,
    exhibitionsMatch,
    formatExhibitionSchedule,
    getExhibitionIdentityKey,
    sortExhibitionsForDisplay,
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

function transformArtwork(artwork: ArtworkDB): Artwork {
    return {
        id: artwork.id,
        title: artwork.title,
        year: artwork.year,
        description: artwork.description,
        link: artwork.link,
        featured: artwork.featured,
        category: artwork.category,
        medium: artwork.medium,
        width: artwork.width,
        height: artwork.height,
        depth: artwork.depth,
        unit: artwork.unit,
        slug: artwork.slug,
        status: artwork.status,
        tags: artwork.tags,
        series: artwork.series,
        materials: artwork.materials,
        technique: artwork.technique,
        location: artwork.location,
        availability: artwork.availability,
        price: artwork.price,
        currency: artwork.currency,
        priceUponRequest: artwork.price_upon_request,
        collectorName: artwork.collector_name,
        sortOrder: artwork.sort_order,
        thumbnailPath: artwork.thumbnail_path,
        artistNotes: artwork.artist_notes,
        dateCreated: artwork.date_created,
        exhibitionHistory: artwork.exhibition_history,
        viewsCount: artwork.views_count,
        media: artwork.media,
        createdAt: artwork.created_at,
        updatedAt: artwork.updated_at,
    }
}

function mapExhibitionFields(
    raw: Partial<ExhibitionHistory> & {
        name?: string
        venue?: string
        about?: string
        curator?: string
        coverImage?: string | null
        exhibitionImages?: string[]
        type?: string
        otherArtists?: string | null
        highlightOnHomepage?: boolean
    }
): Pick<
    Exhibition,
    | "name"
    | "venue"
    | "about"
    | "curator"
    | "dates"
    | "startDate"
    | "endDate"
    | "startTime"
    | "endTime"
    | "coverImage"
    | "exhibitionImages"
    | "type"
    | "otherArtists"
    | "highlightOnHomepage"
> {
    const schedule = {
        startDate: raw.startDate ?? null,
        endDate: raw.endDate ?? null,
        startTime: raw.startTime ?? null,
        endTime: raw.endTime ?? null,
        dates: raw.dates ?? null,
    }

    return {
        name: raw.name || "",
        venue: raw.venue || "",
        about: raw.about || "",
        curator: raw.curator || "",
        startDate: raw.startDate || "",
        endDate: raw.endDate ?? null,
        startTime: raw.startTime ?? null,
        endTime: raw.endTime ?? null,
        dates: raw.dates ?? formatExhibitionSchedule(schedule),
        coverImage: raw.coverImage ?? null,
        exhibitionImages: raw.exhibitionImages || [],
        type: (raw.type as ExhibitionType) || "solo",
        otherArtists: raw.otherArtists ?? null,
        highlightOnHomepage: raw.highlightOnHomepage === true,
    }
}

function rowToExhibition(row: StandaloneExhibitionRow): Exhibition {
    return {
        id: row.id,
        isStandalone: true,
        ...mapExhibitionFields({
            name: row.name,
            venue: row.venue,
            about: row.about,
            curator: row.curator,
            startDate: row.start_date || undefined,
            endDate: row.end_date,
            startTime: row.start_time,
            endTime: row.end_time,
            dates: row.dates || undefined,
            coverImage: row.cover_image,
            exhibitionImages: row.exhibition_images || [],
            type: row.type as ExhibitionType,
            otherArtists: row.other_artists,
            highlightOnHomepage: row.highlight_on_homepage,
        }),
        artworks: [],
    }
}

function standaloneInsertPayload(exhibition: Omit<ExhibitionHistory, "id">) {
    const schedule = buildExhibitionSchedulePayload({
        startDate: exhibition.startDate,
        endDate: exhibition.endDate || undefined,
        startTime: exhibition.startTime || undefined,
        endTime: exhibition.endTime || undefined,
    })

    return {
        name: exhibition.name.trim(),
        venue: exhibition.venue.trim(),
        about: exhibition.about?.trim() ?? "",
        curator: exhibition.curator?.trim() ?? "",
        dates: schedule.dates,
        start_date: schedule.startDate,
        end_date: schedule.endDate,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        cover_image: exhibition.coverImage,
        exhibition_images: exhibition.exhibitionImages ?? [],
        type: exhibition.type,
        other_artists: exhibition.otherArtists,
        highlight_on_homepage: exhibition.highlightOnHomepage === true,
        status: "published",
    }
}

function standaloneUpdatePayload(exhibition: ExhibitionHistory) {
    const schedule = buildExhibitionSchedulePayload({
        startDate: exhibition.startDate,
        endDate: exhibition.endDate || undefined,
        startTime: exhibition.startTime || undefined,
        endTime: exhibition.endTime || undefined,
    })

    return {
        name: exhibition.name.trim(),
        venue: exhibition.venue.trim(),
        about: exhibition.about?.trim() ?? "",
        curator: exhibition.curator?.trim() ?? "",
        dates: schedule.dates,
        start_date: schedule.startDate,
        end_date: schedule.endDate,
        start_time: schedule.startTime,
        end_time: schedule.endTime,
        cover_image: exhibition.coverImage,
        exhibition_images: exhibition.exhibitionImages ?? [],
        type: exhibition.type,
        other_artists: exhibition.otherArtists,
        highlight_on_homepage: exhibition.highlightOnHomepage === true,
    }
}

function validateExhibitionFields(exhibition: Omit<ExhibitionHistory, "id">): void {
    if (!exhibition.name || !exhibition.name.trim()) {
        throw new AppError(
            ErrorType.REQUIRED_FIELD,
            "Exhibition name is required.",
            "Missing exhibition name"
        )
    }

    if (!exhibition.venue || !exhibition.venue.trim()) {
        throw new AppError(
            ErrorType.REQUIRED_FIELD,
            "Exhibition venue is required.",
            "Missing exhibition venue"
        )
    }

    if (!exhibition.startDate && !exhibition.dates) {
        throw new AppError(
            ErrorType.REQUIRED_FIELD,
            "Exhibition start date is required.",
            "Missing exhibition start date"
        )
    }

    if (exhibition.endDate && exhibition.startDate && exhibition.endDate < exhibition.startDate) {
        throw new AppError(
            ErrorType.VALIDATION_ERROR,
            "End date must be on or after the start date.",
            "Invalid exhibition date range"
        )
    }

    if (
        exhibition.type === "group" &&
        (!exhibition.curator || !exhibition.curator.trim())
    ) {
        throw new AppError(
            ErrorType.REQUIRED_FIELD,
            "Curator is required for group exhibitions.",
            "Missing exhibition curator"
        )
    }
}

async function fetchStandaloneExhibitionRows(
    supabase: Awaited<ReturnType<typeof createClient>>,
    options?: { publishedOnly?: boolean }
): Promise<StandaloneExhibitionRow[]> {
    let query = supabase.from(STANDALONE_EXHIBITIONS_TABLE).select("*")

    if (options?.publishedOnly) {
        query = query.eq("status", "published")
    }

    const { data, error } = await query.order("updated_at", { ascending: false })

    if (error) {
        if (error.code === "42P01" || error.code === "PGRST205") {
            return []
        }

        throw error
    }

    return (data as StandaloneExhibitionRow[]) || []
}

async function countArtworksWithExhibition(
    supabase: Awaited<ReturnType<typeof createClient>>,
    exhibition: ExhibitionHistory
): Promise<number> {
    const { data, error } = await supabase
        .from("artworks")
        .select("exhibition_history")
        .not("exhibition_history", "is", null)

    if (error) {
        throw error
    }

    let count = 0

    for (const artwork of data || []) {
        const history = (artwork.exhibition_history as ExhibitionHistory[]) || []
        if (history.some((entry) => exhibitionsMatch(entry, exhibition))) {
            count++
        }
    }

    return count
}

async function ensureStandaloneIfNoLinkedArtworks(
    supabase: Awaited<ReturnType<typeof createClient>>,
    exhibition: ExhibitionHistory
): Promise<void> {
    const linkedCount = await countArtworksWithExhibition(supabase, exhibition)
    if (linkedCount > 0) {
        return
    }

    const existing = await fetchStandaloneExhibitionRows(supabase)
    if (existing.some((row) => exhibitionsMatch(row, exhibition))) {
        return
    }

    const { error } = await supabase
        .from(STANDALONE_EXHIBITIONS_TABLE)
        .insert(standaloneInsertPayload(exhibition))

    if (error && error.code !== "42P01" && error.code !== "PGRST205") {
        throw error
    }
}

function revalidateExhibitionPaths() {
    revalidatePath("/protected/artworks")
    revalidatePath("/protected/exhibitions")
    revalidatePath("/api/artworks")
    revalidatePath("/api/exhibitions")
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
    type: string
    otherArtists: string | null
    highlightOnHomepage?: boolean
    artworks: Artwork[]
}

/**
 * Get all exhibitions from artworks' exhibition_history and standalone records.
 */
export async function getExhibitions(): Promise<Exhibition[]> {
    try {
        await requireAuth()

        const supabase = await createClient()

        const { data, error } = await supabase
            .from("artworks")
            .select("*")
            .not("exhibition_history", "is", null)
            .order("updated_at", { ascending: false })

        if (error) {
            const appError = parseSupabaseError(error, "fetch", "Exhibitions")
            logError(appError, { operation: "getExhibitions" })
            throw appError
        }

        const exhibitionsMap = new Map<string, Exhibition>()

        data?.forEach((artworkDB) => {
            const artwork = transformArtwork(artworkDB)
            const exhibitions = artwork.exhibitionHistory || []

            exhibitions.forEach((exhibition) => {
                const fields = mapExhibitionFields(exhibition)
                const key = getExhibitionIdentityKey(fields)

                if (exhibitionsMap.has(key)) {
                    exhibitionsMap.get(key)!.artworks.push(artwork)
                } else {
                    exhibitionsMap.set(key, {
                        ...fields,
                        artworks: [artwork],
                    })
                }
            })
        })

        const standaloneRows = await fetchStandaloneExhibitionRows(supabase)
        for (const row of standaloneRows) {
            const key = getExhibitionIdentityKey(row)
            if (!exhibitionsMap.has(key)) {
                exhibitionsMap.set(key, rowToExhibition(row))
            }
        }

        return sortExhibitionsForDisplay(Array.from(exhibitionsMap.values()))
    } catch (error) {
        if (error instanceof AppError) throw error

        logError(error, { operation: "getExhibitions" })
        throw new AppError(
            ErrorType.DATABASE_ERROR,
            ErrorMessages.FETCH_FAILED,
            error instanceof Error ? error.message : "Unknown error"
        )
    }
}

function normalizeExhibitionInput(
    exhibition: Omit<ExhibitionHistory, "id">
): ExhibitionHistory {
    if (exhibition.startDate) {
        const schedule = buildExhibitionSchedulePayload({
            startDate: exhibition.startDate,
            endDate: exhibition.endDate || undefined,
            startTime: exhibition.startTime || undefined,
            endTime: exhibition.endTime || undefined,
        })

        return {
            ...exhibition,
            ...schedule,
        }
    }

    return exhibition as ExhibitionHistory
}

/**
 * Create an exhibition, optionally linked to artworks.
 */
export async function addExhibitionToArtworks(
    artworkIds: string[],
    exhibition: Omit<ExhibitionHistory, "id">
): Promise<void> {
    try {
        await requireAuth()
        validateExhibitionFields(exhibition)
        const normalizedExhibition = normalizeExhibitionInput(exhibition)

        const supabase = await createClient()

        if (!artworkIds || artworkIds.length === 0) {
            const { error } = await supabase
                .from(STANDALONE_EXHIBITIONS_TABLE)
                .insert(standaloneInsertPayload(normalizedExhibition))

            if (error) {
                if (error.code === "42P01" || error.code === "PGRST205") {
                    throw new AppError(
                        ErrorType.DATABASE_ERROR,
                        "Standalone exhibitions table is missing. Run the standalone exhibitions migration in Supabase.",
                        error.message
                    )
                }

                const appError = parseSupabaseError(error, "create", "Exhibition")
                logError(appError, { operation: "addExhibitionToArtworks", additionalInfo: { exhibition } })
                throw appError
            }

            revalidateExhibitionPaths()
            return
        }

        const errors: string[] = []
        let successCount = 0

        for (const artworkId of artworkIds) {
            const { data: artwork, error: fetchError } = await supabase
                .from("artworks")
                .select("exhibition_history")
                .eq("id", artworkId)
                .single()

            if (fetchError) {
                errors.push(`Artwork ${artworkId}: ${fetchError.message}`)
                logError(fetchError, { operation: "addExhibitionToArtworks", additionalInfo: { artworkId } })
                continue
            }

            const currentHistory = (artwork.exhibition_history as ExhibitionHistory[]) || []
            const existingIndex = currentHistory.findIndex((entry) =>
                exhibitionsMatch(entry, normalizedExhibition)
            )

            if (existingIndex === -1) {
                const updatedHistory = [...currentHistory, normalizedExhibition]

                const { error: updateError } = await supabase
                    .from("artworks")
                    .update({ exhibition_history: updatedHistory })
                    .eq("id", artworkId)

                if (updateError) {
                    errors.push(`Artwork ${artworkId}: ${updateError.message}`)
                    logError(updateError, { operation: "addExhibitionToArtworks", additionalInfo: { artworkId } })
                } else {
                    successCount++
                }
            } else {
                successCount++
            }
        }

        if (successCount === 0 && errors.length > 0) {
            throw new AppError(
                ErrorType.UPDATE_FAILED,
                `Failed to add exhibition to artworks. ${errors.length} error(s) occurred.`,
                errors.join("; ")
            )
        }

        revalidateExhibitionPaths()
    } catch (error) {
        if (error instanceof AppError) throw error

        logError(error, { operation: "addExhibitionToArtworks", additionalInfo: { artworkIds, exhibition } })
        throw new AppError(
            ErrorType.UPDATE_FAILED,
            "Failed to add exhibition. Please try again.",
            error instanceof Error ? error.message : "Unknown error"
        )
    }
}

/**
 * Update an exhibition on artworks and/or as a standalone record.
 */
export async function updateExhibition(
    oldExhibition: ExhibitionHistory,
    newExhibition: ExhibitionHistory,
    options?: { standaloneId?: string }
): Promise<void> {
    try {
        await requireAuth()
        validateExhibitionFields(newExhibition)
        const normalizedExhibition = normalizeExhibitionInput(newExhibition)

        const supabase = await createClient()

        if (options?.standaloneId) {
            const { error } = await supabase
                .from(STANDALONE_EXHIBITIONS_TABLE)
                .update(standaloneUpdatePayload(normalizedExhibition))
                .eq("id", options.standaloneId)

            if (error) {
                const appError = parseSupabaseError(error, "update", "Exhibition")
                logError(appError, {
                    operation: "updateExhibition",
                    additionalInfo: { standaloneId: options.standaloneId, newExhibition },
                })
                throw appError
            }

            revalidateExhibitionPaths()
            return
        }

        const { data, error } = await supabase
            .from("artworks")
            .select("*")
            .not("exhibition_history", "is", null)

        if (error) {
            const appError = parseSupabaseError(error, "fetch", "Exhibition artworks")
            logError(appError, { operation: "updateExhibition", additionalInfo: { oldExhibition, newExhibition } })
            throw appError
        }

        const errors: string[] = []
        let successCount = 0

        for (const artworkDB of data || []) {
            const currentHistory = (artworkDB.exhibition_history as ExhibitionHistory[]) || []
            const updatedHistory = currentHistory.map((entry) =>
                exhibitionsMatch(entry, oldExhibition) ? normalizedExhibition : entry
            )

            if (updatedHistory.some((entry, index) => entry !== currentHistory[index])) {
                const { error: updateError } = await supabase
                    .from("artworks")
                    .update({ exhibition_history: updatedHistory })
                    .eq("id", artworkDB.id)

                if (updateError) {
                    errors.push(`Artwork ${artworkDB.id}: ${updateError.message}`)
                    logError(updateError, { operation: "updateExhibition", additionalInfo: { artworkId: artworkDB.id } })
                } else {
                    successCount++
                }
            }
        }

        if (successCount === 0 && errors.length > 0) {
            throw new AppError(
                ErrorType.UPDATE_FAILED,
                ErrorMessages.EXHIBITION_UPDATE_FAILED,
                errors.join("; ")
            )
        }

        revalidateExhibitionPaths()
    } catch (error) {
        if (error instanceof AppError) throw error

        logError(error, { operation: "updateExhibition", additionalInfo: { oldExhibition, newExhibition } })
        throw new AppError(
            ErrorType.UPDATE_FAILED,
            ErrorMessages.EXHIBITION_UPDATE_FAILED,
            error instanceof Error ? error.message : "Unknown error"
        )
    }
}

/**
 * Delete an exhibition from artworks and/or standalone storage.
 */
export async function deleteExhibition(
    exhibition: ExhibitionHistory,
    options?: { standaloneId?: string }
): Promise<void> {
    try {
        await requireAuth()

        if (!exhibition.name || !exhibition.venue || (!exhibition.startDate && !exhibition.dates)) {
            throw new AppError(
                ErrorType.REQUIRED_FIELD,
                "Exhibition identification (name, venue, dates) is required.",
                "Missing exhibition identification"
            )
        }

        const supabase = await createClient()

        if (options?.standaloneId) {
            const { error } = await supabase
                .from(STANDALONE_EXHIBITIONS_TABLE)
                .delete()
                .eq("id", options.standaloneId)

            if (error) {
                const appError = parseSupabaseError(error, "delete", "Exhibition")
                logError(appError, { operation: "deleteExhibition", additionalInfo: { standaloneId: options.standaloneId } })
                throw appError
            }

            revalidateExhibitionPaths()
            return
        }

        const { data, error } = await supabase
            .from("artworks")
            .select("*")
            .not("exhibition_history", "is", null)

        if (error) {
            const appError = parseSupabaseError(error, "fetch", "Exhibition artworks")
            logError(appError, { operation: "deleteExhibition", additionalInfo: { exhibition } })
            throw appError
        }

        const errors: string[] = []
        let successCount = 0

        for (const artworkDB of data || []) {
            const currentHistory = (artworkDB.exhibition_history as ExhibitionHistory[]) || []
            const updatedHistory = currentHistory.filter(
                (entry) => !exhibitionsMatch(entry, exhibition)
            )

            if (updatedHistory.length !== currentHistory.length) {
                const { error: updateError } = await supabase
                    .from("artworks")
                    .update({ exhibition_history: updatedHistory })
                    .eq("id", artworkDB.id)

                if (updateError) {
                    errors.push(`Artwork ${artworkDB.id}: ${updateError.message}`)
                    logError(updateError, { operation: "deleteExhibition", additionalInfo: { artworkId: artworkDB.id } })
                } else {
                    successCount++
                }
            }
        }

        if (successCount === 0 && errors.length > 0) {
            throw new AppError(
                ErrorType.DELETE_FAILED,
                ErrorMessages.EXHIBITION_DELETE_FAILED,
                errors.join("; ")
            )
        }

        revalidateExhibitionPaths()
    } catch (error) {
        if (error instanceof AppError) throw error

        logError(error, { operation: "deleteExhibition", additionalInfo: { exhibition } })
        throw new AppError(
            ErrorType.DELETE_FAILED,
            ErrorMessages.EXHIBITION_DELETE_FAILED,
            error instanceof Error ? error.message : "Unknown error"
        )
    }
}

export async function deleteStandaloneExhibition(id: string): Promise<void> {
    await requireAuth()

    const supabase = await createClient()
    const { error } = await supabase.from(STANDALONE_EXHIBITIONS_TABLE).delete().eq("id", id)

    if (error) {
        throw new AppError(
            ErrorType.DELETE_FAILED,
            ErrorMessages.EXHIBITION_DELETE_FAILED,
            error.message
        )
    }

    revalidateExhibitionPaths()
}

/**
 * Remove artworks from an exhibition
 */
export async function removeArtworksFromExhibition(
    artworkIds: string[],
    exhibition: ExhibitionHistory
): Promise<void> {
    await requireAuth()

    const supabase = await createClient()

    if (artworkIds.length === 0) {
        throw new Error("No artworks selected")
    }

    for (const artworkId of artworkIds) {
        const { data: artwork, error: fetchError } = await supabase
            .from("artworks")
            .select("exhibition_history")
            .eq("id", artworkId)
            .single()

        if (fetchError) {
            console.error(`Failed to fetch artwork ${artworkId}:`, fetchError)
            continue
        }

        const currentHistory = (artwork.exhibition_history as ExhibitionHistory[]) || []
        const updatedHistory = currentHistory.filter(
            (entry) => !exhibitionsMatch(entry, exhibition)
        )

        const { error: updateError } = await supabase
            .from("artworks")
            .update({ exhibition_history: updatedHistory })
            .eq("id", artworkId)

        if (updateError) {
            console.error(`Failed to update artwork ${artworkId}:`, updateError)
        }
    }

    await ensureStandaloneIfNoLinkedArtworks(supabase, exhibition)
    revalidateExhibitionPaths()
}
