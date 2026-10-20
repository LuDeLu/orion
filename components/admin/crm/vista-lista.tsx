"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { estadoVencimiento, fechaCorta, prioridad, type Tarea } from "@/lib/crm/modelo"
import { ordenLista } from "./filtros"
import { useCrm } from "./use-crm"
import { Avatares, InsigniaFecha, t } from "./piezas"

/** Tareas agrupadas por cliente, con secciones plegables. */
export function VistaLista({ tareas, onAbrir, onNueva, agrupar }: { tareas: Tarea[]; onAbrir: (id: string) => void; onNueva: (d: Partial<Tarea>) => void; agrupar: boolean }) {
  const { datos, actualizarTarea } = useCrm()
  const [plegados, setPlegados] = useState<Set<string>>(new Set())
  const columnas = datos.tablero.columnas
  const colHecha = columnas.find((c) => c.hecho)
  const colPendiente = columnas.find((c) => !c.hecho) ?? columnas[0]

  const grupos = useMemo(() => {
    if (!agrupar) return [{ id: "todas", nombre: "Todas las tareas", color: "#e0642f", tareas: [...tareas].sort(ordenLista) }]
    const m = new Map<string, Tarea[]>()
    for (const x of tareas) m.set(x.clienteId ?? "sin", [...(m.get(x.clienteId ?? "sin") ?? []), x])
    const lista = [...m.entries()].map(([id, ts]) => {
      const c = datos.clientes.find((x) => x.id === id)
      return { id, nombre: c?.nombre ?? "Sin cliente (internas)", color: c?.color ?? "#64748b", tareas: ts.sort(ordenLista) }
    })
    // Primero los clientes con tareas vencidas, después por nombre; "sin cliente" al final
    return lista.sort((a, b) => {
      if (a.id === "sin") return 1
      if (b.id === "sin") return -1
      const va = a.tareas.some((x) => estadoVencimiento(x) === "vencida") ? 0 : 1
      const vb = b.tareas.some((x) => estadoVencimiento(x) === "vencida") ? 0 : 1
      return va - vb || a.nombre.localeCompare(b.nombre, "es")
    })
  }, [tareas, datos.clientes, agrupar])

  if (!tareas.length) {
    return <p className="text-sm text-center py-16" style={{ color: t.suave }}>No hay tareas con estos filtros.</p>
  }

  return (
    <div className="space-y-3">
      {grupos.map((g) => {
        const plegado = plegados.has(g.id)
        const abiertas = g.tareas.filter((x) => !x.completada).length
        const vencidas = g.tareas.filter((x) => estadoVencimiento(x) === "vencida").length
        return (
          <section key={g.id} className="rounded-xl overflow-hidden" style={{ background: t.panel, boxShadow: `inset 0 0 0 1px ${t.borde}` }}>
            <header className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: plegado ? undefined : `1px solid ${t.borde}` }}>
              <button
                type="button"
                onClick={() => setPlegados((s) => (s.has(g.id) ? new Set([...s].filter((x) => x !== g.id)) : new Set([...s, g.id])))}
                className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                aria-expanded={!plegado}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current transition-transform shrink-0" style={{ color: t.suave, transform: plegado ? "rotate(-90deg)" : undefined }}>
                  <path d="M7 10l5 5 5-5H7Z" />
                </svg>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: g.color }} />
                <span className="font-semibold text-white truncate">{g.nombre}</span>
                <span className="text-xs tabular shrink-0" style={{ color: t.suave }}>
                  {abiertas} {abiertas === 1 ? "abierta" : "abiertas"}
                </span>
                {vencidas > 0 && (
                  <span className="text-[11px] font-semibold rounded-md px-1.5 py-0.5 shrink-0" style={{ background: "rgba(251,113,133,0.15)", color: "#fda4af" }}>
                    {vencidas} vencida{vencidas > 1 ? "s" : ""}
                  </span>
                )}
              </button>
              {agrupar && g.id !== "sin" && (
                <Link href={`/admin/crm/clientes/${g.id}`} className="text-xs shrink-0 hover:text-white" style={{ color: "rgba(244,170,130,0.85)" }}>
                  Ver cliente →
                </Link>
              )}
              <button
                type="button"
                onClick={() => onNueva(g.id === "sin" || g.id === "todas" ? {} : { clienteId: g.id })}
                className="icon-btn !p-1 shrink-0"
                title="Agregar tarea"
                aria-label="Agregar tarea"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z" /></svg>
              </button>
            </header>

            {!plegado && (
              <ul>
                {g.tareas.map((x) => {
                  const col = columnas.find((c) => c.id === x.columnaId)
                  const hecha = !!col?.hecho
                  const pr = prioridad(x.prioridad)
                  const total = x.checklist.length
                  const hechos = x.checklist.filter((i) => i.hecho).length
                  return (
                    <li key={x.id} className="row-hover-orange flex flex-wrap sm:flex-nowrap items-center gap-x-3 gap-y-1.5 px-4 py-2.5 border-t first:border-t-0" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                      <button
                        type="button"
                        onClick={() => {
                          const destino = hecha ? colPendiente : colHecha
                          if (destino) actualizarTarea(x.id, { columnaId: destino.id, orden: Date.now() })
                        }}
                        className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
                        style={hecha ? { background: "#34d399" } : { boxShadow: "inset 0 0 0 1.5px rgba(244,242,238,0.35)" }}
                        aria-label={hecha ? "Marcar como pendiente" : "Marcar como terminada"}
                      >
                        {hecha && <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#0e0c22]"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z" /></svg>}
                      </button>
                      <button type="button" onClick={() => onAbrir(x.id)} className={`flex-1 min-w-[160px] text-left text-sm truncate hover:underline ${hecha ? "line-through" : ""}`} style={{ color: hecha ? t.tenue : "#fff" }}>
                        {x.titulo}
                      </button>
                      {pr && pr.id !== "media" && (
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: pr.color }} title={`Prioridad ${pr.nombre}`} />
                      )}
                      {total > 0 && (
                        <span className="text-[11px] tabular shrink-0" style={{ color: hechos === total ? "#6ee7b7" : t.suave }}>☑ {hechos}/{total}</span>
                      )}
                      {x.vence && (
                        <InsigniaFecha estado={estadoVencimiento(x)} completada={hecha}>
                          {fechaCorta(x.vence)}
                        </InsigniaFecha>
                      )}
                      <select
                        value={x.columnaId}
                        onChange={(e) => actualizarTarea(x.id, { columnaId: e.target.value, orden: Date.now() })}
                        className="rounded-md px-2 py-1 text-xs shrink-0 outline-none cursor-pointer"
                        style={{ background: `${col?.color ?? "#64748b"}1f`, color: col?.color, boxShadow: `inset 0 0 0 1px ${col?.color ?? "#64748b"}45` }}
                        aria-label="Estado"
                      >
                        {columnas.map((c) => (
                          <option key={c.id} value={c.id} style={{ background: "#16132f", color: "#fff" }}>{c.nombre}</option>
                        ))}
                      </select>
                      <span className="w-[64px] flex justify-end shrink-0">
                        <Avatares ids={x.responsables} tam={22} />
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}
