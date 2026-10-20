/**
 * Datos del emisor y preferencias de facturación. Viven en el KV para poder
 * editarlos desde el panel; las variables de entorno solo fijan los valores
 * iniciales (y el CUIT, si se quiere bloquear).
 */
import { kvGet, kvSet } from "@/lib/kv"
import type { Entorno } from "./arca/wsaa"
import type { CondicionEmisor } from "./modelo"

export interface ConfigFacturacion {
  cuit: string
  entorno: Entorno
  puntoVenta: number
  condicionIva: CondicionEmisor
  razonSocial: string
  nombreFantasia: string
  domicilio: string
  iibb: string
  inicioActividades: string // YYYY-MM-DD
  categoriaMonotributo: string
  actividad: string
  email: string
  telefono: string
  web: string
  /** Para Factura de Crédito Electrónica MiPyME */
  cbu: string
  alias: string
  validezPresupuesto: number
  leyendaPie: string
  /** Datos bancarios y medios de pago que se imprimen en presupuestos y facturas */
  datosPago: string
}

const CLAVE = "fac:config"

export const CUIT_EMISOR = (process.env.ARCA_CUIT || "20468137934").replace(/\D/g, "")

const BASE: ConfigFacturacion = {
  cuit: CUIT_EMISOR,
  entorno: process.env.ARCA_ENTORNO === "produccion" ? "produccion" : "homologacion",
  puntoVenta: Number(process.env.ARCA_PUNTO_VENTA) || 1,
  condicionIva: "monotributo",
  razonSocial: "",
  nombreFantasia: "Orion Marketing",
  domicilio: "",
  iibb: "",
  inicioActividades: "",
  categoriaMonotributo: "",
  actividad: "",
  email: "hola@orionmkt.com.ar",
  telefono: "",
  web: "orionmkt.com.ar",
  cbu: "",
  alias: "",
  validezPresupuesto: 15,
  leyendaPie: "Gracias por confiar en Orion. Donde todo se alinea.",
  datosPago: "",
}

export async function leerConfig(): Promise<ConfigFacturacion> {
  const guardada = await kvGet<Partial<ConfigFacturacion>>(CLAVE)
  const cfg = { ...BASE, ...guardada }
  // El CUIT lo fija el entorno si está seteado: evita facturar con otro por error
  if (process.env.ARCA_CUIT) cfg.cuit = CUIT_EMISOR
  return cfg
}

export async function guardarConfig(cambios: Partial<ConfigFacturacion>): Promise<ConfigFacturacion> {
  const actual = await leerConfig()
  const nueva: ConfigFacturacion = { ...actual }
  for (const k of Object.keys(BASE) as (keyof ConfigFacturacion)[]) {
    if (cambios[k] === undefined) continue
    const v = cambios[k]
    ;(nueva as any)[k] = typeof BASE[k] === "number" ? Number(v) || 0 : String(v ?? "").trim()
  }
  if (nueva.entorno !== "produccion") nueva.entorno = "homologacion"
  if (!["monotributo", "responsable_inscripto", "exento"].includes(nueva.condicionIva)) nueva.condicionIva = "monotributo"
  nueva.cuit = nueva.cuit.replace(/\D/g, "")
  if (process.env.ARCA_CUIT) nueva.cuit = CUIT_EMISOR
  await kvSet(CLAVE, nueva)
  return nueva
}
