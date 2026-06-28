import { useParams } from 'react-router-dom'
import { ArrowUpRight, FileX2, Info } from 'lucide-react'
import { usePosts } from '@/data/store'
import { isSafeHttpUrl, postTitle, slideBlocks } from '@/lib/post'
import { PostMeta } from '@/components/post-meta'
import { TagBadge } from '@/components/tag-badge'
import { Breadcrumb } from '@/components/breadcrumb'
import { Icon } from '@/components/icon'
import { LoadBoundary } from '@/components/load-boundary'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Section header (DESIGN §1 h3 step, 31px Oswald 600): rendered as the page's
// <h2> elements. The post page's dominant element is the reading column (IA §5),
// so section labels stay at the h3 *size* over the 18px transcript — calm, not
// the loud 42px h2 step that would out-weight the read.
const SECTION_HEADING =
  'font-condensed text-h3 font-semibold uppercase tracking-[0.01em] text-foreground'

function PostResolver({ id }: { id: string }) {
  const posts = usePosts()
  const post = posts.find((p) => p.id === id)

  if (!post) {
    // Not-found mirrors the EmptyState pattern (DESIGN §8.4/§9) but carries a real
    // <h1> — EmptyState's title is a <p>, and the page needs a heading root.
    return (
      <div className="py-16">
        <Breadcrumb items={[{ label: 'Browse', to: '/browse' }]} />
        <Icon icon={FileX2} size={32} className="mt-6 text-muted-foreground" />
        <h1 className="mt-3 font-condensed text-h3 font-semibold uppercase text-foreground">
          Post not found
        </h1>
        <p className="mt-2 font-sans text-caption text-muted-foreground">
          That post isn’t in the archive — it may have been removed.
        </p>
      </div>
    )
  }

  const title = postTitle(post)
  // Short titles take the Anton display headline; longer derived captions fall to
  // Oswald so the masthead stays one line and never wraps into a wall (DESIGN §4).
  const short = title.length <= 24
  // Keep the trailing crumb tight — the full title is the <h1> right below it.
  const crumbLabel = title.length > 48 ? `${title.slice(0, 47).trimEnd()}…` : title

  const captionText = post.caption.trim()
  // The derived title is the caption's first line; skip the caption block only
  // when it is nothing more than that (pure duplication).
  const showCaption = captionText !== '' && captionText !== title

  const paragraphs = post.transcript
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
  const slides = slideBlocks(post)

  return (
    <>
      <header>
        <Breadcrumb
          items={[
            { label: 'Browse', to: '/browse' },
            {
              label: `@${post.creator}`,
              to: `/creator/${encodeURIComponent(post.creator)}`,
            },
            { label: crumbLabel },
          ]}
        />
        <p className="mt-6 font-sans text-overline font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Post
        </p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {short ? (
            <h1 className="font-display text-display uppercase tracking-[-0.01em] text-foreground">
              {title}
            </h1>
          ) : (
            <h1 className="font-condensed text-h2 font-bold uppercase tracking-[0.01em] text-foreground">
              {title}
            </h1>
          )}
          {/* The single Orchid slab (BRAND §3) — the post's key datum, its source
              platform. Appears exactly once per page. data-slab → forced-colors. */}
          {post.source && (
            <p
              data-slab
              className="inline-flex shrink-0 self-start bg-primary px-4 py-2 font-condensed text-title font-medium uppercase text-primary-foreground md:self-auto"
            >
              {post.source}
            </p>
          )}
        </div>
        <PostMeta post={post} linkCreator className="mt-6" />
        {isSafeHttpUrl(post.url) && (
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'secondary' }), 'mt-6')}
          >
            View original
            <Icon icon={ArrowUpRight} size={16} />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        {/* Masthead rule — the structural seam, 2px, full content width. */}
        <div className="mt-6 border-t-2 border-border" aria-hidden />
      </header>

      <div className="mt-8 md:mt-12 lg:grid lg:grid-cols-12 lg:gap-6">
        {/* Reading column (cols 1–8, 68ch) — the dominant element (DESIGN §7). */}
        <div className="measure-read space-y-10 md:space-y-16 lg:col-span-8">
          {showCaption && (
            <section aria-labelledby="post-caption">
              <h2 id="post-caption" className={SECTION_HEADING}>
                Caption
              </h2>
              <p className="mt-6 whitespace-pre-line font-sans text-body text-foreground">
                {captionText}
              </p>
            </section>
          )}

          <section aria-labelledby="post-transcript">
            <h2 id="post-transcript" className={SECTION_HEADING}>
              Transcript
            </h2>
            {paragraphs.length > 0 ? (
              <div className="mt-6 space-y-4">
                {paragraphs.map((para, i) => (
                  <p key={i} className="font-sans text-read text-foreground">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              // Neutral notice (BRAND §5): muted text + info icon, no chroma.
              <p className="mt-6 flex items-center gap-2 font-sans text-body text-muted-foreground">
                <Icon icon={Info} size={16} className="text-muted-foreground" />
                No transcript for this post.
              </p>
            )}
          </section>

          {post.tags.length > 0 && (
            <section aria-labelledby="post-topics">
              <h2 id="post-topics" className={SECTION_HEADING}>
                Topics
              </h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <TagBadge tag={tag} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Slides / OCR — subordinate (DESIGN §4): hard-bordered, muted, small,
            in the aside (cols 9–12) with a 2px structural seam at lg. */}
        {slides.length > 0 && (
          <aside
            aria-labelledby="post-slides"
            className="mt-10 lg:col-span-4 lg:mt-0 lg:border-l-2 lg:border-border lg:pl-8"
          >
            <h2 id="post-slides" className={SECTION_HEADING}>
              Slides
            </h2>
            <ol className="mt-6 space-y-4">
              {slides.map((block, i) => (
                <li key={i} className="border border-border bg-card p-4">
                  <h3 className="font-condensed text-label font-medium uppercase tracking-[0.01em] text-muted-foreground">
                    Slide {i + 1} of {slides.length}
                  </h3>
                  <p className="mt-2 whitespace-pre-line font-sans text-label text-muted-foreground">
                    {block}
                  </p>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </div>
    </>
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
