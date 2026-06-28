import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// Section eyebrow (DESIGN §1 overline): Inter 600, uppercase, +0.06em.
export function Overline({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'font-sans text-overline font-semibold uppercase tracking-[0.06em] text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}
