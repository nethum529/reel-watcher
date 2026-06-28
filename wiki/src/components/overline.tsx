import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// Section eyebrow (DESIGN §1 overline step): Inter 600, uppercase, +0.12em.
// Renders an <h2> so major sections appear in the heading-nav tree (WCAG 1.3.1);
// the overline styling is purely visual.
export function Overline({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'font-sans text-overline font-semibold uppercase tracking-[0.12em] text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
