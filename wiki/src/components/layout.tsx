import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Nav } from '@/components/nav'

// App frame: skip link + sticky nav + centered content. Cmd/Ctrl+K jumps to the
// search route from anywhere (IA: global search reachable everywhere, DESIGN §5).
export function Layout() {
  const navigate = useNavigate()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        navigate('/search')
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navigate])

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-popover focus:px-4 focus:py-2 focus:font-sans focus:text-label focus:text-foreground"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
