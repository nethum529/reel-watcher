import { usePosts } from '@/data/store'
import { Masthead } from '@/components/masthead'
import { LoadBoundary } from '@/components/load-boundary'

// STUB (leg-B builds the body): masthead with the real count slab + a placeholder
// for the dense archive post list (default sort = recent).
function BrowseBody() {
  const posts = usePosts()
  return (
    <>
      <Masthead
        overline="Archive"
        title="Archive"
        slab={`${posts.length} ${posts.length === 1 ? 'transcript' : 'transcripts'}`}
      />
      <p className="mt-8 font-sans text-body text-muted-foreground md:mt-12">
        TODO (leg-B): the full archive — dense post rows on the grid.
      </p>
    </>
  )
}

export function BrowsePage() {
  return (
    <LoadBoundary>
      <BrowseBody />
    </LoadBoundary>
  )
}
