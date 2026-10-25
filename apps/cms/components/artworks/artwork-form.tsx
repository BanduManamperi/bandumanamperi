"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type {
  Artwork,
  ArtworkInsert,
  ArtworkUpdate,
  ArtworkStatus,
  ArtworkAvailability,
  ExhibitionHistory,
} from "@/lib/types/artwork"
import { createArtwork, updateArtwork } from "@/lib/actions/artworks"
import { findTitleMatches, resolveTitleDecision, type TitleMatch } from "@/lib/actions/series"
import { discardUploads, uploadImage } from "@/lib/storage/images"
import { TitleChoice, type TitleChoiceValue } from "@/components/artworks/title-choice"
import { ImageList, imagesFromArtwork, type ImageItem } from "@/components/artworks/form/image-list"
import { SeriesPicker, type SeriesPick } from "@/components/artworks/form/series-picker"
import { ExhibitionPicker } from "@/components/artworks/form/exhibition-picker"
import { generateSlug, validateSlug } from "@/lib/utils/slug"

interface ArtworkFormProps {
  artwork?: Artwork | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ArtworkForm({ artwork, open, onOpenChange }: ArtworkFormProps) {
  const router = useRouter()
  const isEditing = !!artwork

  const [formData, setFormData] = useState<ArtworkInsert>({
    title: null,
    year: null,
    description: null,
    link: null,
    featured: false,
    category: null,
    medium: null,
    width: null,
    height: null,
    depth: null,
    unit: "cm",
    slug: null,
    status: "draft",
    tags: [],
    series: null,
    materials: null,
    technique: null,
    location: null,
    availability: "available",
    price: null,
    currency: "USD",
    priceUponRequest: false,
    collectorName: null,
    sortOrder: 0,
    thumbnailPath: null,
    artistNotes: null,
    dateCreated: null,
    exhibitionHistory: [],
    media: [],
  })

  const [isLoading, setIsLoading] = useState(false)
  // Duplicate-title check: the title that was checked, what it matched, and the user's answer
  const [checkedTitle, setCheckedTitle] = useState<string | null>(null)
  const [titleMatch, setTitleMatch] = useState<TitleMatch | null>(null)
  const [titleChoice, setTitleChoice] = useState<TitleChoiceValue>({ kind: null, number: 1, editionSize: null })
  const [tagInput, setTagInput] = useState("")
  // The work's images in order; the first is the main image
  const [images, setImages] = useState<ImageItem[]>([])
  const [seriesPick, setSeriesPick] = useState<SeriesPick>({ seriesId: null, seriesNumber: null })
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true)
  const [exhibitionHistory, setExhibitionHistory] = useState<ExhibitionHistory[]>([])

  useEffect(() => {
    if (artwork) {
      setFormData({
        title: artwork.title,
        year: artwork.year,
        description: artwork.description,
        link: artwork.link,
        featured: artwork.featured,
        category: artwork.category,
        medium: artwork.medium,
        width: artwork.width,
        height: artwork.height,
        depth: artwork.depth,
        unit: artwork.unit,
        slug: artwork.slug,
        status: artwork.status,
        tags: artwork.tags || [],
        series: artwork.series,
        materials: artwork.materials,
        technique: artwork.technique,
        location: artwork.location,
        availability: artwork.availability,
        price: artwork.price,
        currency: artwork.currency,
        priceUponRequest: artwork.priceUponRequest,
        collectorName: artwork.collectorName,
        sortOrder: artwork.sortOrder,
        thumbnailPath: artwork.thumbnailPath,
        artistNotes: artwork.artistNotes,
        dateCreated: artwork.dateCreated,
        exhibitionHistory: artwork.exhibitionHistory || [],
        media: artwork.media || [],
      })
      setAutoGenerateSlug(false)
      setImages(imagesFromArtwork(artwork.thumbnailPath, artwork.media))
      setSeriesPick({ seriesId: artwork.seriesId ?? null, seriesNumber: artwork.seriesNumber ?? null })
      setExhibitionHistory(artwork.exhibitionHistory || [])
    } else {
      setFormData({
        title: null,
        year: null,
        description: null,
        link: null,
        featured: false,
        category: null,
        medium: null,
        width: null,
        height: null,
        depth: null,
        unit: "cm",
        slug: null,
        status: "draft",
        tags: [],
        series: null,
        materials: null,
        technique: null,
        location: null,
        availability: "available",
        price: null,
        currency: "USD",
        priceUponRequest: false,
        collectorName: null,
        sortOrder: 0,
        thumbnailPath: null,
        artistNotes: null,
        dateCreated: null,
        exhibitionHistory: [],
        media: [],
      })
      setAutoGenerateSlug(true)
      setImages([])
      setSeriesPick({ seriesId: null, seriesNumber: null })
      setExhibitionHistory([])
    }
  }, [artwork, open])

  // Auto-generate slug from title
  useEffect(() => {
    if (autoGenerateSlug && formData.title) {
      const slug = generateSlug(formData.title)
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.title, autoGenerateSlug])

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    let uploadedThisSave: string[] = []

    try {
      // Validate required fields
      if (!formData.title) {
        toast.error("Title is required")
        return
      }

      if (formData.slug && !validateSlug(formData.slug)) {
        toast.error("Invalid slug format. Use only lowercase letters, numbers, and hyphens.")
        return
      }

      // A title already in use must be answered: edition, version, series or separate work
      const sameAsBefore = isEditing && formData.title.trim().toLowerCase() === (artwork?.title ?? "").trim().toLowerCase()
      if (!sameAsBefore) {
        if (checkedTitle !== formData.title) {
          const matches = await findTitleMatches(formData.title, artwork?.id)
          setCheckedTitle(formData.title)
          setTitleMatch(matches[0] ?? null)
          setTitleChoice({ kind: null, number: 1, editionSize: null })
          if (matches.length > 0) {
            toast.info("This title is already used. Choose what this work is, then save again.")
            return
          }
        } else if (titleMatch && !titleChoice.kind) {
          toast.error("Choose what this work is before saving.")
          return
        }
      }

      // Upload new images in list order; the first image is the main one
      uploadedThisSave = []
      const imageUrls: string[] = []
      for (const [index, item] of images.entries()) {
        if (item.kind === "saved") {
          imageUrls.push(item.url)
        } else {
          const url = await uploadImage(item.file, index === 0 ? "thumbnails" : "media")
          uploadedThisSave.push(url)
          imageUrls.push(url)
        }
      }

      const relation =
        titleMatch && checkedTitle === formData.title && titleChoice.kind && titleChoice.kind !== "separate"
          ? await resolveTitleDecision({
              kind: titleChoice.kind,
              originalId: titleMatch.original.id,
              number: titleChoice.number,
              editionSize: titleChoice.editionSize,
            })
          : {}

      const artworkData: ArtworkInsert = {
        ...formData,
        // The series is set by its id; the database fills in the name
        series: undefined,
        seriesId: seriesPick.seriesId,
        seriesNumber: seriesPick.seriesId ? seriesPick.seriesNumber : null,
        // A duplicate-title decision (edition, version, series) wins over the picker
        ...relation,
        thumbnailPath: imageUrls[0] ?? null,
        media: imageUrls,
        exhibitionHistory: exhibitionHistory.filter(
          (e) => e.name && e.venue && (e.startDate || e.dates)
        ),
      }

      if (isEditing && artwork) {
        const updateData: ArtworkUpdate = {
          id: artwork.id,
          ...artworkData,
        }
        await updateArtwork(updateData)
        toast.success("Artwork updated successfully")
      } else {
        await createArtwork(artworkData)
        toast.success("Artwork created successfully")
      }

      onOpenChange(false)
      setTimeout(() => {
        router.refresh()
      }, 100)
    } catch (error) {
      if (uploadedThisSave.length > 0) await discardUploads(uploadedThisSave)
      console.error("Error saving artwork:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to save artwork"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Artwork" : "New Artwork"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update artwork information"
              : "Create a new artwork entry"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={formData.year || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, year: e.target.value }))
                  }
                  placeholder="2024"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                type="url"
                value={formData.link || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, link: e.target.value }))
                }
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Categorization */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Categorization</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medium">Medium</Label>
                <Input
                  id="medium"
                  value={formData.medium || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, medium: e.target.value }))
                  }
                />
              </div>
            </div>
            <SeriesPicker value={seriesPick} onChange={setSeriesPick} disabled={isLoading} />
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="Add a tag and press Enter"
                />
                <Button type="button" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Dimensions</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  step="0.01"
                  value={formData.width || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      width: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  value={formData.height || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      height: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="depth">Depth</Label>
                <Input
                  id="depth"
                  type="number"
                  step="0.01"
                  value={formData.depth || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      depth: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, unit: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="m">m</SelectItem>
                    <SelectItem value="in">in</SelectItem>
                    <SelectItem value="ft">ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Additional Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="materials">Materials</Label>
                <Textarea
                  id="materials"
                  value={formData.materials || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      materials: e.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technique">Technique</Label>
                <Input
                  id="technique"
                  value={formData.technique || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      technique: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artistNotes">Artist Notes</Label>
              <Textarea
                id="artistNotes"
                value={formData.artistNotes || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    artistNotes: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>

          {/* Status & Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Status & Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: ArtworkStatus) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={formData.availability}
                  onValueChange={(value: ArtworkAvailability) =>
                    setFormData((prev) => ({ ...prev, availability: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="on_loan">On Loan</SelectItem>
                    <SelectItem value="private_collection">Private Collection</SelectItem>
                    <SelectItem value="nfs">Not For Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder || 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sortOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                  disabled={formData.priceUponRequest}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, currency: value }))
                  }
                  disabled={formData.priceUponRequest}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="LKR">LKR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateCreated">Date Created</Label>
                <Input
                  id="dateCreated"
                  type="date"
                  value={formData.dateCreated || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dateCreated: e.target.value || null,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="collectorName">Collector Name</Label>
                <Input
                  id="collectorName"
                  value={formData.collectorName || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      collectorName: e.target.value || null,
                    }))
                  }
                  placeholder="Name of collector (if applicable)"
                />
              </div>
              <div className="flex items-end pb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="priceUponRequest"
                    checked={formData.priceUponRequest}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, priceUponRequest: !!checked }))
                    }
                  />
                  <Label htmlFor="priceUponRequest" className="cursor-pointer">
                    Price upon request
                  </Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={formData.slug || ""}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    setAutoGenerateSlug(false)
                  }}
                  placeholder="auto-generated-from-title"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAutoGenerateSlug(true)}
                >
                  Auto
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, featured: !!checked }))
                }
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Featured artwork
              </Label>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Images</h3>
            <ImageList images={images} onChange={setImages} disabled={isLoading} />
          </div>

          <ExhibitionPicker value={exhibitionHistory} onChange={setExhibitionHistory} disabled={isLoading} />

          {titleMatch && checkedTitle === formData.title && (
            <TitleChoice
              title={(formData.title ?? "").trim()}
              original={{
                title: titleMatch.original.title,
                year: titleMatch.original.year,
                thumbnailPath: titleMatch.original.thumbnailPath,
                editionSize: titleMatch.original.editionSize,
                seriesName: titleMatch.original.seriesName,
                count: titleMatch.count,
                nextEditionNumber: titleMatch.nextEditionNumber,
                nextVersionNumber: titleMatch.nextVersionNumber,
                nextSeriesNumber: titleMatch.nextSeriesNumber,
              }}
              value={titleChoice}
              onChange={setTitleChoice}
            />
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

