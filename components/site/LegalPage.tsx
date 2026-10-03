import Link from 'next/link'
import type { ReactNode } from 'react'
import { breadcrumbSchema, graph, webPageSchema } from '@/lib/seo'
import { SITE } from '@/lib/site'
import { JsonLd } from './JsonLd'
import { PageHero } from './PageHero'

export const LEGAL_UPDATED = 'October 2, 2026'

export function LegalPage({
  title,
  description,
  path,
  lead,
  children,
}: {
  title: string
  description: string
  path: string
  lead: string
  children: ReactNode
}) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: title, path },
  ]
  return (
    <>
      <PageHero crumbs={crumbs} eyebrow="Legal" title={title} lead={lead} />
      <section>
        <div className="wrap">
          <div className="rich legal">
            <p className="updated">Last updated: {LEGAL_UPDATED}</p>
            {children}
          </div>
        </div>
      </section>
      <JsonLd data={graph(webPageSchema({ path, name: title, description }), breadcrumbSchema(crumbs))} />
    </>
  )
}

/** "our contact page" (plus the email address when one is configured). */
export function ContactReference() {
  return (
    <>
      our <Link href="/contact">contact page</Link>
      {SITE.contactEmail && (
        <>
          {' '}
          or by email at <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
        </>
      )}
    </>
  )
}
