import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './admin.css'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Feetify Admin' },
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="admin">{children}</div>
}
