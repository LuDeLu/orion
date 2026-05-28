import { NextResponse, type NextRequest } from "next/server"
import { sendToSheets } from "@/lib/scan-log"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function pickIp(h: Headers): string | null {
  const xff = h.get("x-forwarded-for")
  if (xff) return xff.split(",")[0].trim()
  return h.get("x-real-ip") || h.get("cf-connecting-ip") || null
}

function randomId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export async function GET(req: NextRequest) {
  const h = req.headers
  const visitId = randomId()

  await sendToSheets({
    type: "scan",
    slug: "qr",
    ip: pickIp(h),
    city: h.get("x-vercel-ip-city") ? decodeURIComponent(h.get("x-vercel-ip-city")!) : null,
    region: h.get("x-vercel-ip-country-region"),
    country: h.get("x-vercel-ip-country"),
    userAgent: h.get("user-agent"),
    referer: h.get("referer"),
    language: h.get("accept-language"),
    timestamp: new Date().toISOString(),
    visitId,
  })

  const url = new URL("/?qr=1", req.url)
  const res = NextResponse.redirect(url, { status: 307 })
  res.cookies.set("qr_visit", visitId, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    httpOnly: false,
  })
  return res
}
