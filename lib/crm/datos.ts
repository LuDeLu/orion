/**
 * Persistencia del CRM en Redis:
 *   crm:tablero   JSON con columnas y etiquetas
 *   crm:clientes  hash id → cliente
 *   crm:tareas    hash id → tarea
 * Cada tarea y cliente es un campo propio: dos personas editando tarjetas
 * distintas al mismo tiempo no se pisan.
 */
import { ErrorValidacion } from "@/lib/admin-api"
import { kvGet, kvHdel, kvHget, kvHgetAll, kvHset, kvSet } from "@/lib/kv"
import {
  AREAS,
  COLORES,
  ESTADOS_CLIENTE,
  nuevoId,
  PRIORIDADES,
  RESPONSABLES,
  TABLERO_INICIAL,
  type Cliente,
  type Comentario,
  type DatosCrm,
  type Tablero,
  type Tarea,
} from "./modelo"

const K_TABLERO = "crm:tablero"
const K_CLIENTES = "crm:clientes"
const K_TAREAS = "crm:tareas"

const texto = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max)
const fecha = (v: unknown) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null)
const ahora = () => new Date().toISOString()

export async function leerTablero(): Promise<Tablero> {
  return (await kvGet<Tablero>(K_TABLERO)) ?? TABLERO_INICIAL
}

export async function leerTodo(): Promise<DatosCrm> {
  const [tablero, clientes, tareas] = await Promise.all([leerTablero(), kvHgetAll<Cliente>(K_CLIENTES), kvHgetAll<Tarea>(K_TAREAS)])
  return {
    tablero,
    clientes: Object.values(clientes).sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    tareas: Object.values(tareas).sort((a, b) => a.orden - b.orden),
  }
}

// ── Tablero ──────────────────────────────────────────────────────────────────

export async function guardarTablero(t: Tablero): Promise<Tablero> {
  const columnas = (t.columnas ?? [])
    .map((c) => ({ id: texto(c.id, 40) || nuevoId(), nombre: texto(c.nombre, 60) || "Sin nombre", color: texto(c.color, 9) || COLORES[0], hecho: !!c.hecho }))
    .slice(0, 20)
  if (!columnas.length) throw new ErrorValidacion(["El tablero necesita al menos una columna"])
  const etiquetas = (t.etiquetas ?? [])
    .map((e) => ({ id: texto(e.id, 40) || nuevoId(), nombre: texto(e.nombre, 40), color: texto(e.color, 9) || COLORES[0] }))
    .filter((e) => e.nombre)
    .slice(0, 40)

  // Las tareas de columnas borradas pasan a la primera columna
  const anterior = await leerTablero()
  const borradas = anterior.columnas.filter((c) => !columnas.some((n) => n.id === c.id)).map((c) => c.id)
  if (borradas.length) {
    const tareas = Object.values(await kvHgetAll<Tarea>(K_TAREAS)).filter((t) => borradas.includes(t.columnaId))
    await Promise.all(tareas.map((t) => kvHset(K_TAREAS, t.id, { ...t, columnaId: columnas[0].id, completada: columnas[0].hecho ? t.completada : null })))
  }
  const nuevo = { columnas, etiquetas }
  await kvSet(K_TABLERO, nuevo)
  return nuevo
}

// ── Clientes ─────────────────────────────────────────────────────────────────

function normalizarCliente(c: Partial<Cliente>, previo?: Cliente): Cliente {
  const base: Cliente = previo ?? {
    id: nuevoId(),
    nombre: "",
    contacto: "",
    cuit: "",
    email: "",
    telefono: "",
    web: "",
    rubro: "",
    estado: "activo",
    color: COLORES[Math.floor(Math.random() * COLORES.length)],
    areas: [],
    responsable: "",
    notas: "",
    creado: ahora(),
    actualizado: ahora(),
  }
  const r: Cliente = { ...base }
  if (c.nombre !== undefined) r.nombre = texto(c.nombre, 120)
  if (c.contacto !== undefined) r.contacto = texto(c.contacto, 120)
  if (c.cuit !== undefined) r.cuit = String(c.cuit).replace(/\D/g, "").slice(0, 11)
  if (c.email !== undefined) r.email = texto(c.email, 160)
  if (c.telefono !== undefined) r.telefono = texto(c.telefono, 60)
  if (c.web !== undefined) r.web = texto(c.web, 160)
  if (c.rubro !== undefined) r.rubro = texto(c.rubro, 80)
  if (c.notas !== undefined) r.notas = texto(c.notas, 5000)
  if (c.color !== undefined) r.color = texto(c.color, 9) || r.color
  if (c.estado && ESTADOS_CLIENTE.some((e) => e.id === c.estado)) r.estado = c.estado
  if (c.areas) r.areas = c.areas.filter((a) => AREAS.some((x) => x.id === a))
  if (c.responsable !== undefined) r.responsable = RESPONSABLES.some((x) => x.id === c.responsable) ? c.responsable! : ""
  r.actualizado = ahora()
  if (!r.nombre) throw new ErrorValidacion(["El cliente necesita un nombre"])
  return r
}

export async function crearCliente(c: Partial<Cliente>) {
  const nuevo = normalizarCliente(c)
  await kvHset(K_CLIENTES, nuevo.id, nuevo)
  return nuevo
}

export async function actualizarCliente(id: string, c: Partial<Cliente>) {
  const previo = await kvHget<Cliente>(K_CLIENTES, id)
  if (!previo) throw new ErrorValidacion(["No existe ese cliente"])
  const nuevo = normalizarCliente(c, previo)
  await kvHset(K_CLIENTES, id, nuevo)
  return nuevo
}

/** Borra el cliente; sus tareas quedan en el tablero como "sin cliente". */
export async function borrarCliente(id: string) {
  const tareas = Object.values(await kvHgetAll<Tarea>(K_TAREAS)).filter((t) => t.clienteId === id)
  await Promise.all(tareas.map((t) => kvHset(K_TAREAS, t.id, { ...t, clienteId: null })))
  await kvHdel(K_CLIENTES, id)
}

export const leerCliente = (id: string) => kvHget<Cliente>(K_CLIENTES, id)

// ── Tareas ───────────────────────────────────────────────────────────────────

async function normalizarTarea(t: Partial<Tarea>, previo?: Tarea): Promise<Tarea> {
  const tablero = await leerTablero()
  const base: Tarea = previo ?? {
    id: (t.id && texto(t.id, 40)) || nuevoId(),
    titulo: "",
    descripcion: "",
    clienteId: null,
    columnaId: tablero.columnas[0].id,
    orden: Date.now(),
    responsables: [],
    area: "general",
    prioridad: "media",
    vence: null,
    etiquetas: [],
    checklist: [],
    comentarios: [],
    creado: ahora(),
    actualizado: ahora(),
    completada: null,
  }
  const r: Tarea = { ...base }
  if (t.titulo !== undefined) r.titulo = texto(t.titulo, 200)
  if (t.descripcion !== undefined) r.descripcion = texto(t.descripcion, 10_000)
  if (t.clienteId !== undefined) r.clienteId = t.clienteId ? texto(t.clienteId, 40) : null
  if (t.columnaId !== undefined && tablero.columnas.some((c) => c.id === t.columnaId)) r.columnaId = t.columnaId
  if (t.orden !== undefined && Number.isFinite(Number(t.orden))) r.orden = Number(t.orden)
  if (t.responsables) r.responsables = t.responsables.filter((x) => RESPONSABLES.some((p) => p.id === x))
  if (t.area && AREAS.some((a) => a.id === t.area)) r.area = t.area
  if (t.prioridad && PRIORIDADES.some((p) => p.id === t.prioridad)) r.prioridad = t.prioridad
  if (t.vence !== undefined) r.vence = fecha(t.vence)
  if (t.etiquetas) r.etiquetas = t.etiquetas.filter((e) => tablero.etiquetas.some((x) => x.id === e))
  if (t.checklist)
    r.checklist = t.checklist
      .map((i) => ({ id: texto(i.id, 40) || nuevoId(), texto: texto(i.texto, 300), hecho: !!i.hecho }))
      .filter((i) => i.texto)
      .slice(0, 200)
  if (!r.titulo) throw new ErrorValidacion(["La tarea necesita un título"])

  // Mover a una columna "hecho" marca la tarea como completada
  const enHecho = tablero.columnas.find((c) => c.id === r.columnaId)?.hecho
  r.completada = enHecho ? (r.completada ?? ahora()) : null
  r.actualizado = ahora()
  return r
}

export async function crearTarea(t: Partial<Tarea>) {
  const nueva = await normalizarTarea(t)
  await kvHset(K_TAREAS, nueva.id, nueva)
  return nueva
}

export async function actualizarTarea(id: string, cambios: Partial<Tarea>) {
  const previo = await kvHget<Tarea>(K_TAREAS, id)
  if (!previo) throw new ErrorValidacion(["La tarea ya no existe (¿la borró otra persona?)"])
  const nueva = await normalizarTarea(cambios, previo)
  await kvHset(K_TAREAS, id, nueva)
  return nueva
}

export async function comentar(id: string, textoComentario: string, autor: string) {
  const previo = await kvHget<Tarea>(K_TAREAS, id)
  if (!previo) throw new ErrorValidacion(["La tarea ya no existe"])
  const c: Comentario = { id: nuevoId(), texto: texto(textoComentario, 3000), autor: texto(autor, 60), fecha: ahora() }
  if (!c.texto) throw new ErrorValidacion(["El comentario está vacío"])
  const nueva = { ...previo, comentarios: [...previo.comentarios, c], actualizado: ahora() }
  await kvHset(K_TAREAS, id, nueva)
  return nueva
}

export async function borrarComentario(id: string, comentarioId: string) {
  const previo = await kvHget<Tarea>(K_TAREAS, id)
  if (!previo) throw new ErrorValidacion(["La tarea ya no existe"])
  const nueva = { ...previo, comentarios: previo.comentarios.filter((c) => c.id !== comentarioId) }
  await kvHset(K_TAREAS, id, nueva)
  return nueva
}

export async function borrarTarea(id: string) {
  await kvHdel(K_TAREAS, id)
}
