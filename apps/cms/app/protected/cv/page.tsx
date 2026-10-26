import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CVManager } from "@/components/cv"
import { getCVEntries } from "@/lib/actions/cv"

export const metadata = {
  title: "CV | CMS",
  description: "Manage curriculum vitae entries",
}

async function CVContent() {
  const entries = await getCVEntries()
  return <CVManager initialEntries={entries} />
}

function CVLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function CVPage() {
  return (
    <Suspense fallback={<CVLoading />}>
      <CVContent />
    </Suspense>
  )
}
