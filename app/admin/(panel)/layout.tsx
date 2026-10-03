import Link from 'next/link'
import type { ReactNode } from 'react'
import { AdminNav } from '@/components/admin/AdminNav'
import { requireAdmin } from '@/lib/session'
import { storageBackend } from '@/lib/store'
import { logout } from '../actions'

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  await requireAdmin()
  const backend = storageBackend()

  return (
    <>
      <header className="a-top">
        <div className="a-top-inner">
          <Link className="a-brand" href="/admin">
            Feetify <span>Admin</span>
          </Link>
          <AdminNav />
          <div className="a-top-actions">
            {/* A plain link in a new tab keeps the admin and public stylesheets apart. */}
            <a href="/" target="_blank" rel="noopener">
              View site
            </a>
            <form action={logout}>
              <button type="submit">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="a-main">
        {backend === 'readonly' && (
          <div className="a-alert a-alert-warn" role="alert">
            Storage is not connected, so posts, images and contact messages cannot be saved yet. In Vercel open{' '}
            <strong>Storage → Create → Blob</strong> (choose <strong>Public</strong> access), connect it to this
            project, then redeploy.
          </div>
        )}
        {backend === 'fs' && (
          <div className="a-alert a-alert-info">
            Local mode: posts are saved as files in <code>content/posts</code> and images in{' '}
            <code>public/uploads</code>. Commit them to publish with your next deploy.
          </div>
        )}
        {children}
      </main>
    </>
  )
}
