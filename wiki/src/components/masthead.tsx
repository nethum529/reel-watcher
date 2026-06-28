import type { ReactNode } from 'react'

interface MastheadProps {
  // Wide-tracked uppercase eyebrow (DESIGN §7). NOT a heading — it sits above the
  // h1, so it stays a styled <p> to keep the heading outline gap-free (h1→h2→h3).
  overline: string
  // The page's dominant element: a centered Fraunces display title (the masthead
  // signature, BRAND §3). Rendered as the page <h1>.
  title: ReactNode
  // One quiet concrete subline (count / note), never a tagline (BRAND §8).
  subline?: ReactNode
}

// The gold-leaf masthead, returned subordinated on every wiki page (BRAND §3,
// DESIGN §7): centered overline → Fraunces display title → optional subline →
// the single gold-leaf hairline. Centering is the user-mandated luxury exception;
// it is mitigated by one dominant element here and left-aligned body text below.
export function Masthead({ overline, title, subline }: MastheadProps) {
  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <p className="font-sans text-overline font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {overline}
      </p>
      <h1 className="font-display text-display font-normal tracking-[-0.02em] text-foreground">
        {title}
      </h1>
      {subline && (
        <div className="tnum flex flex-col items-center gap-4 font-sans text-caption text-muted-foreground">
          {subline}
        </div>
      )}
      {/* The recurring gold-leaf rule — appears once per page, only here. */}
      <div className="gold-leaf mt-3" aria-hidden />
    </header>
  )
}
