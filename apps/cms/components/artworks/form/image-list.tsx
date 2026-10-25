"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { IconArrowLeft, IconPhotoPlus, IconStar, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** An image already saved (a URL) or one picked but not yet uploaded (a file). */
export type ImageItem =
  | { key: string; kind: "saved"; url: string }
  | { key: string; kind: "new"; file: File; preview: string }

// Browsers can't show these, so they'd save as broken images
const UNSUPPORTED = /\.(heic|heif|tiff?|raw|cr2|nef|dng)$/i

export function imagesFromArtwork(thumbnailPath: string | null, media: string[] | null): ImageItem[] {
  // The main image is the thumbnail; media may repeat it
  const urls = [...new Set([thumbnailPath, ...(media ?? [])].filter((u): u is string => Boolean(u)))]
  return urls.map((url) => ({ key: url, kind: "saved", url }))
}

/**
 * One ordered list of a work's images. The first is the main image (shown in
 * lists and on the website); the rest are further views of the same work.
 */
export function ImageList({ images, onChange, disabled }: { images: ImageItem[]; onChange: (images: ImageItem[]) => void; disabled?: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const add = (list: FileList | File[]) => {
    const files = Array.from(list)
    const bad = files.filter((f) => UNSUPPORTED.test(f.name) || !f.type.startsWith("image/"))
    if (bad.length) toast.error(`Skipped ${bad.map((f) => f.name).join(", ")}. Export as JPEG or PNG first.`)
    const added: ImageItem[] = files
      .filter((f) => !bad.includes(f))
      .map((file) => ({ key: crypto.randomUUID(), kind: "new", file, preview: URL.createObjectURL(file) }))
    onChange([...images, ...added])
  }

  const remove = (key: string) => {
    const item = images.find((i) => i.key === key)
    if (item?.kind === "new") URL.revokeObjectURL(item.preview)
    onChange(images.filter((i) => i.key !== key))
  }

  const makeMain = (key: string) => {
    const item = images.find((i) => i.key === key)
    if (item) onChange([item, ...images.filter((i) => i.key !== key)])
  }

  const moveEarlier = (index: number) => {
    if (index <= 0) return
    const next = [...images]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    onChange(next)
  }

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((item, index) => {
            const src = item.kind === "saved" ? item.url : item.preview
            return (
              <li key={item.key} className="group">
                <div className={cn("relative aspect-square overflow-hidden rounded-md border bg-muted", index === 0 && "ring-2 ring-foreground")}>
                  <Image src={src} alt="" fill className="object-cover" sizes="160px" unoptimized={item.kind === "new"} />
                  <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    {index > 1 && (
                      <Button type="button" size="icon" variant="secondary" className="size-6" onClick={() => moveEarlier(index)} disabled={disabled} aria-label="Move earlier" title="Move earlier">
                        <IconArrowLeft className="size-3.5" />
                      </Button>
                    )}
                    <Button type="button" size="icon" variant="secondary" className="size-6" onClick={() => remove(item.key)} disabled={disabled} aria-label="Remove image" title="Remove image">
                      <IconX className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  {index === 0 ? (
                    <span className="font-medium text-foreground">Main image</span>
                  ) : (
                    <button type="button" className="inline-flex items-center gap-1 hover:text-foreground" onClick={() => makeMain(item.key)} disabled={disabled}>
                      <IconStar className="size-3" /> Make main
                    </button>
                  )}
                  {item.kind === "new" && <span>New</span>}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !disabled && input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragging(false)
          if (!disabled) add(e.dataTransfer.files)
        }}
        className={cn(
          "flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed p-4 text-sm text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isDragging ? "border-foreground bg-muted" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
      >
        <IconPhotoPlus className="size-5" />
        {images.length === 0 ? "Drop images here, or click to choose. The first is the main image." : "Add more images"}
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) add(e.target.files)
            e.target.value = ""
          }}
        />
      </div>
    </div>
  )
}
