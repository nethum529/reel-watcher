import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <EmptyState icon={Compass} title="That page isn't here." hint="The link may be out of date." />
      <Link
        to="/"
        className="font-sans text-label font-medium text-primary underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </div>
  )
}
