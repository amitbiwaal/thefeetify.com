import { promises as fs } from 'node:fs'
import path from 'node:path'

// Local fallback only. Images uploaded while the server is running (local file mode) are not
// part of the static file list a production build serves, so this route reads them from disk.
// On Vercel, committed files in public/uploads are served statically and never reach this handler.

const TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const match = /^[a-z0-9][a-z0-9-]*\.(jpg|png|gif|webp|avif)$/.exec(name)
  if (!match) return new Response('Not found', { status: 404 })

  try {
    const file = await fs.readFile(path.join(/* turbopackIgnore: true */ process.cwd(), 'public', 'uploads', name))
    return new Response(new Uint8Array(file), {
      headers: {
        'Content-Type': TYPES[match[1]],
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
