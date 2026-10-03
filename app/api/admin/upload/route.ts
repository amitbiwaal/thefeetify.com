import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/session'
import { StorageUnavailableError } from '@/lib/store'
import { UploadError, saveImage } from '@/lib/uploads'

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 })
  }

  // Same-origin only: the session cookie is SameSite=Lax, this is a second check against CSRF.
  const origin = request.headers.get('origin')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: 'Cross-origin uploads are not allowed.' }, { status: 403 })
  }

  let file: FormDataEntryValue | null
  try {
    file = (await request.formData()).get('file')
  } catch {
    return NextResponse.json({ error: 'Could not read the upload. The file may be too large (max 4 MB).' }, { status: 400 })
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file received.' }, { status: 400 })
  }

  try {
    return NextResponse.json({ url: await saveImage(file) })
  } catch (error) {
    if (error instanceof UploadError) return NextResponse.json({ error: error.message }, { status: 400 })
    if (error instanceof StorageUnavailableError) return NextResponse.json({ error: error.message }, { status: 503 })
    console.error('[upload] Failed', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
