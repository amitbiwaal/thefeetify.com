import { BLOG_DESCRIPTION, BLOG_TITLE, BlogListing } from '@/components/site/BlogListing'
import { pageMeta } from '@/lib/seo'

export const revalidate = 300

export const metadata = pageMeta({
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  path: '/blog',
  absoluteTitle: true,
})

export default function BlogPage() {
  return <BlogListing page={1} />
}
