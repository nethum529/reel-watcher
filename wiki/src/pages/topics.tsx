import { Inbox } from 'lucide-react'
import { usePosts, useTopics } from '@/data/store'
import { Breadcrumb } from '@/components/breadcrumb'
import { TopicGrid } from '@/components/topic-grid'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

function TopicsBody() {
  const posts = usePosts()
  const topics = useTopics(posts)

  return (
    <div className="flex flex-col gap-8">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Topics' }]} />
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-h2 font-medium tracking-[-0.015em] text-foreground">
          Topics
        </h1>
        <p className="font-sans text-caption text-muted-foreground">
          {topics.length} {topics.length === 1 ? 'topic' : 'topics'}
        </p>
      </header>
      {topics.length > 0 ? (
        <TopicGrid topics={topics} />
      ) : (
        <EmptyState icon={Inbox} title="No topics yet" />
      )}
    </div>
  )
}

export function TopicsPage() {
  return (
    <LoadBoundary>
      <TopicsBody />
    </LoadBoundary>
  )
}
