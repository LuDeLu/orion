import { parseUA } from "./ua-parser"

export type ScanRow = {
  timestamp: string
  visitId: string
  slug: string
  ip: string
  city: string
  region: string
  country: string
  userAgent: string
  referer: string
  language: string
}

export type LeadRow = {
  timestamp: string
  visitId: string
  name: string
  email: string
  phone: string
  company: string
  message: string
}

export type Stats = {
  totalScans: number
  uniqueVisitors: number
  totalLeads: number
  conversion: number
  last24h: number
  last7d: number
  topCountry: { code: string; count: number } | null
  topDevice: { name: string; count: number } | null
  topBrowser: { name: string; count: number } | null
  perDay: { date: string; count: number }[]
  byCountry: { code: string; count: number }[]
  byDevice: { name: string; count: number }[]
  byBrowser: { name: string; count: number }[]
}

function ts(row: { timestamp: string }) {
  const d = new Date(row.timestamp)
  return Number.isNaN(d.getTime()) ? 0 : d.getTime()
}

function topOf<T extends string>(items: T[]): { name: T; count: number }[] {
  const map = new Map<T, number>()
  for (const v of items) {
    if (!v) continue
    map.set(v, (map.get(v) || 0) + 1)
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export function computeStats(scans: ScanRow[], leads: LeadRow[], days = 14): Stats {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const last24h = scans.filter((s) => now - ts(s) <= dayMs).length
  const last7d = scans.filter((s) => now - ts(s) <= 7 * dayMs).length

  const visitors = new Set<string>()
  for (const s of scans) if (s.visitId) visitors.add(s.visitId)

  const countries = topOf(scans.map((s) => s.country).filter(Boolean))
  const parsed = scans.map((s) => parseUA(s.userAgent))
  const devices = topOf(parsed.map((p) => p.device))
  const browsers = topOf(parsed.map((p) => p.browser))

  const perDayMap = new Map<string, number>()
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  start.setUTCDate(start.getUTCDate() - (days - 1))
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * dayMs)
    perDayMap.set(d.toISOString().slice(0, 10), 0)
  }
  for (const s of scans) {
    const t = ts(s)
    if (!t) continue
    const key = new Date(t).toISOString().slice(0, 10)
    if (perDayMap.has(key)) perDayMap.set(key, (perDayMap.get(key) || 0) + 1)
  }
  const perDay = [...perDayMap.entries()].map(([date, count]) => ({ date, count }))

  return {
    totalScans: scans.length,
    uniqueVisitors: visitors.size,
    totalLeads: leads.length,
    conversion: visitors.size ? Math.round((leads.length / visitors.size) * 1000) / 10 : 0,
    last24h,
    last7d,
    topCountry: countries[0] ? { code: countries[0].name, count: countries[0].count } : null,
    topDevice: devices[0] || null,
    topBrowser: browsers[0] || null,
    perDay,
    byCountry: countries.slice(0, 8).map((c) => ({ code: c.name, count: c.count })),
    byDevice: devices.slice(0, 4),
    byBrowser: browsers.slice(0, 6),
  }
}

export function timeAgo(iso: string): string {
  const t = new Date(iso).getTime()
  if (!t) return ""
  const diff = Date.now() - t
  const m = Math.floor(diff / 60000)
  if (m < 1) return "ahora"
  if (m < 60) return `hace ${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `hace ${h}h`
  const d = Math.floor(h / 24)
  if (d < 30) return `hace ${d}d`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `hace ${mo}mes`
  return `hace ${Math.floor(mo / 12)}a`
}

export function fmtDate(iso: string): string {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}
