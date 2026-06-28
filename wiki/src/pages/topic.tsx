import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Inbox } from 'lucide-react'
import { usePosts } from '@/data/store'
import { Masthead } from '@/components/masthead'
import { Breadcrumb } from '@/components/breadcrumb'
import { PostRow } from '@/components/post-row'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

// A single topic (#/topic/:tag): the signature masthead (TOPIC eyebrow → the tag
// as the Anton headline beside a single Orchid count slab → 2px rule), a
// breadcrumb back to the Topics index, then the dense list of posts carrying this
// tag (newest first — DESIGN §4 "dense"). Empty state when the tag has no posts.
function TopicBody({ tag }: { tag: string }) {
  const posts = usePosts()
  const tagged = useMemo(
    () =>
      posts
        .filter((post) => post.tags.includes(tag))
        .sort((a, b) => b.fetched_at - a.fetched_at),
    [posts, tag],
  )

  return (
    <>
      <Masthead
        overline="Topic"
        title={tag}
        slab={`${tagged.length} ${tagged.length === 1 ? 'post' : 'posts'}`}
      />
      <div className="mt-8 md:mt-12">
        <Breadcrumb
          items={[
            { label: 'Browse', to: '/browse' },
            { label: 'Topics', to: '/topics' },
            { label: tag },
          ]}
        />
        {tagged.length > 0 ? (
          // Posts are the section directly under the page h1, so each row title is
          // an h2 — keeps the heading outline gap-free (DESIGN §8.1).
          <ul className="mt-6">
            {tagged.map((post) => (
              <li key={post.id}>
                <PostRow post={post} as="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Inbox}
            title="No posts under this topic"
            hint={`Nothing is tagged “${tag}”.`}
          />
        )}
      </div>
    </>
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
