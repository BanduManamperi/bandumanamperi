"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import {
  IconAlertTriangle,
  IconArrowLeft,
  IconCheck,
  IconLoader2,
  IconPhotoPlus,
  IconPlus,
  IconRefresh,
  IconX,
} from "@tabler/icons-react"
import type { ArtworkAvailability, ArtworkStatus, Series } from "@bandumanamperi/types"
import { createArtwork } from "@/lib/actions/artworks"
import {
  findTitleMatches,
  getNextSeriesNumber,
  resolveTitleDecision,
  type SeriesSummary,
  type TitleMatch,
} from "@/lib/actions/series"
import { discardUploads, uploadImage } from "@/lib/storage/images"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SeriesFormDialog } from "@/components/series/series-form-dialog"
import {
  TitleChoice,
  describeChoice,
  type TitleChoiceOriginal,
  type TitleChoiceValue,
} from "@/components/artworks/title-choice"
import { cn } from "@/lib/utils"

// Browsers can't preview these, so they'd upload as broken images
const UNSUPPORTED = /\.(heic|heif|tiff?|raw|cr2|nef|dng)$/i
const PARALLEL_UPLOADS = 3
const NO_SERIES = "none"

type Phase = "ready" | "uploading" | "saving" | "done" | "failed"

type Row = {
  key: string
  file: File
  preview: string
  /** Blank means "Untitled" */
  title: string
  /** Per-work overrides; blank falls back to the shared value */
  year: string
  medium: string
  /** null while checking, [] when the title is new */
  matches: TitleMatch[] | null
  choice: TitleChoiceValue
  phase: Phase
  error?: string
  uploadedUrl?: string
  createdId?: string
}

const EMPTY_CHOICE: TitleChoiceValue = { kind: null, number: 1, editionSize: null }

function normalise(title: string) {
  return title.trim().replace(/\s+/g, " ").toLowerCase()
}

function isUntitled(title: string) {
  const t = normalise(title)
  return t === "" || t === "untitled"
}

function fileStem(file: File) {
  return file.name.replace(/\.[^.]+$/, "")
}

/** The work a row's title collides with: a saved work first, else an earlier row in this upload. */
function originalFor(row: Row, index: number, rows: Row[]): { original: TitleChoiceOriginal; batchIndex?: number } | null {
  if (isUntitled(row.title)) return null
  const saved = row.matches?.[0]
  if (saved) {
    return {
      original: {
        title: saved.original.title,
        year: saved.original.year,
        thumbnailPath: saved.original.thumbnailPath,
        editionSize: saved.original.editionSize,
        seriesName: saved.original.seriesName,
        count: saved.count,
        nextEditionNumber: saved.nextEditionNumber,
        nextVersionNumber: saved.nextVersionNumber,
        nextSeriesNumber: saved.nextSeriesNumber,
      },
    }
  }

  const wanted = normalise(row.title)
  const firstIndex = rows.findIndex((r) => normalise(r.title) === wanted)
  if (firstIndex === -1 || firstIndex >= index) return null
  // Number after the earlier rows that already chose the same kind
  const earlier = rows.slice(firstIndex + 1, index).filter((r) => normalise(r.title) === wanted)
  const used = (kind: string) => earlier.filter((r) => r.choice.kind === kind).length
  return {
    batchIndex: firstIndex,
    original: {
      title: rows[firstIndex].title.trim(),
      year: rows[firstIndex].year || null,
      thumbnailPath: null,
      editionSize: null,
      seriesName: null,
      inThisUpload: true,
      count: 1 + earlier.length,
      nextEditionNumber: 2 + used("edition"),
      nextVersionNumber: 2 + used("version"),
      nextSeriesNumber: 2 + used("series"),
    },
  }
}

export function BulkUpload({ initialSeries, preselectedSeriesId }: { initialSeries: SeriesSummary[]; preselectedSeriesId: string | null }) {
  const [seriesList, setSeriesList] = useState<Pick<Series, "id" | "name" | "description">[]>(initialSeries)
  const [seriesId, setSeriesId] = useState<string>(
    preselectedSeriesId && initialSeries.some((s) => s.id === preselectedSeriesId) ? preselectedSeriesId : NO_SERIES
  )
  const [numberInSeries, setNumberInSeries] = useState(true)
  const [isCreatingSeries, setIsCreatingSeries] = useState(false)

  const [shared, setShared] = useState({
    description: "",
    year: "",
    medium: "",
    category: "",
    status: "draft" as ArtworkStatus,
    availability: "available" as ArtworkAvailability,
  })

  const [rows, setRows] = useState<Row[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const checkTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>())

  const selectedSeries = seriesList.find((s) => s.id === seriesId) ?? null

  // Warn before leaving mid-upload
  useEffect(() => {
    if (!isRunning) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [isRunning])

  // Free preview URLs when the page goes away
  const rowsRef = useRef(rows)
  useEffect(() => {
    rowsRef.current = rows
  }, [rows])
  useEffect(() => () => rowsRef.current.forEach((r) => URL.revokeObjectURL(r.preview)), [])

  const updateRow = (key: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.key === key ? { ...r, ...patch } : r)))

  const checkTitle = (key: string, title: string) => {
    const timers = checkTimers.current
    clearTimeout(timers.get(key))
    if (isUntitled(title)) {
      updateRow(key, { matches: [] })
      return
    }
    updateRow(key, { matches: null })
    timers.set(
      key,
      setTimeout(() => {
        findTitleMatches(title)
          .then((matches) =>
            // Ignore a reply for a title the user has since changed
            setRows((prev) => prev.map((r) => (r.key === key && r.title === title ? { ...r, matches } : r)))
          )
          .catch(() => updateRow(key, { matches: [] }))
      }, 400)
    )
  }

  const addFiles = (list: FileList | File[]) => {
    const files = Array.from(list)
    const unsupported = files.filter((f) => UNSUPPORTED.test(f.name) || !f.type.startsWith("image/"))
    if (unsupported.length > 0) {
      toast.error(
        `${unsupported.length} file${unsupported.length === 1 ? "" : "s"} skipped: ${unsupported.map((f) => f.name).join(", ")}. Export as JPEG or PNG first.`
      )
    }
    const accepted = files.filter((f) => !unsupported.includes(f))
    setRows((prev) => [
      ...prev,
      ...accepted.map((file) => ({
        key: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        title: "",
        year: "",
        medium: "",
        matches: [],
        choice: EMPTY_CHOICE,
        phase: "ready" as Phase,
      })),
    ])
  }

  const removeRow = (key: string) => {
    setRows((prev) => {
      const row = prev.find((r) => r.key === key)
      if (row) URL.revokeObjectURL(row.preview)
      return prev.filter((r) => r.key !== key)
    })
  }

  const prompts = useMemo(() => rows.map((row, i) => originalFor(row, i, rows)), [rows])
  const pending = rows.filter((r) => r.phase !== "done")
  const undecided = rows.filter((r, i) => r.phase !== "done" && prompts[i] && !r.choice.kind)
  const checking = rows.some((r) => r.phase !== "done" && r.matches === null)
  const done = rows.filter((r) => r.phase === "done")
  const failed = rows.filter((r) => r.phase === "failed")

  const run = async () => {
    if (undecided.length > 0) {
      toast.error(`Decide what ${undecided.length === 1 ? "1 work" : `${undecided.length} works`} with a repeated title ${undecided.length === 1 ? "is" : "are"} first.`)
      document.getElementById(`row-${undecided[0].key}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    setIsRunning(true)
    // Snapshot: rows still to do, in order, with their prompts
    const queue = rows.map((row, index) => ({ row, index, prompt: prompts[index] })).filter((q) => q.row.phase !== "done")
    const urls = new Map<string, string>()
    let saved = 0
    let failedCount = 0

    // 1. Images, a few at a time
    let next = 0
    const worker = async () => {
      while (next < queue.length) {
        const { row } = queue[next++]
        if (row.uploadedUrl) {
          urls.set(row.key, row.uploadedUrl)
          continue
        }
        updateRow(row.key, { phase: "uploading", error: undefined })
        try {
          const url = await uploadImage(row.file, "thumbnails")
          urls.set(row.key, url)
          updateRow(row.key, { uploadedUrl: url })
        } catch (error) {
          failedCount++
          updateRow(row.key, { phase: "failed", error: error instanceof Error ? error.message : "Upload failed" })
        }
      }
    }
    await Promise.all(Array.from({ length: PARALLEL_UPLOADS }, worker))

    // 2. Records, in order, so later works can point at earlier ones
    const createdIds = new Map<number, string>(rows.map((r, i) => [i, r.createdId]).filter((e): e is [number, string] => Boolean(e[1])))
    let seriesCounter = seriesId !== NO_SERIES && numberInSeries ? await getNextSeriesNumber(seriesId) : null

    for (const { row, index, prompt } of queue) {
      const url = urls.get(row.key)
      if (!url) continue
      updateRow(row.key, { phase: "saving" })
      try {
        let relation = {}
        if (prompt && row.choice.kind && row.choice.kind !== "separate") {
          const originalId = prompt.batchIndex !== undefined ? createdIds.get(prompt.batchIndex) : row.matches?.[0]?.original.id
          if (!originalId) throw new Error("The work it relates to didn't save. Retry that one first.")
          relation = await resolveTitleDecision({
            kind: row.choice.kind,
            originalId,
            number: row.choice.number,
            editionSize: row.choice.editionSize,
          })
        }

        const inChosenSeries = seriesId !== NO_SERIES && !("seriesId" in relation)
        const created = await createArtwork({
          title: isUntitled(row.title) ? "Untitled" : row.title.trim(),
          description: shared.description.trim() || null,
          year: row.year.trim() || shared.year.trim() || null,
          medium: row.medium.trim() || shared.medium.trim() || null,
          category: shared.category.trim() || null,
          status: shared.status,
          availability: shared.availability,
          thumbnailPath: url,
          media: [url],
          sourceFilename: fileStem(row.file),
          seriesId: inChosenSeries ? seriesId : null,
          seriesNumber: inChosenSeries && seriesCounter !== null ? seriesCounter++ : null,
          ...relation,
        })
        createdIds.set(index, created.id)
        saved++
        updateRow(row.key, { phase: "done", createdId: created.id })
      } catch (error) {
        failedCount++
        await discardUploads([url])
        updateRow(row.key, {
          phase: "failed",
          uploadedUrl: undefined,
          error: error instanceof Error ? error.message : "Couldn't save",
        })
      }
    }

    setIsRunning(false)
    if (failedCount === 0) toast.success(`${saved} ${saved === 1 ? "work" : "works"} uploaded`)
    else
      toast.error(
        `${saved} uploaded, ${failedCount} didn't. The ones that didn't are still listed with the reason; retry them.`
      )
  }

  const phaseBadge = (row: Row) => {
    switch (row.phase) {
      case "uploading":
        return (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconLoader2 className="size-3.5 animate-spin" /> Uploading image
          </span>
        )
      case "saving":
        return (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <IconLoader2 className="size-3.5 animate-spin" /> Saving
          </span>
        )
      case "done":
        return (
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <IconCheck className="size-3.5" /> Saved
          </span>
        )
      case "failed":
        return (
          <span className="flex items-start gap-1 text-xs text-destructive">
            <IconAlertTriangle className="mt-px size-3.5 shrink-0" /> {row.error}
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/protected/artworks" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <IconArrowLeft className="size-4" />
            Artworks
          </Link>
          <h2 className="mt-1 text-lg font-semibold">Upload works</h2>
        </div>
      </div>

      {/* Step 1: where they go and what they share */}
      <section className="grid gap-6 rounded-lg border p-4 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">1. Series and shared details</h3>
          <div className="space-y-2">
            <Label>Series</Label>
            <div className="flex gap-2">
              <Select value={seriesId} onValueChange={setSeriesId} disabled={isRunning}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_SERIES}>Not in a series</SelectItem>
                  {seriesList.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" onClick={() => setIsCreatingSeries(true)} disabled={isRunning}>
                <IconPlus className="size-4" />
                New series
              </Button>
            </div>
            {selectedSeries && (
              <>
                <p className="text-xs text-muted-foreground">
                  {selectedSeries.description
                    ? "These works will show the series description on the website unless you write one below."
                    : "This series has no description yet. You can add one from the Series page, or write one below for these works."}
                </p>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={numberInSeries} onCheckedChange={(v) => setNumberInSeries(v === true)} disabled={isRunning} />
                  Number them in upload order, after the works already in the series
                </label>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shared-description">Description for every work (optional)</Label>
            <Textarea
              id="shared-description"
              rows={4}
              value={shared.description}
              onChange={(e) => setShared((s) => ({ ...s, description: e.target.value }))}
              placeholder={selectedSeries?.description ? "Leave empty to use the series description" : "Written once, saved on each work"}
              disabled={isRunning}
            />
          </div>
        </div>

        <div className="grid content-start gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="shared-year">Year</Label>
            <Input id="shared-year" value={shared.year} onChange={(e) => setShared((s) => ({ ...s, year: e.target.value }))} placeholder="e.g. 2022" disabled={isRunning} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shared-medium">Medium</Label>
            <Input id="shared-medium" value={shared.medium} onChange={(e) => setShared((s) => ({ ...s, medium: e.target.value }))} placeholder="e.g. Acrylic on paper" disabled={isRunning} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shared-category">Category</Label>
            <Input id="shared-category" value={shared.category} onChange={(e) => setShared((s) => ({ ...s, category: e.target.value }))} placeholder="e.g. Painting" disabled={isRunning} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={shared.status} onValueChange={(v: ArtworkStatus) => setShared((s) => ({ ...s, status: v }))} disabled={isRunning}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft (hidden from the website)</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Availability</Label>
            <Select value={shared.availability} onValueChange={(v: ArtworkAvailability) => setShared((s) => ({ ...s, availability: v }))} disabled={isRunning}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="on_loan">On loan</SelectItem>
                <SelectItem value="private_collection">Private collection</SelectItem>
                <SelectItem value="nfs">Not for sale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Step 2: the images */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold">2. Images</h3>
        <div
          role="button"
          tabIndex={0}
          onClick={() => !isRunning && fileInput.current?.click()}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !isRunning && fileInput.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            if (!isRunning) addFiles(e.dataTransfer.files)
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isDragging ? "border-foreground bg-muted" : "border-muted-foreground/25 hover:border-muted-foreground/50",
            isRunning && "cursor-not-allowed opacity-60"
          )}
        >
          <IconPhotoPlus className="mb-2 size-8 text-muted-foreground" />
          <p className="text-sm">Drop images here, or click to choose</p>
          <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG or WebP. Titles start empty and save as “Untitled”; the file name is kept as a reference.</p>
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(e.target.files)
              e.target.value = ""
            }}
          />
        </div>

        {rows.length > 0 && (
          <ul className="space-y-3">
            {rows.map((row, index) => {
              const prompt = prompts[index]
              const locked = isRunning || row.phase === "done"
              return (
                <li
                  id={`row-${row.key}`}
                  key={row.key}
                  className={cn(
                    "rounded-lg border p-3",
                    row.phase === "done" && "opacity-70",
                    row.phase === "failed" && "border-destructive/50"
                  )}
                >
                  <div className="flex gap-3">
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                      <Image src={row.preview} alt="" fill className="object-cover" sizes="96px" unoptimized />
                    </div>
                    <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[2fr_1fr_1.5fr]">
                      <div className="space-y-1">
                        <Label htmlFor={`title-${row.key}`} className="text-xs">
                          Title
                        </Label>
                        <Input
                          id={`title-${row.key}`}
                          value={row.title}
                          placeholder="Untitled"
                          disabled={locked}
                          onChange={(e) => {
                            updateRow(row.key, { title: e.target.value, choice: EMPTY_CHOICE })
                            checkTitle(row.key, e.target.value)
                          }}
                        />
                        <p className="truncate text-xs text-muted-foreground">Ref. {fileStem(row.file)}</p>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`year-${row.key}`} className="text-xs">
                          Year
                        </Label>
                        <Input
                          id={`year-${row.key}`}
                          value={row.year}
                          placeholder={shared.year || "n.d."}
                          disabled={locked}
                          onChange={(e) => updateRow(row.key, { year: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`medium-${row.key}`} className="text-xs">
                          Medium
                        </Label>
                        <Input
                          id={`medium-${row.key}`}
                          value={row.medium}
                          placeholder={shared.medium || "Medium"}
                          disabled={locked}
                          onChange={(e) => updateRow(row.key, { medium: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center gap-3 sm:col-span-3">
                        {phaseBadge(row)}
                        {row.phase === "done" && row.choice.kind && row.choice.kind !== "separate" && (
                          <span className="text-xs text-muted-foreground">{describeChoice(row.choice, row.title.trim())}</span>
                        )}
                        {row.matches === null && row.phase !== "done" && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <IconLoader2 className="size-3.5 animate-spin" /> Checking the title
                          </span>
                        )}
                      </div>
                    </div>
                    {row.phase !== "done" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        onClick={() => removeRow(row.key)}
                        disabled={isRunning}
                        aria-label={`Remove ${row.file.name}`}
                      >
                        <IconX className="size-4" />
                      </Button>
                    )}
                  </div>

                  {prompt && row.phase !== "done" && (
                    <div className="mt-3">
                      <TitleChoice
                        compact
                        title={row.title.trim()}
                        original={prompt.original}
                        value={row.choice}
                        onChange={(choice) => updateRow(row.key, { choice })}
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Footer */}
      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur lg:-mx-6 lg:px-6">
        <p className="text-sm text-muted-foreground">
          {rows.length === 0
            ? "No images yet"
            : [
                `${pending.length} to upload`,
                done.length ? `${done.length} saved` : null,
                failed.length ? `${failed.length} failed` : null,
                undecided.length ? `${undecided.length} need a decision` : null,
              ]
                .filter(Boolean)
                .join(", ")}
        </p>
        <div className="flex gap-2">
          {done.length > 0 && !isRunning && (
            <Button variant="outline" asChild>
              <Link href={selectedSeries ? `/protected/series/${selectedSeries.id}` : "/protected/artworks"}>
                {selectedSeries ? `View ${selectedSeries.name}` : "View artworks"}
              </Link>
            </Button>
          )}
          <Button onClick={run} disabled={isRunning || pending.length === 0 || checking}>
            {isRunning ? (
              <>
                <IconLoader2 className="size-4 animate-spin" /> Uploading…
              </>
            ) : failed.length > 0 && failed.length === pending.length ? (
              <>
                <IconRefresh className="size-4" /> Retry {failed.length}
              </>
            ) : (
              `Upload ${pending.length || ""} ${pending.length === 1 ? "work" : "works"}`.replace("  ", " ")
            )}
          </Button>
        </div>
      </div>

      <SeriesFormDialog
        open={isCreatingSeries}
        onOpenChange={setIsCreatingSeries}
        onSaved={(created) => {
          setSeriesList((list) => [...list, created])
          setSeriesId(created.id)
        }}
      />
    </div>
  )
}
