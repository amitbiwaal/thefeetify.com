import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategories, getPublishedPosts } from '@/lib/posts'
import { breadcrumbSchema, graph, schemaRefs } from '@/lib/seo'
import { SITE, absoluteUrl } from '@/lib/site'
import { slugify } from '@/lib/utils'
import { JsonLd } from './JsonLd'
import { PageHero } from './PageHero'
import { PostCard } from './PostCard'

export const BLOG_TITLE = 'Feetify Blog: Guides for Selling Feet Pics Online'
export const BLOG_DESCRIPTION =
  'Step-by-step guides on selling feet pics online: staying anonymous, pricing your content, avoiding scams, and getting paid safely.'

const pageHref = (page: number) => (page <= 1 ? '/blog' : `/blog/page/${page}`)

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null
  return (
    <nav className="pagination" aria-label="Blog pages">
      {page > 1 && (
        <Link href={pageHref(page - 1)} rel="prev">
          ← Newer
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
        <Link key={number} href={pageHref(number)} aria-current={number === page ? 'page' : undefined}>
          {number}
        </Link>
      ))}
      {page < totalPages && (
        <Link href={pageHref(page + 1)} rel="next">
          Older →
        </Link>
      )}
    </nav>
  )
}

export async function getBlogPageCount(): Promise<number> {
  return Math.max(1, Math.ceil((await getPublishedPosts()).length / SITE.postsPerPage))
}

/** Blog index. Pass `categorySlug` for a category archive (not paginated). */
export async function BlogListing({ page = 1, categorySlug }: { page?: number; categorySlug?: string }) {
  const [allPosts, categories] = await Promise.all([getPublishedPosts(), getCategories()])
  const category = categorySlug ? categories.find((item) => item.slug === categorySlug) : undefined
  if (categorySlug && !category) notFound()

  const matching = category ? allPosts.filter((post) => slugify(post.category) === category.slug) : allPosts
  const totalPages = category ? 1 : Math.max(1, Math.ceil(matching.length / SITE.postsPerPage))
  if (page > totalPages) notFound()
  const posts = category ? matching : matching.slice((page - 1) * SITE.postsPerPage, page * SITE.postsPerPage)

  const path = category ? `/blog/category/${category.slug}` : pageHref(page)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    ...(category ? [{ name: category.name, path }] : []),
  ]

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={category ? 'Blog Category' : 'Feetify Blog'}
        title={category ? `${category.name} Guides` : page > 1 ? `Feetify Blog — Page ${page}` : BLOG_TITLE}
        lead={
          category
            ? `Every Feetify guide filed under ${category.name}.`
            : 'Practical guides for adults who want to sell feet pics online — privately, safely, and without giving away their earnings.'
        }
      />

      <section>
        <div className="wrap">
          {categories.length > 0 && (
            <nav className="chip-row" aria-label="Blog categories" style={{ marginBottom: 28 }}>
              <Link className="chip" href="/blog" aria-current={!category ? 'page' : undefined}>
                All
              </Link>
              {categories.map((item) => (
                <Link
                  key={item.slug}
                  className="chip"
                  href={`/blog/category/${item.slug}`}
                  aria-current={category?.slug === item.slug ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          )}

          {posts.length > 0 ? (
            <div className="post-grid">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h2>New guides are on the way</h2>
              <p>
                We&apos;re working on our first articles. In the meantime, the <Link href="/#faq">FAQ</Link> covers the
                questions new sellers ask most.
              </p>
            </div>
          )}

          <Pagination page={page} totalPages={totalPages} />
        </div>
      </section>

      <JsonLd
        data={graph(
          {
            '@type': category ? 'CollectionPage' : 'Blog',
            '@id': `${absoluteUrl(path)}#blog`,
            url: absoluteUrl(path),
            name: category ? `${category.name} Guides` : BLOG_TITLE,
            description: BLOG_DESCRIPTION,
            publisher: schemaRefs.organization,
            isPartOf: schemaRefs.website,
            inLanguage: 'en-US',
            ...(category
              ? {}
              : {
                  blogPost: posts.map((post) => ({
                    '@type': 'BlogPosting',
                    headline: post.title,
                    url: absoluteUrl(`/blog/${post.slug}`),
                    datePublished: post.publishedAt,
                  })),
                }),
          },
          breadcrumbSchema(crumbs),
        )}
      />
    </>
  )
}
