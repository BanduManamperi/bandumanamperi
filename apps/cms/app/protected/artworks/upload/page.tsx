import { listSeries } from "@/lib/actions/series"
import { BulkUpload } from "@/components/artworks/upload/bulk-upload"

export default async function UploadArtworksPage({ searchParams }: { searchParams: Promise<{ series?: string }> }) {
  const [{ series }, allSeries] = await Promise.all([searchParams, listSeries()])
  return <BulkUpload initialSeries={allSeries} preselectedSeriesId={series ?? null} />
}
