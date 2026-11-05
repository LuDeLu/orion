// Abonos mensuales: plantillas de factura por cliente que se emiten cada mes.
// No se emiten solos: el panel muestra cuáles faltan facturar en el mes y cada
// factura se revisa y confirma (una factura con CAE no se puede borrar).
import { ErrorValidacion } from "@/lib/admin-api"
import { kvHdel, kvHget, kvHgetAll, kvHset } from "@/lib/kv"
import { leerClientePorClave, soloReceptor } from "./documentos"
export { limitesPeriodo, periodoAFacturar } from "./periodos"
import { CONDICIONES_VENTA, MONEDAS, type Item, type Receptor } from "./modelo"

const CLAVE = "fac:abonos"

export interface Abono {
  id: string
  /** Cómo lo reconocemos, ej. "Redes – Café Lumbre" */
  nombre: string
  /** Clave del cliente en la agenda (tipo-número) */
  clienteClave: string
  /** Copia de los datos fiscales por si el cliente se borra de la agenda */
  receptor: Receptor
  items: Item[]
  moneda: string
  condicionVenta: string
  /** Días desde la emisión para el vencimiento del pago */
  diasVencimiento: number
  /** Qué mes se factura: el que corre o el anterior (mes vencido) */
  mesFacturado?: "actual" | "anterior"
  observaciones: string
  activo: boolean
  creado: string
  actualizado: string
  /** Último mes facturado (YYYY-MM) y su comprobante */
  ultimoPeriodo?: string
  ultimaFactura?: string
}

export async function listarAbonos(): Promise<Abono[]> {
  return Object.values(await kvHgetAll<Abono>(CLAVE)).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
}

export const leerAbono = (id: string) => kvHget<Abono>(CLAVE, id)

export async function guardarAbono(a: Partial<Abono>): Promise<Abono> {
  const previo = a.id ? await leerAbono(a.id) : null
  const cliente = a.clienteClave ? await leerClientePorClave(a.clienteClave) : null
  const items = (Array.isArray(a.items) ? a.items : [])
    .map((i) => ({
      descripcion: String(i.descripcion ?? "").trim(),
      cantidad: Number(i.cantidad) || 0,
      unidad: String(i.unidad ?? "u.") || "u.",
      precio: Math.round(Number(i.precio) * 100) / 100 || 0,
      bonificacion: Math.min(100, Math.max(0, Number(i.bonificacion) || 0)),
      iva: Number(i.iva) || 5,
    }))
    .filter((i) => i.descripcion || i.precio)

  const e: string[] = []
  if (!cliente && !previo) e.push("Elegí un cliente de la agenda")
  if (!items.length) e.push("Agregá al menos un ítem")
  if (items.some((i) => !i.descripcion)) e.push("Todos los ítems necesitan descripción")
  if (items.some((i) => !(i.cantidad > 0) || !(i.precio > 0))) e.push("Cantidad y precio tienen que ser mayores a cero")
  if (e.length) throw new ErrorValidacion(e)

  const receptor = cliente ? soloReceptor(cliente) : previo!.receptor
  const ahora = new Date().toISOString()
  const abono: Abono = {
    id: previo?.id ?? crypto.randomUUID().slice(0, 8),
    nombre: String(a.nombre ?? "").trim() || `${cliente?.alias || receptor.nombre}`,
    clienteClave: cliente ? String(a.clienteClave) : previo!.clienteClave,
    receptor,
    items,
    moneda: MONEDAS.some((m) => m.id === a.moneda) ? String(a.moneda) : "PES",
    condicionVenta: CONDICIONES_VENTA.includes(String(a.condicionVenta) as never) ? String(a.condicionVenta) : "Transferencia bancaria",
    diasVencimiento: Math.min(90, Math.max(0, Math.round(Number(a.diasVencimiento ?? 10)))),
    mesFacturado: a.mesFacturado === "anterior" ? "anterior" : "actual",
    observaciones: String(a.observaciones ?? "").trim(),
    activo: a.activo ?? previo?.activo ?? true,
    creado: previo?.creado ?? ahora,
    actualizado: ahora,
    ultimoPeriodo: previo?.ultimoPeriodo,
    ultimaFactura: previo?.ultimaFactura,
  }
  await kvHset(CLAVE, abono.id, abono)
  return abono
}

export async function cambiarActivo(id: string, activo: boolean): Promise<Abono> {
  const a = await leerAbono(id)
  if (!a) throw new ErrorValidacion(["No existe ese abono"])
  const actualizado = { ...a, activo, actualizado: new Date().toISOString() }
  await kvHset(CLAVE, id, actualizado)
  return actualizado
}

export const borrarAbono = (id: string) => kvHdel(CLAVE, id)

/** Se llama al emitir la factura de un abono. */
export async function marcarFacturado(id: string, periodo: string, facturaId: string) {
  const a = await leerAbono(id)
  if (!a) return
  // Si se factura un mes anterior (atrasado) no se pisa un período más nuevo
  if (a.ultimoPeriodo && a.ultimoPeriodo > periodo) return
  await kvHset(CLAVE, id, { ...a, ultimoPeriodo: periodo, ultimaFactura: facturaId })
}

/** Datos fiscales actualizados: los de la agenda si el cliente sigue ahí. */
export async function receptorDeAbono(a: Abono): Promise<Receptor> {
  const c = await leerClientePorClave(a.clienteClave)
  return c ? soloReceptor(c) : a.receptor
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

/** "{mes}" en la descripción se reemplaza por el mes facturado, ej. "Noviembre 2026". */
export function conMes(texto: string, periodo: string): string {
  const [a, m] = periodo.split("-").map(Number)
  const nombre = MESES[m - 1] ?? ""
  return texto.replace(/\{mes\}/gi, `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${a}`)
}

/** Al crear un abono desde una factura: "Gestión RRSS Octubre 2026" → "Gestión RRSS {mes}". */
export const generalizarMes = (texto: string) =>
  texto.replace(new RegExp(String.raw`\b(${MESES.join("|")})(\s+(de\s+)?\d{4})?\b`, "gi"), "{mes}")

export const totalAbono = (a: Pick<Abono, "items">) =>
  Math.round(a.items.reduce((s, i) => s + i.cantidad * i.precio * (1 - (i.bonificacion || 0) / 100), 0) * 100) / 100
