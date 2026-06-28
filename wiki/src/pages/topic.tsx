import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { usePosts } from '@/data/store'
import { Breadcrumb } from '@/components/breadcrumb'
import { Masthead } from '@/components/masthead'
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
    <div className="mx-auto w-full max-w-[760px]">
      <Masthead
        overline="Topic"
        title={tag}
        subline={`${matches.length} ${matches.length === 1 ? 'post' : 'posts'}`}
      />
      <div className="mt-6 flex justify-center">
        <Breadcrumb
          items={[
            { label: 'Wiki', to: '/wiki' },
            { label: 'Topics', to: '/wiki#topics' },
            { label: tag },
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
          <EmptyState icon={SearchX} title={`Nothing saved under "${tag}"`} />
        )}
      </div>
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
