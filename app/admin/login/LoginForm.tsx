'use client'

import { useActionState } from 'react'
import { type LoginState, login } from '../actions'

const INITIAL: LoginState = {}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, INITIAL)

  return (
    <form action={action} style={{ display: 'grid', gap: 14 }}>
      {state.error && (
        <div className="a-alert a-alert-err" role="alert" style={{ marginBottom: 0 }}>
          {state.error}
        </div>
      )}
      {/* Lets password managers file the credential under a username. */}
      <input type="text" name="username" autoComplete="username" defaultValue="admin" readOnly hidden />
      <label className="a-field">
        <span>Password</span>
        <input className="a-input" type="password" name="password" autoComplete="current-password" required autoFocus />
      </label>
      <button className="a-btn a-btn-primary" type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
