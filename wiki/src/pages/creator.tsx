import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { usePosts } from '@/data/store'
import { Breadcrumb } from '@/components/breadcrumb'
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
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Creators', to: '/creators' },
            { label: `@${creator}` },
          ]}
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-h2 font-medium tracking-[-0.015em] text-foreground">
            @{creator}
          </h1>
          <p className="font-sans text-caption text-muted-foreground">
            {source ? `${source} · ` : ''}
            {matches.length} {matches.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </header>

      {matches.length > 0 ? (
        <ul className="flex flex-col">
          {matches.map((post) => (
            <li key={post.id}>
              <PostRow post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={SearchX} title={`Nothing saved from @${creator}`} />
      )}
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
