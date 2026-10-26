import { notFound } from "next/navigation"
import { getSeries } from "@/lib/actions/series"
import { SeriesDetail } from "@/components/series/series-detail"

export default async function SeriesDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await getSeries(id)
  if (!result) notFound()
  return <SeriesDetail series={result.series} works={result.works} />
}
