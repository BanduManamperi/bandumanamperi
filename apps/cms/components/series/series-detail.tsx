"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconArrowLeft, IconEdit, IconPlus, IconTrash, IconUpload, IconX } from "@tabler/icons-react"
import type { Series } from "@bandumanamperi/types"
import type { SeriesWork } from "@/lib/actions/series"
import { deleteSeries, removeArtworksFromSeries } from "@/lib/actions/series"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SeriesFormDialog } from "./series-form-dialog"
import { AddWorksDialog } from "./add-works-dialog"

export function SeriesDetail({ series, works }: { series: Series; works: SeriesWork[] }) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const remove = async (work: SeriesWork) => {
    setBusyId(work.id)
    try {
      await removeArtworksFromSeries([work.id])
      toast.success(`${work.title || "Untitled"} taken out of ${series.name}`)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't take the work out")
    } finally {
      setBusyId(null)
    }
  }

  const destroy = async () => {
    try {
      await deleteSeries(series.id)
      toast.success(`Series “${series.name}” deleted. Its works are kept.`)
      router.push("/protected/series")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't delete the series")
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-4 md:py-6 lg:px-6">
      <Link href="/protected/series" className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <IconArrowLeft className="size-4" />
        All series
      </Link>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-4">
          {(series.coverImage || works[0]?.thumbnailPath) && (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
              <Image src={(series.coverImage || works[0]?.thumbnailPath)!} alt="" fill className="object-cover" sizes="96px" />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold">{series.name}</h2>
            <p className="text-sm text-muted-foreground">
              {works.length} {works.length === 1 ? "work" : "works"}
              {series.status === "draft" ? " · Draft, hidden from the website" : ""}
            </p>
            <p className="mt-3 max-w-2xl whitespace-pre-line text-sm">
              {series.description || (
                <span className="text-muted-foreground">
                  No description yet. Add one so works without their own description share it.
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <IconEdit className="size-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsConfirmingDelete(true)}>
            <IconTrash className="size-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-y py-3">
        <Button asChild>
          <Link href={`/protected/artworks/upload?series=${series.id}`}>
            <IconUpload className="size-4" />
            Upload works into this series
          </Link>
        </Button>
        <Button variant="outline" onClick={() => setIsAdding(true)}>
          <IconPlus className="size-4" />
          Add existing works
        </Button>
      </div>

      {works.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          No works in this series yet. Upload new ones or add works you've already uploaded.
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {works.map((work) => (
            <li key={work.id} className="group relative">
              <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                {work.thumbnailPath && <Image src={work.thumbnailPath} alt="" fill className="object-cover" sizes="(min-width: 1024px) 18vw, 45vw" />}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute right-2 top-2 size-7 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  onClick={() => remove(work)}
                  disabled={busyId === work.id}
                  aria-label={`Take ${work.title || "Untitled"} out of the series`}
                  title="Take out of the series (the work is kept)"
                >
                  <IconX className="size-4" />
                </Button>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-2">
                <p className="truncate text-sm">{work.title || "Untitled"}</p>
                {work.seriesNumber && <span className="shrink-0 text-xs text-muted-foreground">no. {work.seriesNumber}</span>}
              </div>
              <div className="flex gap-1 text-xs text-muted-foreground">
                {work.year ?? "n.d."}
                {work.status !== "published" && <Badge variant="outline" className="ml-1 h-4 px-1 text-[10px]">{work.status}</Badge>}
              </div>
            </li>
          ))}
        </ul>
      )}

      <SeriesFormDialog open={isEditing} onOpenChange={setIsEditing} series={series} onSaved={() => router.refresh()} />
      <AddWorksDialog
        open={isAdding}
        onOpenChange={setIsAdding}
        seriesId={series.id}
        seriesName={series.name}
        onAdded={() => router.refresh()}
      />

      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete “{series.name}”?</DialogTitle>
            <DialogDescription>
              The series and its description are deleted. Its {works.length} {works.length === 1 ? "work stays" : "works stay"} in
              Artworks, just no longer grouped.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
              Keep the series
            </Button>
            <Button variant="destructive" onClick={destroy}>
              Delete series
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
