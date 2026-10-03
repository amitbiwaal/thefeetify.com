'use server'

import { MAX_STORED_MESSAGES, addMessage, listMessages } from '@/lib/messages'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { storageBackend } from '@/lib/store'

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  errors?: Partial<Record<'name' | 'email' | 'subject' | 'message', string>>
  values?: { name: string; email: string; subject: string; message: string }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const SUCCESS: ContactState = {
  status: 'success',
  message: 'Thanks — your message has been sent. We read everything and reply when a response is needed.',
}

const field = (data: FormData, name: string) => String(data.get(name) ?? '').trim()

export async function sendMessage(_previous: ContactState, data: FormData): Promise<ContactState> {
  const values = {
    name: field(data, 'name'),
    email: field(data, 'email'),
    subject: field(data, 'subject'),
    message: field(data, 'message'),
  }

  // Bots fill the hidden field or submit instantly. Pretend it worked so they do not retry.
  const elapsed = Date.now() - Number(field(data, 'startedAt') || 0)
  if (field(data, 'company') !== '' || elapsed < 2500) return SUCCESS

  const errors: ContactState['errors'] = {}
  if (values.name.length < 2 || values.name.length > 80) errors.name = 'Please enter your name (2–80 characters).'
  if (!EMAIL_PATTERN.test(values.email) || values.email.length > 120) errors.email = 'Please enter a valid email address.'
  if (values.subject.length > 140) errors.subject = 'Please keep the subject under 140 characters.'
  if (values.message.length < 10) errors.message = 'Please write at least 10 characters.'
  else if (values.message.length > 4000) errors.message = 'Please keep your message under 4,000 characters.'
  if (Object.keys(errors).length) return { status: 'error', errors, values }

  if (!rateLimit(`contact:${await clientIp()}`, 3, 10 * 60 * 1000)) {
    return { status: 'error', message: 'You have sent several messages in a short time. Please try again later.', values }
  }

  try {
    if (storageBackend() === 'readonly' || (await listMessages()).length >= MAX_STORED_MESSAGES) {
      return { status: 'error', message: 'The contact form is temporarily unavailable. Please try again later.', values }
    }
    await addMessage(values)
    return SUCCESS
  } catch (error) {
    console.error('[contact] Could not save message', error)
    return { status: 'error', message: 'Something went wrong while sending your message. Please try again.', values }
  }
}
