const DEFAULT_AFFILIATE_URL =
  'https://app.feetfinder.com/affiliate/link?af_id=97c365207f4d8-615933c06e600f70fe8-024240575f3229cc-1909bce247abe2cc48'

export const SITE = {
  name: 'Feetify',
  domain: 'thefeetify.com',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'https://thefeetify.com').replace(/\/+$/, ''),
  title: 'Start Selling Feet Pics on Feetify Without Any Fees',
  description:
    'Learn how Feetify helps you sell feet pics with anonymous profiles, secure payments, flexible pricing, and tools to grow your earnings safely online.',
  keywords: [
    'sell feet pics',
    'sell feet pics online',
    'feetify',
    'feetify reviews',
    'is feetify legit',
    'sell feet pics anonymously',
    'sell feet pics without fees',
    'how to sell feet pics',
    'feet pics marketplace',
    'sell feet pictures for money',
  ],
  logo: '/assets/feetify-logo.png',
  ogImage: '/assets/feetify-sell-feet-pics-online.png',
  ogImageAlt: 'Feetify — keep 100% of every sale when you sell feet pics online',
  themeColor: '#059669',
  foundingDate: '2019',
  locale: 'en_US',
  defaultAuthor: 'Feetify Team',
  affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_URL || DEFAULT_AFFILIATE_URL,
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  postsPerPage: 9,
} as const

export const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/blog', label: 'Blog' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
] as const

export const FOOTER_LINKS = {
  explore: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  guide: [
    { href: '/#features', label: 'Platform Features' },
    { href: '/#how-it-works', label: 'How It Works' },
    { href: '/#comparison', label: 'Platform Comparison' },
    { href: '/#faq', label: 'FAQ' },
  ],
  legal: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Use' },
    { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
  ],
} as const

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`
}
