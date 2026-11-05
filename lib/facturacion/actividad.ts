// Registro de actividad del módulo de facturación: quién hizo qué y cuándo.
// Un sorted set por fecha; se conservan 18 meses.
import { kvPipeline, kvZrevrange } from "@/lib/kv"

const CLAVE = "fac:actividad"
const RETENCION_MS = 548 * 864e5

export interface Evento {
  /** ISO */
  fecha: string
  usuario: string
  accion: string
  detalle: string
  /** Link interno para ir al objeto (comprobante, cliente…) */
  href?: string
}

/** Nunca rompe la operación principal: si falla el registro, solo se loguea. */
export async function registrar(usuario: string | undefined, accion: string, detalle: string, href?: string) {
  const ahora = Date.now()
  const ev: Evento = { fecha: new Date(ahora).toISOString(), usuario: usuario || "—", accion, detalle, href }
  try {
    await kvPipeline([
      // El sufijo aleatorio evita que dos eventos idénticos en el mismo ms se pisen
      ["ZADD", CLAVE, ahora, JSON.stringify({ ...ev, _: Math.random().toString(36).slice(2, 7) })],
      ["ZREMRANGEBYSCORE", CLAVE, 0, ahora - RETENCION_MS],
    ])
  } catch (e) {
    console.error("[actividad]", e)
  }
}

export async function listarActividad(limite = 300): Promise<Evento[]> {
  const crudos = await kvZrevrange(CLAVE, 0, limite - 1)
  return (crudos ?? []).flatMap((s) => {
    try {
      const { _, ...ev } = JSON.parse(s) as Evento & { _?: string }
      return [ev]
    } catch {
      return []
    }
  })
}
