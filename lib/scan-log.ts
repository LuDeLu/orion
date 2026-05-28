const WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL
const WEBHOOK_SECRET = process.env.SHEETS_WEBHOOK_SECRET

export type ScanPayload = {
  type: "scan"
  slug: string
  ip: string | null
  city: string | null
  region: string | null
  country: string | null
  userAgent: string | null
  referer: string | null
  language: string | null
  timestamp: string
  visitId: string
}

export type LeadPayload = {
  type: "lead"
  visitId: string | null
  name: string
  email: string
  phone: string
  company: string
  message: string
  timestamp: string
}

export async function sendToSheets(payload: ScanPayload | LeadPayload): Promise<boolean> {
  if (!WEBHOOK_URL) {
    console.warn("[scan-log] SHEETS_WEBHOOK_URL no configurada, ignorando")
    return false
  }

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, secret: WEBHOOK_SECRET }),
      cache: "no-store",
    })
    return res.ok
  } catch (err) {
    console.error("[scan-log] error enviando a sheets", err)
    return false
  }
}

export async function readFromSheets(kind: "scans" | "leads"): Promise<Record<string, string>[]> {
  if (!WEBHOOK_URL || !WEBHOOK_SECRET) return []

  try {
    const url = `${WEBHOOK_URL}?secret=${encodeURIComponent(WEBHOOK_SECRET)}&kind=${kind}`
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data?.rows) ? data.rows : []
  } catch (err) {
    console.error("[scan-log] error leyendo sheets", err)
    return []
  }
}
