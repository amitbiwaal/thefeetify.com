import { postExcerpt } from '@/components/site/PostCard'
import { BLOG_DESCRIPTION } from '@/components/site/BlogListing'
import { getPublishedPosts } from '@/lib/posts'
import { SITE, absoluteUrl } from '@/lib/site'
import { escapeXml } from '@/lib/utils'

export const revalidate = 300

export async function GET() {
  const posts = (await getPublishedPosts()).filter((post) => !post.noindex).slice(0, 30)
  const updated = posts[0]?.publishedAt ? new Date(posts[0].publishedAt) : new Date()

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`)
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt!).toUTCString()}</pubDate>
      <description>${escapeXml(postExcerpt(post, 300))}</description>${
        post.category ? `\n      <category>${escapeXml(post.category)}</category>` : ''
      }
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE.name} Blog`)}</title>
    <link>${absoluteUrl('/blog')}</link>
    <description>${escapeXml(BLOG_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
