'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { type ContactState, sendMessage } from './actions'

const INITIAL: ContactState = { status: 'idle' }

export function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, INITIAL)
  const [startedAt, setStartedAt] = useState('')

  const feedback = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setStartedAt(String(Date.now()))
  }, [])

  // The result replaces or sits above the form; bring it into view so it is not missed on phones.
  useEffect(() => {
    if (state.status === 'idle') return
    feedback.current?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    feedback.current?.focus({ preventScroll: true })
  }, [state])

  if (state.status === 'success') {
    return (
      <div className="alert alert-ok" role="status" tabIndex={-1} ref={feedback}>
        {state.message}
      </div>
    )
  }

  const { errors = {}, values } = state

  return (
    <form className="form" action={action} noValidate>
      {state.status === 'error' && (
        <div className="alert alert-err" role="alert" tabIndex={-1} ref={feedback}>
          {state.message ?? 'Please check the highlighted fields and try again.'}
        </div>
      )}

      <div className="form-row">
        <div className="field">
          <label htmlFor="contact-name">Name</label>
          <input
            className="input"
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            required
            defaultValue={values?.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
          />
          {errors.name && (
            <p className="error" id="contact-name-error">
              {errors.name}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="contact-email">Email</label>
          <input
            className="input"
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={120}
            required
            defaultValue={values?.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
          />
          {errors.email && (
            <p className="error" id="contact-email-error">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="contact-subject">Subject (optional)</label>
        <input
          className="input"
          id="contact-subject"
          name="subject"
          type="text"
          maxLength={140}
          defaultValue={values?.subject}
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
        />
        {errors.subject && (
          <p className="error" id="contact-subject-error">
            {errors.subject}
          </p>
        )}
      </div>

      <div className="field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          className="textarea"
          id="contact-message"
          name="message"
          maxLength={4000}
          required
          defaultValue={values?.message}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-hint'}
        />
        {errors.message ? (
          <p className="error" id="contact-message-error">
            {errors.message}
          </p>
        ) : (
          <p className="hint" id="contact-message-hint">
            Please do not include passwords, payment details, or photos.
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <div>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? 'Sending…' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}
