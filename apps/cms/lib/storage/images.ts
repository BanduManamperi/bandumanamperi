"use client"

import { createClient } from "@/lib/supabase/client"

const BUCKET = "artworks"

/** Folders in the artworks bucket. "thumbnails" holds each work's main (full size) image. */
export type ImageFolder = "thumbnails" | "media" | "series"

function uniqueName(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}.${extension}`
}

/** Upload an image and return its public URL. Throws with a readable message on failure. */
export async function uploadImage(file: File, folder: ImageFolder): Promise<string> {
  const supabase = createClient()
  const path = `${folder}/${uniqueName(file)}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })
  if (error) {
    if (error.message.includes("row-level security")) {
      throw new Error("You're not allowed to upload images. Sign in again and retry.")
    }
    throw new Error(`Couldn't upload ${file.name}: ${error.message}`)
  }

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/**
 * Delete images uploaded for a save that then failed, so they don't sit in
 * storage unreferenced. Best effort: a failure here is logged, not thrown.
 */
export async function discardUploads(publicUrls: string[]): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const paths = publicUrls
    .map((url) => (url.includes(marker) ? decodeURIComponent(url.split(marker)[1]) : null))
    .filter((p): p is string => Boolean(p))
  if (paths.length === 0) return

  const { error } = await createClient().storage.from(BUCKET).remove(paths)
  if (error) console.error("Couldn't remove unused uploads:", paths, error)
}
