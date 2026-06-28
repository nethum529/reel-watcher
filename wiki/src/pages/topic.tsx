import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { usePosts } from '@/data/store'
import { Breadcrumb } from '@/components/breadcrumb'
import { PostRow } from '@/components/post-row'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

function TopicBody({ tag }: { tag: string }) {
  const posts = usePosts()
  const matches = useMemo(
    () =>
      posts
        .filter((p) => p.tags.includes(tag))
        .sort((a, b) => b.fetched_at - a.fetched_at),
    [posts, tag],
  )

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-4">
        <Breadcrumb
          items={[{ label: 'Home', to: '/' }, { label: 'Topics', to: '/topics' }, { label: tag }]}
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-h2 font-medium tracking-[-0.015em] text-foreground">
            {tag}
          </h1>
          <p className="font-sans text-caption text-muted-foreground">
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
        <EmptyState icon={SearchX} title={`Nothing saved under "${tag}"`} />
      )}
    </div>
  )
}

export function TopicPage() {
  const { tag } = useParams<{ tag: string }>()
  return (
    <LoadBoundary>
      <TopicBody tag={tag ?? ''} />
    </LoadBoundary>
  )
}
