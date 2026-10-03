import type { ReactNode } from 'react'
import { SITE } from '@/lib/site'

/** Every call-to-action on the site points at the affiliate link and is marked as sponsored. */
export function AffiliateLink({
  children,
  className = 'btn btn-primary',
  arrow = true,
}: {
  children: ReactNode
  className?: string
  arrow?: boolean
}) {
  return (
    <a className={className} href={SITE.affiliateUrl} target="_blank" rel="sponsored nofollow noopener">
      {children}
      {arrow && (
        <span className="arr" aria-hidden="true">
          →
        </span>
      )}
    </a>
  )
}
