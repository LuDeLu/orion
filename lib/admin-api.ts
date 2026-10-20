// Helpers para las rutas /api/admin/*: sesión, errores de validación y respuestas JSON.
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getAuthCookieName, getSessionSecret, verifySession } from "@/lib/auth"
import { ErrorArca } from "@/lib/facturacion/arca/soap"

export class ErrorValidacion extends Error {
  constructor(public errores: string[]) {
    super(errores.join(" · "))
    this.name = "ErrorValidacion"
  }
}

export async function sesionValida() {
  const jar = await cookies()
  return verifySession(jar.get(getAuthCookieName())?.value, getSessionSecret())
}

/** Corre el handler solo con sesión de admin y traduce los errores a respuestas legibles. */
export async function conAdmin(fn: (sesion: { username: string }) => Promise<unknown>) {
  const sesion = await sesionValida()
  if (!sesion) return NextResponse.json({ error: "Sesión vencida. Volvé a ingresar." }, { status: 401 })
  try {
    const r = await fn(sesion)
    return r instanceof Response ? r : NextResponse.json(r ?? { ok: true })
  } catch (e) {
    if (e instanceof ErrorValidacion) return NextResponse.json({ error: e.message, errores: e.errores }, { status: 422 })
    if (e instanceof ErrorArca) return NextResponse.json({ error: e.message, codigo: e.codigo }, { status: 502 })
    console.error("[admin]", e)
    return NextResponse.json({ error: (e as Error).message || "Error inesperado" }, { status: 500 })
  }
}
