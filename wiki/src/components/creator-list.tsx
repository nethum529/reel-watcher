import { Link } from 'react-router-dom'
import type { CreatorSummary } from '@/data/types'

// Creators index: dense list rows (serif handle + sans source · count).
export function CreatorList({ creators }: { creators: CreatorSummary[] }) {
  return (
    <ul className="flex flex-col">
      {creators.map((c) => (
        <li key={c.creator}>
          <Link
            to={`/creator/${encodeURIComponent(c.creator)}`}
            className="group flex items-baseline justify-between gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-accent active:bg-accent-subtle"
          >
            <span className="font-serif text-title font-medium tracking-[-0.005em] text-foreground decoration-primary underline-offset-4 group-hover:underline">
              @{c.creator}
            </span>
            <span className="tnum shrink-0 font-sans text-caption text-muted-foreground">
              {c.source ? `${c.source} · ` : ''}
              {c.count} {c.count === 1 ? 'post' : 'posts'}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
