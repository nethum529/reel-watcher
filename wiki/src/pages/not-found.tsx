import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { Icon } from '@/components/icon'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-4 py-16 text-center">
      <Icon icon={Compass} size={32} className="text-muted-foreground" />
      <h1 className="font-display text-display font-normal tracking-[-0.02em] text-foreground">
        That page isn't here.
      </h1>
      <p className="font-sans text-caption text-muted-foreground">The link may be out of date.</p>
      <Link
        to="/wiki"
        className="mt-2 flex min-h-11 items-center font-sans text-label font-medium text-primary underline-offset-4 hover:text-gold-hover hover:underline"
      >
        Back to the archive
      </Link>
    </div>
  )
}
