import { useParams } from 'react-router-dom'
import { usePosts } from '@/data/store'
import { Masthead } from '@/components/masthead'
import { LoadBoundary } from '@/components/load-boundary'

// STUB (leg-Creator builds the body): masthead with the @handle + real count slab,
// then a placeholder for the dense list of this creator's posts.
function CreatorBody({ creator }: { creator: string }) {
  const posts = usePosts()
  const count = posts.filter((p) => p.creator === creator).length
  return (
    <>
      <Masthead
        overline="Creator"
        title={`@${creator}`}
        slab={`${count} ${count === 1 ? 'post' : 'posts'}`}
      />
      <p className="mt-8 font-sans text-body text-muted-foreground md:mt-12">
        TODO (leg-Creator): posts from @{creator}.
      </p>
    </>
  )
}

export function CreatorPage() {
  const { creator } = useParams<{ creator: string }>()
  return (
    <LoadBoundary>
      <CreatorBody creator={creator ?? ''} />
    </LoadBoundary>
  )
}
