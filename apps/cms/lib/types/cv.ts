export type CVSection =
  | "education"
  | "work_current"
  | "work_past"
  | "solo_exhibitions"
  | "group_exhibitions"
  | "workshops_residencies"
  | "invited_lectures"
  | "awards"
  | "public_collections"

export const CV_SECTION_LABELS: Record<CVSection, string> = {
  education: "Education",
  work_current: "Work Experience — Current",
  work_past: "Work Experience — Past",
  solo_exhibitions: "Solo Exhibitions",
  group_exhibitions: "Group Exhibitions & Performances",
  workshops_residencies: "Workshops & Residencies",
  invited_lectures: "Invited Lectures & Talks",
  awards: "Awards & Grants",
  public_collections: "Public Collections",
}

export const CV_SECTIONS = Object.keys(CV_SECTION_LABELS) as CVSection[]

// DB row (snake_case)
export interface CVEntryDB {
  id: string
  section: CVSection
  year: string
  title: string
  subtitle: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

// App type (camelCase)
export interface CVEntry {
  id: string
  section: CVSection
  year: string
  title: string
  subtitle: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface CVEntryInsert {
  section: CVSection
  year: string
  title: string
  subtitle?: string | null
  sortOrder?: number
}

export interface CVEntryUpdate extends Partial<CVEntryInsert> {
  id: string
}

export function cvEntryDBToApp(db: CVEntryDB): CVEntry {
  return {
    id: db.id,
    section: db.section,
    year: db.year,
    title: db.title,
    subtitle: db.subtitle,
    sortOrder: db.sort_order,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  }
}

export function cvEntryAppToDB(
  app: CVEntryInsert | CVEntryUpdate
): Record<string, unknown> {
  const db: Record<string, unknown> = {}
  if ("id" in app) db.id = app.id
  if (app.section !== undefined) db.section = app.section
  if (app.year !== undefined) db.year = app.year
  if (app.title !== undefined) db.title = app.title
  if (app.subtitle !== undefined) db.subtitle = app.subtitle
  if (app.sortOrder !== undefined) db.sort_order = app.sortOrder
  return db
}
