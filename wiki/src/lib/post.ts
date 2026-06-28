import type { Post } from '@/data/types'

function firstLine(text: string): string {
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (line) return line
  }
  return ''
}

function clamp(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

/** Posts carry no explicit title; derive one from caption → transcript → creator. */
export function postTitle(post: Post): string {
  const fromCaption = firstLine(post.caption)
  if (fromCaption) return clamp(fromCaption, 100)
  const fromTranscript = firstLine(post.transcript)
  if (fromTranscript) return clamp(fromTranscript, 100)
  return `Post from @${post.creator}`
}

/** A short preview line for search results (transcript-first, the payoff). */
export function postExcerpt(post: Post, max = 180): string {
  const body = post.transcript.trim() || post.caption.trim()
  return clamp(body.replace(/\s+/g, ' '), max)
}

export function hasTranscript(post: Post): boolean {
  return post.transcript.trim().length > 0
}

/** Only http(s) outbound links are rendered — guards against javascript:/data: urls. */
export function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/** Split slides text into discrete OCR blocks (blank-line separated). */
export function slideBlocks(post: Post): string[] {
  return post.slides
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Case-insensitive full-text search over title/caption/transcript/creator/tags. */
export function postMatches(post: Post, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    postTitle(post).toLowerCase().includes(q) ||
    post.caption.toLowerCase().includes(q) ||
    post.transcript.toLowerCase().includes(q) ||
    post.creator.toLowerCase().includes(q) ||
    post.tags.some((t) => t.toLowerCase().includes(q))
  )
}
