import 'server-only'
import sanitizeHtml from 'sanitize-html'
import { SITE } from './site'
import { slugify, stripHtml } from './utils'

export type TocItem = { id: string; text: string; level: 2 | 3 }

const REL_TOKENS = new Set(['nofollow', 'sponsored', 'ugc', 'noopener', 'noreferrer'])

function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

const affiliateHost = hostOf(SITE.affiliateUrl)?.split('.').slice(-2).join('.')

function linkAttributes(attribs: Record<string, string>): Record<string, string> {
  const href = (attribs.href ?? '').trim()
  const result: Record<string, string> = {}
  if (href) result.href = href
  if (attribs.title) result.title = attribs.title

  const host = /^https?:\/\//i.test(href) ? hostOf(href) : null
  const external = host !== null && host !== SITE.domain
  const rel = new Set((attribs.rel ?? '').toLowerCase().split(/\s+/).filter((token) => REL_TOKENS.has(token)))

  if (external && affiliateHost && (host === affiliateHost || host!.endsWith(`.${affiliateHost}`))) {
    // Affiliate links must always be disclosed to search engines.
    rel.add('sponsored').add('nofollow')
    result.target = '_blank'
  }
  if (attribs.target === '_blank') result.target = '_blank'
  if (result.target === '_blank') rel.add('noopener')
  if (!external) {
    rel.delete('nofollow')
    rel.delete('sponsored')
    rel.delete('ugc')
  }
  if (rel.size) result.rel = [...rel].join(' ')
  return result
}

/** Whitelist-based cleanup of editor HTML. Runs when a post is saved and again when it is rendered. */
export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'h2', 'h3', 'h4', 'p', 'br', 'hr', 'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'mark', 'code', 'pre',
      'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
      th: ['colspan', 'rowspan', 'scope'],
      td: ['colspan', 'rowspan'],
      ol: ['start'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    transformTags: {
      h1: 'h2',
      h5: 'h4',
      h6: 'h4',
      a: (tagName, attribs) => ({ tagName, attribs: linkAttributes(attribs) }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, alt: attribs.alt ?? '', loading: 'lazy', decoding: 'async' },
      }),
    },
  }).trim()
}

/** Sanitizes post HTML for display, adds heading anchors and collects a table of contents. */
export function renderContent(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = []
  const used = new Set<string>()

  const withAnchors = sanitizeContent(html).replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_match, level: string, inner: string) => {
    const text = stripHtml(inner)
    if (!text) return `<h${level}>${inner}</h${level}>`
    const base = slugify(text) || 'section'
    let id = base
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`
    used.add(id)
    toc.push({ id, text, level: Number(level) as 2 | 3 })
    return `<h${level} id="${id}">${inner}</h${level}>`
  })

  // Wide tables scroll inside their own container instead of breaking the mobile layout,
  // and the empty paragraphs editors leave behind are dropped so they do not add stray gaps.
  const withTables = withAnchors
    .replace(/<p>(?:\s|&nbsp;|<br\s*\/?>)*<\/p>/g, '')
    .replace(/<table>/g, '<div class="table-scroll" tabindex="0" role="region" aria-label="Table"><table>')
    .replace(/<\/table>/g, '</table></div>')

  return { html: withTables, toc }
}
