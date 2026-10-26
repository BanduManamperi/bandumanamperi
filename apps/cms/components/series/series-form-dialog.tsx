"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import type { Series } from "@bandumanamperi/types"
import { createSeries, updateSeries } from "@/lib/actions/series"
import { discardUploads, uploadImage } from "@/lib/storage/images"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type SeriesFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Edit this series; omit to create a new one */
  series?: Series
  /** A name to start from, e.g. the title that prompted a new series */
  initialName?: string
  onSaved: (series: Series) => void
}

// Create or edit a series: a name, the description its works share, and an
// optional cover. A series can be created before any work is uploaded into it.
export function SeriesFormDialog({ open, onOpenChange, series, initialName, onSaved }: SeriesFormDialogProps) {
  const isEditing = Boolean(series)
  const [name, setName] = useState(series?.name ?? initialName ?? "")
  const [description, setDescription] = useState(series?.description ?? "")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(series?.coverImage ?? null)
  const [isSaving, setIsSaving] = useState(false)

  // Fresh fields each time the dialog opens
  const [lastOpen, setLastOpen] = useState(open)
  if (open !== lastOpen) {
    setLastOpen(open)
    if (open) {
      setName(series?.name ?? initialName ?? "")
      setDescription(series?.description ?? "")
      setCoverFile(null)
      setCoverPreview(series?.coverImage ?? null)
    }
  }

  const chooseCover = (file: File | undefined) => {
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const save = async () => {
    if (!name.trim()) {
      toast.error("Give the series a name")
      return
    }
    setIsSaving(true)
    let uploadedCover: string | null = null
    try {
      if (coverFile) uploadedCover = await uploadImage(coverFile, "series")
      const coverImage = uploadedCover ?? (coverPreview && !coverPreview.startsWith("blob:") ? coverPreview : null)

      const saved = isEditing
        ? await updateSeries({ id: series!.id, name, description, coverImage })
        : await createSeries({ name, description, coverImage })

      toast.success(isEditing ? "Series saved" : `Series “${saved.name}” created`)
      onSaved(saved)
      onOpenChange(false)
    } catch (error) {
      if (uploadedCover) await discardUploads([uploadedCover])
      toast.error(error instanceof Error ? error.message : "Couldn't save the series")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !isSaving && onOpenChange(next)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit series" : "New series"}</DialogTitle>
          <DialogDescription>
            A series groups works under one name and description. Works without a description
            of their own show this one on the website.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="series-name">Name</Label>
            <Input
              id="series-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wings of Certainty"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="series-description">Description</Label>
            <Textarea
              id="series-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What the works in this series share"
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="series-cover">Cover image (optional)</Label>
            <div className="flex items-center gap-4">
              {coverPreview && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border">
                  <Image src={coverPreview} alt="" fill className="object-cover" sizes="64px" unoptimized={coverPreview.startsWith("blob:")} />
                </div>
              )}
              <Input id="series-cover" type="file" accept="image/*" onChange={(e) => chooseCover(e.target.files?.[0])} />
            </div>
            <p className="text-xs text-muted-foreground">If you skip this, the first work in the series is used.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={save} disabled={isSaving}>
            {isSaving ? "Saving…" : isEditing ? "Save series" : "Create series"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
