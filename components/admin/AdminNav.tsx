'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/admin', label: 'Posts', match: (path: string) => path === '/admin' || path.startsWith('/admin/posts') },
  { href: '/admin/posts/new', label: 'New post', match: () => false },
  { href: '/admin/messages', label: 'Messages', match: (path: string) => path.startsWith('/admin/messages') },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="a-nav" aria-label="Admin">
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} aria-current={link.match(pathname) ? 'page' : undefined}>
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
