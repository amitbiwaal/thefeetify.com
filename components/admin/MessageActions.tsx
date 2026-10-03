'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { deleteMessageAction, setMessageReadAction } from '@/app/admin/actions'

export function MessageActions({
  id,
  read,
  email,
  subject,
}: {
  id: string
  read: boolean
  email: string
  subject: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const run = (task: () => Promise<{ ok: true } | { ok: false; error: string }>) => {
    setError('')
    startTransition(async () => {
      try {
        const result = await task()
        if (!result.ok) setError(result.error)
        else router.refresh()
      } catch {
        setError('Could not reach the server. Please try again.')
      }
    })
  }

  return (
    <div className="a-item-actions" style={{ justifyContent: 'flex-start' }}>
      <a className="a-link" href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${subject || 'Your message to Feetify'}`)}`}>
        Reply by email
      </a>
      <button className="a-link" type="button" disabled={pending} onClick={() => run(() => setMessageReadAction(id, !read))}>
        Mark as {read ? 'unread' : 'read'}
      </button>
      <button
        className="a-link a-link-danger"
        type="button"
        disabled={pending}
        onClick={() => {
          if (window.confirm('Delete this message permanently?')) run(() => deleteMessageAction(id))
        }}
      >
        Delete
      </button>
      {error && <span className="a-error">{error}</span>}
    </div>
  )
}
