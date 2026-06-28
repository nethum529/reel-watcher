import type { ReactNode } from 'react'
import { OctagonAlert } from 'lucide-react'
import { useData } from '@/data/store'
import { EmptyState } from '@/components/empty-state'
import { PostRowSkeleton } from '@/components/skeleton'

// Gates page content on the single data.json load. Children only mount once
// ready, so they can call usePosts() and get real data.
export function LoadBoundary({
  children,
  skeleton,
}: {
  children: ReactNode
  skeleton?: ReactNode
}) {
  const state = useData()
  if (state.status === 'loading') return <>{skeleton ?? <PostRowSkeleton />}</>
  if (state.status === 'error') {
    return (
      <EmptyState
        icon={OctagonAlert}
        title="Couldn't load the archive"
        hint={state.error}
      />
    )
  }
  return <>{children}</>
}
