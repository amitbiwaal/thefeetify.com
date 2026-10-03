import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AffiliateLink } from '@/components/site/AffiliateLink'
import { JsonLd } from '@/components/site/JsonLd'
import { Breadcrumb } from '@/components/site/PageHero'
import { PostCard, postExcerpt } from '@/components/site/PostCard'
import { getCategories, getPostBySlug, getPublishedPosts, getRelatedPosts, modifiedAt } from '@/lib/posts'
import { renderContent } from '@/lib/sanitize'
import { NOT_FOUND_META, breadcrumbSchema, graph, pageMeta, schemaRefs } from '@/lib/seo'
import { SITE, absoluteUrl } from '@/lib/site'
import { formatDate, readingTime, slugify, wordCount } from '@/lib/utils'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getPublishedPosts()).map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug)
  if (!post) return NOT_FOUND_META
  return pageMeta({
    title: post.metaTitle || post.title,
    absoluteTitle: Boolean(post.metaTitle),
    description: post.metaDescription || postExcerpt(post),
    path: `/blog/${post.slug}`,
    image: post.coverImage || undefined,
    imageAlt: post.coverAlt || post.title,
    noindex: post.noindex,
    article: {
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: modifiedAt(post),
      author: post.author || SITE.defaultAuthor,
      section: post.category || undefined,
      tags: post.tags,
    },
  })
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug((await params).slug)
  if (!post) notFound()

  const [related, categories, recent] = await Promise.all([
    getRelatedPosts(post),
    getCategories(),
    getPublishedPosts().then((posts) => posts.filter((item) => item.id !== post.id).slice(0, 5)),
  ])
  const { html, toc } = renderContent(post.content)
  const path = `/blog/${post.slug}`
  const author = post.author || SITE.defaultAuthor
  const categorySlug = slugify(post.category)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    ...(categorySlug ? [{ name: post.category, path: `/blog/category/${categorySlug}` }] : []),
    { name: post.title, path },
  ]
  const wasUpdated =
    post.publishedAt !== null &&
    new Date(modifiedAt(post)).getTime() - new Date(post.publishedAt).getTime() > 24 * 60 * 60 * 1000

  return (
    <article>
      <header className="article-head">
        <div className="wrap">
          <div className="inner">
            <Breadcrumb items={crumbs} />
            {categorySlug && (
              <Link className="chip" href={`/blog/category/${categorySlug}`}>
                {post.category}
              </Link>
            )}
            <h1>{post.title}</h1>
            {post.excerpt && <p className="lead">{post.excerpt}</p>}
            <div className="post-meta">
              <span>By {author}</span>
              <span>
                <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
              </span>
              {wasUpdated && (
                <span>
                  Updated <time dateTime={modifiedAt(post)}>{formatDate(modifiedAt(post))}</time>
                </span>
              )}
              <span>{readingTime(post.content)} min read</span>
            </div>
          </div>
        </div>
      </header>

      <div className="article-section">
        <div className="wrap article-layout">
          <div>
            {post.coverImage && (
              <div className="article-cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.coverImage} alt={post.coverAlt || post.title} fetchPriority="high" decoding="async" />
              </div>
            )}

            {toc.length >= 3 && (
              <details className="toc" open>
                <summary>In this guide</summary>
                <ol>
                  {toc.map((item) => (
                    <li key={item.id} className={item.level === 3 ? 'sub' : undefined}>
                      <a href={`#${item.id}`}>{item.text}</a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            <div className="rich" dangerouslySetInnerHTML={{ __html: html }} />

            {post.tags.length > 0 && (
              <ul className="tag-list" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            )}

            <p className="article-note">
              This article may contain affiliate links. If you sign up through one, we may earn a commission at no
              extra cost to you. Earnings from selling content are never guaranteed and vary by individual. Read our{' '}
              <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
            </p>
          </div>

          <aside className="sidebar" aria-label="More from Feetify">
            <div className="side-card side-cta">
              <h2>Ready to start selling?</h2>
              <p>Build an anonymous seller profile, set your own prices, and publish your first listing today.</p>
              <AffiliateLink className="btn">Start Selling on Feetify</AffiliateLink>
              <p className="note">18+ only · Earnings vary and are never guaranteed.</p>
            </div>
            {recent.length > 0 && (
              <div className="side-card">
                <h2>Recent guides</h2>
                <ul>
                  {recent.map((item) => (
                    <li key={item.id}>
                      <Link href={`/blog/${item.slug}`}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {categories.length > 0 && (
              <div className="side-card">
                <h2>Categories</h2>
                <ul>
                  {categories.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/blog/category/${item.slug}`}>
                        {item.name} ({item.count})
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section-alt" aria-labelledby="related-heading">
          <div className="wrap">
            <div className="sec-head">
              <span className="eyebrow">Keep Reading</span>
              <h2 id="related-heading">Related Guides</h2>
            </div>
            <div className="post-grid">
              {related.map((item) => (
                <PostCard key={item.id} post={item} headingLevel="h3" />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={graph(
          {
            '@type': 'BlogPosting',
            '@id': `${absoluteUrl(path)}#article`,
            mainEntityOfPage: absoluteUrl(path),
            url: absoluteUrl(path),
            headline: post.title,
            description: post.metaDescription || postExcerpt(post),
            image: absoluteUrl(post.coverImage || SITE.ogImage),
            datePublished: post.publishedAt,
            dateModified: modifiedAt(post),
            author: { '@type': 'Organization', name: author, url: `${SITE.url}/about` },
            publisher: schemaRefs.organization,
            isPartOf: schemaRefs.website,
            articleSection: post.category || undefined,
            keywords: post.tags.length ? post.tags.join(', ') : undefined,
            wordCount: wordCount(post.content),
            inLanguage: 'en-US',
          },
          breadcrumbSchema(crumbs),
        )}
      />
    </article>
  )
}
