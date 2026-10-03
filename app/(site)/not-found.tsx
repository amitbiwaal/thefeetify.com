import Link from 'next/link'

// Rendered inside the site layout (header, footer, styles) for every missing public page.
export default function NotFound() {
  return (
    <div className="wrap notfound">
      {/* A not-found boundary cannot export metadata, so the tab title is set from here. */}
      <title>Page Not Found | Feetify</title>
      <div className="code" aria-hidden="true">
        404
      </div>
      <h1>We couldn&apos;t find that page</h1>
      <p>The link may be out of date, or the page may have moved. Try one of these instead.</p>
      <div className="hero-cta">
        <Link className="btn btn-primary" href="/">
          Back to Home
        </Link>
        <Link className="btn btn-ghost" href="/blog">
          Read the Blog
        </Link>
      </div>
    </div>
  )
}
