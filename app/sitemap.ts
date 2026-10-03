import type { MetadataRoute } from 'next'
import { getBlogPageCount } from '@/components/site/BlogListing'
import { getCategories, getPublishedPosts, modifiedAt } from '@/lib/posts'
import { SITE, absoluteUrl } from '@/lib/site'
import { slugify } from '@/lib/utils'

export const revalidate = 300

// Bump when the static pages change in a meaningful way.
const STATIC_LAST_MODIFIED = new Date('2026-10-02')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, blogPages] = await Promise.all([getPublishedPosts(), getCategories(), getBlogPageCount()])
  const indexable = posts.filter((post) => !post.noindex)
  const newestPost = indexable[0] ? new Date(modifiedAt(indexable[0])) : STATIC_LAST_MODIFIED

  return [
    {
      url: `${SITE.url}/`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
      images: [absoluteUrl(SITE.ogImage), absoluteUrl(SITE.logo)],
    },
    { url: absoluteUrl('/blog'), lastModified: newestPost, changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/about'), lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: absoluteUrl('/contact'), lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.4 },
    ...indexable.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(modifiedAt(post)),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      ...(post.coverImage ? { images: [absoluteUrl(post.coverImage)] } : {}),
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/blog/category/${category.slug}`),
      lastModified: ((post) => (post ? new Date(modifiedAt(post)) : STATIC_LAST_MODIFIED))(
        indexable.find((item) => slugify(item.category) === category.slug),
      ),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    ...Array.from({ length: Math.max(0, blogPages - 1) }, (_, index) => ({
      url: absoluteUrl(`/blog/page/${index + 2}`),
      lastModified: newestPost,
      changeFrequency: 'weekly' as const,
      priority: 0.3,
    })),
    ...['/privacy-policy', '/terms', '/affiliate-disclosure'].map((path) => ({
      url: absoluteUrl(path),
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'yearly' as const,
      priority: 0.2,
    })),
  ]
}
