import { estadoVencimiento, hoyAr, prioridad, sumarDias, type DatosCrm, type Tarea } from "@/lib/crm/modelo"

export type Vencimiento = "" | "vencidas" | "hoy" | "semana" | "sin"

export interface Filtros {
  q: string
  clientes: string[] // "sin" = tareas sin cliente
  responsables: string[] // "nadie" = sin asignar
  areas: string[]
  prioridades: string[]
  etiquetas: string[]
  vence: Vencimiento
  ocultarHechas: boolean
}

export const FILTROS_VACIOS: Filtros = { q: "", clientes: [], responsables: [], areas: [], prioridades: [], etiquetas: [], vence: "", ocultarHechas: false }

const CLAVES: Record<Exclude<keyof Filtros, "q" | "vence" | "ocultarHechas">, string> = {
  clientes: "c",
  responsables: "r",
  areas: "a",
  prioridades: "p",
  etiquetas: "e",
}

export function filtrosDesdeUrl(sp: URLSearchParams): Filtros {
  const lista = (k: string) => (sp.get(k) ? sp.get(k)!.split(",").filter(Boolean) : [])
  return {
    q: sp.get("q") ?? "",
    clientes: lista("c"),
    responsables: lista("r"),
    areas: lista("a"),
    prioridades: lista("p"),
    etiquetas: lista("e"),
    vence: (sp.get("v") as Vencimiento) ?? "",
    ocultarHechas: sp.get("h") === "1",
  }
}

export function filtrosAUrl(f: Filtros, sp: URLSearchParams) {
  const p = new URLSearchParams(sp)
  const poner = (k: string, v: string) => (v ? p.set(k, v) : p.delete(k))
  poner("q", f.q.trim())
  for (const [campo, k] of Object.entries(CLAVES)) poner(k, (f[campo as keyof typeof CLAVES] as string[]).join(","))
  poner("v", f.vence)
  poner("h", f.ocultarHechas ? "1" : "")
  return p
}

export const cantidadFiltros = (f: Filtros) =>
  (f.q.trim() ? 1 : 0) + f.clientes.length + f.responsables.length + f.areas.length + f.prioridades.length + f.etiquetas.length + (f.vence ? 1 : 0) + (f.ocultarHechas ? 1 : 0)

const normal = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

export function aplicarFiltros(tareas: Tarea[], f: Filtros, datos: DatosCrm, clienteFijo?: string): Tarea[] {
  const hoy = hoyAr()
  const finSemana = sumarDias(hoy, 7)
  const hechas = new Set(datos.tablero.columnas.filter((c) => c.hecho).map((c) => c.id))
  const nombreCliente = new Map(datos.clientes.map((c) => [c.id, c.nombre]))
  const q = normal(f.q.trim())

  return tareas.filter((t) => {
    if (clienteFijo && t.clienteId !== clienteFijo) return false
    if (f.clientes.length && !f.clientes.includes(t.clienteId ?? "sin")) return false
    if (f.responsables.length && !(t.responsables.length ? t.responsables.some((r) => f.responsables.includes(r)) : f.responsables.includes("nadie"))) return false
    if (f.areas.length && !f.areas.includes(t.area)) return false
    if (f.prioridades.length && !f.prioridades.includes(t.prioridad)) return false
    if (f.etiquetas.length && !t.etiquetas.some((e) => f.etiquetas.includes(e))) return false
    if (f.ocultarHechas && hechas.has(t.columnaId)) return false
    if (f.vence) {
      const ev = estadoVencimiento(t, hoy)
      if (f.vence === "vencidas" && ev !== "vencida") return false
      if (f.vence === "hoy" && t.vence !== hoy) return false
      if (f.vence === "semana" && !(t.vence && !t.completada && t.vence <= finSemana)) return false
      if (f.vence === "sin" && t.vence) return false
    }
    if (q) {
      const texto = normal(
        [t.titulo, t.descripcion, nombreCliente.get(t.clienteId ?? "") ?? "", ...t.checklist.map((i) => i.texto), ...t.comentarios.map((c) => c.texto)].join(" "),
      )
      if (!q.split(/\s+/).every((p) => texto.includes(p))) return false
    }
    return true
  })
}

/** Orden para la vista de lista: vencidas primero, después por fecha y prioridad. */
export function ordenLista(a: Tarea, b: Tarea) {
  if (!!a.completada !== !!b.completada) return a.completada ? 1 : -1
  const va = a.vence ?? "9999"
  const vb = b.vence ?? "9999"
  if (va !== vb) return va.localeCompare(vb)
  return (prioridad(a.prioridad)?.peso ?? 9) - (prioridad(b.prioridad)?.peso ?? 9)
}
