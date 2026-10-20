/**
 * Catálogos de ARCA y tipos del módulo de facturación.
 * Se usa tanto en el servidor como en el navegador: nada de imports de Node acá.
 *
 * Códigos según el Manual del Desarrollador WSFEv1 (RG 4291, v4.8) y las tablas
 * de parámetros (FEParamGetTiposCbte, FEParamGetCondicionIvaReceptor, etc.).
 */

export type CondicionEmisor = "monotributo" | "responsable_inscripto" | "exento"
export type Letra = "A" | "B" | "C" | "M"
export type ClaseCbte = "factura" | "nd" | "nc" | "recibo"

export interface TipoComprobante {
  codigo: number
  nombre: string
  letra: Letra
  clase: ClaseCbte
  /** Factura de Crédito Electrónica MiPyME (RG 4367) */
  fce: boolean
}

export const COMPROBANTES: TipoComprobante[] = [
  { codigo: 1, nombre: "Factura A", letra: "A", clase: "factura", fce: false },
  { codigo: 2, nombre: "Nota de Débito A", letra: "A", clase: "nd", fce: false },
  { codigo: 3, nombre: "Nota de Crédito A", letra: "A", clase: "nc", fce: false },
  { codigo: 4, nombre: "Recibo A", letra: "A", clase: "recibo", fce: false },
  { codigo: 6, nombre: "Factura B", letra: "B", clase: "factura", fce: false },
  { codigo: 7, nombre: "Nota de Débito B", letra: "B", clase: "nd", fce: false },
  { codigo: 8, nombre: "Nota de Crédito B", letra: "B", clase: "nc", fce: false },
  { codigo: 9, nombre: "Recibo B", letra: "B", clase: "recibo", fce: false },
  { codigo: 11, nombre: "Factura C", letra: "C", clase: "factura", fce: false },
  { codigo: 12, nombre: "Nota de Débito C", letra: "C", clase: "nd", fce: false },
  { codigo: 13, nombre: "Nota de Crédito C", letra: "C", clase: "nc", fce: false },
  { codigo: 15, nombre: "Recibo C", letra: "C", clase: "recibo", fce: false },
  { codigo: 51, nombre: "Factura M", letra: "M", clase: "factura", fce: false },
  { codigo: 52, nombre: "Nota de Débito M", letra: "M", clase: "nd", fce: false },
  { codigo: 53, nombre: "Nota de Crédito M", letra: "M", clase: "nc", fce: false },
  { codigo: 201, nombre: "Factura de Crédito Electrónica MiPyME A", letra: "A", clase: "factura", fce: true },
  { codigo: 202, nombre: "Nota de Débito Electrónica MiPyME A", letra: "A", clase: "nd", fce: true },
  { codigo: 203, nombre: "Nota de Crédito Electrónica MiPyME A", letra: "A", clase: "nc", fce: true },
  { codigo: 206, nombre: "Factura de Crédito Electrónica MiPyME B", letra: "B", clase: "factura", fce: true },
  { codigo: 207, nombre: "Nota de Débito Electrónica MiPyME B", letra: "B", clase: "nd", fce: true },
  { codigo: 208, nombre: "Nota de Crédito Electrónica MiPyME B", letra: "B", clase: "nc", fce: true },
  { codigo: 211, nombre: "Factura de Crédito Electrónica MiPyME C", letra: "C", clase: "factura", fce: true },
  { codigo: 212, nombre: "Nota de Débito Electrónica MiPyME C", letra: "C", clase: "nd", fce: true },
  { codigo: 213, nombre: "Nota de Crédito Electrónica MiPyME C", letra: "C", clase: "nc", fce: true },
]

export const tipoCbte = (codigo: number) => COMPROBANTES.find((c) => c.codigo === codigo)

/** Letras que puede emitir cada condición del emisor. */
export function letrasEmisor(cond: CondicionEmisor): Letra[] {
  return cond === "responsable_inscripto" ? ["A", "B", "M"] : ["C"]
}

export const discriminaIva = (letra: Letra) => letra === "A" || letra === "B" || letra === "M"

// ── Receptor ─────────────────────────────────────────────────────────────────

/** Condición frente al IVA del receptor (RG 5616, obligatoria desde WSFEv1 v4.8). */
export const CONDICIONES_IVA: { id: number; nombre: string; letras: Letra[] }[] = [
  { id: 1, nombre: "IVA Responsable Inscripto", letras: ["A", "M", "C"] },
  { id: 6, nombre: "Responsable Monotributo", letras: ["A", "M", "C"] },
  { id: 13, nombre: "Monotributista Social", letras: ["A", "M", "C"] },
  { id: 16, nombre: "Monotributo Trabajador Independiente Promovido", letras: ["A", "M", "C"] },
  { id: 5, nombre: "Consumidor Final", letras: ["B", "C"] },
  { id: 4, nombre: "IVA Sujeto Exento", letras: ["B", "C"] },
  { id: 7, nombre: "Sujeto No Categorizado", letras: ["B", "C"] },
  { id: 15, nombre: "IVA No Alcanzado", letras: ["B", "C"] },
  { id: 10, nombre: "IVA Liberado – Ley N° 19.640", letras: ["B", "C"] },
  { id: 8, nombre: "Proveedor del Exterior", letras: ["B", "C"] },
  { id: 9, nombre: "Cliente del Exterior", letras: ["B", "C"] },
]

export const condicionIva = (id: number) => CONDICIONES_IVA.find((c) => c.id === id)

/** Para un Responsable Inscripto: A si el receptor es RI o monotributista, B en el resto. */
export function letraSugerida(emisor: CondicionEmisor, condReceptor: number): Letra {
  if (emisor !== "responsable_inscripto") return "C"
  return [1, 6, 13, 16].includes(condReceptor) ? "A" : "B"
}

export const TIPOS_DOC = [
  { id: 80, nombre: "CUIT" },
  { id: 86, nombre: "CUIL" },
  { id: 96, nombre: "DNI" },
  { id: 94, nombre: "Pasaporte" },
  { id: 99, nombre: "Sin identificar" },
] as const

export const tipoDoc = (id: number) => TIPOS_DOC.find((d) => d.id === id)?.nombre ?? "Doc."

// ── Importes ─────────────────────────────────────────────────────────────────

/** Alícuotas de IVA. Los ids negativos son internos: no van al array Iva de ARCA. */
export const ALICUOTAS = [
  { id: 5, nombre: "21%", tasa: 0.21 },
  { id: 4, nombre: "10,5%", tasa: 0.105 },
  { id: 6, nombre: "27%", tasa: 0.27 },
  { id: 8, nombre: "5%", tasa: 0.05 },
  { id: 9, nombre: "2,5%", tasa: 0.025 },
  { id: 3, nombre: "0%", tasa: 0 },
  { id: -1, nombre: "Exento", tasa: 0 },
  { id: -2, nombre: "No gravado", tasa: 0 },
] as const

export const alicuota = (id: number) => ALICUOTAS.find((a) => a.id === id)

export const CONCEPTOS = [
  { id: 2, nombre: "Servicios" },
  { id: 1, nombre: "Productos" },
  { id: 3, nombre: "Productos y servicios" },
] as const

export const MONEDAS = [
  { id: "PES", nombre: "Pesos", simbolo: "$" },
  { id: "DOL", nombre: "Dólares", simbolo: "US$" },
  { id: "060", nombre: "Euros", simbolo: "€" },
] as const

export const CONDICIONES_VENTA = [
  "Contado",
  "Transferencia bancaria",
  "Cuenta corriente",
  "Tarjeta de débito",
  "Tarjeta de crédito",
  "Mercado Pago",
  "Cheque",
  "Otra",
]

// ── Documentos ───────────────────────────────────────────────────────────────

export interface Item {
  descripcion: string
  cantidad: number
  unidad: string
  precio: number
  /** Bonificación en porcentaje (0 a 100) */
  bonificacion: number
  /** Id de alícuota (ver ALICUOTAS). Ignorado en comprobantes C. */
  iva: number
}

export interface Receptor {
  docTipo: number
  docNro: string
  nombre: string
  condicionIva: number
  domicilio: string
  email: string
}

export interface ComprobanteAsociado {
  tipo: number
  puntoVenta: number
  numero: number
  fecha: string // YYYY-MM-DD
}

export interface Totales {
  /** Base gravada (incluye alícuota 0%) */
  neto: number
  exento: number
  noGravado: number
  ivas: { id: number; base: number; importe: number }[]
  iva: number
  total: number
}

export type EstadoFactura = "emitido" | "rechazado" | "pendiente"
export type EstadoPresupuesto = "vigente" | "aceptado" | "rechazado" | "facturado"

/** Lo que se carga en el formulario. Base común de factura y presupuesto. */
export interface DatosComprobante {
  tipo: number // 0 = presupuesto
  fecha: string // YYYY-MM-DD
  concepto: number
  servicioDesde?: string
  servicioHasta?: string
  vencimientoPago?: string
  receptor: Receptor
  items: Item[]
  preciosConIva: boolean
  moneda: string
  cotizacion: number
  condicionVenta: string
  observaciones: string
  asociado?: ComprobanteAsociado
  /** Solo FCE: si es NC/ND de anulación (opcional 22) */
  anulacion?: boolean
  /** Presupuesto: días de validez */
  validezDias?: number
}

export interface Documento extends DatosComprobante {
  id: string
  clase: "factura" | "presupuesto"
  estado: EstadoFactura | EstadoPresupuesto
  creado: string
  entorno?: "homologacion" | "produccion"
  puntoVenta: number
  numero: number
  totales: Totales
  cae?: string
  caeVencimiento?: string // YYYY-MM-DD
  mensajesArca?: string[]
  /** Presupuesto → factura que lo cerró / factura → presupuesto de origen */
  vinculo?: string
}

// ── Formato ──────────────────────────────────────────────────────────────────

export const soloDigitos = (s: string) => (s ?? "").replace(/\D/g, "")

export function cuitValido(cuit: string): boolean {
  const d = soloDigitos(cuit)
  if (d.length !== 11) return false
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  const suma = pesos.reduce((s, p, i) => s + p * Number(d[i]), 0)
  let dv = 11 - (suma % 11)
  if (dv === 11) dv = 0
  if (dv === 10) dv = 9
  return dv === Number(d[10])
}

export const formatoCuit = (c: string) => {
  const d = soloDigitos(c)
  return d.length === 11 ? `${d.slice(0, 2)}-${d.slice(2, 10)}-${d.slice(10)}` : c
}

export const numeroCbte = (pv: number, n: number) =>
  `${String(pv).padStart(5, "0")}-${String(n).padStart(8, "0")}`

export function dinero(n: number, moneda = "PES") {
  const simbolo = MONEDAS.find((m) => m.id === moneda)?.simbolo ?? "$"
  return `${simbolo} ${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const fechaAr = (iso?: string) => (iso ? iso.slice(0, 10).split("-").reverse().join("/") : "")

/** Fecha de hoy en Argentina (UTC-3), formato YYYY-MM-DD. */
export const hoyAr = () => new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10)

export function nombreDocumento(d: Pick<Documento, "clase" | "tipo">) {
  return d.clase === "presupuesto" ? "Presupuesto" : (tipoCbte(d.tipo)?.nombre ?? `Comprobante ${d.tipo}`)
}
