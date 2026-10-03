import Link from 'next/link'
import { AffiliateLink } from '@/components/site/AffiliateLink'
import { Icon, Tick } from '@/components/site/Icon'
import { JsonLd } from '@/components/site/JsonLd'
import { PostCard } from '@/components/site/PostCard'
import {
  ABOUT_PARAGRAPHS,
  CATEGORIES,
  CHECKLIST,
  COMPARISON,
  DIFFERENCES,
  FAQS,
  FEATURES,
  LEGIT_POINTS,
  QUICK_START,
  STATS,
  STEPS,
  TESTIMONIALS,
  TIPS,
  TRUST_ITEMS,
  USE_CASES,
} from '@/lib/home-content'
import { getPublishedPosts } from '@/lib/posts'
import { graph, pageMeta, schemaRefs, webPageSchema } from '@/lib/seo'
import { SITE, absoluteUrl } from '@/lib/site'

export const revalidate = 600

export const metadata = {
  ...pageMeta({ title: SITE.title, description: SITE.description, path: '/', absoluteTitle: true }),
  keywords: [...SITE.keywords],
}

const homeSchema = graph(
  {
    ...webPageSchema({ path: '/', name: SITE.title, description: SITE.description }),
    '@id': `${SITE.url}/#webpage`,
    url: `${SITE.url}/`,
    primaryImageOfPage: absoluteUrl(SITE.ogImage),
  },
  {
    '@type': 'Service',
    '@id': `${SITE.url}/#service`,
    name: 'Feetify — Sell Feet Pics Online',
    serviceType: 'Foot content creator marketplace',
    provider: schemaRefs.organization,
    areaServed: 'Worldwide',
    audience: { '@type': 'Audience', audienceType: 'Adults 18+ who want to sell feet content' },
    description:
      'Feetify lets verified adults sell feet pics online anonymously, set their own prices, keep 80% on a free account or 100% on Premium, and get paid through protected in-platform payouts.',
  },
  {
    '@type': 'BreadcrumbList',
    '@id': `${SITE.url}/#breadcrumb`,
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Sell Feet Pics Online', item: `${SITE.url}/#what-is-feetify` },
    ],
  },
  {
    '@type': 'FAQPage',
    '@id': `${SITE.url}/#faq`,
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  },
)

export default async function HomePage() {
  const latestPosts = (await getPublishedPosts()).slice(0, 3)

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero" id="hero">
        <div className="wrap inner">
          <span className="eyebrow">Feetify for Sellers</span>
          <h1>Keep 100% of Every Sale By Sell Feet Pics On Feetify</h1>
          <p className="sub">
            Most people who try selling feet pics give up for one of two reasons. They&apos;re worried someone they
            know will recognize them, or they get scammed by buyers who disappear after getting the content. Feetify is
            built to solve both problems. Your real name and face never appear on the platform, your content stays
            locked until payment is complete, and Premium sellers keep every dollar they earn.
          </p>
          <div className="hero-cta">
            <AffiliateLink className="btn btn-primary btn-lg">Start Selling on Feetify</AffiliateLink>
            <AffiliateLink className="btn btn-ghost btn-lg" arrow={false}>
              See How Feetify Works
            </AffiliateLink>
          </div>
          <div className="hero-stats">
            <div className="hstat">
              <span className="k">Earnings this month</span>
              <span className="v">$1,240</span>
            </div>
            <div className="hstat">
              <span className="k">Content sold this week</span>
              <span className="v">38</span>
            </div>
            <div className="hstat">
              <span className="k">Privacy status</span>
              <span className="v ok">Protected</span>
            </div>
          </div>
          <div className="trust-row">
            {TRUST_ITEMS.map((item) => (
              <span key={item.label}>
                <Icon name={item.icon} /> {item.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION ONE — ABOUT FEETIFY ===== */}
      <section id="what-is-feetify">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">About Feetify</span>
            <h2>The Feet Pic Selling Site That Has Paid Sellers Since 2019</h2>
          </div>
          <div className="prose">
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION TWO — INSIDE THE PLATFORM ===== */}
      <section className="section-soft" id="features">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Inside the Platform</span>
            <h2>How the Selling Side Works On Feetify</h2>
            <p className="lead">
              Your Feetify seller account includes everything you need to manage your listings, connect with buyers,
              and grow your sales. Here&apos;s what each feature actually does.
            </p>
          </div>
          <div className="grid g3">
            {FEATURES.map((item) => (
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

      {/* ===== SECTION THREE — IS IT LEGIT ===== */}
      <section id="is-it-legit">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Is It Legit</span>
            <h2>Feetify Reviews and the Questions Behind Them</h2>
            <p className="lead">
              Search for Feetify reviews and you&apos;ll find all kinds of opinions, many from people who&apos;ve never
              actually sold on the platform. Here&apos;s what matters most, including the things people don&apos;t
              always mention.
            </p>
          </div>
          <div className="benefits-grid">
            {LEGIT_POINTS.map((item) => (
              <div className="benefit" key={item.title}>
                <Tick />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION FOUR — STEP BY STEP ===== */}
      <section className="section-alt" id="how-it-works">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Step by Step</span>
            <h2>Getting From Empty Profile to First Sale</h2>
            <p className="lead">
              Five simple steps are all it takes to get started. Many new sellers receive their first buyer message
              within the first week.
            </p>
          </div>
          <div className="steps">
            {STEPS.map((item) => (
              <div className="step" key={item.title}>
                <div className="num" aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
          <div className="center-cta">
            <AffiliateLink className="btn btn-primary btn-lg">Create Your Feetify Account</AffiliateLink>
          </div>
        </div>
      </section>

      {/* ===== SECTION FIVE — WHAT SELLS ===== */}
      <section id="categories">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">What Sells</span>
            <h2>The Feet Pics That Sell Best On Feetify</h2>
            <p className="lead">
              These are the six types of content that consistently perform well, roughly in order of earning potential.
            </p>
          </div>
          <div className="grid g3">
            {CATEGORIES.map((item) => (
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

      {/* ===== SECTION SIX — THE DIFFERENCE ===== */}
      <section className="section-soft" id="why">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">The Difference</span>
            <h2>Why Sellers Move to Feetify</h2>
            <p className="lead">
              There are plenty of places where you can sell feet pics online. These are the four things that make
              Feetify stand out.
            </p>
          </div>
          <div className="grid g4">
            {DIFFERENCES.map((item) => (
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

      {/* ===== SECTION SEVEN — HOW IT COMPARES ===== */}
      <section id="comparison">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">How It Compares</span>
            <h2>Feetify Against Other Sell Feet Pics Platforms</h2>
            <p className="lead">
              General creator platforms and private social media messages can both work. Here&apos;s how they compare
              with Feetify.
            </p>
          </div>
          <div className="cmp-wrap" tabIndex={0} role="region" aria-label="Platform comparison table">
            <table className="cmp">
              <thead>
                <tr>
                  <th className="feat" scope="col">
                    Feature
                  </th>
                  <th scope="col">Feetify</th>
                  <th scope="col">General creator platforms</th>
                  <th scope="col">Social media messages</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row">{row.feature}</th>
                    {row.cells.map((cell, index) => (
                      <td className={cell.tone} key={index}>
                        {cell.text}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="scroll-hint">Swipe the table sideways to see every column.</p>
          <p className="fine-print">
            Fees and platform policies are based on publicly available information. Always check the latest terms
            before deciding where to sell your feet pics.
          </p>
        </div>
      </section>

      {/* ===== SECTION EIGHT — WHO IT FITS ===== */}
      <section className="section-alt" id="who-its-for">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Who It Fits</span>
            <h2>Sellers Who Do Well on Feetify</h2>
            <p className="lead">
              Feetify isn&apos;t the right fit for everyone, but it&apos;s a great option for many sellers. See if any
              of these sound like you.
            </p>
          </div>
          <div className="uses">
            {USE_CASES.map((item) => (
              <article className="use" key={item.title}>
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

      {/* ===== SECTION NINE — SELLER REVIEWS ===== */}
      <section className="section-dark" id="social-proof">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Seller Reviews</span>
            <h2>What Sellers Say About Feetify</h2>
            <p className="lead">
              With six years online and more than half a million members, the most valuable reviews come from sellers
              who have actually been paid.
            </p>
          </div>
          <div className="stats spaced">
            {STATS.map((stat) => (
              <div className="stat" key={stat.label}>
                <div className="big">{stat.value}</div>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="quotes">
            {TESTIMONIALS.map((quote) => (
              <figure className="quote" key={quote.slice(0, 40)}>
                <div className="stars" role="img" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
                <p>&quot;{quote}&quot;</p>
                <figcaption className="who">— Official Feetify Seller</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION TEN — QUESTIONS AND ANSWERS ===== */}
      <section id="faq">
        <div className="wrap">
          <div className="sec-head center">
            <span className="eyebrow">Questions and Answers</span>
            <h2>Feetify FAQ for Selling Feet Pics Online</h2>
            <p className="lead">
              These are the questions new sellers ask most before getting started. The answers are straightforward,
              with no sales pitch.
            </p>
          </div>
          <div className="faq">
            {FAQS.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION ELEVEN — QUICK-START GUIDE ===== */}
      <section className="section-soft" id="getting-started">
        <div className="wrap">
          <div className="started">
            <div>
              <span className="eyebrow">Getting Started</span>
              <h2>Your Feetify Quick-Start Guide</h2>
              <p className="intro">
                Work through this short checklist and you can go from total beginner to your first Feetify listing in a
                single afternoon.
              </p>
              <ol>
                {QUICK_START.map((item) => (
                  <li key={item.bold}>
                    <b>{item.bold}</b> {item.text}
                  </li>
                ))}
              </ol>
              <AffiliateLink className="btn btn-primary btn-lg">Create Your Feetify Profile</AffiliateLink>
            </div>
            <aside className="started-art">
              <h3>Beginner checklist</h3>
              {CHECKLIST.map((item) => (
                <div className="benefit plain" key={item}>
                  <Tick />
                  <div>
                    <h3>{item}</h3>
                  </div>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </section>

      {/* ===== SECTION TWELVE — PRO TIPS ===== */}
      <section id="tips">
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow">Pro Tips</span>
            <h2>Habits That Change What You Earn On Feetify</h2>
            <p className="lead">
              None of these tips require extra photo shoots. They simply help you get more value from the content
              you&apos;ve already created.
            </p>
          </div>
          <div className="tips">
            {TIPS.map((tip, index) => (
              <div className="tip" key={tip.title}>
                <span className="n">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{tip.title}</h3>
                  <p>{tip.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FROM THE BLOG (only when posts exist) ===== */}
      {latestPosts.length > 0 && (
        <section className="section-alt" id="blog">
          <div className="wrap">
            <div className="sec-head center">
              <span className="eyebrow">From the Blog</span>
              <h2>Latest Guides for Feet Pic Sellers</h2>
              <p className="lead">Practical, step-by-step reading on privacy, pricing, and getting paid safely.</p>
            </div>
            <div className="post-grid">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} headingLevel="h3" />
              ))}
            </div>
            <div className="center-cta">
              <Link className="btn btn-ghost" href="/blog">
                Read All Guides
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== FINAL CTA ===== */}
      <section id="start">
        <div className="wrap">
          <div className="final">
            <h2>Ready to Sell Feet Pics Online? Start with Feetify Today</h2>
            <p>
              You have the playbook. Now take the step. Set up your Feetify profile and turn what you have learned into
              your first sale, safely, privately, and entirely on your own terms.
            </p>
            <AffiliateLink className="btn btn-primary btn-lg">Start Selling on Feetify</AffiliateLink>
            <p className="note">18+ only · Privacy first · Earnings vary and are never guaranteed.</p>
          </div>
        </div>
      </section>

      <JsonLd data={homeSchema} />
    </>
  )
}
