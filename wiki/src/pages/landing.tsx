import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useData } from '@/data/store'
import { Icon } from '@/components/icon'

// Staggered fade-rise delays (DESIGN §13): ~70ms apart, last enter ends ≤700ms.
// Reduced motion swaps the whole thing for a plain cross-fade (index.css).
function enter(delayMs: number) {
  return { '--enter-delay': `${delayMs}ms` } as CSSProperties
}

// The dramatic entry (#/, DESIGN §13): full-bleed warm near-black — the deepest
// material, distinct from the green wiki it gates — with one gold-leaf type
// moment and a single Enter affordance, in maximum *ma*. No sidebar, no chrome.
export function LandingPage() {
  const state = useData()
  const posts = state.status === 'ready' ? state.data.posts : []
  const topicCount = new Set(posts.flatMap((p) => p.tags)).size
  const creatorCount = new Set(posts.map((p) => p.creator)).size
  const hasCounts = state.status === 'ready' && posts.length > 0

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sidebar px-6 py-24 text-center">
      <p
        className="landing-enter font-sans text-overline font-semibold uppercase tracking-[0.18em] text-muted-foreground"
        style={enter(0)}
      >
        Personal archive
      </p>

      <h1
        className="landing-enter mt-8 font-display text-hero font-light tracking-[-0.02em] text-foreground"
        style={enter(70)}
      >
        reel-watcher
      </h1>

      <div className="landing-enter my-8 gold-leaf" style={enter(140)} aria-hidden />

      {hasCounts && (
        <p
          className="landing-enter tnum font-serif text-read text-muted-foreground"
          style={enter(210)}
        >
          {posts.length} {posts.length === 1 ? 'transcript' : 'transcripts'} · {topicCount}{' '}
          {topicCount === 1 ? 'topic' : 'topics'} · {creatorCount}{' '}
          {creatorCount === 1 ? 'creator' : 'creators'}
        </p>
      )}

      <Link
        to="/wiki"
        style={enter(280)}
        className="landing-enter mt-12 inline-flex min-h-11 items-center gap-2 rounded-md font-sans text-label font-semibold text-primary underline-offset-4 transition-colors hover:text-gold-hover hover:underline"
      >
        Enter the archive
        <Icon icon={ArrowRight} size={20} />
      </Link>
    </main>
  )
}
