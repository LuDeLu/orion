"use client"

import { useId, useMemo, useRef, useState } from "react"
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Columna, Tarea } from "@/lib/crm/modelo"
import { useCrm } from "./use-crm"
import { TarjetaArrastrable, TarjetaVista } from "./tarjeta"
import { t } from "./piezas"

type Mapa = Record<string, string[]>

interface Props {
  tareas: Tarea[] // ya filtradas
  onAbrir: (id: string) => void
  /** Valores por defecto para las tareas creadas desde el tablero (cliente fijo o filtrado) */
  defaultsNueva: Partial<Tarea>
  mostrarCliente: boolean
}

const PASO = 1024

/** Calcula el orden fraccional para dejar la tarjeta entre sus vecinas. */
function ordenEntre(anterior?: number, siguiente?: number) {
  if (anterior == null && siguiente == null) return Date.now()
  if (anterior == null) return siguiente! - PASO
  if (siguiente == null) return anterior + PASO
  return (anterior + siguiente) / 2
}

export function TableroKanban({ tareas, onAbrir, defaultsNueva, mostrarCliente }: Props) {
  const { datos, actualizarTarea, crearTarea, bloquearSync } = useCrm()
  const idDnd = useId()
  const { columnas, etiquetas } = datos.tablero
  const porId = useMemo(() => new Map(tareas.map((x) => [x.id, x])), [tareas])
  const clientes = useMemo(() => new Map(datos.clientes.map((c) => [c.id, c])), [datos.clientes])
  const colHecha = columnas.find((c) => c.hecho)
  const colPendiente = columnas.find((c) => !c.hecho) ?? columnas[0]

  const base = useMemo<Mapa>(() => {
    const m: Mapa = Object.fromEntries(columnas.map((c) => [c.id, []]))
    for (const x of [...tareas].sort((a, b) => a.orden - b.orden)) (m[x.columnaId] ??= []).push(x.id)
    return m
  }, [tareas, columnas])

  const [arrastre, setArrastre] = useState<Mapa | null>(null)
  const [activo, setActivo] = useState<string | null>(null)
  const mapa = arrastre ?? base
  const mapaRef = useRef(mapa)
  mapaRef.current = mapa

  const sensores = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const columnaDe = (id: string, m: Mapa = mapaRef.current) => (id.startsWith("col:") ? id.slice(4) : Object.keys(m).find((c) => m[c].includes(id)))

  function alEmpezar(e: DragStartEvent) {
    bloquearSync(true)
    setActivo(String(e.active.id))
    setArrastre(structuredClone(base))
  }

  function alPasar({ active, over }: DragOverEvent) {
    if (!over) return
    const desde = columnaDe(String(active.id))
    const hasta = columnaDe(String(over.id))
    if (!desde || !hasta || desde === hasta) return
    setArrastre((prev) => {
      const m = structuredClone(prev ?? base)
      m[desde] = m[desde].filter((x) => x !== active.id)
      const idx = String(over.id).startsWith("col:") ? m[hasta].length : Math.max(0, m[hasta].indexOf(String(over.id)))
      m[hasta].splice(idx, 0, String(active.id))
      return m
    })
  }

  function alSoltar({ active, over }: DragEndEvent) {
    const id = String(active.id)
    let m = mapaRef.current
    const col = columnaDe(id, m)
    if (over && col) {
      const destino = columnaDe(String(over.id), m)
      if (destino === col && !String(over.id).startsWith("col:") && over.id !== active.id) {
        m = { ...m, [col]: arrayMove(m[col], m[col].indexOf(id), m[col].indexOf(String(over.id))) }
      }
      const lista = m[col]
      const i = lista.indexOf(id)
      const anterior = porId.get(lista[i - 1])?.orden
      const siguiente = porId.get(lista[i + 1])?.orden
      const tarea = porId.get(id)
      if (tarea) {
        const posicionCambio = tarea.columnaId !== col || (anterior != null && tarea.orden <= anterior) || (siguiente != null && tarea.orden >= siguiente)
        if (posicionCambio) actualizarTarea(id, { columnaId: col, orden: ordenEntre(anterior, siguiente) })
      }
    }
    setArrastre(null)
    setActivo(null)
    bloquearSync(false)
  }

  function alCancelar() {
    setArrastre(null)
    setActivo(null)
    bloquearSync(false)
  }

  const completar = (x: Tarea) => {
    const hecha = columnas.find((c) => c.id === x.columnaId)?.hecho
    const destino = hecha ? colPendiente : colHecha
    if (destino) actualizarTarea(x.id, { columnaId: destino.id, orden: Date.now() })
  }

  const tareaActiva = activo ? porId.get(activo) : null

  return (
    <DndContext id={idDnd} sensors={sensores} collisionDetection={closestCorners} onDragStart={alEmpezar} onDragOver={alPasar} onDragEnd={alSoltar} onDragCancel={alCancelar}>
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 snap-x snap-mandatory sm:snap-none" style={{ minHeight: "60vh" }}>
        {columnas.map((c) => (
          <ColumnaKanban
            key={c.id}
            columna={c}
            ids={mapa[c.id] ?? []}
            render={(id) => {
              const x = porId.get(id)
              if (!x) return null
              return (
                <TarjetaArrastrable
                  key={id}
                  tarea={x}
                  cliente={x.clienteId ? clientes.get(x.clienteId) : undefined}
                  etiquetas={etiquetas}
                  hecha={c.hecho}
                  onAbrir={() => onAbrir(id)}
                  onCompletar={() => completar(x)}
                  mostrarCliente={mostrarCliente}
                />
              )
            }}
            onAgregar={(titulo) => crearTarea({ ...defaultsNueva, titulo, columnaId: c.id })}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={{ duration: 180 }}>
        {tareaActiva ? (
          <div className="w-[272px]">
            <TarjetaVista
              tarea={tareaActiva}
              cliente={tareaActiva.clienteId ? clientes.get(tareaActiva.clienteId) : undefined}
              etiquetas={etiquetas}
              hecha={!!columnas.find((c) => c.id === columnaDe(tareaActiva.id))?.hecho}
              onAbrir={() => {}}
              mostrarCliente={mostrarCliente}
              arrastrando
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

function ColumnaKanban({ columna, ids, render, onAgregar }: { columna: Columna; ids: string[]; render: (id: string) => React.ReactNode; onAgregar: (titulo: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: `col:${columna.id}` })
  const [agregando, setAgregando] = useState(false)
  const [titulo, setTitulo] = useState("")

  function confirmar() {
    const v = titulo.trim()
    if (v) onAgregar(v)
    setTitulo("")
  }

  return (
    <section className="w-[85vw] sm:w-[288px] shrink-0 snap-start flex flex-col rounded-2xl max-h-[calc(100dvh-260px)] min-h-[200px]" style={{ background: isOver ? "rgba(224,100,47,0.06)" : "rgba(255,255,255,0.025)", boxShadow: `inset 0 0 0 1px ${isOver ? "rgba(224,100,47,0.3)" : t.borde}` }} aria-label={columna.nombre}>
      <header className="flex items-center justify-between gap-2 px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: columna.color }} />
          <h3 className="text-sm font-semibold text-white truncate">{columna.nombre}</h3>
          <span className="text-xs tabular rounded-md px-1.5" style={{ color: t.suave, background: "rgba(255,255,255,0.05)" }}>{ids.length}</span>
        </div>
        <button type="button" onClick={() => setAgregando(true)} className="icon-btn !p-1" aria-label={`Agregar tarea en ${columna.nombre}`} title="Agregar tarea">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z" /></svg>
        </button>
      </header>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto px-2 pb-2 space-y-2 min-h-[60px]">
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {ids.map(render)}
        </SortableContext>
        {ids.length === 0 && !agregando && (
          <p className="text-xs text-center py-6 rounded-xl border border-dashed" style={{ color: t.tenue, borderColor: t.borde }}>
            Arrastrá tarjetas acá
          </p>
        )}
      </div>

      <div className="px-2 pb-2">
        {agregando ? (
          <div className="space-y-1.5">
            <textarea
              autoFocus
              rows={2}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  confirmar()
                }
                if (e.key === "Escape") setAgregando(false)
              }}
              onBlur={() => {
                confirmar()
                setAgregando(false)
              }}
              placeholder="Título de la tarea… (Enter para agregar)"
              className="input-orion w-full rounded-lg px-2.5 py-2 text-sm resize-none"
            />
          </div>
        ) : (
          <button type="button" onClick={() => setAgregando(true)} className="w-full text-left text-sm px-2.5 py-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: t.suave }}>
            + Agregar tarea
          </button>
        )}
      </div>
    </section>
  )
}
