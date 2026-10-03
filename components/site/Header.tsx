'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { NAV_LINKS, SITE } from '@/lib/site'
import { AffiliateLink } from './AffiliateLink'

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onResize = () => {
      if (window.innerWidth >= 992) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [open])

  const isCurrent = (href: string) =>
    !href.includes('#') && (pathname === href || pathname.startsWith(`${href}/`))

  return (
    <header className="site-header">
      <div className="wrap nav">
        <Link className="brand" href="/" aria-label={`${SITE.name} home`} onClick={() => setOpen(false)}>
          <Image
            className="brand-logo"
            src={SITE.logo}
            width={430}
            height={132}
            alt="Feetify — feet pics, your way"
            preload
          />
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="navMenu"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`nav-menu${open ? ' open' : ''}`} id="navMenu">
          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent(link.href) ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <AffiliateLink className="btn btn-primary nav-cta">Start Selling</AffiliateLink>
        </div>
      </div>
    </header>
  )
}
