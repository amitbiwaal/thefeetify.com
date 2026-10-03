import type { Metadata } from 'next'
import { BlogListing } from '@/components/site/BlogListing'
import { getCategories } from '@/lib/posts'
import { NOT_FOUND_META, pageMeta } from '@/lib/seo'

export const revalidate = 300

type Props = { params: Promise<{ category: string }> }

export async function generateStaticParams() {
  return (await getCategories()).map((category) => ({ category: category.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const category = (await getCategories()).find((item) => item.slug === slug)
  if (!category) return NOT_FOUND_META
  return pageMeta({
    title: `${category.name} Guides for Feet Pic Sellers`,
    description: `Browse every Feetify guide about ${category.name.toLowerCase()} — practical advice for adults selling feet pics online.`,
    path: `/blog/category/${category.slug}`,
  })
}

export default async function BlogCategoryPage({ params }: Props) {
  const { category } = await params
  return <BlogListing categorySlug={category} />
}
