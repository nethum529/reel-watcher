import { cn } from '@/lib/utils'

// Flat skeleton bar (DESIGN §8.1 empty/skeleton): brutalism is static — a single
// hard --muted bar, square, with an optional opacity pulse. No shimmer, no
// gradient sweep. The global reduced-motion layer (index.css) halts the pulse.
function Bar({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-muted', className)} />
}

/** A list of post-row skeletons (title 60% + meta 30%). */
export function PostRowSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <ul className="flex flex-col" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="border-b border-border-muted px-3 py-3">
          <Bar className="h-5 w-3/5" />
          <Bar className="mt-2 h-3 w-2/5" />
        </li>
      ))}
    </ul>
  )
}
