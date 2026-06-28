import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useData } from '@/data/store'
import { Icon } from '@/components/icon'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'

// Staggered fade-rise delays (DESIGN §13): ~70ms apart, last enter ends ≤500ms.
// Reduced motion swaps the whole thing for a plain cross-fade (index.css).
function enter(delayMs: number) {
  return { '--enter-delay': `${delayMs}ms` } as CSSProperties
}

// The dramatic entry (#/, DESIGN §13): full-bleed paper (jet in dark), no top-bar
// nav — the theme toggle is the only chrome. One Anton hero + a single Orchid
// count slab + one Enter affordance, left-locked and asymmetric. A 2px rule
// structures the composition. This is the product's dominant element overall.
export function LandingPage() {
  const state = useData()
  const posts = state.status === 'ready' ? state.data.posts : []
  const topicCount = new Set(posts.flatMap((p) => p.tags)).size
  const creatorCount = new Set(posts.map((p) => p.creator)).size
  const hasCounts = state.status === 'ready' && posts.length > 0

  return (
    <main className="relative flex min-h-screen flex-col justify-center">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="rw-container">
        <div className="border-t-2 border-border" aria-hidden />

        <p
          className="landing-enter mt-8 font-sans text-overline font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          style={enter(0)}
        >
          Personal archive
        </p>

        <h1
          className="landing-enter mt-6 font-display text-hero uppercase tracking-[-0.01em] text-foreground"
          style={enter(70)}
        >
          reel-watcher
        </h1>

        {hasCounts && (
          <p
            data-slab
            className="landing-enter tnum mt-8 inline-block bg-primary px-4 py-2 font-condensed text-title font-medium uppercase text-primary-foreground"
            style={enter(140)}
          >
            {posts.length} {posts.length === 1 ? 'transcript' : 'transcripts'} · {topicCount}{' '}
            {topicCount === 1 ? 'topic' : 'topics'} · {creatorCount}{' '}
            {creatorCount === 1 ? 'creator' : 'creators'}
          </p>
        )}

        <div className="landing-enter mt-12" style={enter(210)}>
          <Link to="/browse" className={buttonVariants({ variant: 'primary' })}>
            Enter the archive
            <Icon icon={ArrowRight} size={24} />
          </Link>
        </div>
      </div>
    </main>
  )
}
