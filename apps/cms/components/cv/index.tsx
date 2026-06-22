"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  CVEntry,
  CVSection,
  CV_SECTIONS,
  CV_SECTION_LABELS,
} from "@/lib/types/cv"
import {
  createCVEntry,
  updateCVEntry,
  deleteCVEntry,
  reorderCVEntries,
} from "@/lib/actions/cv"

interface CVManagerProps {
  initialEntries: CVEntry[]
}

const EMPTY_FORM = {
  year: "",
  title: "",
  subtitle: "",
  section: "education" as CVSection,
}

export function CVManager({ initialEntries }: CVManagerProps) {
  const router = useRouter()
  const [entries, setEntries] = useState<CVEntry[]>(initialEntries)
  const [activeSection, setActiveSection] = useState<CVSection>("education")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<CVEntry | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [isSaving, setIsSaving] = useState(false)

  const sectionEntries = entries
    .filter((e) => e.section === activeSection)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const openAdd = () => {
    setEditingEntry(null)
    setForm({ ...EMPTY_FORM, section: activeSection })
    setIsDialogOpen(true)
  }

  const openEdit = (entry: CVEntry) => {
    setEditingEntry(entry)
    setForm({
      year: entry.year,
      title: entry.title,
      subtitle: entry.subtitle ?? "",
      section: entry.section,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required")
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        section: form.section,
        year: form.year.trim(),
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
      }

      if (editingEntry) {
        const updated = await updateCVEntry({ id: editingEntry.id, ...payload })
        setEntries((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e))
        )
        toast.success("Entry updated")
      } else {
        const maxOrder = entries
          .filter((e) => e.section === form.section)
          .reduce((max, e) => Math.max(max, e.sortOrder), -1)
        const created = await createCVEntry({ ...payload, sortOrder: maxOrder + 1 })
        setEntries((prev) => [...prev, created])
        toast.success("Entry added")
      }

      setIsDialogOpen(false)
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save entry")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (entry: CVEntry) => {
    if (!confirm(`Delete "${entry.title}"?`)) return
    try {
      await deleteCVEntry(entry.id)
      setEntries((prev) => prev.filter((e) => e.id !== entry.id))
      toast.success("Entry deleted")
      router.refresh()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete entry")
    }
  }

  const move = async (entry: CVEntry, direction: "up" | "down") => {
    const list = [...sectionEntries]
    const idx = list.findIndex((e) => e.id === entry.id)
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= list.length) return

    const newList = [...list]
    ;[newList[idx], newList[swapIdx]] = [newList[swapIdx], newList[idx]]
    const updates = newList.map((e, i) => ({ id: e.id, sortOrder: i }))

    const updatedMap = new Map(updates.map((u) => [u.id, u.sortOrder]))
    setEntries((prev) =>
      prev.map((e) =>
        updatedMap.has(e.id) ? { ...e, sortOrder: updatedMap.get(e.id)! } : e
      )
    )

    try {
      await reorderCVEntries(updates)
    } catch {
      toast.error("Failed to reorder")
    }
  }

  const totalBySection = (section: CVSection) =>
    entries.filter((e) => e.section === section).length

  return (
    <div className="@container/main flex flex-1 flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-4 pt-6 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Curriculum Vitae</h1>
          <p className="text-muted-foreground">
            Changes publish to the website immediately
          </p>
        </div>
        <Button onClick={openAdd} className="shrink-0">
          <IconPlus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      {/* Section picker */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Select
            value={activeSection}
            onValueChange={(v) => setActiveSection(v as CVSection)}
          >
            <SelectTrigger className="w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CV_SECTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  <span className="flex items-center gap-2">
                    {CV_SECTION_LABELS[s]}
                    {totalBySection(s) > 0 && (
                      <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                        {totalBySection(s)}
                      </Badge>
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" onClick={openAdd}>
            <IconPlus className="h-3.5 w-3.5 mr-1.5" />
            Add to section
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="px-4 pb-6 lg:px-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead className="w-24">Year</TableHead>
                <TableHead>Title & Details</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sectionEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    No entries yet.{" "}
                    <button onClick={openAdd} className="underline hover:text-foreground">
                      Add one
                    </button>
                  </TableCell>
                </TableRow>
              ) : (
                sectionEntries.map((entry, idx) => (
                  <TableRow key={entry.id}>
                    <TableCell className="px-2">
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => move(entry, "up")}
                          disabled={idx === 0}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                        >
                          <IconArrowUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => move(entry, "down")}
                          disabled={idx === sectionEntries.length - 1}
                          className="text-muted-foreground hover:text-foreground disabled:opacity-20"
                        >
                          <IconArrowDown className="h-3 w-3" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono align-top pt-3">
                      {entry.year}
                    </TableCell>
                    <TableCell className="py-3">
                      <p className="text-sm font-medium">{entry.title}</p>
                      {entry.subtitle && (
                        <p className="text-xs text-muted-foreground mt-0.5">{entry.subtitle}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-right align-top pt-2">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(entry)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(entry)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Edit Entry" : "Add Entry"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Section</Label>
              <Select
                value={form.section}
                onValueChange={(v) => setForm((f) => ({ ...f, section: v as CVSection }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CV_SECTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {CV_SECTION_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Year</Label>
              <Input
                placeholder="e.g. 2024, 2020–Present"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                placeholder="Entry title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Subtitle / Details</Label>
              <Textarea
                placeholder="Institution, location, additional details…"
                rows={3}
                value={form.subtitle}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving…" : editingEntry ? "Save Changes" : "Add Entry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
