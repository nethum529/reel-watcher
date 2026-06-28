import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Inbox, Search } from 'lucide-react'
import { useCreators, usePosts, useRecent, useTopics } from '@/data/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icon'
import { Masthead } from '@/components/masthead'
import { Overline } from '@/components/overline'
import { TopicGrid } from '@/components/topic-grid'
import { CreatorList } from '@/components/creator-list'
import { PostRow } from '@/components/post-row'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

// The global search field — the dominant interactive element of the wiki home
// (DESIGN §5). Submits to the dedicated /search route.
function GlobalSearch() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  return (
    <form
      role="search"
      className="mx-auto flex w-full max-w-[560px] gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        navigate(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : '/search')
      }}
    >
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon icon={Search} size={16} />
        </span>
        <Input
          type="search"
          aria-label="Search transcripts, topics, and creators"
          placeholder="Search transcripts, topics, creators"
          className="pl-9"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <Button type="submit" variant="primary">
        Search
      </Button>
    </form>
  )
}

function HomeBody() {
  const posts = usePosts()
  const topics = useTopics(posts)
  const creators = useCreators(posts)
  const recent = useRecent(posts, 8)
  const { hash } = useLocation()

  // Sidebar Topics/Creators items deep-link to these sections (#topics/#creators).
  // Scroll smoothly, or jump under reduced-motion preference.
  useEffect(() => {
    if (!hash) return
    const el = document.querySelector(hash)
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }, [hash])

  return (
    <div className="mx-auto w-full max-w-[880px]">
      <Masthead
        overline="Archive"
        title="The archive"
        subline={
          posts.length > 0
            ? `${posts.length} ${posts.length === 1 ? 'post' : 'posts'} · ${topics.length} ${
                topics.length === 1 ? 'topic' : 'topics'
              } · ${creators.length} ${creators.length === 1 ? 'creator' : 'creators'}`
            : undefined
        }
      />

      <div className="mt-16 flex flex-col gap-16 md:mt-24 md:gap-24">
        <GlobalSearch />

        <section id="topics" className="flex scroll-mt-24 flex-col gap-6">
          <Overline>Topics</Overline>
          {topics.length > 0 ? (
            <TopicGrid topics={topics} />
          ) : (
            <EmptyState icon={Inbox} title="No topics yet" hint="Saved posts group here by tag." />
          )}
        </section>

        <section id="creators" className="flex scroll-mt-24 flex-col gap-6">
          <Overline>Creators</Overline>
          {creators.length > 0 ? (
            <CreatorList creators={creators} />
          ) : (
            <EmptyState icon={Inbox} title="No creators yet" />
          )}
        </section>

        <section className="flex flex-col gap-4">
          <Overline>Recent</Overline>
          {recent.length > 0 ? (
            <ul className="flex flex-col">
              {recent.map((post) => (
                <li key={post.id}>
                  <PostRow post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={Inbox} title="Nothing saved yet" />
          )}
        </section>
      </div>
    </div>
  )
}

export function HomePage() {
  return (
    <LoadBoundary>
      <HomeBody />
    </LoadBoundary>
  )
}
