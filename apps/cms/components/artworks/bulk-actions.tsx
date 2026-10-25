"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { IconLink, IconPencil, IconStack2, IconX } from "@tabler/icons-react"
import type { Artwork, ArtworkAvailability, ArtworkStatus } from "@bandumanamperi/types"
import { bulkRelate, bulkUpdateDetails, type BulkDetails } from "@/lib/actions/bulk"
import { addArtworksToSeries, removeArtworksFromSeries } from "@/lib/actions/series"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SeriesPicker, type SeriesPick } from "@/components/artworks/form/series-picker"
import { cn } from "@/lib/utils"

const UNCHANGED = "unchanged"

function thumb(a: Artwork) {
  return a.thumbnailPath || a.media?.[0] || null
}

/** Set shared details on many works; blank fields are left as they are. */
function EditDetailsDialog({ open, onOpenChange, works, onDone }: { open: boolean; onOpenChange: (o: boolean) => void; works: Artwork[]; onDone: () => void }) {
  const [form, setForm] = useState({ year: "", medium: "", category: "", description: "" })
  const [status, setStatus] = useState<string>(UNCHANGED)
  const [availability, setAvailability] = useState<string>(UNCHANGED)
  const [isSaving, setIsSaving] = useState(false)

  const save = async () => {
    const details: BulkDetails = {}
    if (form.year.trim()) details.year = form.year
    if (form.medium.trim()) details.medium = form.medium
    if (form.category.trim()) details.category = form.category
    if (form.description.trim()) details.description = form.description
    if (status !== UNCHANGED) details.status = status as ArtworkStatus
    if (availability !== UNCHANGED) details.availability = availability as ArtworkAvailability
    if (Object.keys(details).length === 0) {
      toast.error("Fill in at least one field to change")
      return
    }
    setIsSaving(true)
    try {
      await bulkUpdateDetails(works.map((w) => w.id), details)
      toast.success(`${works.length} ${works.length === 1 ? "work" : "works"} updated`)
      setForm({ year: "", medium: "", category: "", description: "" })
      setStatus(UNCHANGED)
      setAvailability(UNCHANGED)
      onDone()
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't update the works")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !isSaving && onOpenChange(o)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit {works.length} works</DialogTitle>
          <DialogDescription>Whatever you fill in replaces that field on every selected work. Blank fields are left as they are.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="bulk-year">Year</Label>
            <Input id="bulk-year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="Unchanged" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="bulk-medium">Medium</Label>
            <Input id="bulk-medium" value={form.medium} onChange={(e) => setForm({ ...form, medium: e.target.value })} placeholder="Unchanged" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="bulk-category">Category</Label>
            <Input id="bulk-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Unchanged" />
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UNCHANGED}>Unchanged</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Availability</Label>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UNCHANGED}>Unchanged</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="on_loan">On loan</SelectItem>
                <SelectItem value="private_collection">Private collection</SelectItem>
                <SelectItem value="nfs">Not for sale</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor="bulk-description">Description</Label>
            <Textarea id="bulk-description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Unchanged. If these works share a description, consider putting them in a series and describing the series instead." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={isSaving}>
            {isSaving ? "Saving…" : `Update ${works.length} works`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Put works into a series (numbered in list order if wanted), or take them out. */
function SeriesDialog({ open, onOpenChange, works, onDone }: { open: boolean; onOpenChange: (o: boolean) => void; works: Artwork[]; onDone: () => void }) {
  const [pick, setPick] = useState<SeriesPick>({ seriesId: null, seriesNumber: null })
  const [numberThem, setNumberThem] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const inSomeSeries = works.some((w) => w.seriesId)

  const run = async (action: "add" | "remove") => {
    setIsSaving(true)
    try {
      if (action === "remove") {
        await removeArtworksFromSeries(works.map((w) => w.id))
        toast.success(`${works.length} ${works.length === 1 ? "work" : "works"} taken out of their series`)
      } else {
        if (!pick.seriesId) {
          toast.error("Choose a series")
          return
        }
        await addArtworksToSeries(pick.seriesId, works.map((w) => w.id), { number: numberThem })
        toast.success(`${works.length} ${works.length === 1 ? "work" : "works"} added to the series`)
      }
      onDone()
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't change the series")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !isSaving && onOpenChange(o)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Series for {works.length} works</DialogTitle>
          <DialogDescription>Works already in another series move to the one you choose.</DialogDescription>
        </DialogHeader>
        <SeriesPicker value={pick} onChange={(v) => setPick({ ...v, seriesNumber: null })} disabled={isSaving} />
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={numberThem} onCheckedChange={(v) => setNumberThem(v === true)} />
          Number them in list order, after the works already in the series
        </label>
        <DialogFooter className="sm:justify-between">
          {inSomeSeries ? (
            <Button variant="ghost" onClick={() => run("remove")} disabled={isSaving}>
              Take them out of their series
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={() => run("add")} disabled={isSaving || !pick.seriesId}>
              {isSaving ? "Saving…" : "Add to series"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type RelateKind = "edition" | "version" | "series"

/** Choose an original among the selection and link the rest to it. */
function RelateDialog({ open, onOpenChange, works, onDone }: { open: boolean; onOpenChange: (o: boolean) => void; works: Artwork[]; onDone: () => void }) {
  const [originalId, setOriginalId] = useState<string | null>(null)
  const [kind, setKind] = useState<RelateKind>("series")
  const [editionSize, setEditionSize] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)

  const original = works.find((w) => w.id === originalId) ?? works[0]
  const others = works.filter((w) => w.id !== original?.id)

  const label = (index: number) =>
    kind === "edition"
      ? `Edition ${index + 2}${editionSize ? ` of ${editionSize}` : ""}`
      : kind === "version"
        ? `Version ${index + 2}`
        : `no. ${index + 2}`

  const save = async () => {
    if (!original) return
    setIsSaving(true)
    try {
      await bulkRelate(original.id, others.map((w) => w.id), kind, { editionSize: editionSize ? Number(editionSize) : null })
      toast.success(
        kind === "series"
          ? `${works.length} works are now a series`
          : `${others.length} ${kind === "edition" ? (others.length === 1 ? "edition" : "editions") : others.length === 1 ? "version" : "versions"} of “${original.title || "Untitled"}”`
      )
      onDone()
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't link the works")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !isSaving && onOpenChange(o)}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mark {works.length} works as related</DialogTitle>
          <DialogDescription>Pick the original, then what the others are. Numbers follow the list order; the original counts as no. 1.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          {(["series", "edition", "version"] as RelateKind[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={cn("rounded-md border p-2 text-left text-sm", kind === k ? "border-foreground" : "hover:border-foreground/40")}
            >
              <span className="block font-medium">{k === "series" ? "A series" : k === "edition" ? "Editions" : "Versions"}</span>
              <span className="block text-xs text-muted-foreground">
                {k === "series" ? "Different works made as a set" : k === "edition" ? "Numbered copies of one work" : "Other takes on one work"}
              </span>
            </button>
          ))}
        </div>

        {kind === "edition" && (
          <div className="flex items-center gap-2 text-sm">
            <Label htmlFor="relate-size">Edition size (optional)</Label>
            <Input id="relate-size" type="number" min={1} className="w-24" value={editionSize} onChange={(e) => setEditionSize(e.target.value)} />
          </div>
        )}

        <ul className="divide-y rounded-md border">
          {works.map((w) => {
            const isOriginal = w.id === original?.id
            const otherIndex = others.findIndex((o) => o.id === w.id)
            return (
              <li key={w.id}>
                <label className="flex cursor-pointer items-center gap-3 px-3 py-2">
                  <input type="radio" name="original" checked={isOriginal} onChange={() => setOriginalId(w.id)} className="accent-foreground" />
                  <span className="relative size-10 shrink-0 overflow-hidden rounded bg-muted">
                    {thumb(w) && <Image src={thumb(w)!} alt="" fill className="object-cover" sizes="40px" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm">{w.title || "Untitled"}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{isOriginal ? "Original" : label(otherIndex)}</span>
                </label>
              </li>
            )
          })}
        </ul>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={isSaving || others.length === 0}>
            {isSaving ? "Saving…" : "Link them"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** The bar shown while works are selected in the list. */
export function BulkActions({ selected, onClear, onDone }: { selected: Artwork[]; onClear: () => void; onDone: () => void }) {
  const [dialog, setDialog] = useState<"details" | "series" | "relate" | null>(null)
  if (selected.length === 0) return null

  return (
    <>
      <div role="toolbar" aria-label="Selected artworks" className="fixed bottom-4 left-1/2 z-40 flex w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-lg">
        <span className="px-1 text-sm font-medium">{selected.length} selected</span>
        <Button size="sm" variant="outline" onClick={() => setDialog("details")}>
          <IconPencil className="size-4" /> Edit details
        </Button>
        <Button size="sm" variant="outline" onClick={() => setDialog("series")}>
          <IconStack2 className="size-4" /> Series
        </Button>
        <Button size="sm" variant="outline" onClick={() => setDialog("relate")} disabled={selected.length < 2} title={selected.length < 2 ? "Select at least two works" : undefined}>
          <IconLink className="size-4" /> Mark as related
        </Button>
        <Button size="sm" variant="ghost" onClick={onClear} aria-label="Clear selection">
          <IconX className="size-4" />
        </Button>
      </div>

      <EditDetailsDialog open={dialog === "details"} onOpenChange={(o) => setDialog(o ? "details" : null)} works={selected} onDone={onDone} />
      <SeriesDialog open={dialog === "series"} onOpenChange={(o) => setDialog(o ? "series" : null)} works={selected} onDone={onDone} />
      <RelateDialog open={dialog === "relate"} onOpenChange={(o) => setDialog(o ? "relate" : null)} works={selected} onDone={onDone} />
    </>
  )
}
