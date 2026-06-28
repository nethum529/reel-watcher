import { Link } from 'react-router-dom'
import type { CreatorSummary } from '@/data/types'

// Creators index: dense list rows (Oswald handle + Inter source · count). Each
// row carries a 1px --border-muted divider; hover fills with --accent and
// underlines the handle in --accent-ink (two channels).
export function CreatorList({ creators }: { creators: CreatorSummary[] }) {
  return (
    <ul className="flex flex-col">
      {creators.map((c) => (
        <li key={c.creator}>
          <Link
            to={`/creator/${encodeURIComponent(c.creator)}`}
            className="group flex min-h-11 items-baseline justify-between gap-3 border-b border-border-muted px-3 py-3 transition-colors hover:bg-accent"
          >
            <span className="font-condensed text-title font-medium text-foreground decoration-accent-ink decoration-2 underline-offset-4 group-hover:underline">
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
