import { listSeries } from "@/lib/actions/series"
import { SeriesList } from "@/components/series/series-list"

export default async function SeriesPage() {
  const series = await listSeries()
  return <SeriesList initialSeries={series} />
}
