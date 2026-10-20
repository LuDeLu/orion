/**
 * Cliente de la API de Mintaka (el sistema de gestión del área IT).
 *
 * Todo lo que vive acá corre EN EL SERVIDOR de Next, nunca en el navegador:
 * el visitante habla con orionmkt.com.ar y Next habla con la API. Así no hay
 * CORS que resolver, la URL de la API no queda expuesta en el bundle y el
 * portal sigue andando aunque la API esté en una red que no es pública.
 *
 * Las rutas de `/api/portal/*` no piden sesión: se identifican por token.
 */

/**
 * Base de la API. En producción se setea en Vercel (SquareCloud, VPS, lo que sea).
 * Sin prefijo NEXT_PUBLIC_ a propósito: así Next falla el build si alguien
 * importa este módulo desde un componente cliente por error.
 */
export const MINTAKA_API_URL = (
  process.env.MINTAKA_API_URL ?? "http://localhost:4000"
).replace(/\/+$/, "")

/** Base pública del portal, para armar links entre pantallas. */
export const PORTAL_BASE = "/it"

/** Error con el mensaje que ya viene redactado desde el backend. */
export class MintakaError extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    mensaje: string,
  ) {
    super(mensaje)
    this.name = "MintakaError"
  }

  /** 404 y 401 son "el token no sirve", no una caída del sistema. */
  get esTokenInvalido() {
    return this.status === 404 || this.status === 401
  }
}

interface Opciones {
  metodo?: "GET" | "POST"
  cuerpo?: unknown
  /** IP real del visitante, para que el rate-limit y la auditoría no vean solo a Vercel. */
  ip?: string | null
  /** Corta la espera: si la API no está prendida, no dejamos colgado al visitante. */
  timeoutMs?: number
}

/**
 * Pega a la API y devuelve el JSON tipado.
 * Traduce cualquier fallo a un MintakaError con mensaje mostrable.
 */
export async function mintaka<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  const { metodo = "GET", cuerpo, ip, timeoutMs = 8000 } = opciones
  const url = `${MINTAKA_API_URL}/api/portal${ruta.startsWith("/") ? ruta : `/${ruta}`}`

  const control = new AbortController()
  const corte = setTimeout(() => control.abort(), timeoutMs)

  let res: Response
  try {
    res = await fetch(url, {
      method: metodo,
      headers: {
        ...(cuerpo !== undefined ? { "content-type": "application/json" } : {}),
        // El backend corre con trustProxy, así que toma esta IP como req.ip.
        ...(ip ? { "x-forwarded-for": ip } : {}),
      },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
      signal: control.signal,
      // Un seguimiento cacheado sería un seguimiento equivocado.
      cache: "no-store",
    })
  } catch (err) {
    const abortado = (err as Error).name === "AbortError"
    throw new MintakaError(
      0,
      abortado ? "TIMEOUT" : "SIN_CONEXION",
      "No pudimos conectarnos con el sistema. Probá de nuevo en un rato o escribinos.",
    )
  } finally {
    clearTimeout(corte)
  }

  const texto = await res.text()
  let datos: unknown = null
  if (texto) {
    try {
      datos = JSON.parse(texto)
    } catch {
      datos = null
    }
  }

  if (!res.ok) {
    const cuerpoError = (datos ?? {}) as { error?: string; mensaje?: string }
    throw new MintakaError(
      res.status,
      cuerpoError.error ?? "ERROR",
      cuerpoError.mensaje ?? "No pudimos completar la operación.",
    )
  }

  return datos as T
}

// ============================================================================
// Tipos — espejo de lo que devuelve src/modules/portal.ts
// ============================================================================

export type EstadoOrden =
  | "INGRESADO"
  | "EN_DIAGNOSTICO"
  | "PRESUPUESTADO"
  | "APROBADO"
  | "EN_REPARACION"
  | "ESPERANDO_REPUESTO"
  | "CONTROL_CALIDAD"
  | "LISTO"
  | "ENTREGADO"
  | "SIN_REPARACION"
  | "ABANDONADO"
  | "GARANTIA"

export interface Seguimiento {
  numero: string
  cliente: string
  equipo: string
  tipoEquipo: string
  falla: string
  estado: EstadoOrden
  estadoTexto: string
  pasos: { estado: string; texto: string; alcanzado: boolean }[]
  esGarantia: boolean
  tecnico: string | null
  fechaIngreso: string
  fechaPrometida: string | null
  fechaListo: string | null
  fechaEntrega: string | null
  garantiaHasta: string | null
  total: number | null
  linea: { estado: string; texto: string; fecha: string }[]
}

export interface PresupuestoItem {
  id: number
  descripcion: string
  cantidad: number
  unidad: string
  precioUnit: number
  descuentoPct: number
  opcional: boolean
  aceptado: boolean
  subtotal: number
}

export interface PresupuestoSeccion {
  id: number
  tipo: "MATERIALES" | "MANO_DE_OBRA" | "SERVICIO_MENSUAL" | "OTROS"
  titulo: string
  alternativa: string | null
  subtotal: number
  items: PresupuestoItem[]
}

export interface PresupuestoPortal {
  numero: string
  titulo: string
  descripcion: string | null
  estado: "BORRADOR" | "ENVIADO" | "EN_NEGOCIACION" | "APROBADO" | "RECHAZADO" | "VENCIDO"
  fecha: string
  venceEn: string
  vencido: boolean
  /** El backend ya decidió si todavía se puede aprobar o rechazar. */
  decidible: boolean
  firmado: boolean
  cliente: { nombre: string; razonSocial: string | null; email: string | null; telefono: string | null }
  vendedor: { nombre: string; email: string | null; telefono: string | null }
  textoLegal: string | null
  subtotal: number
  descuento: number
  impuestos: number
  total: number
  secciones: PresupuestoSeccion[]
}

export interface MotivoRechazo {
  id: number
  nombre: string
}

export interface PanelCliente {
  cliente: {
    nombre: string
    razonSocial: string | null
    email: string | null
    telefono: string | null
    saldo: number
  }
  ordenes: {
    id: number
    numero: string
    tipoEquipo: string
    marca: string | null
    modelo: string | null
    estado: EstadoOrden
    fechaIngreso: string
    fechaPrometida: string | null
    fechaEntrega: string | null
    garantiaHasta: string | null
    presupuestoMonto: number
    qrToken: string | null
  }[]
  tickets: {
    id: number
    numero: string
    asunto: string
    estado: string
    prioridad: "BAJA" | "MEDIA" | "ALTA" | "CRITICA"
    createdAt: string
    resueltoEn: string | null
    categoria: string | null
  }[]
  visitas: {
    id: number
    numero: string
    titulo: string
    tipo: string
    estado: string
    fechaInicio: string
    direccion: string | null
  }[]
  activos: {
    id: number
    codigo: string
    nombre: string
    tipo: string
    marca: string | null
    modelo: string | null
    serie: string | null
    estado: string
    garantiaHasta: string | null
    ubicacionFisica: string | null
  }[]
  comprobantes: {
    id: number
    numero: string
    tipo: string
    puntoVenta: number
    estado: string
    fecha: string
    vencimiento: string | null
    total: number
    pagado: number
    cae: string | null
  }[]
  presupuestos: {
    id: number
    numero: string
    titulo: string
    estado: string
    total: number
    fecha: string
    venceEn: string
    tokenPortal: string | null
  }[]
  contratos: {
    id: number
    numero: string
    nombre: string
    tipo: string
    estado: string
    precio: number
    vigenciaHasta: string | null
    servicios: { descripcion: string; incluido: boolean }[]
    horas: { compradas: number; consumidas: number; restantes: number; vigenciaHasta: string | null }[]
  }[]
}

// ============================================================================
// Lecturas que usan las páginas (server components)
// ============================================================================

export const getSeguimiento = (token: string, ip?: string | null) =>
  mintaka<Seguimiento>(`/seguimiento/${encodeURIComponent(token)}`, { ip })

export const getPresupuesto = (token: string, ip?: string | null) =>
  mintaka<PresupuestoPortal>(`/presupuesto/${encodeURIComponent(token)}`, { ip })

export const getPanelCliente = (token: string, ip?: string | null) =>
  mintaka<PanelCliente>(`/acceso/${encodeURIComponent(token)}`, { ip })

export const getMotivosRechazo = (ip?: string | null) =>
  mintaka<MotivoRechazo[]>("/motivos-rechazo", { ip })
