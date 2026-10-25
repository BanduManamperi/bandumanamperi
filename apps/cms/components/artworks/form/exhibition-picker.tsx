"use client"

import { useEffect, useMemo, useState } from "react"
import { IconPlus, IconX } from "@tabler/icons-react"
import type { ExhibitionHistory, ExhibitionType } from "@bandumanamperi/types"
import { getExhibitions, type Exhibition } from "@/lib/actions/exhibitions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/** Same show if the name and opening date match, ignoring case and spacing (as the website groups them). */
function sameShow(a: { name: string; startDate?: string | null }, b: { name: string; startDate?: string | null }) {
  const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase()
  return norm(a.name) === norm(b.name) && (a.startDate ?? "") === (b.startDate ?? "")
}

function toHistory(ex: Exhibition): ExhibitionHistory {
  return {
    name: ex.name,
    venue: ex.venue,
    about: "",
    curator: ex.curator ?? "",
    startDate: ex.startDate,
    endDate: ex.endDate ?? null,
    startTime: ex.startTime ?? null,
    endTime: ex.endTime ?? null,
    // The exhibition's own record keeps its images; the artwork only needs the link
    coverImage: null,
    exhibitionImages: [],
    type: (ex.type as ExhibitionType) || "group",
    otherArtists: ex.otherArtists ?? null,
  }
}

function formatDates(h: ExhibitionHistory) {
  if (!h.startDate) return h.dates || "No dates"
  return h.endDate && h.endDate !== h.startDate ? `${h.startDate} to ${h.endDate}` : h.startDate
}

// The exhibitions a work was shown in. Picking from existing exhibitions copies
// their exact details, so the same show isn't typed slightly differently on
// different works (which made the website list it twice).
export function ExhibitionPicker({ value, onChange, disabled }: { value: ExhibitionHistory[]; onChange: (value: ExhibitionHistory[]) => void; disabled?: boolean }) {
  const [exhibitions, setExhibitions] = useState<Exhibition[] | null>(null)
  const [manual, setManual] = useState<ExhibitionHistory | null>(null)

  useEffect(() => {
    let cancelled = false
    getExhibitions()
      .then((list) => !cancelled && setExhibitions(list))
      .catch(() => !cancelled && setExhibitions([]))
    return () => {
      cancelled = true
    }
  }, [])

  const available = useMemo(
    () => (exhibitions ?? []).filter((ex) => !value.some((h) => sameShow(h, ex))),
    [exhibitions, value]
  )

  const addExisting = (index: string) => {
    const ex = available[Number(index)]
    if (ex) onChange([...value, toHistory(ex)])
  }

  const saveManual = () => {
    if (!manual?.name.trim() || !manual.venue.trim() || !manual.startDate) return
    const match = (exhibitions ?? []).find((ex) => sameShow(ex, manual))
    // If it turns out to be a listed show, use the listed details
    onChange([...value, match ? toHistory(match) : { ...manual, name: manual.name.trim(), venue: manual.venue.trim() }])
    setManual(null)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Exhibitions</h3>

      {value.length > 0 ? (
        <ul className="divide-y rounded-md border">
          {value.map((h, i) => (
            <li key={`${h.name}-${h.startDate}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-medium">{h.name}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {h.venue} · {formatDates(h)}
                </span>
              </span>
              <Button type="button" variant="ghost" size="icon" className="size-7 shrink-0" onClick={() => onChange(value.filter((_, j) => j !== i))} disabled={disabled} aria-label={`Remove ${h.name}`}>
                <IconX className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Not in any exhibition yet.</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Select value="" onValueChange={addExisting} disabled={disabled || exhibitions === null || available.length === 0}>
          <SelectTrigger className="w-full sm:w-80">
            <SelectValue
              placeholder={
                exhibitions === null ? "Loading exhibitions…" : available.length === 0 ? "No other exhibitions to add" : "Add an existing exhibition"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {available.map((ex, i) => (
              <SelectItem key={`${ex.name}-${ex.startDate}`} value={String(i)}>
                {ex.name} ({ex.startDate?.slice(0, 4) || "n.d."}, {ex.venue})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!manual && (
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              setManual({ name: "", venue: "", about: "", curator: "", startDate: "", endDate: null, coverImage: null, exhibitionImages: [], type: "group", otherArtists: null })
            }
            disabled={disabled}
          >
            <IconPlus className="size-4" />
            Not listed? Add it by hand
          </Button>
        )}
      </div>

      {manual && (
        <div className="grid gap-2 rounded-md border p-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-xs">Exhibition name</Label>
            <Input value={manual.name} onChange={(e) => setManual({ ...manual, name: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Venue</Label>
            <Input value={manual.venue} onChange={(e) => setManual({ ...manual, venue: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Opening date</Label>
            <Input type="date" value={manual.startDate} onChange={(e) => setManual({ ...manual, startDate: e.target.value })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Closing date</Label>
            <Input type="date" value={manual.endDate ?? ""} onChange={(e) => setManual({ ...manual, endDate: e.target.value || null })} />
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            For a show that will appear on several works, create it under Exhibitions instead, then pick it here.
          </p>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="button" size="sm" onClick={saveManual} disabled={!manual.name.trim() || !manual.venue.trim() || !manual.startDate}>
              Add
            </Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setManual(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
