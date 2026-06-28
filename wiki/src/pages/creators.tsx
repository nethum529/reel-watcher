import { Inbox } from 'lucide-react'
import { useCreators, usePosts } from '@/data/store'
import { Masthead } from '@/components/masthead'
import { CreatorList } from '@/components/creator-list'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

// STUB (leg-Creators may extend: avatars/platform grouping). The index list is
// trivial, so it renders for real from the shared CreatorList.
function CreatorsBody() {
  const posts = usePosts()
  const creators = useCreators(posts)
  return (
    <>
      <Masthead
        overline="Index"
        title="Creators"
        slab={`${creators.length} ${creators.length === 1 ? 'creator' : 'creators'}`}
      />
      <div className="mt-8 md:mt-12">
        {creators.length > 0 ? (
          <CreatorList creators={creators} />
        ) : (
          <EmptyState icon={Inbox} title="No creators yet" />
        )}
      </div>
    </>
  )
}

export function CreatorsPage() {
  return (
    <LoadBoundary>
      <CreatorsBody />
    </LoadBoundary>
  )
}
