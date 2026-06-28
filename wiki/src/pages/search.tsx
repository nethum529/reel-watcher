import { Fragment, useId, useMemo, useState, type ReactNode } from 'react'
import { Search, SearchX } from 'lucide-react'
import type { Post } from '@/data/types'
import { usePosts } from '@/data/store'
import { postExcerpt, postMatches } from '@/lib/post'
import { Masthead } from '@/components/masthead'
import { PostRow } from '@/components/post-row'
import { EmptyState } from '@/components/empty-state'
import { Icon } from '@/components/icon'
import { Input } from '@/components/ui/input'
import { LoadBoundary } from '@/components/load-boundary'

// The Search column is left-locked to cols 1–8 (DESIGN §7 / §11). The page field
// is pinned at 640px; results share the column width.
const COLUMN = 'max-w-[640px]'
const SNIPPET_LEN = 160

// Regex-escape the query so a user typing "(", ".", or "\" can't break the
// highlight pattern or inject into it (Tier-1: untrusted input → RegExp source).
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Build a context window around the first match so the matched term is visible in
// the result snippet — the search payoff — regardless of which field matched.
function matchSnippet(post: Post, query: string): string {
  const q = query.toLowerCase()
  const fields = [
    post.transcript,
    post.caption,
    post.tags.map((tag) => `#${tag}`).join(' '),
    `@${post.creator}`,
  ]
  for (const field of fields) {
    const text = field.replace(/\s+/g, ' ').trim()
    if (!text) continue
    const idx = text.toLowerCase().indexOf(q)
    if (idx === -1) continue
    const start = Math.max(0, idx - Math.floor((SNIPPET_LEN - q.length) / 2))
    const end = Math.min(text.length, start + SNIPPET_LEN)
    return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
  }
  return postExcerpt(post)
}

// Wrap each case-insensitive match in <mark>. Per DESIGN §8.4 the mark is never a
// fill that breaks contrast: transparent bg, two channels (accent-ink color + a
// 2px Orchid underline). Original casing is preserved (split keeps the match).
function highlight(text: string, query: string): ReactNode[] {
  const pattern = new RegExp(`(${escapeRegExp(query)})`, 'gi')
  return text.split(pattern).map((part, i) =>
    i % 2 === 1 ? (
      <mark
        key={i}
        className="bg-transparent font-medium text-accent-ink underline decoration-accent-ink decoration-2 underline-offset-2"
      >
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

function SearchBody() {
  const posts = usePosts()
  const [query, setQuery] = useState('')
  const inputId = useId()
  const q = query.trim()

  const results = useMemo(
    () => (q ? posts.filter((post) => postMatches(post, q)) : []),
    [posts, q],
  )
  const count = results.length

  // Live region copy (announced on change). Empty while no query so the live
  // region exists at mount but stays silent until the user searches.
  const status = !q
    ? ''
    : count === 0
      ? `No results for “${q}”`
      : `${count} ${count === 1 ? 'result' : 'results'} for “${q}”`

  return (
    <>
      <Masthead
        overline="Search"
        title="Search"
        slab={`${posts.length} ${posts.length === 1 ? 'transcript' : 'transcripts'}`}
      />

      <form
        role="search"
        className={`mt-8 ${COLUMN} md:mt-12`}
        onSubmit={(e) => e.preventDefault()}
      >
        <label
          htmlFor={inputId}
          className="font-sans text-overline font-semibold uppercase tracking-[0.12em] text-muted-foreground"
        >
          Search transcripts
        </label>
        <div className="relative mt-3">
          <Icon
            icon={Search}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Word, topic, or @creator"
            autoComplete="off"
            className="pl-11"
          />
        </div>
      </form>

      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={`mt-8 ${COLUMN} min-h-5 tnum font-sans text-caption text-muted-foreground`}
      >
        {status}
      </p>

      {q && count > 0 && (
        <ul className={`mt-4 ${COLUMN} list-none`}>
          {results.map((post) => (
            <li key={post.id}>
              <PostRow post={post} as="h2" snippet={highlight(matchSnippet(post, q), q)} />
            </li>
          ))}
        </ul>
      )}

      {!q && (
        <EmptyState
          icon={Search}
          title="Search the archive"
          hint="Type a word from a transcript, caption, topic, or creator handle."
        />
      )}

      {q && count === 0 && (
        <EmptyState
          icon={SearchX}
          title={`No results for “${q}”`}
          hint="Try fewer words, a creator handle, or a topic."
        />
      )}
    </>
  )
}

export function SearchPage() {
  return (
    <LoadBoundary>
      <SearchBody />
    </LoadBoundary>
  )
}
