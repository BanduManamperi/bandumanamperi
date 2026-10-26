"use client"

import Image from "next/image"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type TitleChoiceKind = "edition" | "version" | "series" | "separate"

export type TitleChoiceValue = {
  kind: TitleChoiceKind | null
  number: number
  /** Edition only: total editions, recorded on the original */
  editionSize: number | null
}

/** The existing work a new title collides with, and the numbers to offer. */
export type TitleChoiceOriginal = {
  title: string
  year: string | null
  thumbnailPath: string | null
  editionSize: number | null
  seriesName: string | null
  /** True when the "original" is another work in the same upload, not yet saved */
  inThisUpload?: boolean
  count: number
  nextEditionNumber: number
  nextVersionNumber: number
  nextSeriesNumber: number
}

export function defaultNumber(kind: TitleChoiceKind, original: TitleChoiceOriginal): number {
  if (kind === "edition") return original.nextEditionNumber
  if (kind === "version") return original.nextVersionNumber
  if (kind === "series") return original.nextSeriesNumber
  return 1
}

/** Short label for a decided choice, e.g. "Edition 2 of 5". */
export function describeChoice(value: TitleChoiceValue, title: string): string {
  switch (value.kind) {
    case "edition":
      return `Edition ${value.number}${value.editionSize ? ` of ${value.editionSize}` : ""}`
    case "version":
      return `Version ${value.number}`
    case "series":
      return `${title}, no. ${value.number}`
    case "separate":
      return "Separate work"
    default:
      return "Not decided"
  }
}

const OPTIONS: { kind: TitleChoiceKind; label: string; hint: (o: TitleChoiceOriginal) => string }[] = [
  { kind: "edition", label: "Edition", hint: () => "A numbered copy of the same work: a print, cast or photograph." },
  { kind: "version", label: "Version", hint: () => "Another take on the same work, unnumbered as an edition." },
  {
    kind: "series",
    label: "Add to series",
    hint: (o) =>
      o.seriesName
        ? `A different work in the series “${o.seriesName}”.`
        : "A different work made as a set under this title. Both go into a new series.",
  },
  { kind: "separate", label: "Separate work", hint: () => "Unrelated; the shared title is a coincidence." },
]

// Shown when a title is already in use: which existing work it matches, and
// what this new work is in relation to it. Nothing saves until one is picked.
export function TitleChoice({
  title,
  original,
  value,
  onChange,
  compact = false,
}: {
  title: string
  original: TitleChoiceOriginal
  value: TitleChoiceValue
  onChange: (value: TitleChoiceValue) => void
  compact?: boolean
}) {
  const pick = (kind: TitleChoiceKind) =>
    onChange({ kind, number: defaultNumber(kind, original), editionSize: kind === "edition" ? original.editionSize : null })

  const where = original.inThisUpload ? "another work in this upload" : original.count > 1 ? `${original.count} works` : "an existing work"

  return (
    <div className={cn("rounded-md border border-amber-500/40 bg-amber-500/5", compact ? "p-3" : "p-4")} role="group" aria-label="Title already in use">
      <div className="flex items-start gap-3">
        {original.thumbnailPath && (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border bg-muted">
            <Image src={original.thumbnailPath} alt="" fill className="object-cover" sizes="48px" />
          </div>
        )}
        <p className="text-sm">
          <span className="font-medium">“{title}”</span> is already used by {where}
          {original.year ? ` (${original.year})` : ""}. What is this work?
        </p>
      </div>

      <div className={cn("mt-3 grid gap-2", compact ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2")}>
        {OPTIONS.map((option) => (
          <button
            key={option.kind}
            type="button"
            onClick={() => pick(option.kind)}
            aria-pressed={value.kind === option.kind}
            className={cn(
              "rounded-md border bg-background p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              value.kind === option.kind ? "border-foreground" : "hover:border-foreground/40"
            )}
          >
            <span className="block text-sm font-medium">{option.label}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{option.hint(original)}</span>
          </button>
        ))}
      </div>

      {(value.kind === "edition" || value.kind === "version" || value.kind === "series") && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">{value.kind === "series" ? "Number in series" : value.kind === "edition" ? "Edition" : "Version"}</span>
          <Input
            type="number"
            min={1}
            className="h-8 w-20"
            value={value.number}
            onChange={(e) => onChange({ ...value, number: Math.max(1, Number(e.target.value) || 1) })}
            aria-label="Number"
          />
          {value.kind === "edition" && (
            <>
              <span className="text-muted-foreground">of</span>
              <Input
                type="number"
                min={1}
                className="h-8 w-20"
                placeholder="?"
                value={value.editionSize ?? ""}
                onChange={(e) => onChange({ ...value, editionSize: e.target.value ? Math.max(1, Number(e.target.value)) : null })}
                aria-label="Edition size"
              />
            </>
          )}
          <span className="text-muted-foreground">Shown as “{describeChoice(value, title)}”</span>
        </div>
      )}
    </div>
  )
}
