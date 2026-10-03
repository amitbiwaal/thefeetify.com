'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { type PostInput, deletePostAction, savePostAction } from '@/app/admin/actions'
import type { Post } from '@/lib/posts'
import { slugify, stripHtml, truncate } from '@/lib/utils'
import { RichTextEditor } from './RichTextEditor'
import { uploadImage } from './upload'

type Draft = Omit<PostInput, 'tags' | 'publishedAt'> & { tags: string; publishedAt: string }
type FieldErrors = Partial<Record<keyof PostInput, string>>

const SAVED_NOTICE_KEY = 'feetify-admin-saved-notice'
const NETWORK_ERROR = 'Could not reach the server. Nothing was lost — your changes are still here. Check your connection and try again.'

const pad = (value: number) => String(value).padStart(2, '0')

// The publish date is kept as an ISO string in state and only converted to local time for the
// date picker in the browser. The server (UTC on Vercel) and the editor's time zone therefore
// never disagree, and saving without touching the field leaves the stored time untouched.

/** ISO string → value for <input type="datetime-local"> in the editor's own time zone. */
function toLocalInput(iso: string): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Value of <input type="datetime-local"> (local time) → ISO string. */
function fromLocalInput(value: string): string {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

function toDraft(post: Post | null, defaultAuthor: string): Draft {
  return {
    id: post?.id,
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    coverImage: post?.coverImage ?? '',
    coverAlt: post?.coverAlt ?? '',
    category: post?.category ?? '',
    tags: post?.tags.join(', ') ?? '',
    author: post?.author || defaultAuthor,
    status: post?.status ?? 'draft',
    publishedAt: post?.publishedAt ?? '',
    metaTitle: post?.metaTitle ?? '',
    metaDescription: post?.metaDescription ?? '',
    noindex: post?.noindex ?? false,
  }
}

function Counter({ value, ideal }: { value: string; ideal: number }) {
  return (
    <span className={`a-counter${value.length > ideal ? ' is-over' : ''}`}>
      {value.length}/{ideal}
    </span>
  )
}

export function PostEditor({
  post,
  categories,
  siteName,
  siteDomain,
  defaultAuthor,
  canSave,
}: {
  post: Post | null
  categories: string[]
  siteName: string
  siteDomain: string
  defaultAuthor: string
  canSave: boolean
}) {
  const router = useRouter()
  const [draft, setDraft] = useState<Draft>(() => toDraft(post, defaultAuthor))
  const [saved, setSaved] = useState<Draft>(() => toDraft(post, defaultAuthor))
  const [slugEdited, setSlugEdited] = useState(Boolean(post))
  const [errors, setErrors] = useState<FieldErrors>({})
  const [banner, setBanner] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null)
  const [coverBusy, setCoverBusy] = useState(false)
  const [pending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)
  const coverInput = useRef<HTMLInputElement>(null)

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved])
  const isPublished = saved.status === 'published'
  const isLive = isPublished && (!saved.publishedAt || new Date(saved.publishedAt).getTime() <= Date.now())

  useEffect(() => setMounted(true), [])

  // Confirmations fade on their own; errors stay until dismissed or the next save.
  useEffect(() => {
    if (banner?.tone !== 'ok') return
    const timer = setTimeout(() => setBanner(null), 7000)
    return () => clearTimeout(timer)
  }, [banner])

  useEffect(() => {
    try {
      const text = sessionStorage.getItem(SAVED_NOTICE_KEY)
      if (!text) return
      sessionStorage.removeItem(SAVED_NOTICE_KEY)
      setBanner({ tone: 'ok', text })
    } catch {}
  }, [])

  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }))
    if (errors[key as keyof PostInput]) setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const onTitle = (title: string) => {
    setDraft((current) => ({ ...current, title, slug: slugEdited ? current.slug : slugify(title) }))
    if (errors.title) setErrors((current) => ({ ...current, title: undefined }))
  }

  const save = (status: PostInput['status']) => {
    setBanner(null)
    startTransition(async () => {
      let result: Awaited<ReturnType<typeof savePostAction>>
      try {
        result = await savePostAction({
          ...draft,
          status,
          tags: draft.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
          publishedAt: draft.publishedAt || null,
        })
      } catch {
        setBanner({ tone: 'err', text: NETWORK_ERROR })
        return
      }
      if (!result.ok) {
        setErrors(result.fields ?? {})
        setBanner({ tone: 'err', text: result.error })
        return
      }
      const next = { ...toDraft(result.post, defaultAuthor), content: draft.content }
      setErrors({})
      setDraft(next)
      setSaved(next)
      setSlugEdited(true)
      const scheduled =
        result.post.status === 'published' &&
        result.post.publishedAt !== null &&
        new Date(result.post.publishedAt).getTime() > Date.now()
      const text =
        result.post.status === 'draft'
          ? 'Draft saved.'
          : scheduled
            ? 'Scheduled. The post goes live automatically at the publish date.'
            : 'Published. The live site updates within a few seconds.'
      if (draft.id) {
        setBanner({ tone: 'ok', text })
      } else {
        // A new post moves to its permanent edit URL; carry the confirmation across the navigation.
        try {
          sessionStorage.setItem(SAVED_NOTICE_KEY, text)
        } catch {}
        router.replace(`/admin/posts/${result.post.id}`)
      }
    })
  }

  const remove = () => {
    if (!draft.id || !window.confirm('Delete this post permanently? This cannot be undone.')) return
    startTransition(async () => {
      let result: Awaited<ReturnType<typeof deletePostAction>>
      try {
        result = await deletePostAction(draft.id!)
      } catch {
        setBanner({ tone: 'err', text: NETWORK_ERROR })
        return
      }
      if (!result.ok) {
        setBanner({ tone: 'err', text: result.error })
        return
      }
      setSaved(draft)
      router.replace('/admin')
    })
  }

  const onCover = async (file: File | undefined) => {
    if (!file) return
    setCoverBusy(true)
    try {
      set('coverImage', await uploadImage(file))
    } catch (cause) {
      setErrors((current) => ({ ...current, coverImage: cause instanceof Error ? cause.message : 'Upload failed.' }))
    } finally {
      setCoverBusy(false)
      if (coverInput.current) coverInput.current.value = ''
    }
  }

  const seoTitle = draft.metaTitle || (draft.title ? `${draft.title} | ${siteName}` : 'Post title')
  const seoDescription =
    draft.metaDescription || draft.excerpt || truncate(stripHtml(draft.content), 160) || 'Your meta description appears here.'
  const disabled = pending || !canSave

  return (
    <div className="post-editor">
      <div className="a-pagehead">
        <div>
          <Link className="a-back" href="/admin">
            ← All posts
          </Link>
          <h1>{draft.id ? 'Edit post' : 'New post'}</h1>
        </div>
        <div className="a-status">
          <span className={`a-badge ${isPublished ? (isLive ? 'is-live' : 'is-scheduled') : 'is-draft'}`}>
            {isPublished ? (isLive ? 'Published' : 'Scheduled') : 'Draft'}
          </span>
          {dirty && <span className="a-dirty">Unsaved changes</span>}
        </div>
      </div>

      {banner && (
        <div
          className={`a-alert a-toast ${banner.tone === 'ok' ? 'a-alert-ok' : 'a-alert-err'}`}
          role={banner.tone === 'ok' ? 'status' : 'alert'}
        >
          <span>
            {banner.text}
            {banner.tone === 'ok' && isLive && (
              <>
                {' '}
                <a href={`/blog/${saved.slug}`} target="_blank" rel="noopener">
                  View post
                </a>
              </>
            )}
          </span>
          <button className="a-toast-close" type="button" aria-label="Dismiss message" onClick={() => setBanner(null)}>
            ×
          </button>
        </div>
      )}

      <div className="post-editor-grid">
        <div className="post-editor-main">
          <label className="a-field">
            <span>Title</span>
            <textarea
              className="a-input a-input-title"
              rows={1}
              value={draft.title}
              maxLength={160}
              placeholder="e.g. How to Sell Feet Pics Without Showing Your Face"
              aria-invalid={errors.title ? true : undefined}
              onChange={(event) => onTitle(event.target.value.replace(/\s*\n\s*/g, ' '))}
            />
            {errors.title && <em className="a-error">{errors.title}</em>}
          </label>

          <label className="a-field">
            <span>URL slug</span>
            <div className="a-slug">
              <span aria-hidden="true">{siteDomain}/blog/</span>
              <input
                className="a-input"
                type="text"
                value={draft.slug}
                maxLength={80}
                spellCheck={false}
                autoCapitalize="none"
                aria-invalid={errors.slug ? true : undefined}
                onChange={(event) => {
                  setSlugEdited(true)
                  set('slug', event.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))
                }}
                onBlur={() => set('slug', slugify(draft.slug))}
              />
            </div>
            {errors.slug && <em className="a-error">{errors.slug}</em>}
            {isPublished && draft.slug !== saved.slug && (
              <em className="a-hint">Changing the URL of a published post breaks links that already point to it.</em>
            )}
          </label>

          <div className="a-field">
            <span>Content</span>
            <RichTextEditor
              initialContent={post?.content ?? ''}
              invalid={Boolean(errors.content)}
              onChange={(html) => set('content', html)}
            />
            {errors.content && <em className="a-error">{errors.content}</em>}
          </div>
        </div>

        <aside className="post-editor-side">
          <section className="a-card">
            <h2>Publish</h2>
            <label className="a-field">
              <span>Publish date</span>
              <input
                className="a-input"
                type="datetime-local"
                // Filled in after mount: local time is only known in the browser.
                value={mounted ? toLocalInput(draft.publishedAt) : ''}
                aria-invalid={errors.publishedAt ? true : undefined}
                onChange={(event) => set('publishedAt', fromLocalInput(event.target.value))}
              />
              <em className="a-hint">Your local time. Leave empty to publish right away; a future date schedules the post.</em>
              {errors.publishedAt && <em className="a-error">{errors.publishedAt}</em>}
            </label>
            <label className="a-field">
              <span>Author</span>
              <input
                className="a-input"
                type="text"
                value={draft.author}
                maxLength={80}
                onChange={(event) => set('author', event.target.value)}
              />
            </label>
            <div className="a-actions">
              {isPublished ? (
                <>
                  <button className="a-btn a-btn-primary" type="button" disabled={disabled} onClick={() => save('published')}>
                    {pending ? 'Saving…' : 'Update'}
                  </button>
                  <button className="a-btn" type="button" disabled={disabled} onClick={() => save('draft')}>
                    Unpublish
                  </button>
                </>
              ) : (
                <>
                  <button className="a-btn a-btn-primary" type="button" disabled={disabled} onClick={() => save('published')}>
                    {pending ? 'Saving…' : 'Publish'}
                  </button>
                  <button className="a-btn" type="button" disabled={disabled} onClick={() => save('draft')}>
                    Save draft
                  </button>
                </>
              )}
            </div>
            <div className="a-actions a-actions-minor">
              {isLive && (
                <a className="a-link" href={`/blog/${saved.slug}`} target="_blank" rel="noopener">
                  View post
                </a>
              )}
              {draft.id && (
                <button className="a-link a-link-danger" type="button" disabled={disabled} onClick={remove}>
                  Delete post
                </button>
              )}
            </div>
          </section>

          <section className="a-card">
            <h2>Cover image</h2>
            {draft.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="a-cover" src={draft.coverImage} alt="" />
            )}
            <input
              ref={coverInput}
              className="a-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              aria-label="Upload cover image"
              disabled={coverBusy || !canSave}
              onChange={(event) => onCover(event.target.files?.[0])}
            />
            {coverBusy && <em className="a-hint">Uploading…</em>}
            <label className="a-field">
              <span>Image URL</span>
              <input
                className="a-input"
                type="text"
                inputMode="url"
                placeholder="https://"
                value={draft.coverImage}
                aria-invalid={errors.coverImage ? true : undefined}
                onChange={(event) => set('coverImage', event.target.value)}
              />
              {errors.coverImage && <em className="a-error">{errors.coverImage}</em>}
            </label>
            <label className="a-field">
              <span>Alt text</span>
              <input
                className="a-input"
                type="text"
                value={draft.coverAlt}
                maxLength={200}
                onChange={(event) => set('coverAlt', event.target.value)}
              />
            </label>
            <em className="a-hint">Best at 1200 × 675 px (16:9). Also used as the social sharing image.</em>
            {draft.coverImage && (
              <button className="a-link a-link-danger" type="button" onClick={() => set('coverImage', '')}>
                Remove image
              </button>
            )}
          </section>

          <section className="a-card">
            <h2>Organise</h2>
            <label className="a-field">
              <span>Category</span>
              <input
                className="a-input"
                type="text"
                list="post-categories"
                value={draft.category}
                maxLength={60}
                placeholder="e.g. Privacy"
                onChange={(event) => set('category', event.target.value)}
              />
              <datalist id="post-categories">
                {categories.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </label>
            <label className="a-field">
              <span>Tags (comma separated)</span>
              <input
                className="a-input"
                type="text"
                value={draft.tags}
                placeholder="anonymous selling, pricing"
                aria-invalid={errors.tags ? true : undefined}
                onChange={(event) => set('tags', event.target.value)}
              />
              {errors.tags && <em className="a-error">{errors.tags}</em>}
            </label>
            <label className="a-field">
              <span>
                Excerpt <Counter value={draft.excerpt} ideal={160} />
              </span>
              <textarea
                className="a-input"
                rows={3}
                value={draft.excerpt}
                maxLength={320}
                placeholder="One or two sentences shown on blog cards and under the title."
                aria-invalid={errors.excerpt ? true : undefined}
                onChange={(event) => set('excerpt', event.target.value)}
              />
              {errors.excerpt && <em className="a-error">{errors.excerpt}</em>}
            </label>
          </section>

          <section className="a-card">
            <h2>SEO</h2>
            <div className="a-serp" aria-label="Search result preview">
              <span className="a-serp-url">
                {siteDomain} › blog › {draft.slug || 'post-url'}
              </span>
              <span className="a-serp-title">{truncate(seoTitle, 62)}</span>
              <span className="a-serp-desc">{truncate(seoDescription, 160)}</span>
            </div>
            <label className="a-field">
              <span>
                SEO title <Counter value={draft.metaTitle} ideal={60} />
              </span>
              <input
                className="a-input"
                type="text"
                value={draft.metaTitle}
                maxLength={120}
                placeholder={`Defaults to "${truncate(draft.title || 'Post title', 30)} | ${siteName}"`}
                aria-invalid={errors.metaTitle ? true : undefined}
                onChange={(event) => set('metaTitle', event.target.value)}
              />
              {errors.metaTitle && <em className="a-error">{errors.metaTitle}</em>}
            </label>
            <label className="a-field">
              <span>
                Meta description <Counter value={draft.metaDescription} ideal={160} />
              </span>
              <textarea
                className="a-input"
                rows={3}
                value={draft.metaDescription}
                maxLength={320}
                placeholder="Defaults to the excerpt."
                aria-invalid={errors.metaDescription ? true : undefined}
                onChange={(event) => set('metaDescription', event.target.value)}
              />
              {errors.metaDescription && <em className="a-error">{errors.metaDescription}</em>}
            </label>
            <label className="a-check">
              <input type="checkbox" checked={draft.noindex} onChange={(event) => set('noindex', event.target.checked)} />
              Hide from search engines (noindex)
            </label>
          </section>
        </aside>
      </div>

      {/* Always-reachable save bar for phones, where the Publish card is far down the page. */}
      <div className="a-savebar">
        <span>{dirty ? 'Unsaved changes' : 'All changes saved'}</span>
        <div>
          {!isPublished && (
            <button className="a-btn" type="button" disabled={disabled} onClick={() => save('draft')}>
              Save draft
            </button>
          )}
          <button className="a-btn a-btn-primary" type="button" disabled={disabled} onClick={() => save('published')}>
            {pending ? 'Saving…' : isPublished ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
