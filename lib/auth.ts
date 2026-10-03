// Stateless admin session: an HMAC-signed expiry timestamp stored in an httpOnly cookie.
// Uses Web Crypto only, so the same code runs in proxy.ts and in server components/actions.

export const SESSION_COOKIE = 'feetify_admin'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7

const encoder = new TextEncoder()

export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD)
}

function signingSecret(): string | null {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return null
  // The password is part of the key, so changing it signs everyone out.
  return `${process.env.AUTH_SECRET ?? ''}:${password}`
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> | null {
  try {
    const binary = atob(value.replace(/-/g, '+').replace(/_/g, '/'))
    const bytes = new Uint8Array(new ArrayBuffer(binary.length))
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
  } catch {
    return null
  }
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ])
}

export async function createSessionToken(): Promise<string | null> {
  const secret = signingSecret()
  if (!secret) return null
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE
  const signature = await crypto.subtle.sign('HMAC', await hmacKey(secret), encoder.encode(`admin:${expires}`))
  return `${expires}.${toBase64Url(new Uint8Array(signature))}`
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  const secret = signingSecret()
  if (!secret || !token) return false
  const [expiresRaw, signatureRaw] = token.split('.')
  if (!expiresRaw || !signatureRaw || !/^\d{1,12}$/.test(expiresRaw)) return false
  if (Number(expiresRaw) < Math.floor(Date.now() / 1000)) return false
  const signature = fromBase64Url(signatureRaw)
  if (!signature) return false
  return crypto.subtle.verify('HMAC', await hmacKey(secret), signature, encoder.encode(`admin:${expiresRaw}`))
}

export async function verifyPassword(candidate: string): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD
  if (!password || !candidate) return false
  // Compare digests so the comparison time does not depend on where the strings differ.
  const [a, b] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(candidate)),
    crypto.subtle.digest('SHA-256', encoder.encode(password)),
  ])
  const left = new Uint8Array(a)
  const right = new Uint8Array(b)
  let diff = 0
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i]
  return diff === 0
}
