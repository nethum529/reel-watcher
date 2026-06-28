import { Link } from 'react-router-dom'
import { FileX2 } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'
import { buttonVariants } from '@/components/ui/button'

// 404 within the shell: a left-locked typographic empty state + one way back.
export function NotFoundPage() {
  return (
    <div>
      <EmptyState
        icon={FileX2}
        title="Page not found"
        hint="That route isn't in the archive."
      />
      <Link to="/browse" className={buttonVariants({ variant: 'secondary' })}>
        Go to the archive
      </Link>
    </div>
  )
}
