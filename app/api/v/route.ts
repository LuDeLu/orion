import { NextResponse } from "next/server"
import { registrar, type Hit } from "@/lib/analitica"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Recibe los hits de analítica del sitio (components/analitica.tsx).
 * Nombre corto a propósito: los bloqueadores filtran rutas como /analytics o /track.
 * Nunca falla hacia el navegador: la analítica no puede romper la navegación.
 */
export async function POST(req: Request) {
  try {
    const texto = await req.text()
    if (texto.length > 2000) return new NextResponse(null, { status: 204 })
    const hit = JSON.parse(texto) as Hit
    if (!["vista", "salida", "evento"].includes(hit?.tipo)) return new NextResponse(null, { status: 204 })
    await registrar(hit, req.headers, new URL(req.url).hostname)
  } catch (e) {
    console.error("[analitica]", (e as Error).message)
  }
  return new NextResponse(null, { status: 204 })
}
