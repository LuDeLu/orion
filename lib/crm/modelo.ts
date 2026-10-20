/**
 * Modelo del CRM: clientes, tablero (columnas y etiquetas) y tareas estilo Trello.
 * Se usa en servidor y navegador: nada de imports de Node acá.
 */

export const RESPONSABLES = [
  { id: "lucas", nombre: "Lucas Baez", iniciales: "LB", color: "#e0642f", area: "software" },
  { id: "davi", nombre: "Davi Cabella", iniciales: "DC", color: "#dbac34", area: "marketing" },
  { id: "nicolas", nombre: "Nicolás Mazzotti", iniciales: "NM", color: "#38bdf8", area: "it" },
] as const

export const AREAS = [
  { id: "marketing", nombre: "Marketing", color: "#f472b6" },
  { id: "software", nombre: "Software", color: "#a78bfa" },
  { id: "it", nombre: "IT", color: "#38bdf8" },
  { id: "general", nombre: "General", color: "#94a3b8" },
] as const

export const PRIORIDADES = [
  { id: "urgente", nombre: "Urgente", color: "#fb7185", peso: 0 },
  { id: "alta", nombre: "Alta", color: "#fb923c", peso: 1 },
  { id: "media", nombre: "Media", color: "#facc15", peso: 2 },
  { id: "baja", nombre: "Baja", color: "#94a3b8", peso: 3 },
] as const

export const ESTADOS_CLIENTE = [
  { id: "prospecto", nombre: "Prospecto", color: "#38bdf8" },
  { id: "activo", nombre: "Activo", color: "#34d399" },
  { id: "pausado", nombre: "Pausado", color: "#facc15" },
  { id: "finalizado", nombre: "Finalizado", color: "#94a3b8" },
] as const

/** Paleta para clientes, columnas y etiquetas. */
export const COLORES = ["#e0642f", "#dbac34", "#34d399", "#38bdf8", "#a78bfa", "#f472b6", "#fb7185", "#facc15", "#2dd4bf", "#94a3b8"]

export type IdResponsable = (typeof RESPONSABLES)[number]["id"]
export type IdArea = (typeof AREAS)[number]["id"]
export type IdPrioridad = (typeof PRIORIDADES)[number]["id"]
export type IdEstadoCliente = (typeof ESTADOS_CLIENTE)[number]["id"]

export interface Cliente {
  id: string
  nombre: string
  contacto: string
  cuit: string
  email: string
  telefono: string
  web: string
  rubro: string
  estado: IdEstadoCliente
  color: string
  areas: IdArea[]
  responsable: IdResponsable | ""
  notas: string
  creado: string
  actualizado: string
}

export interface Columna {
  id: string
  nombre: string
  color: string
  /** Las tareas en esta columna cuentan como terminadas */
  hecho: boolean
}

export interface Etiqueta {
  id: string
  nombre: string
  color: string
}

export interface Tablero {
  columnas: Columna[]
  etiquetas: Etiqueta[]
}

export interface ItemChecklist {
  id: string
  texto: string
  hecho: boolean
}

export interface Comentario {
  id: string
  texto: string
  autor: string
  fecha: string
}

export interface Tarea {
  id: string
  titulo: string
  descripcion: string
  clienteId: string | null
  columnaId: string
  orden: number
  responsables: IdResponsable[]
  area: IdArea
  prioridad: IdPrioridad
  vence: string | null // YYYY-MM-DD
  etiquetas: string[]
  checklist: ItemChecklist[]
  comentarios: Comentario[]
  creado: string
  actualizado: string
  completada: string | null
}

export interface DatosCrm {
  tablero: Tablero
  clientes: Cliente[]
  tareas: Tarea[]
}

export const TABLERO_INICIAL: Tablero = {
  columnas: [
    { id: "ideas", nombre: "Ideas y pendientes", color: "#94a3b8", hecho: false },
    { id: "por-hacer", nombre: "Por hacer", color: "#38bdf8", hecho: false },
    { id: "en-curso", nombre: "En curso", color: "#e0642f", hecho: false },
    { id: "revision", nombre: "En revisión", color: "#a78bfa", hecho: false },
    { id: "hecho", nombre: "Hecho", color: "#34d399", hecho: true },
  ],
  etiquetas: [
    { id: "reunion", nombre: "Reunión", color: "#38bdf8" },
    { id: "diseno", nombre: "Diseño", color: "#f472b6" },
    { id: "desarrollo", nombre: "Desarrollo", color: "#a78bfa" },
    { id: "contenido", nombre: "Contenido", color: "#dbac34" },
    { id: "publicidad", nombre: "Publicidad", color: "#e0642f" },
    { id: "soporte", nombre: "Soporte", color: "#2dd4bf" },
    { id: "facturacion", nombre: "Facturación", color: "#34d399" },
    { id: "esperando", nombre: "Esperando al cliente", color: "#facc15" },
  ],
}

export const responsable = (id: string) => RESPONSABLES.find((r) => r.id === id)
export const area = (id: string) => AREAS.find((a) => a.id === id)
export const prioridad = (id: string) => PRIORIDADES.find((p) => p.id === id)
export const estadoCliente = (id: string) => ESTADOS_CLIENTE.find((e) => e.id === id)

export const nuevoId = () => Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4)

export const inicialesDe = (nombre: string) =>
  nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "?"

/** Fecha de hoy en Argentina, YYYY-MM-DD. */
export const hoyAr = () => new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10)

export const sumarDias = (iso: string, n: number) => new Date(new Date(`${iso}T12:00:00Z`).getTime() + n * 864e5).toISOString().slice(0, 10)

export type EstadoVencimiento = "vencida" | "hoy" | "pronto" | "futura" | null

export function estadoVencimiento(t: Pick<Tarea, "vence" | "completada">, hoy = hoyAr()): EstadoVencimiento {
  if (!t.vence || t.completada) return null
  if (t.vence < hoy) return "vencida"
  if (t.vence === hoy) return "hoy"
  if (t.vence <= sumarDias(hoy, 3)) return "pronto"
  return "futura"
}

export function fechaCorta(iso: string) {
  const [a, m, d] = iso.split("-").map(Number)
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
  const anio = a !== Number(hoyAr().slice(0, 4)) ? ` ${a}` : ""
  return `${d} ${meses[m - 1]}${anio}`
}
