import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth'

// First line of defence for the admin area. Every admin page and server action
// re-checks the session itself, so this only keeps signed-out visitors off the UI.
export async function proxy(request: NextRequest) {
  // Only page loads are redirected. Server actions (POST) pass through and answer with their own
  // "session expired" error; redirecting them would silently drop a save from an open editor.
  if (request.method !== 'GET' && request.method !== 'HEAD') return NextResponse.next()

  const { pathname } = request.nextUrl
  const signedIn = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)

  if (pathname === '/admin/login') {
    return signedIn ? NextResponse.redirect(new URL('/admin', request.url)) : NextResponse.next()
  }
  if (!signedIn) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
