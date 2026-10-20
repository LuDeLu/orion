import { NextResponse } from "next/server"
import { sesionValida } from "@/lib/admin-api"
import { enVivo } from "@/lib/analitica"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  if (!(await sesionValida())) return NextResponse.json({ error: "Sesión vencida" }, { status: 401 })
  return NextResponse.json(await enVivo())
}
