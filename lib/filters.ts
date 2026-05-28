export type FilterParams = {
  q?: string
  country?: string
  device?: string
  from?: string
  to?: string
}

export function parseFilters(sp: Record<string, string | string[] | undefined>): FilterParams {
  const g = (k: string) => {
    const v = sp[k]
    return typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined
  }
  return {
    q: g("q"),
    country: g("country"),
    device: g("device"),
    from: g("from"),
    to: g("to"),
  }
}

function inRange(iso: string, from?: string, to?: string): boolean {
  if (!from && !to) return true
  const t = new Date(iso).getTime()
  if (!t) return false
  if (from) {
    const f = new Date(from + "T00:00:00").getTime()
    if (t < f) return false
  }
  if (to) {
    const tt = new Date(to + "T23:59:59").getTime()
    if (t > tt) return false
  }
  return true
}

export function applyScanFilters<
  T extends {
    timestamp: string
    country: string
    userAgent: string
    city: string
    ip: string
    referer: string
  },
>(rows: T[], f: FilterParams, deviceOf: (ua: string) => string): T[] {
  const ql = (f.q || "").toLowerCase().trim()
  return rows.filter((r) => {
    if (!inRange(r.timestamp, f.from, f.to)) return false
    if (f.country && r.country?.toLowerCase() !== f.country.toLowerCase()) return false
    if (f.device && deviceOf(r.userAgent) !== f.device) return false
    if (ql) {
      const hay = `${r.city} ${r.country} ${r.userAgent} ${r.ip} ${r.referer}`.toLowerCase()
      if (!hay.includes(ql)) return false
    }
    return true
  })
}

export function applyLeadFilters<
  T extends {
    timestamp: string
    name: string
    email: string
    phone: string
    company: string
    message: string
  },
>(rows: T[], f: FilterParams): T[] {
  const ql = (f.q || "").toLowerCase().trim()
  return rows.filter((r) => {
    if (!inRange(r.timestamp, f.from, f.to)) return false
    if (ql) {
      const hay = `${r.name} ${r.email} ${r.phone} ${r.company} ${r.message}`.toLowerCase()
      if (!hay.includes(ql)) return false
    }
    return true
  })
}

export function toQueryString(f: FilterParams): string {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(f)) if (v) p.set(k, String(v))
  return p.toString()
}
