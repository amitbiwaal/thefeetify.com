'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAuthConfigured, verifyPassword } from '@/lib/auth'
import { deleteMessage, setMessageRead } from '@/lib/messages'
import { type Post, deletePost, loadAllPosts, savePost } from '@/lib/posts'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { sanitizeContent } from '@/lib/sanitize'
import { endSession, isAdmin, startSession } from '@/lib/session'
import { SITE } from '@/lib/site'
import { StorageUnavailableError, isValidId, newId } from '@/lib/store'
import { slugify, stripHtml } from '@/lib/utils'

const SESSION_EXPIRED =
  'Your session has expired. Open /admin/login in a new tab, sign in, then come back and save again — your changes are still here.'
const RESERVED_SLUGS = new Set(['page', 'category'])
const MIN_PRODUCTION_PASSWORD_LENGTH = 10

/* --------------------------------- session -------------------------------- */

export type LoginState = { error?: string }

export async function login(_previous: LoginState, data: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return { error: 'Admin login is disabled: set the ADMIN_PASSWORD environment variable, then redeploy.' }
  }
  if (
    process.env.NODE_ENV === 'production' &&
    (process.env.ADMIN_PASSWORD ?? '').length < MIN_PRODUCTION_PASSWORD_LENGTH
  ) {
    return { error: `ADMIN_PASSWORD is too short. Use at least ${MIN_PRODUCTION_PASSWORD_LENGTH} characters.` }
  }
  if (!rateLimit(`login:${await clientIp()}`, 5, 15 * 60 * 1000)) {
    return { error: 'Too many attempts. Please wait 15 minutes and try again.' }
  }

  const valid = await verifyPassword(String(data.get('password') ?? ''))
  if (!valid) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return { error: 'Incorrect password.' }
  }

  await startSession()
  redirect('/admin')
}

export async function logout(): Promise<void> {
  await endSession()
  redirect('/admin/login')
}

/* ---------------------------------- posts --------------------------------- */

export type PostInput = {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  coverAlt: string
  category: string
  tags: string[]
  author: string
  status: 'draft' | 'published'
  publishedAt: string | null
  metaTitle: string
  metaDescription: string
  noindex: boolean
}

export type PostResult =
  | { ok: true; post: Post }
  | { ok: false; error: string; fields?: Partial<Record<keyof PostInput, string>> }

function revalidateSite() {
  // Posts appear on the home page, blog index, category archives, post pages, sitemap and feeds.
  revalidatePath('/', 'layout')
  revalidatePath('/sitemap.xml')
  revalidatePath('/feed.xml')
  revalidatePath('/llms.txt')
}

function storageError(error: unknown): string {
  if (error instanceof StorageUnavailableError) return error.message
  console.error('[admin] Storage error', error)
  return 'Could not reach storage. Please try again.'
}

const isImageUrl = (value: string) => value === '' || value.startsWith('/') || /^https?:\/\/\S+$/i.test(value)

export async function savePostAction(input: PostInput): Promise<PostResult> {
  if (!(await isAdmin())) return { ok: false, error: SESSION_EXPIRED }

  const fields: Partial<Record<keyof PostInput, string>> = {}
  const title = String(input.title ?? '').trim()
  const slug = slugify(String(input.slug ?? '') || title)
  const excerpt = String(input.excerpt ?? '').trim()
  const metaTitle = String(input.metaTitle ?? '').trim()
  const metaDescription = String(input.metaDescription ?? '').trim()
  const coverImage = String(input.coverImage ?? '').trim()
  const status = input.status === 'published' ? 'published' : 'draft'
  const content = sanitizeContent(String(input.content ?? ''))
  const tags = [
    ...new Set((Array.isArray(input.tags) ? input.tags : []).map((tag) => String(tag).trim()).filter(Boolean)),
  ]

  if (!title) fields.title = 'A title is required.'
  else if (title.length > 160) fields.title = 'Keep the title under 160 characters.'
  if (!slug) fields.slug = 'The URL slug needs at least one letter or number.'
  else if (RESERVED_SLUGS.has(slug)) fields.slug = `"${slug}" is reserved. Please choose another slug.`
  if (excerpt.length > 320) fields.excerpt = 'Keep the excerpt under 320 characters.'
  if (metaTitle.length > 120) fields.metaTitle = 'Keep the SEO title under 120 characters.'
  if (metaDescription.length > 320) fields.metaDescription = 'Keep the meta description under 320 characters.'
  if (!isImageUrl(coverImage)) fields.coverImage = 'The cover image must be an uploaded image or a full https:// URL.'
  if (tags.length > 15) fields.tags = 'Use 15 tags or fewer.'
  if (status === 'published' && !stripHtml(content) && !/<img\b/i.test(content)) {
    fields.content = 'Write some content before publishing.'
  }

  let publishedAt: string | null = null
  if (input.publishedAt) {
    const date = new Date(input.publishedAt)
    if (Number.isNaN(date.getTime())) fields.publishedAt = 'That publish date is not valid.'
    else publishedAt = date.toISOString()
  }

  try {
    const posts = await loadAllPosts()
    const existing = input.id ? posts.find((post) => post.id === input.id) : undefined
    if (input.id && (!isValidId(input.id) || !existing)) {
      return { ok: false, error: 'This post no longer exists. It may have been deleted in another tab.' }
    }
    if (slug && posts.some((post) => post.slug === slug && post.id !== existing?.id)) {
      fields.slug = 'Another post already uses this URL slug.'
    }
    if (Object.keys(fields).length) {
      return { ok: false, error: 'Please fix the highlighted fields.', fields }
    }

    const now = new Date().toISOString()
    const post: Post = {
      id: existing?.id ?? newId(),
      slug,
      title,
      excerpt,
      content,
      coverImage,
      coverAlt: String(input.coverAlt ?? '').trim(),
      category: String(input.category ?? '').trim().slice(0, 60),
      tags,
      author: String(input.author ?? '').trim().slice(0, 80) || SITE.defaultAuthor,
      status,
      // Empty date field: a post that is already live keeps its date, a draft going live gets
      // the current time, and a draft simply has no date yet.
      publishedAt:
        publishedAt ??
        (status === 'published' ? ((existing?.status === 'published' ? existing.publishedAt : null) ?? now) : null),
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      metaTitle,
      metaDescription,
      noindex: input.noindex === true,
    }

    await savePost(post)
    revalidateSite()
    return { ok: true, post }
  } catch (error) {
    return { ok: false, error: storageError(error) }
  }
}

export type SimpleResult = { ok: true } | { ok: false; error: string }

export async function deletePostAction(id: string): Promise<SimpleResult> {
  if (!(await isAdmin())) return { ok: false, error: SESSION_EXPIRED }
  if (!isValidId(id)) return { ok: false, error: 'Invalid post.' }
  try {
    await deletePost(id)
    revalidateSite()
    return { ok: true }
  } catch (error) {
    return { ok: false, error: storageError(error) }
  }
}

/* -------------------------------- messages -------------------------------- */

export async function setMessageReadAction(id: string, read: boolean): Promise<SimpleResult> {
  if (!(await isAdmin())) return { ok: false, error: SESSION_EXPIRED }
  if (!isValidId(id)) return { ok: false, error: 'Invalid message.' }
  try {
    await setMessageRead(id, read)
    revalidatePath('/admin', 'layout')
    return { ok: true }
  } catch (error) {
    return { ok: false, error: storageError(error) }
  }
}

export async function deleteMessageAction(id: string): Promise<SimpleResult> {
  if (!(await isAdmin())) return { ok: false, error: SESSION_EXPIRED }
  if (!isValidId(id)) return { ok: false, error: 'Invalid message.' }
  try {
    await deleteMessage(id)
    revalidatePath('/admin', 'layout')
    return { ok: true }
  } catch (error) {
    return { ok: false, error: storageError(error) }
  }
}
