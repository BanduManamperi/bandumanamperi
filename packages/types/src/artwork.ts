export type ArtworkStatus = "published" | "draft" | "archived"
export type ArtworkAvailability = "available" | "sold" | "on_loan" | "private_collection" | "nfs"
export type ExhibitionType = "solo" | "group" | "online"
/** How a work relates to the original it was made from */
export type ArtworkRelationType = "edition" | "version"
export type SeriesStatus = "draft" | "published"

// A named group of works with its own description, which can exist before
// any work is uploaded into it.
export interface SeriesDB {
  id: string
  name: string
  slug: string
  description: string | null
  cover_image: string | null
  sort_order: number
  status: SeriesStatus
  created_at: string
  updated_at: string
}

export interface Series {
  id: string
  name: string
  slug: string
  description: string | null
  coverImage: string | null
  sortOrder: number
  status: SeriesStatus
  createdAt: string
  updatedAt: string
}

export interface SeriesInsert {
  name: string
  description?: string | null
  coverImage?: string | null
  sortOrder?: number
  status?: SeriesStatus
}

export interface SeriesUpdate extends Partial<SeriesInsert> {
  id: string
}

export interface ExhibitionHistory {
  name: string
  venue: string
  about: string
  curator: string
  /** @deprecated Legacy free-text dates. Use startDate/endDate. */
  dates?: string
  startDate: string
  endDate?: string | null
  startTime?: string | null
  endTime?: string | null
  coverImage: string | null
  exhibitionImages: string[]
  type: ExhibitionType
  otherArtists: string | null
  /** When true, shown in the homepage exhibition banner */
  highlightOnHomepage?: boolean
}

// Database schema (snake_case)
export interface ArtworkDB {
  id: string
  title: string | null
  year: string | null
  description: string | null
  link: string | null
  featured: boolean
  category: string | null
  medium: string | null
  width: number | null
  height: number | null
  depth: number | null
  unit: string
  slug: string | null
  status: ArtworkStatus
  tags: string[] | null
  series: string | null
  materials: string | null
  technique: string | null
  location: string | null
  availability: ArtworkAvailability
  price: number | null
  currency: string
  price_upon_request: boolean
  collector_name: string | null
  sort_order: number
  thumbnail_path: string | null
  artist_notes: string | null
  date_created: string | null
  exhibition_history: ExhibitionHistory[] | null
  views_count: number
  media: string[] | null
  created_at: string
  updated_at: string
  // Added by database-schema-series.sql; optional until every reader is updated
  series_id?: string | null
  series_number?: number | null
  parent_artwork_id?: string | null
  relation_type?: ArtworkRelationType | null
  relation_number?: number | null
  edition_size?: number | null
  source_filename?: string | null
}

// Application type (camelCase)
export interface Artwork {
  id: string
  title: string | null
  year: string | null
  description: string | null
  link: string | null
  featured: boolean
  category: string | null
  medium: string | null
  width: number | null
  height: number | null
  depth: number | null
  unit: string
  slug: string | null
  status: ArtworkStatus
  tags: string[] | null
  series: string | null
  materials: string | null
  technique: string | null
  location: string | null
  availability: ArtworkAvailability
  price: number | null
  currency: string
  priceUponRequest: boolean
  collectorName: string | null
  sortOrder: number
  thumbnailPath: string | null
  artistNotes: string | null
  dateCreated: string | null
  exhibitionHistory: ExhibitionHistory[] | null
  viewsCount: number
  media: string[] | null
  createdAt: string
  updatedAt: string
  seriesId?: string | null
  /** Position within the series ("no. 2") */
  seriesNumber?: number | null
  /** The original work this one is an edition or version of */
  parentArtworkId?: string | null
  relationType?: ArtworkRelationType | null
  /** Edition or version number ("2" in "Edition 2 of 5") */
  relationNumber?: number | null
  /** On an original: total editions ("5" in "Edition 2 of 5") */
  editionSize?: number | null
  /** Camera file name the image was uploaded as, kept as an archival reference */
  sourceFilename?: string | null
}

export interface ArtworkInsert {
  title?: string | null
  year?: string | null
  description?: string | null
  link?: string | null
  featured?: boolean
  category?: string | null
  medium?: string | null
  width?: number | null
  height?: number | null
  depth?: number | null
  unit?: string
  slug?: string | null
  status?: ArtworkStatus
  tags?: string[] | null
  series?: string | null
  materials?: string | null
  technique?: string | null
  location?: string | null
  availability?: ArtworkAvailability
  price?: number | null
  currency?: string
  priceUponRequest?: boolean
  collectorName?: string | null
  sortOrder?: number
  thumbnailPath?: string | null
  artistNotes?: string | null
  dateCreated?: string | null
  exhibitionHistory?: ExhibitionHistory[] | null
  media?: string[] | null
  seriesId?: string | null
  seriesNumber?: number | null
  parentArtworkId?: string | null
  relationType?: ArtworkRelationType | null
  relationNumber?: number | null
  editionSize?: number | null
  sourceFilename?: string | null
}

export interface ArtworkUpdate extends Partial<ArtworkInsert> {
  id: string
}
