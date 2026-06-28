import { useParams } from 'react-router-dom'
import { FileX2 } from 'lucide-react'
import { usePosts } from '@/data/store'
import { postTitle } from '@/lib/post'
import { PostMeta } from '@/components/post-meta'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

// STUB (leg-Post builds the reading column). Post titles are long, so the header
// uses Oswald (not Anton) per DESIGN §4 — the leg fleshes out transcript, slides,
// and the source link-out.
function PostResolver({ id }: { id: string }) {
  const posts = usePosts()
  const post = posts.find((p) => p.id === id)
  if (!post) {
    return (
      <EmptyState
        icon={FileX2}
        title="Post not found"
        hint="That post isn't in the archive — it may have been removed."
      />
    )
  }
  return (
    <>
      <header>
        <p className="font-sans text-overline font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Post
        </p>
        <h1 className="mt-4 font-condensed text-h2 font-bold uppercase text-foreground">
          {postTitle(post)}
        </h1>
        <PostMeta post={post} linkCreator className="mt-4" />
        <div className="mt-4 border-t-2 border-border" aria-hidden />
      </header>
      <p className="mt-8 font-sans text-body text-muted-foreground md:mt-12">
        TODO (leg-Post): the reading column — transcript, slides/OCR, source link.
      </p>
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
