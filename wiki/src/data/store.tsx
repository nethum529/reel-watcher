import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CreatorSummary, Post, TopicSummary, WikiData } from './types'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'ready'; data: WikiData }

const DataContext = createContext<LoadState | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    // Relative to index.html so the app is file://-hostable; the backend writes
    // data.json beside index.html (wiki_export.build_wiki).
    const url = `${import.meta.env.BASE_URL}data.json`
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`data.json returned ${res.status}`)
        return res.json() as Promise<WikiData>
      })
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', data })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            error: err instanceof Error ? err.message : 'Could not load data.json',
          })
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  return <DataContext.Provider value={state}>{children}</DataContext.Provider>
}

export function useData(): LoadState {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within a DataProvider')
  return ctx
}

/** Convenience: the loaded posts, or [] while loading/errored. */
export function usePosts(): Post[] {
  const state = useData()
  return state.status === 'ready' ? (state.data.posts ?? []) : []
}

export function useTopics(posts: Post[]): TopicSummary[] {
  return useMemo(() => {
    const counts = new Map<string, number>()
    for (const post of posts) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }
    return [...counts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  }, [posts])
}

export function useCreators(posts: Post[]): CreatorSummary[] {
  return useMemo(() => {
    const map = new Map<string, CreatorSummary>()
    for (const post of posts) {
      const existing = map.get(post.creator)
      if (existing) {
        existing.count += 1
      } else {
        map.set(post.creator, {
          creator: post.creator,
          source: post.source,
          count: 1,
        })
      }
    }
    return [...map.values()].sort(
      (a, b) => b.count - a.count || a.creator.localeCompare(b.creator),
    )
  }, [posts])
}

/** Newest-first by fetched_at. */
export function useRecent(posts: Post[], limit?: number): Post[] {
  return useMemo(() => {
    const sorted = [...posts].sort((a, b) => b.fetched_at - a.fetched_at)
    return limit ? sorted.slice(0, limit) : sorted
  }, [posts, limit])
}
