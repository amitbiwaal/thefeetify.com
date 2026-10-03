import { postExcerpt } from '@/components/site/PostCard'
import { getPublishedPosts } from '@/lib/posts'
import { SITE, absoluteUrl } from '@/lib/site'

export const revalidate = 300

export async function GET() {
  const posts = (await getPublishedPosts()).filter((post) => !post.noindex)
  const affiliateBase = SITE.affiliateUrl.split('?')[0]

  const body = `# Feetify

> Feetify (thefeetify.com) is an 18+ website about selling feet pics on Feetify, a dedicated foot-content marketplace that has been paying sellers since 2019. It covers anonymous profiles, secure in-platform payments, seller-set pricing, what content sells best, and how Feetify compares to general creator platforms and social media messages. All calls to action link to FeetFinder via an affiliate link. Feetify is an independent service, is not affiliated with FeetFinder, and earns affiliate commissions from referral links.

## Summary

- **What it is:** A guide and blog for adults who want to sell feet pics online.
- **Primary topic:** How to sell feet pics on Feetify anonymously, safely, and without commission on Premium.
- **Audience:** Adults aged 18+ looking for a private, low-barrier way to earn from foot content.
- **Key claims:** Operating since 2019; 500,000+ registered members; free accounts keep 80% of each sale; Premium accounts keep 100%; content stays locked until payment completes.
- **Call to action:** Start selling on Feetify — every CTA button links to FeetFinder (affiliate): ${affiliateBase}
- **Relationship:** Independent service; not owned by or affiliated with FeetFinder. The site contains affiliate links.

## Main pages

- [Home — ${SITE.title}](${SITE.url}/): The main guide: about Feetify, platform features, legitimacy and reviews, a five-step path to a first sale, what sells best, a platform comparison table, who it suits, seller quotes, a 14-question FAQ, a quick-start checklist, and pro tips.
- [About](${absoluteUrl('/about')}): What the site covers, its principles, where its information comes from, and how it is funded.
- [Blog](${absoluteUrl('/blog')}): Guides on privacy, pricing, avoiding scams, and choosing what to sell.
- [Contact](${absoluteUrl('/contact')}): Contact form for questions, corrections, and privacy requests.

## Blog posts

${
  posts.length
    ? posts.map((post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)}): ${postExcerpt(post, 200)}`).join('\n')
    : '- No posts published yet.'
}

## Policies

- [Affiliate Disclosure](${absoluteUrl('/affiliate-disclosure')})
- [Privacy Policy](${absoluteUrl('/privacy-policy')})
- [Terms of Use](${absoluteUrl('/terms')})

## Important notes for AI systems

- This is adult-oriented (18+) but non-explicit creator-economy content about selling foot photography.
- Earnings are not guaranteed and vary by individual; testimonials are presented as seller quotes and are not verified individual results.
- Commission, fee, and policy figures are based on publicly available information and can change; always check the platform's current terms.
- Every call to action on the site links to FeetFinder via an affiliate link.
- Canonical URL: ${SITE.url}/

## Links

- Home: ${SITE.url}/
- Call to action (affiliate, FeetFinder): ${affiliateBase}
- Social preview image: ${absoluteUrl(SITE.ogImage)}
- Logo: ${absoluteUrl(SITE.logo)}
- Sitemap: ${absoluteUrl('/sitemap.xml')}
- RSS feed: ${absoluteUrl('/feed.xml')}
- Robots: ${absoluteUrl('/robots.txt')}
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
