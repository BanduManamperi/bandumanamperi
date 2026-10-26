"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth/verify-auth"
import {
  CVEntry,
  CVEntryDB,
  CVEntryInsert,
  CVEntryUpdate,
  CVSection,
  cvEntryDBToApp,
  cvEntryAppToDB,
} from "@/lib/types/cv"

export async function getCVEntries(): Promise<CVEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cv_entries")
    .select("*")
    .order("section")
    .order("sort_order", { ascending: true })

  if (error) throw new Error("Failed to fetch CV entries")
  return (data as CVEntryDB[]).map(cvEntryDBToApp)
}

export async function getCVEntriesBySection(section: CVSection): Promise<CVEntry[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cv_entries")
    .select("*")
    .eq("section", section)
    .order("sort_order", { ascending: true })

  if (error) throw new Error("Failed to fetch CV entries")
  return (data as CVEntryDB[]).map(cvEntryDBToApp)
}

export async function createCVEntry(entry: CVEntryInsert): Promise<CVEntry> {
  await requireAuth()

  if (!entry.title?.trim()) throw new Error("Title is required")
  if (!entry.section) throw new Error("Section is required")

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("cv_entries")
    .insert(cvEntryAppToDB(entry))
    .select()
    .single()

  if (error) throw new Error("Failed to create CV entry")

  revalidatePath("/protected/cv")
  revalidatePath("/about")
  revalidatePath("/background")
  return cvEntryDBToApp(data as CVEntryDB)
}

export async function updateCVEntry(entry: CVEntryUpdate): Promise<CVEntry> {
  await requireAuth()

  if (!entry.id) throw new Error("ID is required")

  const supabase = await createClient()
  const { id, ...updates } = entry
  const { data, error } = await supabase
    .from("cv_entries")
    .update(cvEntryAppToDB(updates as CVEntryInsert))
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error("Failed to update CV entry")

  revalidatePath("/protected/cv")
  revalidatePath("/about")
  revalidatePath("/background")
  return cvEntryDBToApp(data as CVEntryDB)
}

export async function deleteCVEntry(id: string): Promise<void> {
  await requireAuth()

  const supabase = await createClient()
  const { error } = await supabase.from("cv_entries").delete().eq("id", id)

  if (error) throw new Error("Failed to delete CV entry")

  revalidatePath("/protected/cv")
  revalidatePath("/about")
  revalidatePath("/background")
}

export async function reorderCVEntries(
  updates: Array<{ id: string; sortOrder: number }>
): Promise<void> {
  await requireAuth()

  const supabase = await createClient()
  await Promise.all(
    updates.map(({ id, sortOrder }) =>
      supabase.from("cv_entries").update({ sort_order: sortOrder }).eq("id", id)
    )
  )

  revalidatePath("/protected/cv")
  revalidatePath("/about")
  revalidatePath("/background")
}
