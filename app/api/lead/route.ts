import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { sendToSheets } from "@/lib/scan-log"

export const runtime = "nodejs"

export async function POST(req: Request) {
  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }

  const name = String(body.name ?? "").trim().slice(0, 120)
  const email = String(body.email ?? "").trim().slice(0, 200)
  const phone = String(body.phone ?? "").trim().slice(0, 60)
  const company = String(body.company ?? "").trim().slice(0, 120)
  const message = String(body.message ?? "").trim().slice(0, 1000)

  if (!name || (!email && !phone)) {
    return NextResponse.json(
      { ok: false, error: "Falta nombre y al menos un contacto (email o teléfono)" },
      { status: 400 },
    )
  }

  const cookieStore = await cookies()
  const visitId = cookieStore.get("qr_visit")?.value ?? null

  const ok = await sendToSheets({
    type: "lead",
    visitId,
    name,
    email,
    phone,
    company,
    message,
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json({ ok })
}
