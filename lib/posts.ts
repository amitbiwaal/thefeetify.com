import 'server-only'
import { cache } from 'react'
import { deleteRecord, fsReadAll, isValidId, readRecords, storageBackend, writeRecord } from './store'
import { slugify } from './utils'

export type PostStatus = 'draft' | 'published'

export type Post = {
  id: string
  slug: string
  title: string
  excerpt: string
  /** Sanitized HTML produced by the admin editor. */
  content: string
  coverImage: string
  coverAlt: string
  category: string
  tags: string[]
  author: string
  status: PostStatus
  /** ISO date. A published post with a future date goes live when that date passes. */
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  metaTitle: string
  metaDescription: string
  noindex: boolean
}

export type Category = { name: string; slug: string; count: number }

const text = (value: unknown, fallback = ''): string => (typeof value === 'string' ? value : fallback)

const isoDate = (value: unknown): string | null => {
  if (typeof value !== 'string' || !value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export function normalizePost(raw: unknown): Post | null {
  if (!raw || typeof raw !== 'object') return null
  const data = raw as Record<string, unknown>
  if (!isValidId(data.id) || typeof data.title !== 'string') return null
  const slug = slugify(text(data.slug)) || slugify(data.title)
  if (!slug) return null
  const createdAt = isoDate(data.createdAt) ?? new Date(0).toISOString()
  return {
    id: data.id,
    slug,
    title: data.title.trim(),
    excerpt: text(data.excerpt).trim(),
    content: text(data.content),
    coverImage: text(data.coverImage).trim(),
    coverAlt: text(data.coverAlt).trim(),
    category: text(data.category).trim(),
    tags: Array.isArray(data.tags)
      ? data.tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim() !== '').map((tag) => tag.trim())
      : [],
    author: text(data.author).trim(),
    status: data.status === 'published' ? 'published' : 'draft',
    publishedAt: isoDate(data.publishedAt),
    createdAt,
    updatedAt: isoDate(data.updatedAt) ?? createdAt,
    metaTitle: text(data.metaTitle).trim(),
    metaDescription: text(data.metaDescription).trim(),
    noindex: data.noindex === true,
  }
}

const isTombstone = (raw: unknown): raw is { id: string; deleted: true } =>
  Boolean(raw) && typeof raw === 'object' && (raw as { deleted?: unknown }).deleted === true

/** Posts committed to the repo (content/posts). On Vercel these are read-only. */
async function loadBundledPosts(): Promise<Post[]> {
  return (await fsReadAll('posts')).map(normalizePost).filter((post): post is Post => post !== null)
}

/** Uncached read — use inside server actions, where data may have just changed. */
export async function loadAllPosts(): Promise<Post[]> {
  const posts = new Map<string, Post>()
  for (const post of await loadBundledPosts()) posts.set(post.id, post)

  if (storageBackend() === 'blob') {
    // Blob records override the bundled post with the same id; a tombstone hides it.
    for (const raw of await readRecords('posts')) {
      if (isTombstone(raw)) {
        posts.delete(raw.id)
        continue
      }
      const post = normalizePost(raw)
      if (post) posts.set(post.id, post)
    }
  }

  return [...posts.values()].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export const getAllPosts = cache(loadAllPosts)

export function isPublic(post: Post, now = Date.now()): boolean {
  return post.status === 'published' && post.publishedAt !== null && new Date(post.publishedAt).getTime() <= now
}

/** Last-modified date for readers and search engines; never earlier than the publish date (scheduled posts). */
export function modifiedAt(post: Post): string {
  return post.publishedAt && post.publishedAt > post.updatedAt ? post.publishedAt : post.updatedAt
}

export const getPublishedPosts = cache(async (): Promise<Post[]> => {
  const now = Date.now()
  return (await getAllPosts())
    .filter((post) => isPublic(post, now))
    .sort((a, b) => (a.publishedAt! < b.publishedAt! ? 1 : -1))
})

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return (await getPublishedPosts()).find((post) => post.slug === slug) ?? null
}

export async function getPostById(id: string): Promise<Post | null> {
  return (await getAllPosts()).find((post) => post.id === id) ?? null
}

export async function getCategories(): Promise<Category[]> {
  const categories = new Map<string, Category>()
  for (const post of await getPublishedPosts()) {
    const slug = slugify(post.category)
    if (!slug) continue
    const existing = categories.get(slug)
    if (existing) existing.count += 1
    else categories.set(slug, { name: post.category, slug, count: 1 })
  }
  return [...categories.values()].sort((a, b) => a.name.localeCompare(b.name))
}

export async function getRelatedPosts(post: Post, limit = 3): Promise<Post[]> {
  const others = (await getPublishedPosts()).filter((candidate) => candidate.id !== post.id)
  const category = slugify(post.category)
  const score = (candidate: Post) =>
    (category && slugify(candidate.category) === category ? 2 : 0) +
    candidate.tags.filter((tag) => post.tags.includes(tag)).length
  return others
    .map((candidate, index) => ({ candidate, index, score: score(candidate) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((item) => item.candidate)
}

export async function savePost(post: Post): Promise<void> {
  await writeRecord('posts', post.id, post)
}

export async function deletePost(id: string): Promise<void> {
  if (storageBackend() === 'blob' && (await loadBundledPosts()).some((post) => post.id === id)) {
    // A post that ships with the repo cannot be removed from the bundle, so hide it instead.
    await writeRecord('posts', id, { id, deleted: true, updatedAt: new Date().toISOString() })
    return
  }
  await deleteRecord('posts', id)
}
