import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { BLOG_DESCRIPTION, BlogListing, getBlogPageCount } from '@/components/site/BlogListing'
import { NOT_FOUND_META, pageMeta } from '@/lib/seo'

export const revalidate = 300

type Props = { params: Promise<{ page: string }> }

function parsePage(value: string): number | null {
  return /^[1-9]\d{0,3}$/.test(value) ? Number(value) : null
}

export async function generateStaticParams() {
  const total = await getBlogPageCount()
  return Array.from({ length: Math.max(0, total - 1) }, (_, index) => ({ page: String(index + 2) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = parsePage((await params).page)
  if (!page || page > (await getBlogPageCount())) return NOT_FOUND_META
  return pageMeta({
    title: `Feetify Blog — Page ${page}`,
    description: BLOG_DESCRIPTION,
    path: `/blog/page/${page}`,
  })
}

export default async function BlogPaginatedPage({ params }: Props) {
  const page = parsePage((await params).page)
  if (!page) notFound()
  if (page === 1) permanentRedirect('/blog')
  return <BlogListing page={page} />
}
