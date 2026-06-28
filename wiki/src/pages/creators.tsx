import { Inbox } from 'lucide-react'
import { useCreators, usePosts } from '@/data/store'
import { Breadcrumb } from '@/components/breadcrumb'
import { CreatorList } from '@/components/creator-list'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

function CreatorsBody() {
  const posts = usePosts()
  const creators = useCreators(posts)

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Creators' }]} />
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-h2 font-medium tracking-[-0.015em] text-foreground">
          Creators
        </h1>
        <p className="font-sans text-caption text-muted-foreground">
          {creators.length} {creators.length === 1 ? 'creator' : 'creators'}
        </p>
      </header>
      {creators.length > 0 ? (
        <CreatorList creators={creators} />
      ) : (
        <EmptyState icon={Inbox} title="No creators yet" />
      )}
    </div>
  )
}

export function CreatorsPage() {
  return (
    <LoadBoundary>
      <CreatorsBody />
    </LoadBoundary>
  )
}
