import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ExternalLink, FileX2, OctagonAlert } from 'lucide-react'
import type { Post } from '@/data/types'
import { usePosts } from '@/data/store'
import { postTitle, hasTranscript, slideBlocks, isSafeHttpUrl } from '@/lib/post'
import { Breadcrumb } from '@/components/breadcrumb'
import { PostMeta } from '@/components/post-meta'
import { TagBadge } from '@/components/tag-badge'
import { Separator } from '@/components/ui/separator'
import { Icon } from '@/components/icon'
import { Overline } from '@/components/overline'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'
import { buttonVariants } from '@/components/ui/button'

function Transcript({ post }: { post: Post }) {
  const paragraphs = useMemo(
    () =>
      post.transcript
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean),
    [post.transcript],
  )

  if (!hasTranscript(post)) {
    return (
      <p className="inline-flex items-center gap-2 font-sans text-body text-destructive">
        <Icon icon={OctagonAlert} size={16} />
        No transcript yet for this post.
      </p>
    )
  }

  return (
    <div className="font-serif text-read text-foreground">
      {paragraphs.map((para, i) => (
        <p key={i} className="my-4 whitespace-pre-line first:mt-0">
          {para}
        </p>
      ))}
    </div>
  )
}

function PostBody({ post }: { post: Post }) {
  const slides = slideBlocks(post)
  const firstTag = post.tags[0]

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-5">
        <Breadcrumb
          items={[
            { label: 'Home', to: '/' },
            ...(firstTag
              ? [{ label: firstTag, to: `/topic/${encodeURIComponent(firstTag)}` }]
              : []),
            { label: postTitle(post) },
          ]}
        />
        <h1 className="font-serif text-[clamp(1.875rem,5vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
          {postTitle(post)}
        </h1>
        <div className="flex flex-col gap-4">
          <PostMeta post={post} linkCreator />
          {post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <TagBadge tag={tag} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <Separator />

      {/* Signature element: the reading column (BRAND §3) — dominant, 66ch. */}
      <div className="measure-read mx-auto w-full">
        {post.caption.trim() && (
          <p className="mb-8 font-sans text-body text-muted-foreground">{post.caption.trim()}</p>
        )}
        <Transcript post={post} />
      </div>

      {/* Subordinate: slides/OCR + source, below the read, muted (BRAND §3). */}
      {slides.length > 0 && (
        <section className="measure-read mx-auto w-full flex-col gap-4">
          <Separator className="my-8" />
          <Overline className="mb-4">Slides</Overline>
          <ul className="flex flex-col gap-6">
            {slides.map((slide, i) => (
              <li
                key={i}
                className="rounded-lg border border-border bg-muted px-4 py-3 font-sans text-caption leading-relaxed text-muted-foreground"
              >
                {slide}
              </li>
            ))}
          </ul>
        </section>
      )}

      {isSafeHttpUrl(post.url) && (
        <div className="measure-read mx-auto w-full">
          <Separator className="my-8" />
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'secondary' })}
          >
            <Icon icon={ExternalLink} size={16} />
            {post.source ? `Open on ${post.source}` : 'Open original'}
          </a>
        </div>
      )}
    </article>
  )
}

export function PostPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <LoadBoundary>
      <PostResolver id={id ?? ''} />
    </LoadBoundary>
  )
}

function PostResolver({ id }: { id: string }) {
  const posts = usePosts()
  const post = posts.find((p) => p.id === id)
  if (!post) {
    return <EmptyState icon={FileX2} title="That post isn't in the archive." hint="It may have been removed." />
  }
  return <PostBody post={post} />
}
