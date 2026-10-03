const MAX_DIMENSION = 1600
const SKIP_BELOW_BYTES = 350 * 1024

/**
 * Shrinks large photos in the browser before upload so they stay under the 4 MB request
 * limit and load quickly for readers. GIFs (animation) and already-small files are left alone.
 */
async function prepareImage(file: File): Promise<File> {
  if (file.type === 'image/gif' || !file.type.startsWith('image/')) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    if (scale === 1 && file.size <= SKIP_BELOW_BYTES) {
      bitmap.close()
      return file
    }
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.86))
    // Browsers without WebP encoding fall back to PNG; keep the original if nothing was gained.
    if (!blob || blob.type !== 'image/webp' || blob.size >= file.size) return file
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' })
  } catch {
    return file
  }
}

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData()
  body.append('file', await prepareImage(file))
  const response = await fetch('/api/admin/upload', { method: 'POST', body })
  const result = (await response.json().catch(() => null)) as { url?: string; error?: string } | null
  if (!response.ok || !result?.url) {
    throw new Error(result?.error || 'Upload failed. Please try again.')
  }
  return result.url
}
