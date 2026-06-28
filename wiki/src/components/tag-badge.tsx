import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'

interface TagBadgeProps {
  tag: string
  selected?: boolean
  size?: 'default' | 'sm'
}

// A topic tag as a link to its topic page (DESIGN §8.3). SQUARE chip; selected
// takes the single Orchid fill with a check (the required second channel beyond
// color). The link wrapper guarantees a 44px hit area around the smaller chip
// (BRAND §10 / WCAG 2.5.8).
export function TagBadge({ tag, selected = false, size = 'default' }: TagBadgeProps) {
  return (
    <Link
      to={`/topic/${encodeURIComponent(tag)}`}
      className={cn(
        'inline-flex min-h-11 min-w-11 items-center justify-center transition-colors',
        !selected && 'hover:[&>span]:bg-accent hover:[&>span]:text-foreground',
      )}
    >
      <Badge variant={selected ? 'selected' : 'default'} size={size}>
        {selected && <Icon icon={Check} size={12} />}
        {tag}
      </Badge>
    </Link>
  )
}
