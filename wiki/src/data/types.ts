// Mirrors the backend data contract (wiki_export.py → cache.cache_get_all()).
export interface Post {
  id: string
  url: string
  source: string
  caption: string
  transcript: string
  slides: string
  content: string
  creator: string
  posted_at: string | null
  view_count: number | null
  tags: string[]
  fetched_at: number
}

export interface WikiData {
  generated_at: number
  posts: Post[]
}

export interface TopicSummary {
  tag: string
  count: number
}

export interface CreatorSummary {
  creator: string
  source: string
  count: number
}
