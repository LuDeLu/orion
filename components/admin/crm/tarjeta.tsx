"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { estadoVencimiento, fechaCorta, prioridad, type Cliente, type Etiqueta, type Tarea } from "@/lib/crm/modelo"
import { Avatares, InsigniaFecha, t } from "./piezas"

interface Props {
  tarea: Tarea
  cliente?: Cliente
  etiquetas: Etiqueta[]
  hecha: boolean
  onAbrir: () => void
  onCompletar?: () => void
  mostrarCliente?: boolean
}

/** Contenido visual de una tarjeta (se usa también en el overlay del arrastre). */
export function TarjetaVista({ tarea, cliente, etiquetas, hecha, onAbrir, onCompletar, mostrarCliente = true, arrastrando }: Props & { arrastrando?: boolean }) {
  const pr = prioridad(tarea.prioridad)
  const hechos = tarea.checklist.filter((i) => i.hecho).length
  const total = tarea.checklist.length
  const ev = estadoVencimiento(tarea)
  const etq = tarea.etiquetas.map((id) => etiquetas.find((e) => e.id === id)).filter(Boolean) as Etiqueta[]

  return (
    <div
      className="group relative rounded-xl p-3 cursor-pointer select-none transition-[box-shadow,transform] duration-150"
      style={{
        background: arrastrando ? "#1d1940" : "#15122e",
        boxShadow: arrastrando ? "0 18px 40px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(224,100,47,0.5)" : `inset 0 0 0 1px ${t.borde}`,
        transform: arrastrando ? "rotate(2deg)" : undefined,
        opacity: hecha && !arrastrando ? 0.7 : 1,
      }}
      onClick={onAbrir}
      onKeyDown={(e) => e.key === "Enter" && onAbrir()}
      role="button"
      tabIndex={0}
      aria-label={`Abrir tarea ${tarea.titulo}`}
    >
      {cliente && mostrarCliente && (
        <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r" style={{ background: cliente.color }} aria-hidden />
      )}

      {(etq.length > 0 || (mostrarCliente && cliente)) && (
        <div className="flex flex-wrap items-center gap-1 mb-2">
          {mostrarCliente && cliente && (
            <span className="text-[10px] font-semibold uppercase tracking-wider truncate max-w-full mr-1" style={{ color: cliente.color }}>
              {cliente.nombre}
            </span>
          )}
          {etq.map((e) => (
            <span key={e.id} className="h-1.5 w-7 rounded-full" style={{ background: e.color }} title={e.nombre} />
          ))}
        </div>
      )}

      <div className="flex items-start gap-2">
        {onCompletar && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onCompletar()
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={hecha ? "Marcar como pendiente" : "Marcar como terminada"}
            title={hecha ? "Marcar como pendiente" : "Marcar como terminada"}
            className={`mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center transition-all ${hecha ? "" : "opacity-60 group-hover:opacity-100"}`}
            style={hecha ? { background: "#34d399" } : { boxShadow: "inset 0 0 0 1.5px rgba(244,242,238,0.35)" }}
          >
            {hecha && (
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#0e0c22]">
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z" />
              </svg>
            )}
          </button>
        )}
        <p className={`text-sm leading-snug text-white break-words min-w-0 ${hecha ? "line-through decoration-white/40" : ""}`}>{tarea.titulo || "Sin título"}</p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-2.5 text-[11px]" style={{ color: t.suave }}>
        {pr && pr.id !== "media" && (
          <span className="inline-flex items-center gap-1 font-medium" style={{ color: pr.color }} title={`Prioridad ${pr.nombre}`}>
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M14.4 6 14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6Z" /></svg>
            {pr.nombre}
          </span>
        )}
        {tarea.vence && (
          <InsigniaFecha estado={ev} completada={hecha}>
            {fechaCorta(tarea.vence)}
          </InsigniaFecha>
        )}
        {total > 0 && (
          <span
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 tabular"
            style={hechos === total ? { background: "rgba(52,211,153,0.15)", color: "#6ee7b7" } : { background: "rgba(255,255,255,0.05)" }}
            title="Checklist"
          >
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-9 14-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z" /></svg>
            {hechos}/{total}
          </span>
        )}
        {tarea.descripcion && (
          <span title="Tiene descripción">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M3 18h12v-2H3v2ZM3 6v2h18V6H3Zm0 7h18v-2H3v2Z" /></svg>
          </span>
        )}
        {tarea.comentarios.length > 0 && (
          <span className="inline-flex items-center gap-0.5 tabular" title="Comentarios">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1Zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1Z" /></svg>
            {tarea.comentarios.length}
          </span>
        )}
        <span className="ml-auto">
          <Avatares ids={tarea.responsables} tam={20} />
        </span>
      </div>
    </div>
  )
}

/** Tarjeta arrastrable dentro del tablero. */
export function TarjetaArrastrable(props: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.tarea.id, data: { tipo: "tarea" } })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.35 : 1 }}
      {...attributes}
      {...listeners}
    >
      <TarjetaVista {...props} />
    </div>
  )
}
