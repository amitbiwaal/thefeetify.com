import Link from 'next/link'
import { AffiliateLink } from '@/components/site/AffiliateLink'
import { Icon, type IconName } from '@/components/site/Icon'
import { JsonLd } from '@/components/site/JsonLd'
import { PageHero } from '@/components/site/PageHero'
import { breadcrumbSchema, graph, pageMeta, webPageSchema } from '@/lib/seo'

const TITLE = 'About Feetify'
const DESCRIPTION =
  'What thefeetify.com is, who it is for, how our guides to selling feet pics online are put together, and how the site is funded.'
const PATH = '/about'
const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: PATH },
]

export const metadata = pageMeta({ title: TITLE, description: DESCRIPTION, path: PATH })

const PRINCIPLES: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'shield',
    title: 'Privacy comes first',
    text: 'Every guide assumes you want to stay anonymous: a separate email, a username that reveals nothing, and photos checked for identifying details before they go anywhere.',
  },
  {
    icon: 'lock',
    title: 'Payment before delivery',
    text: 'We only recommend ways of selling where the buyer pays before the content unlocks and the conversation stays on the platform. That single rule prevents most scams.',
  },
  {
    icon: 'chart',
    title: 'Honest about earnings',
    text: 'Selling feet pics is not a guaranteed income. Results depend on consistency, content quality, and demand. We never promise a number, and you should be wary of anyone who does.',
  },
  {
    icon: 'users',
    title: 'Adults only',
    text: 'Everything here is written for people aged 18 or over. Legitimate platforms verify age before a seller profile goes live, and we will never suggest a way around that.',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={CRUMBS}
        eyebrow="About"
        title="About Feetify"
        lead="Feetify (thefeetify.com) is a platform and resource for adults who want to sell feet pics online safely. Here is what we cover, how we work, and how the site is funded."
      />

      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">What We Do</span>
            <h2>Clear Answers for People Thinking About Selling Feet Pics</h2>
          </div>
          <div className="prose">
            <p>
              Most people who look into selling feet pics have the same handful of worries. Will someone I know find
              out? Will a buyer take the content and disappear? Is it even legal? How much is realistic? Those questions
              deserve straight answers, and that is what this site is for.
            </p>
            <p>
              Our <Link href="/">main guide</Link> walks through how selling works from the seller&apos;s side: setting
              up an anonymous profile, pricing your content, what tends to sell, and how a dedicated marketplace
              compares with general creator platforms and social media messages. The{' '}
              <Link href="/blog">blog</Link> goes deeper on individual topics such as privacy, avoiding scams, and
              choosing what to shoot.
            </p>
            <p>
              We write for complete beginners. You do not need a following, expensive equipment, or any experience as a
              creator to follow along.
            </p>
          </div>
        </div>
      </section>

      <section className="section-soft">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Our Principles</span>
            <h2>What Every Guide on This Site Is Built Around</h2>
          </div>
          <div className="grid g2">
            {PRINCIPLES.map((item) => (
              <article className="card" key={item.title}>
                <div className="ico">
                  <Icon name={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How We Work</span>
            <h2>Where Our Information Comes From</h2>
          </div>
          <div className="prose">
            <p>
              Fees, commission rates, and platform policies mentioned on this site are based on publicly available
              information. Platforms change their terms, so treat any figure you read here as a starting point and
              confirm the current details on the platform itself before you decide where to sell.
            </p>
            <p>
              Seller quotes shown on the site are illustrative examples, not verified individual results. Nothing here
              is financial, legal, or tax advice. Laws on adult-oriented content differ between countries, so check the
              rules where you live.
            </p>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How We Are Funded</span>
            <h2>Affiliate Links, Explained Plainly</h2>
          </div>
          <div className="prose">
            <p>
              This site is free to read. It is funded through affiliate links: the &quot;Start Selling&quot; buttons
              and some links in our articles point to FeetFinder through a referral link. If you sign up or make a
              purchase after clicking one, we may earn a commission at no extra cost to you.
            </p>
            <p>
              Feetify is an independent service and is not affiliated with, owned by, or endorsed by FeetFinder. All
              product names and trademarks belong to their respective owners. The full details are in our{' '}
              <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
            </p>
            <p>
              Spotted something out of date, or have a question we have not answered? Tell us through the{' '}
              <Link href="/contact">contact page</Link>.
            </p>
          </div>
        </div>
      </section>

      <section id="start">
        <div className="wrap">
          <div className="final">
            <h2>Ready to Sell Feet Pics Online? Start with Feetify Today</h2>
            <p>Set up an anonymous profile, price your first set, and keep every conversation on the platform.</p>
            <AffiliateLink className="btn btn-primary btn-lg">Start Selling on Feetify</AffiliateLink>
            <p className="note">18+ only · Privacy first · Earnings vary and are never guaranteed.</p>
          </div>
        </div>
      </section>

      <JsonLd
        data={graph(
          webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION, type: 'AboutPage' }),
          breadcrumbSchema(CRUMBS),
        )}
      />
    </>
  )
}
