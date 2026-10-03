import type { Metadata } from 'next'
import Link from 'next/link'
import { listMessages } from '@/lib/messages'
import { type Post, getAllPosts, isPublic } from '@/lib/posts'
import { requireAdmin } from '@/lib/session'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Posts' }

type Filter = 'all' | 'published' | 'draft'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
]

function StatusBadge({ post }: { post: Post }) {
  if (post.status === 'draft') return <span className="a-badge is-draft">Draft</span>
  if (!isPublic(post)) return <span className="a-badge is-scheduled">Scheduled</span>
  return <span className="a-badge is-live">Published</span>
}

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin()
  const { status } = await searchParams
  const filter: Filter = status === 'published' || status === 'draft' ? status : 'all'

  const [posts, unread] = await Promise.all([
    getAllPosts(),
    listMessages()
      .then((messages) => messages.filter((message) => !message.read).length)
      .catch(() => 0),
  ])
  const counts = {
    all: posts.length,
    published: posts.filter((post) => post.status === 'published').length,
    draft: posts.filter((post) => post.status === 'draft').length,
  }
  const visible = filter === 'all' ? posts : posts.filter((post) => post.status === filter)

  return (
    <>
      <div className="a-pagehead">
        <h1>Posts</h1>
        <Link className="a-btn a-btn-primary" href="/admin/posts/new">
          + New post
        </Link>
      </div>

      {unread > 0 && (
        <div className="a-alert a-alert-info">
          You have {unread} unread contact {unread === 1 ? 'message' : 'messages'}.{' '}
          <Link href="/admin/messages">Open messages</Link>
        </div>
      )}

      <nav className="a-tabs" aria-label="Filter posts">
        {FILTERS.map((item) => (
          <Link
            key={item.key}
            href={item.key === 'all' ? '/admin' : `/admin?status=${item.key}`}
            aria-current={filter === item.key ? 'page' : undefined}
          >
            {item.label} ({counts[item.key]})
          </Link>
        ))}
      </nav>

      {visible.length === 0 ? (
        <div className="a-empty">
          <h2>{filter === 'all' ? 'No posts yet' : 'Nothing here'}</h2>
          <p>Write your first article and publish it to the blog.</p>
          <Link className="a-btn a-btn-primary" href="/admin/posts/new">
            Write a post
          </Link>
        </div>
      ) : (
        <ul className="a-list">
          {visible.map((post) => (
            <li className="a-item" key={post.id}>
              <div style={{ display: 'grid', gap: 6, minWidth: 0 }}>
                <Link className="a-item-title" href={`/admin/posts/${post.id}`}>
                  {post.title || 'Untitled'}
                </Link>
                <div className="a-item-meta">
                  <StatusBadge post={post} />
                  {post.category && <span>{post.category}</span>}
                  <span>/{post.slug}</span>
                  <span>
                    {post.status === 'published' && post.publishedAt
                      ? `Published ${formatDate(post.publishedAt)}`
                      : `Edited ${formatDate(post.updatedAt)}`}
                  </span>
                </div>
              </div>
              <div className="a-item-actions">
                <Link className="a-link" href={`/admin/posts/${post.id}`}>
                  Edit
                </Link>
                {isPublic(post) && (
                  <a className="a-link" href={`/blog/${post.slug}`} target="_blank" rel="noopener">
                    View
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
