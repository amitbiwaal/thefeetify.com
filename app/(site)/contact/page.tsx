import Link from 'next/link'
import { Tick } from '@/components/site/Icon'
import { JsonLd } from '@/components/site/JsonLd'
import { PageHero } from '@/components/site/PageHero'
import { breadcrumbSchema, graph, pageMeta, webPageSchema } from '@/lib/seo'
import { SITE } from '@/lib/site'
import { storageBackend } from '@/lib/store'
import { ContactForm } from './ContactForm'

const TITLE = 'Contact Feetify'
const DESCRIPTION =
  'Questions about our guides, a correction to suggest, or a privacy request? Send the Feetify team a message.'
const PATH = '/contact'
const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: PATH },
]

export const metadata = pageMeta({ title: TITLE, description: DESCRIPTION, path: PATH })

const TOPICS = [
  { title: 'Questions about a guide', text: 'Something unclear, or a topic you would like us to cover next.' },
  { title: 'Corrections', text: 'A fee, policy, or detail that has changed since we published.' },
  { title: 'Privacy requests', text: 'Ask what we hold about you, or ask us to delete a message you sent.' },
]

export default function ContactPage() {
  const formAvailable = storageBackend() !== 'readonly'

  return (
    <>
      <PageHero
        crumbs={CRUMBS}
        eyebrow="Contact"
        title="Contact Feetify"
        lead="Have a question about one of our guides, or spotted something that needs correcting? Send us a message."
      />

      <section>
        <div className="wrap contact-layout">
          <div className="contact-card">
            {formAvailable ? (
              <ContactForm />
            ) : (
              <div className="alert alert-err" role="status">
                The contact form is temporarily unavailable.
                {SITE.contactEmail ? ' Please email us instead using the address on this page.' : ' Please check back soon.'}
              </div>
            )}
          </div>

          <aside className="contact-aside" aria-label="Before you write">
            {TOPICS.map((topic) => (
              <div className="benefit" key={topic.title}>
                <Tick />
                <div>
                  <h2>{topic.title}</h2>
                  <p>{topic.text}</p>
                </div>
              </div>
            ))}
            {SITE.contactEmail && (
              <div className="benefit">
                <Tick />
                <div>
                  <h2>Prefer email?</h2>
                  <p>
                    <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a>
                  </p>
                </div>
              </div>
            )}
            <p className="fine-print">
              We cannot help with accounts, payouts, or verification on any selling platform — please contact that
              platform&apos;s own support. See how we handle your message in our{' '}
              <Link href="/privacy-policy">privacy policy</Link>.
            </p>
          </aside>
        </div>
      </section>

      <JsonLd
        data={graph(
          webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION, type: 'ContactPage' }),
          breadcrumbSchema(CRUMBS),
        )}
      />
    </>
  )
}
