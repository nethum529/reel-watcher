import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { OctagonAlert } from 'lucide-react'
import type { Post } from '@/data/types'
import { postTitle, hasTranscript } from '@/lib/post'
import { PostMeta } from '@/components/post-meta'
import { Icon } from '@/components/icon'

interface PostRowProps {
  post: Post
  // Optional matched-term snippet (search results); rendered below the meta.
  snippet?: ReactNode
  // Heading level so the page outline stays gap-free: h3 when the list sits under
  // a section eyebrow (Home/Recent), h2 when posts are the section under the page h1.
  as?: 'h2' | 'h3'
}

// The workhorse (DESIGN §6.1): a block link, serif title + sans meta, no tile.
// Hover bg + title underline (two channels); focus ring is global.
export function PostRow({ post, snippet, as: Heading = 'h3' }: PostRowProps) {
  const missingTranscript = !hasTranscript(post)
  return (
    <Link
      to={`/post/${encodeURIComponent(post.id)}`}
      className="group block rounded-lg px-3 py-3 transition-colors hover:bg-accent active:bg-accent-subtle"
    >
      <Heading className="font-serif text-title font-medium tracking-[-0.005em] text-foreground decoration-primary underline-offset-4 group-hover:underline">
        {postTitle(post)}
      </Heading>
      <PostMeta post={post} className="mt-1" />
      {snippet && (
        <p className="mt-1 font-sans text-caption leading-relaxed text-muted-foreground">
          {snippet}
        </p>
      )}
      {missingTranscript && (
        <p className="mt-1 inline-flex items-center gap-1 font-sans text-caption text-destructive">
          <Icon icon={OctagonAlert} size={14} strokeWidth={1} />
          transcript unavailable
        </p>
      )}
    </Link>
  )
}
