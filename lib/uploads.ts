import 'server-only'
import { randomBytes } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { put } from '@vercel/blob'
import { StorageUnavailableError, storageBackend } from './store'
import { slugify } from './utils'

/** Vercel functions accept request bodies up to 4.5 MB; the editor compresses larger images first. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

const IMAGE_TYPES: Record<string, { ext: string; matches: (bytes: Uint8Array) => boolean }> = {
  'image/jpeg': { ext: 'jpg', matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  'image/png': { ext: 'png', matches: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  'image/gif': { ext: 'gif', matches: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38 },
  'image/webp': {
    ext: 'webp',
    matches: (b) => ascii(b, 0, 4) === 'RIFF' && ascii(b, 8, 12) === 'WEBP',
  },
  'image/avif': { ext: 'avif', matches: (b) => ascii(b, 4, 8) === 'ftyp' && /^avi[fs]$/.test(ascii(b, 8, 12)) },
}

function ascii(bytes: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...bytes.slice(start, end))
}

export class UploadError extends Error {}

export async function saveImage(file: File): Promise<string> {
  const type = IMAGE_TYPES[file.type]
  if (!type) throw new UploadError('Only JPG, PNG, WebP, AVIF and GIF images are allowed.')
  if (file.size === 0) throw new UploadError('The file is empty.')
  if (file.size > MAX_UPLOAD_BYTES) throw new UploadError('Image is too large (max 4 MB).')

  const bytes = new Uint8Array(await file.arrayBuffer())
  // Trust the file signature, not the browser-supplied MIME type.
  if (!type.matches(bytes)) throw new UploadError('The file does not look like a valid image.')

  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image'
  const name = `${base.slice(0, 60)}-${randomBytes(4).toString('hex')}.${type.ext}`

  switch (storageBackend()) {
    case 'blob': {
      const now = new Date()
      const folder = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`
      const blob = await put(`uploads/${folder}/${name}`, Buffer.from(bytes), {
        access: 'public',
        contentType: file.type,
        addRandomSuffix: false,
        cacheControlMaxAge: 60 * 60 * 24 * 365,
      })
      return blob.url
    }
    case 'fs': {
      // Development only, so the bundler does not need to trace this folder into the deployment.
      const dir = path.join(/* turbopackIgnore: true */ process.cwd(), 'public', 'uploads')
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(path.join(/* turbopackIgnore: true */ dir, name), bytes)
      return `/uploads/${name}`
    }
    default:
      throw new StorageUnavailableError()
  }
}
