"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconPlus, IconStack2 } from "@tabler/icons-react"
import type { SeriesSummary } from "@/lib/actions/series"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SeriesFormDialog } from "./series-form-dialog"

function SeriesThumb({ summary }: { summary: SeriesSummary }) {
  const images = summary.coverImage ? [summary.coverImage] : summary.previews
  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center bg-muted text-sm text-muted-foreground">
        No works yet
      </div>
    )
  }
  if (images.length === 1) {
    return (
      <div className="relative aspect-[4/3] bg-muted">
        <Image src={images[0]} alt="" fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
      </div>
    )
  }
  return (
    <div className="grid aspect-[4/3] grid-cols-2 gap-px bg-border">
      {images.slice(0, 4).map((src) => (
        <div key={src} className="relative bg-muted">
          <Image src={src} alt="" fill className="object-cover" sizes="(min-width: 1024px) 12vw, 25vw" />
        </div>
      ))}
    </div>
  )
}

export function SeriesList({ initialSeries }: { initialSeries: SeriesSummary[] }) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="flex flex-col gap-6 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Series</h2>
          <p className="text-sm text-muted-foreground">
            Group works under one name and description. Create a series first, then upload works into it.
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <IconPlus className="size-4" />
          New series
        </Button>
      </div>

      {initialSeries.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <IconStack2 className="mb-4 size-10 text-muted-foreground" />
          <p className="font-medium">No series yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create a series with its description, then upload works straight into it.
          </p>
          <Button className="mt-4" onClick={() => setIsCreating(true)}>
            <IconPlus className="size-4" />
            New series
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {initialSeries.map((summary) => (
            <Link
              key={summary.id}
              href={`/protected/series/${summary.id}`}
              className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full overflow-hidden py-0 transition-colors hover:border-foreground/30">
                <SeriesThumb summary={summary} />
                <CardContent className="space-y-1 pb-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate font-medium">{summary.name}</p>
                    <p className="shrink-0 text-xs text-muted-foreground">
                      {summary.workCount} {summary.workCount === 1 ? "work" : "works"}
                    </p>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {summary.description || "No description yet"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <SeriesFormDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        onSaved={(created) => router.push(`/protected/series/${created.id}`)}
      />
    </div>
  )
}
