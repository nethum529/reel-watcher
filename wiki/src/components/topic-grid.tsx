import { Link } from 'react-router-dom'
import type { TopicSummary } from '@/data/types'

// Topics index (DESIGN §4 "medium" density): an honest grid, since topics are
// co-equal. Each tile is a SQUARE card-link — depth = a hard 2px border + the
// --card surface step, never a shadow. Hover fills with --accent and underlines
// the name in --accent-ink (two channels).
export function TopicGrid({ topics }: { topics: TopicSummary[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {topics.map((topic) => (
        <li key={topic.tag}>
          <Link
            to={`/topic/${encodeURIComponent(topic.tag)}`}
            className="group flex h-full min-h-11 items-baseline justify-between gap-3 border-2 border-border bg-card px-4 py-4 transition-colors hover:bg-accent"
          >
            <span className="font-condensed text-title font-medium text-foreground decoration-accent-ink decoration-2 underline-offset-4 group-hover:underline">
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
