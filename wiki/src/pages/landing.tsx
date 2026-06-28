import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useData, usePosts, useTopics, useCreators } from '@/data/store'
import { Icon } from '@/components/icon'
import { ThemeToggle } from '@/components/theme-toggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Staggered fade-rise delays (DESIGN §13): ~70ms apart, last enter ends ≤500ms.
// Reduced motion swaps the whole thing for a plain cross-fade (index.css).
function enter(delayMs: number) {
  return { '--enter-delay': `${delayMs}ms` } as CSSProperties
}

// "12 transcripts" / "1 transcript" — never bare numbers (BRAND §8: name the object).
function plural(n: number, noun: string) {
  return `${n} ${n === 1 ? noun : `${noun}s`}`
}

// The dramatic entry (#/, DESIGN §13): full-bleed paper (jet in dark), no top-bar
// nav — the theme toggle is the only chrome. Eyebrow + one Anton hero, framed
// between two 2px rules as a Swiss masthead band; a single Orchid count slab; one
// Enter affordance. Left-locked and asymmetric. This is the product's dominant
// element overall. Two structural rules frame the hero (DESIGN §13 allows a rule
// above and/or below); the rules are static — only the type rises on first paint.
export function LandingPage() {
  const state = useData()
  const posts = usePosts()
  const topics = useTopics(posts)
  const creators = useCreators(posts)
  const ready = state.status === 'ready'
  const hasCounts = ready && posts.length > 0

  return (
    <main className="relative flex min-h-screen flex-col justify-center">
      <div className="rw-container w-full">
        {/* Masthead band: eyebrow + hero framed by 2px rules (the poster frame). */}
        <div className="border-y-2 border-border py-8 md:py-12">
          <p
            className="landing-enter font-sans text-overline font-semibold uppercase tracking-[0.12em] text-muted-foreground"
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
        </div>

        {/* The single Orchid punch: the count datum (jet on Orchid, 10.2:1). Only
            shown with real data — never an invented number (BRAND §8). */}
        {hasCounts ? (
          <p
            data-slab
            className="landing-enter tnum mt-8 inline-block bg-primary px-4 py-2 font-condensed text-title font-medium uppercase text-primary-foreground md:mt-12"
            style={enter(140)}
          >
            {plural(posts.length, 'transcript')} · {plural(topics.length, 'topic')} ·{' '}
            {plural(creators.length, 'creator')}
          </p>
        ) : ready ? (
          <p
            className="landing-enter mt-8 font-sans text-overline uppercase tracking-[0.12em] text-muted-foreground md:mt-12"
            style={enter(140)}
          >
            Archive empty · no transcripts yet
          </p>
        ) : null}

        {/* Enter the archive → #/browse. The only nav element above the fold, and
            the first/primary focus stop (the theme toggle, below in DOM, is the
            second) per DESIGN §13. Orchid fill, jet label, 2px border, ≥44px. */}
        <div className="landing-enter mt-8" style={enter(210)}>
          <Link
            to="/browse"
            className={cn(
              buttonVariants({ variant: 'primary' }),
              'uppercase tracking-[0.04em]',
            )}
          >
            Enter the archive
            <Icon icon={ArrowRight} size={24} />
          </Link>
        </div>
      </div>

      {/* Last in DOM so the Enter affordance is the first tab stop (DESIGN §13);
          visually pinned top-right as the page's only chrome. */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
    </main>
  )
}
