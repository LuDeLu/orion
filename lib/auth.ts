const COOKIE_NAME = "orion_admin"
const SESSION_TTL = 60 * 60 * 8

function base64UrlEncode(bytes: Uint8Array): string {
  let str = ""
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i])
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(input.length + ((4 - (input.length % 4)) % 4), "=")
  const bin = atob(padded)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  )
}

export async function signSession(username: string, secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL
  const payload = `${encodeURIComponent(username)}.${exp}`
  const key = await getKey(secret)
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  return `${payload}.${base64UrlEncode(new Uint8Array(sig))}`
}

export async function verifySession(
  token: string | undefined,
  secret: string,
): Promise<{ username: string; exp: number } | null> {
  if (!token) return null
  const parts = token.split(".")
  if (parts.length !== 3) return null
  const [user, expStr, sig] = parts
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null

  const payload = `${user}.${expStr}`
  const key = await getKey(secret)
  const expected = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)))
  const given = base64UrlDecode(sig)
  if (!timingSafeEqual(expected, given)) return null

  return { username: decodeURIComponent(user), exp }
}

export async function checkCredentials(username: string, password: string): Promise<boolean> {
  const u = process.env.ADMIN_USER
  const p = process.env.ADMIN_PASS
  if (!u || !p) return false
  const a = new TextEncoder().encode(username)
  const b = new TextEncoder().encode(u)
  const c = new TextEncoder().encode(password)
  const d = new TextEncoder().encode(p)
  return timingSafeEqual(a, b) && timingSafeEqual(c, d)
}

export function getAuthCookieName() {
  return COOKIE_NAME
}

export function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASS || "fallback-insecure-secret-change-me"
}

export function getSessionTTL() {
  return SESSION_TTL
}
