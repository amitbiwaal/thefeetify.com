import 'server-only'
import { randomBytes } from 'node:crypto'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { del, list, put } from '@vercel/blob'

/**
 * Where CMS data lives:
 *  - "blob": Vercel Blob (production, once a Blob store is connected to the project)
 *  - "fs": local JSON files (development) — posts are written to content/posts and can be committed
 *  - "readonly": deployed on Vercel without a Blob store; posts committed to the repo still render
 */
export type Backend = 'blob' | 'fs' | 'readonly'
export type Collection = 'posts' | 'messages'

export class StorageUnavailableError extends Error {
  constructor() {
    super(
      'Storage is not connected. In Vercel, open Storage → Create → Blob (Public), connect it to this project, then redeploy.',
    )
    this.name = 'StorageUnavailableError'
  }
}

export function storageBackend(): Backend {
  if (process.env.BLOB_READ_WRITE_TOKEN) return 'blob'
  if (process.env.VERCEL) return 'readonly'
  return 'fs'
}

const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,79}$/

export function isValidId(id: unknown): id is string {
  return typeof id === 'string' && ID_PATTERN.test(id)
}

export function newId(): string {
  return randomBytes(12).toString('hex')
}

function assertId(id: string) {
  if (!isValidId(id)) throw new Error('Invalid record id')
}

/* ------------------------------ local files ------------------------------ */

// Paths are spelled out per collection so the bundler can see exactly which folder is read:
// content/posts ships with the deployment, .data/messages only exists on a developer machine.
function fsPath(collection: Collection, file = ''): string {
  return collection === 'posts'
    ? path.join(process.cwd(), 'content', 'posts', file)
    : path.join(/* turbopackIgnore: true */ process.cwd(), '.data', 'messages', file)
}

export async function fsReadAll(collection: Collection): Promise<unknown[]> {
  let files: string[]
  try {
    files = await fs.readdir(fsPath(collection))
  } catch {
    return []
  }
  const records = await Promise.all(
    files
      .filter((file) => file.endsWith('.json'))
      .map(async (file) => {
        try {
          return JSON.parse(await fs.readFile(fsPath(collection, file), 'utf8')) as unknown
        } catch {
          console.error(`[store] Skipping unreadable file ${collection}/${file}`)
          return null
        }
      }),
  )
  return records.filter((record) => record !== null)
}

async function fsWrite(collection: Collection, id: string, data: unknown): Promise<void> {
  await fs.mkdir(fsPath(collection), { recursive: true })
  const target = fsPath(collection, `${id}.json`)
  const temp = `${target}.${randomBytes(4).toString('hex')}.tmp`
  await fs.writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
  await fs.rename(temp, target)
}

async function fsDelete(collection: Collection, id: string): Promise<void> {
  await fs.rm(fsPath(collection, `${id}.json`), { force: true })
}

/* ------------------------------ Vercel Blob ------------------------------ */

// Every save writes a new, unguessable blob URL (cms/<collection>/<id>/<time>-<random>.json)
// and removes the previous version. URLs are therefore immutable, which sidesteps CDN
// staleness on overwrite and keeps drafts and messages private in a public store.

type BlobVersion = { pathname: string; url: string }

const blobPrefix = (collection: Collection, id?: string) => `cms/${collection}/${id ? `${id}/` : ''}`

async function withRetry<T>(task: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await task()
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)))
    }
  }
  throw lastError
}

async function blobVersions(collection: Collection, id?: string): Promise<Map<string, BlobVersion[]>> {
  const base = blobPrefix(collection)
  const groups = new Map<string, BlobVersion[]>()
  let cursor: string | undefined
  do {
    const page = await withRetry(() => list({ prefix: blobPrefix(collection, id), cursor, limit: 1000 }))
    for (const blob of page.blobs) {
      const [recordId, file] = blob.pathname.slice(base.length).split('/')
      if (!isValidId(recordId) || !file?.endsWith('.json')) continue
      const versions = groups.get(recordId) ?? []
      versions.push({ pathname: blob.pathname, url: blob.url })
      groups.set(recordId, versions)
    }
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  for (const versions of groups.values()) {
    versions.sort((a, b) => (a.pathname < b.pathname ? 1 : -1))
  }
  return groups
}

async function blobReadAll(collection: Collection): Promise<unknown[]> {
  const groups = await blobVersions(collection)
  return Promise.all(
    [...groups.values()].map(async ([latest]) => {
      // Immutable URL, so it is safe to cache forever and never forces a page to render dynamically.
      const response = await withRetry(() => fetch(latest.url, { cache: 'force-cache' }))
      if (!response.ok) throw new Error(`Could not read ${latest.pathname} (${response.status})`)
      return (await response.json()) as unknown
    }),
  )
}

async function blobWrite(collection: Collection, id: string, data: unknown): Promise<void> {
  const version = `${Date.now().toString().padStart(15, '0')}-${randomBytes(16).toString('hex')}`
  const created = await put(`${blobPrefix(collection, id)}${version}.json`, JSON.stringify(data), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    cacheControlMaxAge: 60 * 60 * 24 * 365,
  })
  try {
    const stale = ((await blobVersions(collection, id)).get(id) ?? [])
      .filter((item) => item.pathname !== created.pathname)
      .map((item) => item.url)
    if (stale.length) await del(stale)
  } catch (error) {
    // The new version is already the latest one; leftover versions are cleaned up on the next save.
    console.error('[store] Could not remove old versions', error)
  }
}

async function blobDelete(collection: Collection, id: string): Promise<void> {
  const versions = (await blobVersions(collection, id)).get(id) ?? []
  if (versions.length) await del(versions.map((item) => item.url))
}

/* ------------------------------- public API ------------------------------ */

export async function readRecords(collection: Collection): Promise<unknown[]> {
  switch (storageBackend()) {
    case 'blob':
      return blobReadAll(collection)
    case 'fs':
      return fsReadAll(collection)
    default:
      return []
  }
}

export async function writeRecord(collection: Collection, id: string, data: unknown): Promise<void> {
  assertId(id)
  switch (storageBackend()) {
    case 'blob':
      return blobWrite(collection, id, data)
    case 'fs':
      return fsWrite(collection, id, data)
    default:
      throw new StorageUnavailableError()
  }
}

export async function deleteRecord(collection: Collection, id: string): Promise<void> {
  assertId(id)
  switch (storageBackend()) {
    case 'blob':
      return blobDelete(collection, id)
    case 'fs':
      return fsDelete(collection, id)
    default:
      throw new StorageUnavailableError()
  }
}
