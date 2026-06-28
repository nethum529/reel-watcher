import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Inbox } from 'lucide-react'
import { usePosts } from '@/data/store'
import type { Post } from '@/data/types'
import { Masthead } from '@/components/masthead'
import { Breadcrumb } from '@/components/breadcrumb'
import { PostRow } from '@/components/post-row'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

// Single creator (#/creator/:creator): breadcrumb back to the index → signature
// masthead (@handle + post-count slab) → that creator's posts as dense rows,
// newest first (DESIGN §4 "Creator · post list"). Empty state when the handle has
// no posts. Rows sit directly under the page h1, so PostRow renders an h2 (the
// heading outline stays gap-free).
function CreatorBody({ creator }: { creator: string }) {
  const posts = usePosts()
  const mine = useMemo<Post[]>(
    () =>
      posts
        .filter((p) => p.creator === creator)
        .sort((a, b) => b.fetched_at - a.fetched_at),
    [posts, creator],
  )
  return (
    <>
      <Breadcrumb
        items={[{ label: 'Creators', to: '/creators' }, { label: `@${creator}` }]}
      />
      <div className="mt-4">
        <Masthead
          overline="Creator"
          title={`@${creator}`}
          slab={`${mine.length} ${mine.length === 1 ? 'post' : 'posts'}`}
        />
      </div>
      <div className="mt-8 md:mt-12">
        {mine.length > 0 ? (
          <ul className="flex flex-col">
            {mine.map((post) => (
              <li key={post.id}>
                <PostRow post={post} as="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Inbox}
            title={`No posts from @${creator}`}
            hint="This creator isn't in the archive yet."
          />
        )}
      </div>
    </>
  )
}

export function CreatorPage() {
  const { creator } = useParams<{ creator: string }>()
  return (
    <LoadBoundary>
      <CreatorBody creator={creator ?? ''} />
    </LoadBoundary>
  )
}
