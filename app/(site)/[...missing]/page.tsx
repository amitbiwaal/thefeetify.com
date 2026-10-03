import { notFound } from 'next/navigation'
import { NOT_FOUND_META } from '@/lib/seo'

// Catches every URL that no other route matches and hands it to the site's not-found page,
// so 404s are rendered with the normal header, footer and styles.
export const metadata = NOT_FOUND_META

export default function MissingPage() {
  notFound()
}
