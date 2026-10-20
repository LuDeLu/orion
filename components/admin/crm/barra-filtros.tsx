"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { AREAS, PRIORIDADES, RESPONSABLES, type DatosCrm } from "@/lib/crm/modelo"
import { cantidadFiltros, FILTROS_VACIOS, type Filtros, type Vencimiento } from "./filtros"
import { Avatar, Chip, t } from "./piezas"

const alternar = (lista: string[], v: string) => (lista.includes(v) ? lista.filter((x) => x !== v) : [...lista, v])

/** Menú desplegable simple con cierre al hacer clic afuera. */
function Desplegable({ etiqueta, activo, children }: { etiqueta: ReactNode; activo: boolean; children: ReactNode }) {
  const [abierto, setAbierto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!abierto) return
    const fuera = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAbierto(false)
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false)
    document.addEventListener("mousedown", fuera)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("mousedown", fuera)
      document.removeEventListener("keydown", esc)
    }
  }, [abierto])
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors"
        style={activo ? { background: "rgba(224,100,47,0.16)", color: "#fff", boxShadow: "inset 0 0 0 1px rgba(224,100,47,0.6)" } : { background: "rgba(255,255,255,0.03)", color: t.suave, boxShadow: `inset 0 0 0 1px ${t.borde}` }}
      >
        {etiqueta}
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current opacity-70">
          <path d="M7 10l5 5 5-5H7Z" />
        </svg>
      </button>
      {abierto && (
        <div className="absolute z-40 mt-1.5 left-0 w-64 max-w-[85vw] rounded-xl p-2 shadow-2xl" style={{ background: "#16132f", border: `1px solid ${t.borde}` }}>
          {children}
        </div>
      )}
    </div>
  )
}

export function BarraFiltros({
  filtros,
  setFiltros,
  datos,
  clienteFijo,
  total,
  visibles,
  buscadorRef,
}: {
  filtros: Filtros
  setFiltros: (f: Filtros) => void
  datos: DatosCrm
  clienteFijo?: string
  total: number
  visibles: number
  buscadorRef?: React.RefObject<HTMLInputElement | null>
}) {
  const [qCliente, setQCliente] = useState("")
  const f = filtros
  const cambiar = (c: Partial<Filtros>) => setFiltros({ ...f, ...c })
  const n = cantidadFiltros(f)
  const clientesVisibles = datos.clientes.filter((c) => c.nombre.toLowerCase().includes(qCliente.toLowerCase()))

  const vencimientos: { id: Vencimiento; nombre: string }[] = [
    { id: "vencidas", nombre: "Vencidas" },
    { id: "hoy", nombre: "Hoy" },
    { id: "semana", nombre: "Próximos 7 días" },
    { id: "sin", nombre: "Sin fecha" },
  ]

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 fill-current pointer-events-none" style={{ color: t.tenue }}>
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z" />
          </svg>
          <input
            ref={buscadorRef}
            value={f.q}
            onChange={(e) => cambiar({ q: e.target.value })}
            placeholder="Buscar tareas, checklists, comentarios…   ( / )"
            aria-label="Buscar"
            className="input-orion w-full rounded-lg pl-9 pr-3 py-2 text-sm"
          />
        </div>

        {/* Responsables: avatares de un clic */}
        <div className="inline-flex items-center gap-1 rounded-full p-1" style={{ background: "rgba(255,255,255,0.03)", boxShadow: `inset 0 0 0 1px ${t.borde}` }}>
          {RESPONSABLES.map((r) => {
            const activo = f.responsables.includes(r.id)
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => cambiar({ responsables: alternar(f.responsables, r.id) })}
                title={`Tareas de ${r.nombre}`}
                aria-pressed={activo}
                className="rounded-full transition-all"
                style={{ opacity: f.responsables.length && !activo ? 0.35 : 1, transform: activo ? "scale(1.08)" : undefined }}
              >
                <Avatar id={r.id} tam={26} conBorde={false} />
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => cambiar({ responsables: alternar(f.responsables, "nadie") })}
            title="Sin asignar"
            aria-pressed={f.responsables.includes("nadie")}
            className="w-[26px] h-[26px] rounded-full text-[10px] font-bold transition-all"
            style={{ boxShadow: `inset 0 0 0 1px ${f.responsables.includes("nadie") ? "#e0642f" : t.borde}`, color: t.suave, opacity: f.responsables.length && !f.responsables.includes("nadie") ? 0.35 : 1 }}
          >
            ?
          </button>
        </div>

        {n > 0 && (
          <button type="button" onClick={() => setFiltros(FILTROS_VACIOS)} className="text-xs px-2 py-1 rounded-md hover:text-white transition-colors" style={{ color: "rgba(244,170,130,0.9)" }}>
            Limpiar filtros ({n})
          </button>
        )}
        <span className="text-xs ml-auto tabular" style={{ color: t.tenue }}>
          {visibles === total ? `${total} tareas` : `${visibles} de ${total} tareas`}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {!clienteFijo && (
          <Desplegable
            activo={f.clientes.length > 0}
            etiqueta={
              f.clientes.length === 1
                ? (datos.clientes.find((c) => c.id === f.clientes[0])?.nombre ?? "Sin cliente")
                : f.clientes.length
                  ? `${f.clientes.length} clientes`
                  : "Cliente"
            }
          >
            <input value={qCliente} onChange={(e) => setQCliente(e.target.value)} placeholder="Buscar cliente…" autoFocus className="input-orion w-full rounded-lg px-2.5 py-1.5 text-xs mb-1.5" />
            <div className="max-h-64 overflow-y-auto space-y-0.5">
              {[...clientesVisibles.map((c) => ({ id: c.id, nombre: c.nombre, color: c.color })), { id: "sin", nombre: "Sin cliente", color: "#64748b" }].map((c) => (
                <label key={c.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-white/5" style={{ color: t.media }}>
                  <input type="checkbox" checked={f.clientes.includes(c.id)} onChange={() => cambiar({ clientes: alternar(f.clientes, c.id) })} className="accent-[#e0642f]" />
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="truncate">{c.nombre}</span>
                </label>
              ))}
            </div>
            {f.clientes.length > 0 && (
              <button type="button" onClick={() => cambiar({ clientes: [] })} className="w-full mt-1.5 text-xs py-1 rounded-md hover:bg-white/5" style={{ color: t.suave }}>
                Quitar selección
              </button>
            )}
          </Desplegable>
        )}

        {vencimientos.map((v) => (
          <Chip key={v.id} activo={f.vence === v.id} onClick={() => cambiar({ vence: f.vence === v.id ? "" : v.id })} color={v.id === "vencidas" ? "#fb7185" : undefined}>
            {v.nombre}
          </Chip>
        ))}

        <span className="w-px h-5 mx-1" style={{ background: t.borde }} />

        {PRIORIDADES.map((p) => (
          <Chip key={p.id} activo={f.prioridades.includes(p.id)} onClick={() => cambiar({ prioridades: alternar(f.prioridades, p.id) })} color={p.color}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
            {p.nombre}
          </Chip>
        ))}

        <span className="w-px h-5 mx-1" style={{ background: t.borde }} />

        {AREAS.map((a) => (
          <Chip key={a.id} activo={f.areas.includes(a.id)} onClick={() => cambiar({ areas: alternar(f.areas, a.id) })} color={a.color}>
            {a.nombre}
          </Chip>
        ))}

        <Desplegable activo={f.etiquetas.length > 0} etiqueta={f.etiquetas.length ? `Etiquetas (${f.etiquetas.length})` : "Etiquetas"}>
          <div className="flex flex-wrap gap-1.5">
            {datos.tablero.etiquetas.map((e) => (
              <Chip key={e.id} activo={f.etiquetas.includes(e.id)} onClick={() => cambiar({ etiquetas: alternar(f.etiquetas, e.id) })} color={e.color}>
                {e.nombre}
              </Chip>
            ))}
          </div>
        </Desplegable>

        <Chip activo={f.ocultarHechas} onClick={() => cambiar({ ocultarHechas: !f.ocultarHechas })} color="#34d399">
          Ocultar terminadas
        </Chip>
      </div>
    </div>
  )
}
