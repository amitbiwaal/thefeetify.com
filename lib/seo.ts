import type { Metadata } from 'next'
import { SITE, absoluteUrl } from './site'

type PageMetaInput = {
  /** Used as-is for <title>; the " | Feetify" suffix is added unless `absoluteTitle` is set. */
  title: string
  description: string
  path: string
  image?: string
  imageAlt?: string
  absoluteTitle?: boolean
  noindex?: boolean
  article?: { publishedTime?: string; modifiedTime?: string; author?: string; section?: string; tags?: string[] }
}

// Next.js replaces nested metadata objects (openGraph, alternates, ...) instead of merging them,
// so every page builds its complete metadata through this helper.
export function pageMeta(input: PageMetaInput): Metadata {
  const image = input.image || SITE.ogImage
  const isDefaultImage = image === SITE.ogImage
  const images = [
    {
      url: image,
      alt: input.imageAlt || (isDefaultImage ? SITE.ogImageAlt : input.title),
      ...(isDefaultImage ? { width: 1200, height: 630, type: 'image/png' } : {}),
    },
  ]
  const socialTitle = input.absoluteTitle ? input.title : `${input.title} | ${SITE.name}`

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: {
      canonical: input.path,
      types: { 'application/rss+xml': [{ url: '/feed.xml', title: `${SITE.name} Blog` }] },
    },
    robots: input.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    openGraph: {
      type: input.article ? 'article' : 'website',
      siteName: SITE.name,
      locale: SITE.locale,
      title: socialTitle,
      description: input.description,
      url: input.path,
      images,
      ...(input.article
        ? {
            publishedTime: input.article.publishedTime,
            modifiedTime: input.article.modifiedTime,
            authors: input.article.author ? [input.article.author] : undefined,
            section: input.article.section,
            tags: input.article.tags,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: input.description,
      images: images.map((item) => ({ url: item.url, alt: item.alt })),
    },
  }
}

/** Metadata for URLs that turn out not to exist (unknown paths, deleted posts, empty categories). */
export const NOT_FOUND_META: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist or has moved.',
  robots: { index: false, follow: true },
}

/* ------------------------------ structured data ------------------------------ */

const ORG_ID = `${SITE.url}/#organization`
const WEBSITE_ID = `${SITE.url}/#website`

export const organizationSchema = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: absoluteUrl(SITE.logo),
  foundingDate: SITE.foundingDate,
  description:
    'Feetify is a dedicated marketplace where verified adults sell feet pics online with anonymous profiles, secure payments, and 0% commission on Premium.',
  knowsAbout: [
    'selling feet pics online',
    'feet content creation',
    'creator monetization',
    'online privacy for creators',
  ],
}

export const websiteSchema = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${SITE.url}/`,
  name: SITE.name,
  description: SITE.description,
  publisher: { '@id': ORG_ID },
  inLanguage: 'en-US',
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function webPageSchema(input: { path: string; name: string; description: string; type?: string }) {
  return {
    '@type': input.type ?? 'WebPage',
    '@id': `${absoluteUrl(input.path)}#webpage`,
    url: absoluteUrl(input.path),
    name: input.name,
    description: input.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'en-US',
  }
}

export const schemaRefs = { organization: { '@id': ORG_ID }, website: { '@id': WEBSITE_ID } }

export function graph(...nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
