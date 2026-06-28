import { Inbox } from 'lucide-react'
import { usePosts, useTopics } from '@/data/store'
import { Masthead } from '@/components/masthead'
import { TopicGrid } from '@/components/topic-grid'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

// The Topics index (#/topics): the signature masthead (INDEX eyebrow → "TOPICS"
// Anton headline beside a single Orchid count slab → 2px rule), then a strict
// Swiss grid of every tag with its post count, each tile linking to #/topic/:tag.
// "Index" cadence is medium-density (co-equal tiles) — DESIGN §4.
function TopicsBody() {
  const posts = usePosts()
  const topics = useTopics(posts)
  return (
    <>
      <Masthead
        overline="Index"
        title="Topics"
        slab={`${topics.length} ${topics.length === 1 ? 'topic' : 'topics'}`}
      />
      <div className="mt-8 md:mt-12">
        {topics.length > 0 ? (
          <TopicGrid topics={topics} />
        ) : (
          <EmptyState icon={Inbox} title="No topics yet" hint="Saved posts group here by tag." />
        )}
      </div>
    </>
  )
}

export function TopicsPage() {
  return (
    <LoadBoundary>
      <TopicsBody />
    </LoadBoundary>
  )
}
