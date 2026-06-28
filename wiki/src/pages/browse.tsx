import { Inbox } from 'lucide-react'
import { usePosts, useRecent } from '@/data/store'
import { Masthead } from '@/components/masthead'
import { PostRow } from '@/components/post-row'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

// Browse — the full archive (DESIGN §4/§5/§7). The signature masthead carries
// the real count slab, then a dense, newest-first list of every post snaps to
// the full-width Swiss grid. Browse answers "what's everything, newest first?";
// topic/creator filtering lives on their own pages (the shared TagBadge is a
// navigation link there), so this page stays the pure archive and keeps the
// single Orchid slab the masthead already owns (BRAND §3).
function BrowseBody() {
  const posts = usePosts()
  const recent = useRecent(posts) // newest-first by fetched_at

  return (
    <>
      <Masthead
        overline="Archive"
        title="Archive"
        slab={`${posts.length} ${posts.length === 1 ? 'transcript' : 'transcripts'}`}
      />
      {/* gap-masthead (DESIGN §2): 32px → 48px before content begins. */}
      <div className="mt-8 md:mt-12">
        {recent.length > 0 ? (
          // Dense rows on the grid (DESIGN §4 Browse · post list). Each PostRow
          // is the section directly under the page h1, so its title is an h2 —
          // a gap-free outline (h1 → h2) the screen reader can scan post-to-post.
          <ul className="flex flex-col">
            {recent.map((post) => (
              <li key={post.id}>
                <PostRow post={post} as="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={Inbox}
            title="No transcripts yet"
            hint="Saved reels appear here, newest first."
          />
        )}
      </div>
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
