import Link from 'next/link'
import type { Post } from '@/lib/posts'
import { formatDate, readingTime, slugify, stripHtml, truncate } from '@/lib/utils'

export function postExcerpt(post: Post, max = 160): string {
  return truncate(post.excerpt || stripHtml(post.content), max)
}

export function PostCard({ post, headingLevel = 'h2' }: { post: Post; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  const href = `/blog/${post.slug}`
  const categorySlug = slugify(post.category)

  return (
    <article className="post-card">
      <Link className="post-card-media" href={href} tabIndex={-1} aria-hidden="true">
        {post.coverImage ? (
          // CMS images can live on any host, so they are served as-is instead of through next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt="" loading="lazy" decoding="async" />
        ) : (
          // No cover uploaded: a title panel keeps every card in a row the same height.
          <span className="ph">
            <span className="ph-card">
              {post.category && <span className="ph-cat">{post.category}</span>}
              <span className="ph-title">{post.title}</span>
            </span>
          </span>
        )}
      </Link>
      <div className="post-card-body">
        {categorySlug && (
          <div>
            <Link className="chip" href={`/blog/category/${categorySlug}`}>
              {post.category}
            </Link>
          </div>
        )}
        <Heading>
          <Link href={href}>{post.title}</Link>
        </Heading>
        <p>{postExcerpt(post)}</p>
        <div className="post-meta">
          <span>
            <time dateTime={post.publishedAt ?? undefined}>{formatDate(post.publishedAt)}</time>
          </span>
          <span>{readingTime(post.content)} min read</span>
        </div>
      </div>
    </article>
  )
}
