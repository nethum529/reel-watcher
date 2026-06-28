import { Fragment, useMemo, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SearchX } from 'lucide-react'
import type { Post } from '@/data/types'
import { usePosts } from '@/data/store'
import { postMatches } from '@/lib/post'
import { Input } from '@/components/ui/input'
import { Icon } from '@/components/icon'
import { PostRow } from '@/components/post-row'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

// Escape a user string for use in a RegExp.
function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Wrap case-insensitive matches in <mark> (color + semantic = two channels).
function highlight(text: string, query: string): ReactNode {
  const q = query.trim()
  if (!q) return text
  const parts = text.split(new RegExp(`(${escapeRe(q)})`, 'gi'))
  return parts.map((part, i) =>
    part.toLowerCase() === q.toLowerCase() ? (
      <mark key={i} className="rounded-sm bg-accent-subtle px-0.5 text-primary">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

// A snippet of the transcript/caption centered on the first match.
function matchSnippet(post: Post, query: string): ReactNode {
  const q = query.trim().toLowerCase()
  const body = (post.transcript.trim() || post.caption.trim()).replace(/\s+/g, ' ')
  if (!body) return null
  const idx = body.toLowerCase().indexOf(q)
  if (idx === -1) return null
  const start = Math.max(0, idx - 70)
  const end = Math.min(body.length, idx + q.length + 110)
  const slice = `${start > 0 ? '…' : ''}${body.slice(start, end)}${end < body.length ? '…' : ''}`
  return highlight(slice, query)
}

function SearchBody() {
  const posts = usePosts()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''

  const results = useMemo(() => {
    const q = query.trim()
    if (!q) return []
    return posts
      .filter((p) => postMatches(p, q))
      .sort((a, b) => b.fetched_at - a.fetched_at)
  }, [posts, query])

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-3">
        <label htmlFor="search-field" className="font-sans text-label font-medium text-foreground">
          Search the archive
        </label>
        <div className="relative w-full max-w-[640px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon icon={Search} size={16} />
          </span>
          <Input
            id="search-field"
            type="search"
            autoFocus
            placeholder="Search transcripts, topics, creators"
            className="h-12 pl-9 text-body"
            value={query}
            onChange={(e) => {
              const next = e.target.value
              setParams(next ? { q: next } : {}, { replace: true })
            }}
          />
        </div>
        {query.trim() && (
          <p className="tnum font-sans text-caption text-muted-foreground" role="status">
            {results.length} {results.length === 1 ? 'result' : 'results'} for "{query.trim()}"
          </p>
        )}
      </section>

      {!query.trim() ? (
        <EmptyState
          icon={Search}
          title="Search your saved reels"
          hint="Match against transcripts, captions, creators, and topics."
        />
      ) : results.length > 0 ? (
        <ul className="flex flex-col">
          {results.map((post) => (
            <li key={post.id}>
              <PostRow post={post} snippet={matchSnippet(post, query)} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={SearchX}
          title={`No results for "${query.trim()}"`}
          hint="Try a creator handle or a topic."
        />
      )}
    </div>
  )
}

export function SearchPage() {
  return (
    <LoadBoundary>
      <SearchBody />
    </LoadBoundary>
  )
}
