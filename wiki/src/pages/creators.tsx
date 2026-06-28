import { Inbox } from 'lucide-react'
import { useCreators, usePosts } from '@/data/store'
import { Masthead } from '@/components/masthead'
import { CreatorList } from '@/components/creator-list'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

// Creators index (#/creators): the signature masthead → a strict Swiss dense list
// of every creator with its post count (shared CreatorList), each row linking to
// #/creator/:creator. DESIGN §4 "Creators · index" — co-equal rows on the grid,
// sorted by count then handle (useCreators).
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
          <EmptyState
            icon={Inbox}
            title="No creators yet"
            hint="Saved posts group here by creator."
          />
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
