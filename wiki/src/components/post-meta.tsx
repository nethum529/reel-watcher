import { Link } from 'react-router-dom'
import type { Post } from '@/data/types'
import { exactDate, compactCount, exactCount, relativeDate } from '@/lib/format'
import { cn } from '@/lib/utils'

interface PostMetaProps {
  post: Post
  linkCreator?: boolean
  className?: string
}

// Sans metadata line: @creator · platform · relative date · {N} views.
// Tabular figures; exact date/count on hover (BRAND §8 voice).
export function PostMeta({ post, linkCreator = false, className }: PostMetaProps) {
  const rel = relativeDate(post.posted_at)
  const views = compactCount(post.view_count)

  const creatorText = `@${post.creator}`
  const creator = linkCreator ? (
    <Link
      to={`/creator/${encodeURIComponent(post.creator)}`}
      className="text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
    >
      {creatorText}
    </Link>
  ) : (
    <span>{creatorText}</span>
  )

  return (
    <p className={cn('tnum font-sans text-caption text-muted-foreground', className)}>
      {creator}
      {post.source && <span aria-hidden> · </span>}
      {post.source && <span>{post.source}</span>}
      {rel && <span aria-hidden> · </span>}
      {rel && (
        <time dateTime={post.posted_at ?? undefined} title={exactDate(post.posted_at)}>
          {rel}
        </time>
      )}
      {views && <span aria-hidden> · </span>}
      {views && <span title={exactCount(post.view_count)}>{views} views</span>}
    </p>
  )
}
