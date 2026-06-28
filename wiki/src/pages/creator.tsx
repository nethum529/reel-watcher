import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { usePosts } from '@/data/store'
import { Breadcrumb } from '@/components/breadcrumb'
import { Masthead } from '@/components/masthead'
import { PostRow } from '@/components/post-row'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

function CreatorBody({ creator }: { creator: string }) {
  const posts = usePosts()
  const matches = useMemo(
    () =>
      posts
        .filter((p) => p.creator === creator)
        .sort((a, b) => b.fetched_at - a.fetched_at),
    [posts, creator],
  )
  const source = matches[0]?.source

  return (
    <div className="mx-auto w-full max-w-[760px]">
      <Masthead
        overline="Creator"
        title={`@${creator}`}
        subline={`${source ? `${source} · ` : ''}${matches.length} ${
          matches.length === 1 ? 'post' : 'posts'
        }`}
      />
      <div className="mt-6 flex justify-center">
        <Breadcrumb
          items={[
            { label: 'Wiki', to: '/wiki' },
            { label: 'Creators', to: '/wiki#creators' },
            { label: `@${creator}` },
          ]}
        />
      </div>

      <div className="mt-16 md:mt-24">
        {matches.length > 0 ? (
          <ul className="flex flex-col">
            {matches.map((post) => (
              <li key={post.id}>
                <PostRow post={post} as="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={SearchX} title={`Nothing saved from @${creator}`} />
        )}
      </div>
    </div>
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
