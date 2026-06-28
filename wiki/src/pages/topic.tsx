import { useParams } from 'react-router-dom'
import { usePosts } from '@/data/store'
import { Masthead } from '@/components/masthead'
import { LoadBoundary } from '@/components/load-boundary'

// STUB (leg-Topic builds the body): masthead with the tag + real count slab, then
// a placeholder for the dense list of posts under this tag.
function TopicBody({ tag }: { tag: string }) {
  const posts = usePosts()
  const count = posts.filter((p) => p.tags.includes(tag)).length
  return (
    <>
      <Masthead
        overline="Topic"
        title={tag}
        slab={`${count} ${count === 1 ? 'post' : 'posts'}`}
      />
      <p className="mt-8 font-sans text-body text-muted-foreground md:mt-12">
        TODO (leg-Topic): posts tagged “{tag}”.
      </p>
    </>
  )
}

export function TopicPage() {
  const { tag } = useParams<{ tag: string }>()
  return (
    <LoadBoundary>
      <TopicBody tag={tag ?? ''} />
    </LoadBoundary>
  )
}
