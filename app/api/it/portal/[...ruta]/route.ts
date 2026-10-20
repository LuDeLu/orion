import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { mintaka, MintakaError } from "@/lib/mintaka"

/**
 * Puente entre el navegador del cliente y la API de Mintaka.
 *
 * Las pantallas del portal leen sus datos server-side, pero las acciones
 * (aprobar un presupuesto, abrir un ticket, pedir el link de acceso) salen del
 * navegador. En vez de exponer la API a internet y pelear con CORS, pasan por
 * acá: mismo origen, y la URL real de la API no sale nunca del servidor.
 *
 * Es un puente con lista blanca, no un proxy abierto: solo deja pasar las
 * rutas públicas del portal que las pantallas realmente usan.
 */

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const TOKEN = "[A-Za-z0-9_-]{8,128}"

const PERMITIDAS: { metodo: "GET" | "POST"; patron: RegExp }[] = [
  { metodo: "GET", patron: /^motivos-rechazo$/ },
  { metodo: "GET", patron: new RegExp(`^acceso/${TOKEN}$`) },
  { metodo: "POST", patron: new RegExp(`^presupuesto/${TOKEN}/(opcionales|aprobar|rechazar)$`) },
  { metodo: "POST", patron: /^acceso\/solicitar$/ },
  { metodo: "POST", patron: new RegExp(`^acceso/${TOKEN}/tickets$`) },
  { metodo: "POST", patron: new RegExp(`^encuesta/${TOKEN}$`) },
]

const permitida = (metodo: "GET" | "POST", ruta: string) =>
  PERMITIDAS.some((p) => p.metodo === metodo && p.patron.test(ruta))

/** IP real del visitante: el backend la usa para rate-limit y auditoría. */
async function ipDelVisitante(): Promise<string | null> {
  const h = await headers()
  const fwd = h.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0]?.trim() || null
  return h.get("x-real-ip")
}

async function despachar(
  req: Request,
  params: Promise<{ ruta: string[] }>,
  metodo: "GET" | "POST",
) {
  const { ruta: segmentos } = await params
  const ruta = (segmentos ?? []).join("/")

  if (!permitida(metodo, ruta)) {
    return NextResponse.json(
      { error: "NO_ENCONTRADO", mensaje: "Esa ruta no existe en el portal" },
      { status: 404 },
    )
  }

  let cuerpo: unknown
  if (metodo === "POST") {
    try {
      cuerpo = await req.json()
    } catch {
      cuerpo = {}
    }
  }

  try {
    const datos = await mintaka<unknown>(`/${ruta}`, {
      metodo,
      cuerpo,
      ip: await ipDelVisitante(),
      // Aprobar un presupuesto abre una transacción con varias escrituras.
      timeoutMs: metodo === "POST" ? 20_000 : 8000,
    })
    return NextResponse.json(datos, { headers: { "cache-control": "no-store" } })
  } catch (err) {
    if (err instanceof MintakaError) {
      return NextResponse.json(
        { error: err.codigo, mensaje: err.message },
        { status: err.status || 502, headers: { "cache-control": "no-store" } },
      )
    }
    return NextResponse.json(
      { error: "ERROR_INTERNO", mensaje: "Algo salió mal de nuestro lado." },
      { status: 500 },
    )
  }
}

export async function GET(req: Request, ctx: { params: Promise<{ ruta: string[] }> }) {
  return despachar(req, ctx.params, "GET")
}

export async function POST(req: Request, ctx: { params: Promise<{ ruta: string[] }> }) {
  return despachar(req, ctx.params, "POST")
}
