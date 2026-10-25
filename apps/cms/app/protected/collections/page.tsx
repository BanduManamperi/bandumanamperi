import { redirect } from "next/navigation"

// Collections were renamed to series
export default function CollectionsPage() {
  redirect("/protected/series")
}
