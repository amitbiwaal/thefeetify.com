import type { ReactNode } from 'react'

const ICONS = {
  shield: <path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />,
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 010 20" />
    </>
  ),
  check: <polyline points="20 6 9 17 4 12" />,
  upload: (
    <>
      <path d="M21 15V5a2 2 0 00-2-2H9" />
      <rect x="3" y="7" width="14" height="14" rx="2" />
      <path d="M7 15l3-3 3 3 2-2 2 2" />
    </>
  ),
  dollar: (
    <>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </>
  ),
  message: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />,
  tag: (
    <>
      <path d="M20.6 13.4L12 22l-9-9V3h10z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-6" />
    </>
  ),
  card: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  stack: (
    <>
      <rect x="2" y="7" width="14" height="14" rx="2" />
      <path d="M8 3h10a2 2 0 012 2v10" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="10 9 16 12 10 15 10 9" fill="currentColor" />
    </>
  ),
  star: <path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 16.6 5.7 21l2.3-7.2-6-4.4h7.6z" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6" />
      <path d="M17 8a3 3 0 010 6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  filter: (
    <>
      <path d="M3 6h18" />
      <path d="M6 12h12" />
      <path d="M10 18h4" />
    </>
  ),
  question: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 015.8 1c0 2-3 2.5-3 4" />
      <line x1="12" y1="17.5" x2="12" y2="17.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  doc: (
    <>
      <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof ICONS

export function Icon({ name, strokeWidth = 2 }: { name: IconName; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true">
      {ICONS[name]}
    </svg>
  )
}

export function Tick() {
  return (
    <span className="tick">
      <Icon name="check" strokeWidth={3} />
    </span>
  )
}
