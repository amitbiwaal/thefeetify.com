import type { Metadata } from 'next'
import { MessageActions } from '@/components/admin/MessageActions'
import { type Message, listMessages } from '@/lib/messages'
import { requireAdmin } from '@/lib/session'

export const metadata: Metadata = { title: 'Messages' }

const dateTime = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' })

export default async function AdminMessagesPage() {
  await requireAdmin()

  let messages: Message[] = []
  let failed = false
  try {
    messages = await listMessages()
  } catch (error) {
    console.error('[admin] Could not load messages', error)
    failed = true
  }
  const unread = messages.filter((message) => !message.read).length

  return (
    <>
      <div className="a-pagehead">
        <h1>Messages</h1>
        <span className="a-item-meta">
          {messages.length} total · {unread} unread
        </span>
      </div>

      {failed && (
        <div className="a-alert a-alert-err" role="alert">
          Could not load messages from storage. Please refresh the page.
        </div>
      )}

      {!failed && messages.length === 0 ? (
        <div className="a-empty">
          <h2>No messages yet</h2>
          <p>Messages sent through the contact page appear here.</p>
        </div>
      ) : (
        <div className="a-list">
          {messages.map((message) => (
            <article className={`a-message${message.read ? '' : ' is-unread'}`} key={message.id}>
              <div className="a-item-meta">
                {!message.read && <span className="a-badge is-new">New</span>}
                <strong style={{ color: '#0b3d31', fontSize: '.95rem' }}>{message.name}</strong>
                <a href={`mailto:${message.email}`}>{message.email}</a>
                <span>{dateTime.format(new Date(message.createdAt))} UTC</span>
              </div>
              {message.subject && <h2>{message.subject}</h2>}
              <div className="a-message-body">{message.message}</div>
              <MessageActions id={message.id} read={message.read} email={message.email} subject={message.subject} />
            </article>
          ))}
        </div>
      )}
    </>
  )
}
