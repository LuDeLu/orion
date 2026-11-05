// Catálogo de servicios: ítems predefinidos para cargar facturas, presupuestos y abonos.
import { ErrorValidacion } from "@/lib/admin-api"
import { kvHdel, kvHgetAll, kvHset } from "@/lib/kv"
import { ALICUOTAS, MONEDAS, type Item } from "./modelo"

const CLAVE = "fac:catalogo"

export interface Servicio {
  id: string
  descripcion: string
  precio: number
  moneda: string
  unidad: string
  /** Id de alícuota (solo importa si se discrimina IVA) */
  iva: number
  actualizado: string
}

export async function listarCatalogo(): Promise<Servicio[]> {
  return Object.values(await kvHgetAll<Servicio>(CLAVE)).sort((a, b) => a.descripcion.localeCompare(b.descripcion, "es"))
}

export async function guardarServicio(s: Partial<Servicio>): Promise<Servicio> {
  const descripcion = String(s.descripcion ?? "").trim()
  const precio = Math.round(Number(s.precio) * 100) / 100
  const e: string[] = []
  if (!descripcion) e.push("Falta la descripción")
  if (!(precio >= 0)) e.push("El precio no es válido")
  if (e.length) throw new ErrorValidacion(e)
  const servicio: Servicio = {
    id: s.id || crypto.randomUUID().slice(0, 8),
    descripcion,
    precio,
    moneda: MONEDAS.some((m) => m.id === s.moneda) ? String(s.moneda) : "PES",
    unidad: String(s.unidad ?? "").trim() || "u.",
    iva: ALICUOTAS.some((a) => a.id === Number(s.iva)) ? Number(s.iva) : 5,
    actualizado: new Date().toISOString(),
  }
  await kvHset(CLAVE, servicio.id, servicio)
  return servicio
}

export const borrarServicio = (id: string) => kvHdel(CLAVE, id)

/** Un servicio del catálogo como ítem de comprobante. */
export const comoItem = (s: Pick<Servicio, "descripcion" | "precio" | "unidad" | "iva">): Item => ({
  descripcion: s.descripcion,
  cantidad: 1,
  unidad: s.unidad,
  precio: s.precio,
  bonificacion: 0,
  iva: s.iva,
})
