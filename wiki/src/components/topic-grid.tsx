import { Link } from 'react-router-dom'
import type { TopicSummary } from '@/data/types'

// Topics index (DESIGN §4 "medium" density): a real grid, since topics are
// co-equal. Each tile is a card-shaped link; depth = border + surface step.
export function TopicGrid({ topics }: { topics: TopicSummary[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {topics.map((topic) => (
        <li key={topic.tag}>
          <Link
            to={`/topic/${encodeURIComponent(topic.tag)}`}
            className="flex h-full items-baseline justify-between gap-3 rounded-lg border border-border bg-card px-4 py-4 transition-colors hover:bg-accent active:bg-accent-subtle"
          >
            <span className="font-serif text-title font-medium tracking-[-0.005em] text-foreground">
              {topic.tag}
            </span>
            <span className="tnum shrink-0 font-sans text-caption text-muted-foreground">
              {topic.count} {topic.count === 1 ? 'post' : 'posts'}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
