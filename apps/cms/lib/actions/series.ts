"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/verify-auth"
import { parseSupabaseError, AppError, ErrorType, ErrorMessages, logError } from "@/lib/utils/error-handler"
import { generateSlug } from "@/lib/utils/slug"
import type { ArtworkRelationType, Series, SeriesDB, SeriesInsert, SeriesUpdate } from "@bandumanamperi/types"

function transformSeries(row: SeriesDB): Series {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    coverImage: row.cover_image,
    sortOrder: row.sort_order,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function revalidateSeries() {
  revalidatePath("/protected/series")
  revalidatePath("/protected/artworks")
  revalidatePath("/api/artworks")
}

/** Titles and names compare ignoring case and extra spaces: "Wings  of certainty" = "Wings of Certainty" */
function normalise(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase()
}

export type SeriesSummary = Series & {
  workCount: number
  /** Up to four thumbnails, for the series card */
  previews: string[]
}

export type SeriesWork = {
  id: string
  title: string | null
  year: string | null
  status: string
  thumbnailPath: string | null
  seriesNumber: number | null
}

/** A work's main image. Older works saved from the form kept their images only in media. */
function mainImage(work: { thumbnail_path: string | null; media: string[] | null }): string | null {
  return work.thumbnail_path || work.media?.[0] || null
}

/** Every series with its number of works, newest first within sort order. Empty series included. */
export async function listSeries(): Promise<SeriesSummary[]> {
  await requireAuth()
  const supabase = await createClient()

  const [{ data: rows, error }, { data: works, error: worksError }] = await Promise.all([
    supabase.from("series").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
    supabase.from("artworks").select("series_id, thumbnail_path, media").not("series_id", "is", null),
  ])

  if (error || worksError) {
    const appError = parseSupabaseError(error ?? worksError, "fetch", "Series")
    logError(appError, { operation: "listSeries" })
    throw appError
  }

  return (rows as SeriesDB[]).map((row) => {
    const members = (works ?? []).filter((w) => w.series_id === row.id)
    return {
      ...transformSeries(row),
      workCount: members.length,
      previews: members.map(mainImage).filter((p): p is string => Boolean(p)).slice(0, 4),
    }
  })
}

/** One series and its works, in series order (numbered works first). */
export async function getSeries(id: string): Promise<{ series: Series; works: SeriesWork[] } | null> {
  await requireAuth()
  const supabase = await createClient()

  const { data: row, error } = await supabase.from("series").select("*").eq("id", id).maybeSingle()
  if (error) {
    const appError = parseSupabaseError(error, "fetch", "Series")
    logError(appError, { operation: "getSeries", additionalInfo: { id } })
    throw appError
  }
  if (!row) return null

  const { data: works } = await supabase
    .from("artworks")
    .select("id, title, year, status, thumbnail_path, media, series_number, created_at")
    .eq("series_id", id)
    .order("series_number", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true })

  return {
    series: transformSeries(row as SeriesDB),
    works: (works ?? []).map((w) => ({
      id: w.id,
      title: w.title,
      year: w.year,
      status: w.status,
      thumbnailPath: mainImage(w),
      seriesNumber: w.series_number,
    })),
  }
}

/** Create a series, empty or not. Names are unique ignoring case. */
export async function createSeries(input: SeriesInsert): Promise<Series> {
  try {
    await requireAuth()
    const name = input.name?.trim()
    if (!name) {
      throw new AppError(ErrorType.REQUIRED_FIELD, ErrorMessages.COLLECTION_NAME_REQUIRED, "Missing series name")
    }

    const supabase = await createClient()
    const base = generateSlug(name) || "series"
    const { data: taken } = await supabase.from("series").select("slug").like("slug", `${base}%`)
    const slugs = new Set((taken ?? []).map((r) => r.slug))
    let slug = base
    for (let n = 2; slugs.has(slug); n++) slug = `${base}-${n}`

    const { data, error } = await supabase
      .from("series")
      .insert({
        name,
        slug,
        description: input.description?.trim() || null,
        cover_image: input.coverImage ?? null,
        sort_order: input.sortOrder ?? 0,
        status: input.status ?? "published",
      })
      .select()
      .single()

    if (error) {
      if (error.code === "23505") {
        throw new AppError(ErrorType.DUPLICATE_ENTRY, ErrorMessages.SERIES_DUPLICATE_NAME, error.message)
      }
      const appError = parseSupabaseError(error, "create", "Series")
      logError(appError, { operation: "createSeries", additionalInfo: { input } })
      throw appError
    }

    revalidateSeries()
    return transformSeries(data as SeriesDB)
  } catch (error) {
    if (error instanceof AppError) throw error
    logError(error, { operation: "createSeries", additionalInfo: { input } })
    throw new AppError(ErrorType.CREATE_FAILED, ErrorMessages.COLLECTION_CREATE_FAILED, error instanceof Error ? error.message : "Unknown error")
  }
}

/** Edit a series. Renaming updates the series label on its works (done in the database). */
export async function updateSeries(input: SeriesUpdate): Promise<Series> {
  try {
    await requireAuth()
    const supabase = await createClient()

    const changes: Partial<SeriesDB> = {}
    if (input.name !== undefined) {
      const name = input.name.trim()
      if (!name) throw new AppError(ErrorType.REQUIRED_FIELD, ErrorMessages.COLLECTION_NAME_REQUIRED, "Missing series name")
      changes.name = name
    }
    if (input.description !== undefined) changes.description = input.description?.trim() || null
    if (input.coverImage !== undefined) changes.cover_image = input.coverImage
    if (input.sortOrder !== undefined) changes.sort_order = input.sortOrder
    if (input.status !== undefined) changes.status = input.status

    const { data, error } = await supabase.from("series").update(changes).eq("id", input.id).select().single()

    if (error) {
      if (error.code === "23505") {
        throw new AppError(ErrorType.DUPLICATE_ENTRY, ErrorMessages.SERIES_DUPLICATE_NAME, error.message)
      }
      const appError = parseSupabaseError(error, "update", "Series")
      logError(appError, { operation: "updateSeries", additionalInfo: { input } })
      throw appError
    }

    revalidateSeries()
    return transformSeries(data as SeriesDB)
  } catch (error) {
    if (error instanceof AppError) throw error
    logError(error, { operation: "updateSeries", additionalInfo: { input } })
    throw new AppError(ErrorType.UPDATE_FAILED, ErrorMessages.COLLECTION_UPDATE_FAILED, error instanceof Error ? error.message : "Unknown error")
  }
}

/** Delete a series. Its works are kept and simply leave the series. */
export async function deleteSeries(id: string): Promise<void> {
  try {
    await requireAuth()
    const supabase = await createClient()
    // Clear numbers first; the database clears the link itself when the series goes
    await supabase.from("artworks").update({ series_number: null }).eq("series_id", id)
    const { error } = await supabase.from("series").delete().eq("id", id)
    if (error) {
      const appError = parseSupabaseError(error, "delete", "Series")
      logError(appError, { operation: "deleteSeries", additionalInfo: { id } })
      throw appError
    }
    revalidateSeries()
  } catch (error) {
    if (error instanceof AppError) throw error
    logError(error, { operation: "deleteSeries", additionalInfo: { id } })
    throw new AppError(ErrorType.DELETE_FAILED, ErrorMessages.COLLECTION_DELETE_FAILED, error instanceof Error ? error.message : "Unknown error")
  }
}

/** Put existing works into a series, numbered after the works already in it when `number` is set. */
export async function addArtworksToSeries(seriesId: string, artworkIds: string[], options: { number?: boolean } = {}): Promise<void> {
  try {
    await requireAuth()
    if (artworkIds.length === 0) {
      throw new AppError(ErrorType.VALIDATION_ERROR, ErrorMessages.COLLECTION_NO_ARTWORKS, "No artworks selected")
    }
    const supabase = await createClient()

    if (!options.number) {
      const { error } = await supabase.from("artworks").update({ series_id: seriesId }).in("id", artworkIds)
      if (error) throw parseSupabaseError(error, "update", "Series")
    } else {
      let next = await getNextSeriesNumber(seriesId)
      for (const id of artworkIds) {
        const { error } = await supabase.from("artworks").update({ series_id: seriesId, series_number: next++ }).eq("id", id)
        if (error) throw parseSupabaseError(error, "update", "Series")
      }
    }
    revalidateSeries()
  } catch (error) {
    if (error instanceof AppError) throw error
    logError(error, { operation: "addArtworksToSeries", additionalInfo: { seriesId, artworkIds } })
    throw new AppError(ErrorType.UPDATE_FAILED, ErrorMessages.COLLECTION_UPDATE_FAILED, error instanceof Error ? error.message : "Unknown error")
  }
}

/** Take works out of whatever series they are in. The works themselves are kept. */
export async function removeArtworksFromSeries(artworkIds: string[]): Promise<void> {
  await requireAuth()
  if (artworkIds.length === 0) return
  const supabase = await createClient()
  const { error } = await supabase.from("artworks").update({ series_id: null, series_number: null }).in("id", artworkIds)
  if (error) {
    const appError = parseSupabaseError(error, "update", "Series")
    logError(appError, { operation: "removeArtworksFromSeries", additionalInfo: { artworkIds } })
    throw appError
  }
  revalidateSeries()
}

/** The number the next work added to a series would get. */
export async function getNextSeriesNumber(seriesId: string): Promise<number> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("artworks")
    .select("series_number")
    .eq("series_id", seriesId)
    .order("series_number", { ascending: false, nullsFirst: false })
    .limit(1)
  return (data?.[0]?.series_number ?? 0) + 1
}

// ---------------------------------------------------------------------------
// Duplicate titles
// ---------------------------------------------------------------------------

export type TitleMatch = {
  /** The original work the matches hang off (a match that is itself an edition points here) */
  original: {
    id: string
    title: string
    year: string | null
    thumbnailPath: string | null
    editionSize: number | null
    seriesId: string | null
    seriesName: string | null
  }
  /** How many works already share the title, including the original */
  count: number
  nextEditionNumber: number
  nextVersionNumber: number
  /** Next number in the original's series, or 2 if the two would start a new series */
  nextSeriesNumber: number
}

/**
 * Works whose title matches, grouped under their originals, with the numbers
 * the duplicate-title prompt should offer. Empty when the title is new.
 */
export async function findTitleMatches(title: string, excludeId?: string): Promise<TitleMatch[]> {
  await requireAuth()
  const wanted = normalise(title)
  // Untitled works share a title by definition; they're never a duplicate
  if (!wanted || wanted === "untitled") return []

  const supabase = await createClient()
  // Narrow on the first word in the database, then compare exactly here
  const firstWord = wanted.split(" ")[0].replace(/[%_]/g, "")
  const { data } = await supabase
    .from("artworks")
    .select("id, title, year, thumbnail_path, edition_size, parent_artwork_id, relation_type, relation_number, series_id, series, series_number")
    .ilike("title", `%${firstWord}%`)

  const all = data ?? []
  const matches = all.filter((w) => w.id !== excludeId && w.title && normalise(w.title) === wanted)
  if (matches.length === 0) return []

  const byId = new Map(all.map((w) => [w.id, w]))
  const groups = new Map<string, typeof matches>()
  for (const m of matches) {
    const rootId = m.parent_artwork_id && byId.has(m.parent_artwork_id) ? m.parent_artwork_id : m.id
    groups.set(rootId, [...(groups.get(rootId) ?? []), m])
  }

  const results: TitleMatch[] = []
  for (const [rootId, members] of groups) {
    const root = byId.get(rootId)!
    // Every work hanging off this original, matched or not, for numbering
    const { data: children } = await supabase
      .from("artworks")
      .select("relation_type, relation_number")
      .eq("parent_artwork_id", rootId)
    const highest = (type: ArtworkRelationType) =>
      Math.max(1, ...(children ?? []).filter((c) => c.relation_type === type).map((c) => c.relation_number ?? 1))

    results.push({
      original: {
        id: root.id,
        title: root.title ?? title,
        year: root.year,
        thumbnailPath: root.thumbnail_path,
        editionSize: root.edition_size,
        seriesId: root.series_id,
        seriesName: root.series,
      },
      count: members.length + (members.some((m) => m.id === rootId) ? 0 : 1),
      // The original counts as no. 1 of its editions and versions
      nextEditionNumber: highest("edition") + 1,
      nextVersionNumber: highest("version") + 1,
      nextSeriesNumber: root.series_id ? await getNextSeriesNumber(root.series_id) : 2,
    })
  }
  return results
}

/**
 * What the user decided a same-titled work is. "original" is an existing work;
 * the bulk upload resolves works it created earlier in the same batch to ids first.
 */
export type TitleDecision =
  | { kind: "separate" }
  | { kind: "edition"; originalId: string; number: number; editionSize?: number | null }
  | { kind: "version"; originalId: string; number: number }
  | { kind: "series"; originalId: string; number: number }

export type RelationFields = {
  seriesId?: string | null
  seriesNumber?: number | null
  parentArtworkId?: string | null
  relationType?: ArtworkRelationType | null
  relationNumber?: number | null
}

/**
 * Turn a duplicate-title decision into the fields to save on the new work,
 * making any changes it implies on the original first: recording the edition
 * size, or putting the original into a series (named after it) as no. 1.
 */
export async function resolveTitleDecision(decision: TitleDecision): Promise<RelationFields> {
  await requireAuth()
  if (decision.kind === "separate") return {}

  const supabase = await createClient()
  const { data: original, error } = await supabase
    .from("artworks")
    .select("id, title, series_id, series_number, edition_size")
    .eq("id", decision.originalId)
    .single()
  if (error || !original) {
    throw new AppError(ErrorType.NOT_FOUND, "The original work couldn't be found. It may have been deleted.", error?.message ?? "missing")
  }

  if (decision.kind === "edition" || decision.kind === "version") {
    if (decision.kind === "edition" && decision.editionSize && decision.editionSize !== original.edition_size) {
      const { error: sizeError } = await supabase.from("artworks").update({ edition_size: decision.editionSize }).eq("id", original.id)
      if (sizeError) throw parseSupabaseError(sizeError, "update", "Artwork")
    }
    return { parentArtworkId: original.id, relationType: decision.kind, relationNumber: decision.number }
  }

  // Series: join the original's series, or start one from the title with the original as no. 1
  let seriesId = original.series_id as string | null
  if (!seriesId) {
    const name = (original.title ?? "").trim()
    // Case-insensitive exact match (escape the LIKE wildcards a title might contain)
    const { data: existing } = await supabase
      .from("series")
      .select("id")
      .ilike("name", name.replace(/[\\%_]/g, (c: string) => `\\${c}`))
      .maybeSingle()
    seriesId = existing?.id ?? (await createSeries({ name })).id
  }
  if (original.series_id !== seriesId || original.series_number == null) {
    const { error: joinError } = await supabase
      .from("artworks")
      .update({ series_id: seriesId, series_number: original.series_number ?? 1 })
      .eq("id", original.id)
    if (joinError) throw parseSupabaseError(joinError, "update", "Series")
  }
  revalidateSeries()
  return { seriesId, seriesNumber: decision.number }
}
