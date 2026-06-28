import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { OctagonAlert } from 'lucide-react'
import type { Post } from '@/data/types'
import { postTitle, hasTranscript } from '@/lib/post'
import { PostMeta } from '@/components/post-meta'
import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'

interface PostRowProps {
  post: Post
  // Optional matched-term snippet (search results); rendered below the meta.
  snippet?: ReactNode
  // Keyboard/search selection (DESIGN §8.1): a 2px Orchid left rule + accent bg —
  // a structural channel, not color alone.
  selected?: boolean
  // Heading level so the page outline stays gap-free: h3 when the list sits under
  // a section eyebrow, h2 when posts are the section directly under the page h1.
  as?: 'h2' | 'h3'
}

// The workhorse (DESIGN §8.1): a block link on the grid — Oswald title + Inter
// meta, no tile. Default carries a 1px --border-muted divider; hover fills with
// the neutral --accent surface and underlines the title in --accent-ink (two
// channels). Focus ring is the global :focus-visible.
export function PostRow({ post, snippet, selected = false, as: Heading = 'h3' }: PostRowProps) {
  const missingTranscript = !hasTranscript(post)
  return (
    <Link
      to={`/post/${encodeURIComponent(post.id)}`}
      aria-current={selected ? true : undefined}
      data-active-rule={selected ? 'true' : undefined}
      className={cn(
        'group block border-b border-l-2 border-border-muted px-3 py-3 transition-colors hover:bg-accent active:bg-accent',
        selected ? 'border-l-primary bg-accent' : 'border-l-transparent',
      )}
    >
      <Heading className="font-condensed text-title font-medium text-foreground decoration-accent-ink decoration-2 underline-offset-4 group-hover:underline group-active:text-accent-ink group-active:underline">
        {postTitle(post)}
      </Heading>
      <PostMeta post={post} className="mt-1" />
      {snippet && (
        <p className="mt-1 font-sans text-caption leading-relaxed text-muted-foreground">
          {snippet}
        </p>
      )}
      {missingTranscript && (
        <p className="mt-1 inline-flex items-center gap-1 font-sans text-caption uppercase tracking-[0.04em] text-destructive">
          <Icon icon={OctagonAlert} size={14} strokeWidth={1.5} />
          Transcript unavailable
        </p>
      )}
    </Link>
  )
}
