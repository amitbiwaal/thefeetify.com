import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div className="a-empty" style={{ margin: '40px auto', maxWidth: 520 }}>
      <h1>Not found</h1>
      <p>This post or page does not exist. It may have been deleted.</p>
      <Link className="a-btn a-btn-primary" href="/admin">
        Back to posts
      </Link>
    </div>
  )
}
