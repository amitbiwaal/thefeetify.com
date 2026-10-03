import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostEditor } from '@/components/admin/PostEditor'
import { getAllPosts } from '@/lib/posts'
import { requireAdmin } from '@/lib/session'
import { SITE } from '@/lib/site'
import { storageBackend } from '@/lib/store'

export const metadata: Metadata = { title: 'Edit post' }

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const posts = await getAllPosts()
  const post = posts.find((item) => item.id === id)
  if (!post) notFound()
  const categories = [...new Set(posts.map((item) => item.category).filter(Boolean))].sort()

  return (
    <PostEditor
      // Remount when switching between posts so no state leaks from one to the next.
      key={post.id}
      post={post}
      categories={categories}
      siteName={SITE.name}
      siteDomain={SITE.domain}
      defaultAuthor={SITE.defaultAuthor}
      canSave={storageBackend() !== 'readonly'}
    />
  )
}
