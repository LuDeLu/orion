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
