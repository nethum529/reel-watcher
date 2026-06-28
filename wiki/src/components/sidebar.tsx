import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  House,
  Library,
  Menu,
  Search,
  Tags,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'
import { Icon } from '@/components/icon'
import { cn } from '@/lib/utils'

interface NavItemDef {
  label: string
  icon: LucideIcon
  to: { pathname: string; hash?: string }
  // Predicate over the current location — hash-aware so the wiki-home anchor
  // sections (#topics / #creators) and their detail routes light the right item.
  isActive: (pathname: string, hash: string) => boolean
  kbd?: string
}

// Order = obstacle frequency (DESIGN §5): Wiki · Topics · Creators · Search.
const NAV_ITEMS: NavItemDef[] = [
  {
    label: 'Wiki',
    icon: House,
    to: { pathname: '/wiki' },
    isActive: (p, h) => p === '/wiki' && h === '',
  },
  {
    label: 'Topics',
    icon: Tags,
    to: { pathname: '/wiki', hash: '#topics' },
    isActive: (p, h) => p.startsWith('/topic/') || (p === '/wiki' && h === '#topics'),
  },
  {
    label: 'Creators',
    icon: Users,
    to: { pathname: '/wiki', hash: '#creators' },
    isActive: (p, h) => p.startsWith('/creator/') || (p === '/wiki' && h === '#creators'),
  },
  {
    label: 'Search',
    icon: Search,
    to: { pathname: '/search' },
    isActive: (p) => p === '/search',
    kbd: '⌘K',
  },
]

// One nav item — shared by the desktop rail and the mobile sheet. The active
// state carries three channels (DESIGN §6): gold text/icon + a 2px gold inset
// rule + a stroke-2 icon, never color alone. aria-current marks the route.
// `rail` collapses labels to an icon-only rail at md (labels return at lg); the
// mobile sheet (rail=false) always shows labels.
function NavItem({
  item,
  active,
  rail,
  onNavigate,
}: {
  item: NavItemDef
  active: boolean
  rail?: boolean
  onNavigate?: () => void
}) {
  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      aria-label={item.label}
      aria-current={active ? 'page' : undefined}
      data-active-rule={active ? 'true' : undefined}
      className={cn(
        'group flex min-h-11 items-center gap-3 rounded-md border-l-2 px-3 font-sans text-label font-medium transition-colors',
        rail ? 'justify-center lg:justify-start' : 'justify-start',
        active
          ? 'border-sidebar-primary bg-sidebar-accent text-sidebar-primary'
          : 'border-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground',
      )}
    >
      <Icon
        icon={item.icon}
        size={16}
        strokeWidth={active ? 2 : 1.5}
        className={cn(!active && 'group-hover:text-primary')}
      />
      <span className={cn('flex-1', rail && 'hidden lg:inline')}>{item.label}</span>
      {item.kbd && (
        <kbd
          className={cn(
            'font-sans text-caption font-normal text-muted-foreground',
            rail && 'hidden lg:inline',
          )}
        >
          {item.kbd}
        </kbd>
      )}
    </Link>
  )
}

// The inner rail content, reused by the desktop aside and the mobile sheet.
function NavContent({ onNavigate, rail }: { onNavigate?: () => void; rail?: boolean }) {
  const { pathname, hash } = useLocation()

  return (
    <div className="flex h-full flex-col">
      {/* Brand lockup → landing. Fraunces wordmark; a glyph in the 72px rail. */}
      <div className="flex flex-col gap-3 p-3 lg:px-4 lg:py-5">
        <Link
          to="/"
          onClick={onNavigate}
          aria-label="reel-watcher — back to landing"
          className={cn(
            'flex min-h-11 items-center gap-2 rounded-md',
            rail ? 'justify-center lg:justify-start' : 'justify-start',
          )}
        >
          <span
            className={cn(
              'font-display text-title font-normal text-foreground',
              rail && 'hidden lg:inline',
            )}
          >
            reel-watcher
          </span>
          {rail && <Icon icon={Library} size={18} className="text-primary lg:hidden" />}
        </Link>
        <div className={cn('gold-leaf w-8', rail ? 'mx-auto lg:!mx-0' : '!mx-0')} aria-hidden />
      </div>

      <nav aria-label="Primary" className="flex flex-col gap-1 px-3 lg:px-4">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.label}
            item={item}
            rail={rail}
            active={item.isActive(pathname, hash)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mt-auto px-3 pb-4 lg:px-4">
        <Link
          to="/"
          onClick={onNavigate}
          aria-label="Back to landing"
          className={cn(
            'flex min-h-11 items-center gap-2 rounded-md font-sans text-caption text-muted-foreground transition-colors hover:text-foreground',
            rail ? 'justify-center lg:justify-start' : 'justify-start',
          )}
        >
          <Icon icon={ArrowLeft} size={16} />
          <span className={cn(rail && 'hidden lg:inline')}>Back to landing</span>
        </Link>
      </div>
    </div>
  )
}

// Persistent rail (md+): 72px icon rail at md, 264px icon+label at lg. Warm
// near-black material against the green content well — the material change IS
// the separation of concerns (DESIGN §6). Seam = 1px sidebar-border, no shadow.
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar md:block md:w-[72px] lg:w-[264px]">
      <NavContent rail />
    </aside>
  )
}

// Mobile top bar + sheet (<md). The sheet follows the WAI-ARIA APG Dialog
// pattern (https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): focus
// trapped inside, Esc closes, focus returns to the trigger, body scroll locked.
export function MobileBar() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const panel = panelRef.current
    if (!panel) return
    const trigger = triggerRef.current // captured for focus-return at cleanup

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    focusables()[0]?.focus()

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      trigger?.focus() // return focus to the trigger (modal contract)
    }
  }, [open])

  return (
    <div className="md:hidden">
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-sidebar-border bg-sidebar px-3">
        <Link
          to="/"
          aria-label="reel-watcher — back to landing"
          className="rounded-md font-display text-title font-normal text-foreground"
        >
          reel-watcher
        </Link>
        <button
          ref={triggerRef}
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon icon={open ? X : Menu} size={20} />
        </button>
      </div>

      {open && (
        <>
          {/* Scrim — purposeful layer signal over content, not decorative glass. */}
          <div
            className="fixed inset-0 z-40 bg-green-well/70"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Primary navigation"
            className="fixed inset-y-0 left-0 z-50 w-[264px] border-r border-sidebar-border bg-sidebar"
          >
            <NavContent onNavigate={() => setOpen(false)} />
          </div>
        </>
      )}
    </div>
  )
}
