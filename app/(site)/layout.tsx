import type { ReactNode } from 'react'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { JsonLd } from '@/components/site/JsonLd'
import { graph, organizationSchema, websiteSchema } from '@/lib/seo'
import '../site.css'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <JsonLd data={graph(organizationSchema, websiteSchema)} />
    </>
  )
}
