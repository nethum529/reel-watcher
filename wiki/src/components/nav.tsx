import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { House, Menu, Search, Tags, Users, X, type LucideIcon } from 'lucide-react'
import { Icon } from '@/components/icon'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NavItemDef {
  to: string
  label: string
  icon: LucideIcon
}

const ITEMS: NavItemDef[] = [
  { to: '/', label: 'Home', icon: House },
  { to: '/topics', label: 'Topics', icon: Tags },
  { to: '/creators', label: 'Creators', icon: Users },
  { to: '/search', label: 'Search', icon: Search },
]

// Active item carries two channels: text-primary + 2px under-rule + 18px/stroke-2
// icon (DESIGN §6.6). Inactive: muted text, 16px/stroke-1.5 icon.
function NavItem({ item, onNavigate }: { item: NavItemDef; onNavigate?: () => void }) {
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'flex min-h-11 items-center gap-2 border-b-2 py-2 font-sans text-label font-medium transition-colors',
          isActive
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            icon={item.icon}
            size={isActive ? 18 : 16}
            strokeWidth={isActive ? 2 : 1.5}
          />
          {item.label}
        </>
      )}
    </NavLink>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Disclosure pattern (WAI-ARIA APG: Disclosure). Escape closes; focus stays
  // on the trigger so keyboard users return to a known place.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-0">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          end
          className="font-serif text-title font-medium tracking-[-0.005em] text-foreground"
        >
          reel-watcher
        </NavLink>

        {/* Desktop nav from md (DESIGN §3). */}
        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {ITEMS.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        {/* Mobile disclosure trigger (<md). 44px hit area. */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon icon={open ? X : Menu} size={20} />
        </Button>
      </div>

      {open && (
        <div
          id="mobile-nav"
          ref={panelRef}
          className="border-t border-border bg-background md:hidden"
        >
          <nav aria-label="Primary" className="mx-auto flex max-w-[1200px] flex-col px-4 py-2">
            {ITEMS.map((item) => (
              <NavItem key={item.to} item={item} onNavigate={() => setOpen(false)} />
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
