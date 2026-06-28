import type { ReactNode } from 'react'

interface MastheadProps {
  // Wide-tracked uppercase eyebrow (DESIGN §7, overline step). NOT a heading — it
  // sits above the h1, so it stays a styled <p> to keep the heading outline
  // gap-free (h1 → h2 → h3). E.g. "ARCHIVE", "TOPIC", "CREATOR".
  overline: string
  // The page's dominant element (BRAND §3): a left-locked Anton display headline,
  // ≥2× the weight of anything near it. Rendered as the page <h1>. Uppercase.
  title: ReactNode
  // The single Orchid slab (BRAND §3): a solid --primary rectangle with jet
  // --primary-foreground text carrying the page's key datum (a count / handle).
  // Appears exactly once per page, only here. Omit on pages with no datum.
  slab?: ReactNode
}

// The left-locked grid-rule masthead — the signature element (BRAND §3, DESIGN
// §7), returned on every non-landing page: eyebrow → Anton headline beside the
// single Orchid slab → a 2px full-width hard rule. Left-locked and asymmetric,
// never centered (BRAND §1 refuses centered symmetry).
export function Masthead({ overline, title, slab }: MastheadProps) {
  return (
    <header>
      <p className="font-sans text-overline font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {overline}
      </p>
      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="font-display text-display uppercase tracking-[-0.01em] text-foreground">
          {title}
        </h1>
        {slab && (
          <div
            data-slab
            className="inline-flex shrink-0 items-baseline gap-2 self-start bg-primary px-4 py-2 font-condensed text-title font-medium uppercase text-primary-foreground md:self-auto"
          >
            {slab}
          </div>
        )}
      </div>
      {/* The masthead rule — the structural seam, 2px, full content width. */}
      <div className="mt-4 border-t-2 border-border" aria-hidden />
    </header>
  )
}
