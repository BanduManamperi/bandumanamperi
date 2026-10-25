"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { requireAuth } from "@/lib/auth/verify-auth"
import { AppError, ErrorType, parseSupabaseError, logError } from "@/lib/utils/error-handler"
import type { ArtworkAvailability, ArtworkRelationType, ArtworkStatus } from "@bandumanamperi/types"
import { createSeries, getNextSeriesNumber } from "@/lib/actions/series"

function revalidateArtworks() {
  revalidatePath("/protected/artworks")
  revalidatePath("/protected/series")
  revalidatePath("/api/artworks")
}

/** Fields that can be set on many works at once. Undefined means "leave as it is". */
export type BulkDetails = {
  year?: string | null
  medium?: string | null
  category?: string | null
  description?: string | null
  status?: ArtworkStatus
  availability?: ArtworkAvailability
}

/** Set the same details on every selected work. */
export async function bulkUpdateDetails(ids: string[], details: BulkDetails): Promise<void> {
  await requireAuth()
  if (ids.length === 0) return
  const changes: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(details)) {
    if (value === undefined) continue
    changes[key] = typeof value === "string" ? value.trim() || null : value
  }
  if (Object.keys(changes).length === 0) return

  const supabase = await createClient()
  const { error } = await supabase.from("artworks").update(changes).in("id", ids)
  if (error) {
    const appError = parseSupabaseError(error, "update", "Artworks")
    logError(appError, { operation: "bulkUpdateDetails", additionalInfo: { ids, details } })
    throw appError
  }
  revalidateArtworks()
}

/**
 * Link selected works to one original as editions, versions, or fellow works
 * in a series. Numbers follow the order given, after any already in use.
 */
export async function bulkRelate(
  originalId: string,
  otherIds: string[],
  kind: ArtworkRelationType | "series",
  options: { editionSize?: number | null } = {}
): Promise<void> {
  try {
    await requireAuth()
    const others = otherIds.filter((id) => id !== originalId)
    if (others.length === 0) {
      throw new AppError(ErrorType.VALIDATION_ERROR, "Select at least one work besides the original.", "No other works")
    }

    const supabase = await createClient()
    const { data: rows, error } = await supabase
      .from("artworks")
      .select("id, title, parent_artwork_id, series_id, series_number")
      .in("id", [originalId, ...others])
    if (error || !rows) throw parseSupabaseError(error, "fetch", "Artworks")

    const original = rows.find((r) => r.id === originalId)
    if (!original) throw new AppError(ErrorType.NOT_FOUND, "The original work couldn't be found.", originalId)
    if (original.parent_artwork_id) {
      throw new AppError(
        ErrorType.VALIDATION_ERROR,
        "The work you chose as the original is itself an edition or version. Choose its original instead.",
        "Original has a parent"
      )
    }

    if (kind === "edition" || kind === "version") {
      // A work that has editions of its own can't become someone else's edition
      const { data: parents } = await supabase.from("artworks").select("parent_artwork_id").in("parent_artwork_id", others)
      if (parents && parents.length > 0) {
        throw new AppError(
          ErrorType.VALIDATION_ERROR,
          "One of the selected works already has editions or versions of its own. Use it as the original, or unlink those first.",
          "Selected work has children"
        )
      }

      const { data: existing } = await supabase
        .from("artworks")
        .select("relation_number")
        .eq("parent_artwork_id", originalId)
        .eq("relation_type", kind)
        .not("id", "in", `(${others.join(",")})`)
      // The original counts as no. 1
      let next = Math.max(1, ...(existing ?? []).map((r) => r.relation_number ?? 1)) + 1

      for (const id of others) {
        const { error: linkError } = await supabase
          .from("artworks")
          .update({ parent_artwork_id: originalId, relation_type: kind, relation_number: next++ })
          .eq("id", id)
        if (linkError) throw parseSupabaseError(linkError, "update", "Artwork")
      }
      if (kind === "edition" && options.editionSize) {
        const { error: sizeError } = await supabase.from("artworks").update({ edition_size: options.editionSize }).eq("id", originalId)
        if (sizeError) throw parseSupabaseError(sizeError, "update", "Artwork")
      }
    } else {
      // Series: the original's series, or a new one named after it, original first
      let seriesId = original.series_id as string | null
      if (!seriesId) seriesId = (await createSeries({ name: (original.title ?? "Untitled").trim() })).id
      if (original.series_id !== seriesId || original.series_number == null) {
        const first = original.series_id === seriesId ? await getNextSeriesNumber(seriesId) : 1
        const { error: joinError } = await supabase.from("artworks").update({ series_id: seriesId, series_number: first }).eq("id", originalId)
        if (joinError) throw parseSupabaseError(joinError, "update", "Series")
      }
      let next = await getNextSeriesNumber(seriesId)
      for (const id of others) {
        const { error: joinError } = await supabase.from("artworks").update({ series_id: seriesId, series_number: next++ }).eq("id", id)
        if (joinError) throw parseSupabaseError(joinError, "update", "Series")
      }
    }

    revalidateArtworks()
  } catch (error) {
    if (error instanceof AppError) throw error
    logError(error, { operation: "bulkRelate", additionalInfo: { originalId, otherIds, kind } })
    throw new AppError(ErrorType.UPDATE_FAILED, "Couldn't link the works. Please try again.", error instanceof Error ? error.message : "Unknown error")
  }
}

/** Undo bulkRelate for the selected works: they become independent again. */
export async function bulkUnrelate(ids: string[]): Promise<void> {
  await requireAuth()
  if (ids.length === 0) return
  const supabase = await createClient()
  const { error } = await supabase
    .from("artworks")
    .update({ parent_artwork_id: null, relation_type: null, relation_number: null })
    .in("id", ids)
  if (error) {
    const appError = parseSupabaseError(error, "update", "Artworks")
    logError(appError, { operation: "bulkUnrelate", additionalInfo: { ids } })
    throw appError
  }
  revalidateArtworks()
}
