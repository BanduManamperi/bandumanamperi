"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import type { Artwork } from "@bandumanamperi/types"
import { getArtworks } from "@/lib/actions/artworks"
import { addArtworksToSeries } from "@/lib/actions/series"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AddWorksDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  seriesId: string
  seriesName: string
  onAdded: () => void
}

// Pick existing works to move into a series. Works already in another series
// are marked, since adding them moves them.
export function AddWorksDialog({ open, onOpenChange, seriesId, seriesName, onAdded }: AddWorksDialogProps) {
  const [artworks, setArtworks] = useState<Artwork[] | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState("")
  const [numberThem, setNumberThem] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Start fresh each time the dialog opens...
  const [lastOpen, setLastOpen] = useState(false)
  if (open !== lastOpen) {
    setLastOpen(open)
    if (open) {
      setSelected(new Set())
      setQuery("")
      setArtworks(null)
    }
  }

  // ...and load the works that aren't already in this series
  useEffect(() => {
    if (!open) return
    let cancelled = false
    getArtworks({ includeDrafts: true })
      .then((all) => !cancelled && setArtworks(all.filter((a) => a.seriesId !== seriesId)))
      .catch(() => {
        if (cancelled) return
        setArtworks([])
        toast.error("Couldn't load artworks")
      })
    return () => {
      cancelled = true
    }
  }, [open, seriesId])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!artworks) return []
    return q
      ? artworks.filter((a) => [a.title, a.series, a.year, a.sourceFilename].some((v) => v?.toLowerCase().includes(q)))
      : artworks
  }, [artworks, query])

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const add = async () => {
    setIsSaving(true)
    try {
      // Keep the order the works appear in, so numbering follows the list
      const ids = shown.filter((a) => selected.has(a.id)).map((a) => a.id)
      await addArtworksToSeries(seriesId, ids, { number: numberThem })
      toast.success(`${ids.length} ${ids.length === 1 ? "work" : "works"} added to ${seriesName}`)
      onAdded()
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't add the works")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSaving && onOpenChange(next)}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add existing works to {seriesName}</DialogTitle>
          <DialogDescription>Choose works that are already uploaded. Works in another series move to this one.</DialogDescription>
        </DialogHeader>

        <Input placeholder="Search by title, year or file name" value={query} onChange={(e) => setQuery(e.target.value)} />

        <div className="min-h-0 max-h-[50vh] overflow-y-auto rounded-md border">
          {artworks === null ? (
            <p className="p-6 text-center text-sm text-muted-foreground">Loading artworks…</p>
          ) : shown.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">No artworks match.</p>
          ) : (
            <ul className="divide-y">
              {shown.map((a) => (
                <li key={a.id}>
                  <label className="flex cursor-pointer items-center gap-3 px-3 py-2 hover:bg-muted/50">
                    <Checkbox checked={selected.has(a.id)} onCheckedChange={() => toggle(a.id)} />
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                      {(a.thumbnailPath || a.media?.[0]) && (
                        <Image src={(a.thumbnailPath || a.media?.[0])!} alt="" fill className="object-cover" sizes="40px" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">{a.title || "Untitled"}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {[a.year, a.series ? `In ${a.series}` : null, a.status === "published" ? null : a.status].filter(Boolean).join(" · ") || "No details"}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={numberThem} onCheckedChange={(v) => setNumberThem(v === true)} />
          <Label className="font-normal">Number them after the works already in the series (no. 1, 2, 3…)</Label>
        </label>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={add} disabled={isSaving || selected.size === 0}>
            {isSaving ? "Adding…" : `Add ${selected.size || ""} ${selected.size === 1 ? "work" : "works"}`.replace("  ", " ")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
