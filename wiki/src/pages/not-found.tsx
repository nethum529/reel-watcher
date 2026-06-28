import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Icon } from '@/components/icon'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
      <Icon icon={Compass} size={32} className="text-muted-foreground" />
      <h1 className="font-serif text-h2 font-medium tracking-[-0.015em] text-foreground">
        That page isn't here.
      </h1>
      <p className="font-sans text-caption text-muted-foreground">The link may be out of date.</p>
      <Link
        to="/"
        className="mt-2 font-sans text-label font-medium text-primary underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </div>
  )
}
