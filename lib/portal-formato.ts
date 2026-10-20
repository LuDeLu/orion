/**
 * Formato y etiquetas del portal del cliente.
 *
 * A diferencia de `lib/mintaka.ts`, esto lo pueden importar los componentes
 * cliente: son funciones puras, sin acceso a la API.
 *
 * Los textos son los que ve el cliente final, así que hablan en criollo y
 * nunca nombran estados internos del sistema.
 */

const monedaAR = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
})

const numeroAR = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 })

export const plata = (v: unknown) => monedaAR.format(Number(v ?? 0))
export const numero = (v: unknown) => numeroAR.format(Number(v ?? 0))

/** Fechas siempre en hora de Argentina: el cliente puede estar en cualquier lado. */
const ZONA = "America/Argentina/Buenos_Aires"

export function fecha(v: unknown): string {
  if (!v) return "—"
  const d = new Date(String(v))
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: ZONA,
  })
}

export function fechaHora(v: unknown): string {
  if (!v) return "—"
  const d = new Date(String(v))
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: ZONA,
  })
}

export function fechaLarga(v: unknown): string {
  if (!v) return "—"
  const d = new Date(String(v))
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: ZONA,
  })
}

/** Días entre hoy y una fecha. Negativo = ya pasó. */
export function diasHasta(v: unknown): number {
  if (!v) return 0
  const d = new Date(String(v))
  if (Number.isNaN(d.getTime())) return 0
  const dia = 86_400_000
  return Math.round((d.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / dia)
}

/** "hace 3 días" / "en 2 horas", sin traer una librería entera. */
export function relativo(v: unknown): string {
  if (!v) return "—"
  const d = new Date(String(v))
  if (Number.isNaN(d.getTime())) return "—"

  const rtf = new Intl.RelativeTimeFormat("es-AR", { numeric: "auto" })
  const segundos = (d.getTime() - Date.now()) / 1000
  const tramos: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["day", 86_400],
    ["hour", 3600],
    ["minute", 60],
  ]

  for (const [unidad, seg] of tramos) {
    if (Math.abs(segundos) >= seg) return rtf.format(Math.round(segundos / seg), unidad)
  }
  return "recién"
}

/** ESPERANDO_REPUESTO → Esperando repuesto. */
export function humanizar(valor?: string | null): string {
  if (!valor) return "—"
  const t = valor.replace(/_/g, " ").toLowerCase()
  return t.charAt(0).toUpperCase() + t.slice(1)
}

// ---------------------------------------------------------------------------
// Semántica de color: verde = terminado, ámbar = esperando algo, rojo = mal.
// ---------------------------------------------------------------------------

export type Tono = "neutro" | "activo" | "espera" | "ok" | "mal"

export const COLOR_TONO: Record<Tono, { fg: string; bg: string; borde: string }> = {
  neutro: { fg: "var(--foreground-muted)", bg: "var(--tint-2)", borde: "var(--hairline)" },
  activo: { fg: "var(--area-it)", bg: "rgba(var(--area-it-rgb),0.14)", borde: "rgba(var(--area-it-rgb),0.32)" },
  espera: { fg: "var(--brand-gold)", bg: "var(--brand-gold-dim)", borde: "rgba(219,172,52,0.32)" },
  ok: { fg: "#2f9e6b", bg: "rgba(47,158,107,0.14)", borde: "rgba(47,158,107,0.32)" },
  mal: { fg: "var(--destructive)", bg: "rgba(224,82,82,0.14)", borde: "rgba(224,82,82,0.32)" },
}

export const TONO_ORDEN: Record<string, Tono> = {
  INGRESADO: "neutro",
  EN_DIAGNOSTICO: "activo",
  PRESUPUESTADO: "espera",
  APROBADO: "activo",
  EN_REPARACION: "activo",
  ESPERANDO_REPUESTO: "espera",
  CONTROL_CALIDAD: "activo",
  LISTO: "ok",
  ENTREGADO: "neutro",
  SIN_REPARACION: "mal",
  ABANDONADO: "mal",
  GARANTIA: "espera",
}

/** Los mismos textos que usa el backend, para las pantallas que arman la etiqueta acá. */
export const TEXTO_ORDEN: Record<string, string> = {
  INGRESADO: "Recibimos tu equipo",
  EN_DIAGNOSTICO: "Lo estamos revisando",
  PRESUPUESTADO: "Te pasamos el presupuesto",
  APROBADO: "Presupuesto aprobado",
  EN_REPARACION: "En reparación",
  ESPERANDO_REPUESTO: "Esperando un repuesto",
  CONTROL_CALIDAD: "Control de calidad",
  LISTO: "¡Listo para retirar!",
  ENTREGADO: "Entregado",
  SIN_REPARACION: "Sin reparación",
  ABANDONADO: "Pendiente de retiro",
  GARANTIA: "Reingreso por garantía",
}

export const TONO_TICKET: Record<string, Tono> = {
  NUEVO: "activo",
  ASIGNADO: "activo",
  EN_CURSO: "activo",
  PENDIENTE_CLIENTE: "espera",
  PENDIENTE_TERCERO: "espera",
  RESUELTO: "ok",
  CERRADO: "neutro",
  CANCELADO: "neutro",
}

export const TEXTO_TICKET: Record<string, string> = {
  NUEVO: "Recibido",
  ASIGNADO: "Asignado a un técnico",
  EN_CURSO: "En curso",
  PENDIENTE_CLIENTE: "Esperamos tu respuesta",
  PENDIENTE_TERCERO: "Esperando a un tercero",
  RESUELTO: "Resuelto",
  CERRADO: "Cerrado",
  CANCELADO: "Cancelado",
}

export const TONO_PRESUPUESTO: Record<string, Tono> = {
  BORRADOR: "neutro",
  ENVIADO: "activo",
  EN_NEGOCIACION: "espera",
  APROBADO: "ok",
  RECHAZADO: "mal",
  VENCIDO: "neutro",
}

export const TEXTO_PRESUPUESTO: Record<string, string> = {
  BORRADOR: "En preparación",
  ENVIADO: "Esperando tu respuesta",
  EN_NEGOCIACION: "En conversación",
  APROBADO: "Aprobado",
  RECHAZADO: "Rechazado",
  VENCIDO: "Vencido",
}

export const TONO_COMPROBANTE: Record<string, Tono> = {
  BORRADOR: "neutro",
  EMITIDO: "espera",
  PARCIAL: "espera",
  PAGADO: "ok",
  VENCIDO: "mal",
  ANULADO: "neutro",
}

export const TEXTO_COMPROBANTE: Record<string, string> = {
  BORRADOR: "Borrador",
  EMITIDO: "Pendiente de pago",
  PARCIAL: "Pago parcial",
  PAGADO: "Pagado",
  VENCIDO: "Vencido",
  ANULADO: "Anulado",
}

export const TEXTO_TIPO_COMPROBANTE: Record<string, string> = {
  FACTURA_A: "Factura A",
  FACTURA_B: "Factura B",
  FACTURA_C: "Factura C",
  NOTA_CREDITO_A: "Nota de crédito A",
  NOTA_CREDITO_B: "Nota de crédito B",
  NOTA_CREDITO_C: "Nota de crédito C",
  REMITO: "Remito",
  RECIBO: "Recibo",
  PRESUPUESTO: "Presupuesto",
  ORDEN_TRABAJO: "Orden de trabajo",
  CERTIFICADO_AVANCE: "Certificado de avance",
}

export const TONO_VISITA: Record<string, Tono> = {
  PROGRAMADA: "activo",
  CONFIRMADA: "activo",
  EN_CAMINO: "activo",
  EN_CURSO: "activo",
  FINALIZADA: "ok",
  REPROGRAMADA: "espera",
  CANCELADA: "mal",
}

export const TONO_ACTIVO: Record<string, Tono> = {
  OPERATIVO: "ok",
  EN_REPARACION: "espera",
  EN_GARANTIA: "activo",
  DE_BAJA: "neutro",
  REEMPLAZADO: "neutro",
}

export const TEXTO_PRIORIDAD: Record<string, string> = {
  BAJA: "Baja",
  MEDIA: "Media",
  ALTA: "Alta",
  CRITICA: "Crítica",
}

export const TONO_PRIORIDAD: Record<string, Tono> = {
  BAJA: "neutro",
  MEDIA: "activo",
  ALTA: "espera",
  CRITICA: "mal",
}

/** Tipos de equipo que maneja el sistema, en castellano. */
export const TEXTO_EQUIPO: Record<string, string> = {
  PC: "PC",
  NOTEBOOK: "Notebook",
  CELULAR: "Celular",
  TABLET: "Tablet",
  CONSOLA: "Consola",
  IMPRESORA: "Impresora",
  MONITOR: "Monitor",
  SERVIDOR: "Servidor",
  ROUTER: "Router",
  SWITCH: "Switch",
  ACCESS_POINT: "Access point",
  CAMARA: "Cámara",
  DVR_NVR: "DVR / NVR",
  UPS: "UPS",
  AIRE_ACONDICIONADO: "Aire acondicionado",
  CARTEL: "Cartel",
  OTRO: "Equipo",
}

/** WhatsApp del área de IT, para el pie de todas las pantallas del portal. */
export const WHATSAPP_IT = "5491156566083"

export function linkWhatsApp(mensaje: string): string {
  return `https://wa.me/${WHATSAPP_IT}?text=${encodeURIComponent(mensaje)}`
}
