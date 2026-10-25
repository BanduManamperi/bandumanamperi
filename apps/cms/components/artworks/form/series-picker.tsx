"use client"

import { useEffect, useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { getNextSeriesNumber, listSeries, type SeriesSummary } from "@/lib/actions/series"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SeriesFormDialog } from "@/components/series/series-form-dialog"

const NONE = "none"

export type SeriesPick = { seriesId: string | null; seriesNumber: number | null }

// Choose the series a work belongs to (or none), and optionally its number in
// it. Picking a series suggests the next free number.
export function SeriesPicker({ value, onChange, disabled }: { value: SeriesPick; onChange: (value: SeriesPick) => void; disabled?: boolean }) {
  const [series, setSeries] = useState<Pick<SeriesSummary, "id" | "name" | "description">[] | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    let cancelled = false
    listSeries()
      .then((list) => !cancelled && setSeries(list))
      .catch(() => !cancelled && setSeries([]))
    return () => {
      cancelled = true
    }
  }, [])

  const choose = async (id: string) => {
    if (id === NONE) {
      onChange({ seriesId: null, seriesNumber: null })
      return
    }
    onChange({ seriesId: id, seriesNumber: null })
    const next = await getNextSeriesNumber(id).catch(() => null)
    if (next) onChange({ seriesId: id, seriesNumber: next })
  }

  const selected = series?.find((s) => s.id === value.seriesId)

  return (
    <div className="space-y-2">
      <Label>Series</Label>
      <div className="flex gap-2">
        <Select value={value.seriesId ?? NONE} onValueChange={choose} disabled={disabled || series === null}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder={series === null ? "Loading series…" : undefined} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>Not in a series</SelectItem>
            {(series ?? []).map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {value.seriesId && (
          <Input
            type="number"
            min={1}
            className="w-24"
            placeholder="No."
            aria-label="Number in series"
            value={value.seriesNumber ?? ""}
            onChange={(e) => onChange({ ...value, seriesNumber: e.target.value ? Math.max(1, Number(e.target.value)) : null })}
            disabled={disabled}
          />
        )}
        <Button type="button" variant="outline" onClick={() => setIsCreating(true)} disabled={disabled}>
          <IconPlus className="size-4" />
          New
        </Button>
      </div>
      {selected && (
        <p className="text-xs text-muted-foreground">
          {selected.description
            ? "Without a description of its own, this work shows the series description on the website."
            : "This series has no description yet."}
          {" "}Leave the number empty if the series isn't numbered.
        </p>
      )}

      <SeriesFormDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        onSaved={(created) => {
          setSeries((list) => [...(list ?? []), created])
          onChange({ seriesId: created.id, seriesNumber: 1 })
        }}
      />
    </div>
  )
}
