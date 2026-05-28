import { cookies } from "next/headers"
import { NextResponse, type NextRequest } from "next/server"
import { getAuthCookieName, getSessionSecret, verifySession } from "@/lib/auth"
import { readFromSheets } from "@/lib/scan-log"
import { applyLeadFilters, applyScanFilters, parseFilters } from "@/lib/filters"
import { parseUA } from "@/lib/ua-parser"
import type { LeadRow, ScanRow } from "@/lib/admin-stats"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function escapeCsv(v: unknown): string {
  const s = v == null ? "" : String(v)
  if (/[",\n\r;]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function toCsv(headers: string[], rows: Record<string, unknown>[]): string {
  const lines = [headers.join(",")]
  for (const r of rows) lines.push(headers.map((h) => escapeCsv(r[h])).join(","))
  return "﻿" + lines.join("\n")
}

export async function GET(req: NextRequest) {
  const jar = await cookies()
  const token = jar.get(getAuthCookieName())?.value
  const session = await verifySession(token, getSessionSecret())
  if (!session) return new NextResponse("Unauthorized", { status: 401 })

  const url = new URL(req.url)
  const type = url.searchParams.get("type") === "leads" ? "leads" : "scans"
  const filters = parseFilters(Object.fromEntries(url.searchParams))

  const raw = await readFromSheets(type)
  let csv: string
  let filename: string

  if (type === "leads") {
    const filtered = applyLeadFilters(raw as unknown as LeadRow[], filters)
    csv = toCsv(
      ["timestamp", "visitId", "name", "email", "phone", "company", "message"],
      filtered as unknown as Record<string, unknown>[],
    )
    filename = `orion-leads-${new Date().toISOString().slice(0, 10)}.csv`
  } else {
    const filtered = applyScanFilters(raw as unknown as ScanRow[], filters, (ua) => parseUA(ua).device)
    csv = toCsv(
      ["timestamp", "visitId", "slug", "ip", "city", "region", "country", "userAgent", "referer", "language"],
      filtered as unknown as Record<string, unknown>[],
    )
    filename = `orion-scans-${new Date().toISOString().slice(0, 10)}.csv`
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  })
}
