import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Inbox, Search } from 'lucide-react'
import { usePosts, useRecent, useTopics } from '@/data/store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/icon'
import { Overline } from '@/components/overline'
import { TopicGrid } from '@/components/topic-grid'
import { PostRow } from '@/components/post-row'
import { EmptyState } from '@/components/empty-state'
import { LoadBoundary } from '@/components/load-boundary'

function Masthead() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-serif text-[clamp(1.875rem,5vw,2.5rem)] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
        Your reading archive of saved reels.
      </h1>
      <form
        role="search"
        className="flex w-full max-w-[560px] gap-2"
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
    </section>
  )
}

function HomeBody() {
  const posts = usePosts()
  const topics = useTopics(posts)
  const recent = useRecent(posts, 8)

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <Masthead />

      <section className="flex flex-col gap-6">
        <Overline>Topics</Overline>
        {topics.length > 0 ? (
          <TopicGrid topics={topics} />
        ) : (
          <EmptyState icon={Inbox} title="No topics yet" hint="Saved posts will group here by tag." />
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
  )
}

export function HomePage() {
  return (
    <LoadBoundary>
      <HomeBody />
    </LoadBoundary>
  )
}
