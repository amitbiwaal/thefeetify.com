import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAuthConfigured } from '@/lib/auth'
import { isAdmin } from '@/lib/session'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage() {
  if (await isAdmin()) redirect('/admin')

  return (
    <main className="a-login">
      <div className="a-login-card">
        <div>
          <h1>Feetify Admin</h1>
          <p>Sign in to write and publish blog posts.</p>
        </div>
        {isAuthConfigured() ? (
          <LoginForm />
        ) : (
          <div className="a-alert a-alert-warn" role="alert" style={{ marginBottom: 0 }}>
            Admin login is not set up yet. Add an <code>ADMIN_PASSWORD</code> environment variable (Vercel → Project →
            Settings → Environment Variables), then redeploy.
          </div>
        )}
        <a href="/">← Back to site</a>
      </div>
    </main>
  )
}
