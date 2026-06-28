import { cn } from '@/lib/utils'

// Shimmer bar (DESIGN §6.1 empty/skeleton). Reduced-motion removes the sweep
// (handled by the global reduced-motion layer in index.css).
function Bar({ className }: { className?: string }) {
  return (
    <div className={cn('relative overflow-hidden rounded-md bg-muted', className)}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-card to-transparent" />
    </div>
  )
}

/** A list of post-row skeletons (title 60% + meta 30%). */
export function PostRowSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <ul className="flex flex-col gap-4" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="px-3 py-3">
          <Bar className="h-5 w-3/5" />
          <Bar className="mt-2 h-3 w-2/5" />
        </li>
      ))}
    </ul>
  )
}
