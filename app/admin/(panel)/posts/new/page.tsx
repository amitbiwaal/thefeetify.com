import type { Metadata } from 'next'
import { PostEditor } from '@/components/admin/PostEditor'
import { getAllPosts } from '@/lib/posts'
import { requireAdmin } from '@/lib/session'
import { SITE } from '@/lib/site'
import { storageBackend } from '@/lib/store'

export const metadata: Metadata = { title: 'New post' }

export default async function NewPostPage() {
  await requireAdmin()
  const categories = [...new Set((await getAllPosts()).map((post) => post.category).filter(Boolean))].sort()

  return (
    <PostEditor
      post={null}
      categories={categories}
      siteName={SITE.name}
      siteDomain={SITE.domain}
      defaultAuthor={SITE.defaultAuthor}
      canSave={storageBackend() !== 'readonly'}
    />
  )
}
