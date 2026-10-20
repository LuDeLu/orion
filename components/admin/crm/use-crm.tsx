"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { toast } from "sonner"
import { nuevoId, type Cliente, type DatosCrm, type Tablero, type Tarea } from "@/lib/crm/modelo"

/**
 * Estado del CRM en el navegador. Todas las ediciones son optimistas: se ven al
 * instante y se guardan en segundo plano. Si algo falla se avisa y se vuelve a
 * leer el estado del servidor. Al volver a la pestaña (y cada 45 s) se sincroniza
 * para ver lo que cambiaron los demás.
 */

async function api<T>(url: string, metodo: string, cuerpo?: unknown): Promise<T> {
  const r = await fetch(url, {
    method: metodo,
    headers: cuerpo !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j.errores?.join(" · ") ?? j.error ?? "No se pudo guardar")
  return j as T
}

function useCrmEstado(inicial: DatosCrm) {
  const [datos, setDatos] = useState(inicial)
  const pendientes = useRef(0)
  const bloqueo = useRef(false) // mientras se arrastra no se sincroniza

  const sincronizar = useCallback(async () => {
    if (pendientes.current || bloqueo.current) return
    try {
      const nuevo = await api<DatosCrm>("/api/admin/crm", "GET")
      if (!pendientes.current && !bloqueo.current) setDatos(nuevo)
    } catch {}
  }, [])

  useEffect(() => {
    const alVolver = () => document.visibilityState === "visible" && sincronizar()
    document.addEventListener("visibilitychange", alVolver)
    const t = setInterval(() => document.visibilityState === "visible" && sincronizar(), 45_000)
    return () => {
      document.removeEventListener("visibilitychange", alVolver)
      clearInterval(t)
    }
  }, [sincronizar])

  const actual = useRef(datos)
  actual.current = datos

  /** Corre una mutación remota; si falla avisa y resincroniza. */
  const remoto = useCallback(
    async <T,>(fn: () => Promise<T>, alResolver?: (r: T) => void): Promise<T | null> => {
      pendientes.current++
      let r: T | null = null
      let error: Error | null = null
      try {
        r = await fn()
      } catch (e) {
        error = e as Error
      } finally {
        pendientes.current--
      }
      if (error) {
        toast.error(error.message)
        await sincronizar()
        return null
      }
      alResolver?.(r as T)
      return r
    },
    [sincronizar],
  )

  /** Toma la versión del servidor solo si no hay otras ediciones en vuelo (para no pisarlas). */
  const reemplazarTarea = (t: Tarea) => {
    if (pendientes.current) return
    setDatos((d) => ({ ...d, tareas: d.tareas.some((x) => x.id === t.id) ? d.tareas.map((x) => (x.id === t.id ? t : x)) : [...d.tareas, t] }))
  }

  const acciones = useMemo(
    () => ({
      crearTarea(entrada: Partial<Tarea>) {
        const parcial = Object.fromEntries(Object.entries(entrada).filter(([, v]) => v !== undefined)) as Partial<Tarea>
        const d = actual.current
        const id = nuevoId()
        const ahora = new Date().toISOString()
        const col = parcial.columnaId ?? d.tablero.columnas[0].id
        const enCol = d.tareas.filter((t) => t.columnaId === col)
        const optimista: Tarea = {
          id,
          titulo: "",
          descripcion: "",
          clienteId: null,
          columnaId: col,
          orden: enCol.length ? Math.max(...enCol.map((t) => t.orden)) + 1024 : Date.now(),
          responsables: [],
          area: "general",
          prioridad: "media",
          vence: null,
          etiquetas: [],
          checklist: [],
          comentarios: [],
          creado: ahora,
          actualizado: ahora,
          completada: d.tablero.columnas.find((c) => c.id === col)?.hecho ? ahora : null,
          ...parcial,
        }
        optimista.id = id
        setDatos((x) => ({ ...x, tareas: [...x.tareas, optimista] }))
        void remoto(() => api<Tarea>("/api/admin/crm/tareas", "POST", optimista), reemplazarTarea)
        return id
      },

      actualizarTarea(id: string, cambios: Partial<Tarea>) {
        const hecho = cambios.columnaId ? actual.current.tablero.columnas.find((c) => c.id === cambios.columnaId)?.hecho : undefined
        setDatos((d) => ({
          ...d,
          tareas: d.tareas.map((t) =>
            t.id === id
              ? { ...t, ...cambios, ...(hecho === undefined ? {} : { completada: hecho ? (t.completada ?? new Date().toISOString()) : null }) }
              : t,
          ),
        }))
        void remoto(() => api<Tarea>(`/api/admin/crm/tareas/${id}`, "PATCH", cambios), reemplazarTarea)
      },

      borrarTarea(id: string) {
        setDatos((d) => ({ ...d, tareas: d.tareas.filter((t) => t.id !== id) }))
        void remoto(() => api(`/api/admin/crm/tareas/${id}`, "DELETE"))
      },

      comentar(id: string, texto: string) {
        return remoto(() => api<Tarea>(`/api/admin/crm/tareas/${id}`, "PATCH", { comentario: texto }), reemplazarTarea)
      },

      borrarComentario(id: string, comentarioId: string) {
        setDatos((d) => ({ ...d, tareas: d.tareas.map((t) => (t.id === id ? { ...t, comentarios: t.comentarios.filter((c) => c.id !== comentarioId) } : t)) }))
        void remoto(() => api<Tarea>(`/api/admin/crm/tareas/${id}`, "PATCH", { borrarComentario: comentarioId }), reemplazarTarea)
      },

      guardarTablero(tablero: Tablero) {
        setDatos((d) => ({ ...d, tablero }))
        void remoto(() => api<Tablero>("/api/admin/crm/tablero", "PUT", tablero), () => sincronizar())
      },

      async crearCliente(c: Partial<Cliente>) {
        return remoto(
          () => api<Cliente>("/api/admin/crm/clientes", "POST", c),
          (nuevo) => setDatos((d) => ({ ...d, clientes: [...d.clientes, nuevo].sort((a, b) => a.nombre.localeCompare(b.nombre, "es")) })),
        )
      },

      async actualizarCliente(id: string, c: Partial<Cliente>) {
        setDatos((d) => ({ ...d, clientes: d.clientes.map((x) => (x.id === id ? { ...x, ...c } : x)) }))
        return remoto(
          () => api<Cliente>(`/api/admin/crm/clientes/${id}`, "PATCH", c),
          (nuevo) => setDatos((d) => ({ ...d, clientes: d.clientes.map((x) => (x.id === id ? nuevo : x)) })),
        )
      },

      async borrarCliente(id: string) {
        setDatos((d) => ({
          ...d,
          clientes: d.clientes.filter((x) => x.id !== id),
          tareas: d.tareas.map((t) => (t.clienteId === id ? { ...t, clienteId: null } : t)),
        }))
        return remoto(() => api(`/api/admin/crm/clientes/${id}`, "DELETE"))
      },

      bloquearSync(v: boolean) {
        bloqueo.current = v
      },
      sincronizar,
    }),
    [remoto, sincronizar],
  )

  return { datos, ...acciones }
}

type Crm = ReturnType<typeof useCrmEstado>
const Contexto = createContext<Crm | null>(null)

export function ProveedorCrm({ inicial, children }: { inicial: DatosCrm; children: ReactNode }) {
  const crm = useCrmEstado(inicial)
  return <Contexto.Provider value={crm}>{children}</Contexto.Provider>
}

export function useCrm() {
  const c = useContext(Contexto)
  if (!c) throw new Error("useCrm fuera de ProveedorCrm")
  return c
}
