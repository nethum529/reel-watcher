import { Inbox } from 'lucide-react'
import { usePosts, useTopics } from '@/data/store'
import { Masthead } from '@/components/masthead'
import { TopicGrid } from '@/components/topic-grid'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

// STUB (leg-Topics may extend: sorting/filtering). The index grid itself is
// trivial, so it renders for real from the shared TopicGrid.
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
