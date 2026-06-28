import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ExternalLink, FileX2, OctagonAlert } from 'lucide-react'
import type { Post } from '@/data/types'
import { usePosts } from '@/data/store'
import { postTitle, hasTranscript, slideBlocks, isSafeHttpUrl } from '@/lib/post'
import { Breadcrumb } from '@/components/breadcrumb'
import { Masthead } from '@/components/masthead'
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
        <p key={i} className="my-[18px] whitespace-pre-line first:mt-0">
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
    <article className="mx-auto w-full max-w-[760px]">
      <Masthead
        overline={firstTag ?? 'Post'}
        title={postTitle(post)}
        subline={
          <>
            <PostMeta post={post} linkCreator className="text-center" />
            {post.tags.length > 0 && (
              <ul className="flex flex-wrap justify-center gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <TagBadge tag={tag} />
                  </li>
                ))}
              </ul>
            )}
          </>
        }
      />
      <div className="mt-6 flex justify-center">
        <Breadcrumb
          items={[
            { label: 'Wiki', to: '/wiki' },
            ...(firstTag
              ? [{ label: firstTag, to: `/topic/${encodeURIComponent(firstTag)}` }]
              : []),
            { label: postTitle(post) },
          ]}
        />
      </div>

      <div className="mt-16 md:mt-24">
        {/* Subordinate signature: the reading column (BRAND §3) — dominant, 66ch,
            left-aligned within its centered measure. No card chrome, no border. */}
        <div className="measure-read mx-auto w-full">
          {post.caption.trim() && (
            <p className="mb-8 font-sans text-body text-muted-foreground">{post.caption.trim()}</p>
          )}
          <Transcript post={post} />
        </div>

        {/* Subordinate: slides/OCR + source, below the read, muted (BRAND §3). */}
        {slides.length > 0 && (
          <section className="measure-read mx-auto w-full">
            <Separator className="my-12" />
            <Overline className="mb-4">Slides</Overline>
            <ul className="flex flex-col gap-6">
              {slides.map((slide, i) => (
                <li
                  key={i}
                  className="rounded-md border border-border bg-muted px-4 py-3 font-sans text-caption leading-relaxed text-muted-foreground"
                >
                  {slide}
                </li>
              ))}
            </ul>
          </section>
        )}

        {isSafeHttpUrl(post.url) && (
          <div className="measure-read mx-auto w-full">
            <Separator className="my-12" />
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
      </div>
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
