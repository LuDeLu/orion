"use client"

import { useEffect, type ReactNode } from "react"
import { responsable as buscarResponsable, type EstadoVencimiento } from "@/lib/crm/modelo"

export const t = {
  suave: "rgba(244,242,238,0.45)",
  tenue: "rgba(244,242,238,0.30)",
  media: "rgba(244,242,238,0.72)",
  borde: "rgba(255,255,255,0.08)",
  panel: "rgba(14,12,34,0.65)",
}

export function Avatar({ id, tam = 22, conBorde = true }: { id: string; tam?: number; conBorde?: boolean }) {
  const r = buscarResponsable(id)
  if (!r) return null
  return (
    <span
      title={r.nombre}
      className="inline-flex items-center justify-center rounded-full font-bold shrink-0 select-none"
      style={{
        width: tam,
        height: tam,
        fontSize: tam * 0.4,
        background: `${r.color}30`,
        color: r.color,
        boxShadow: conBorde ? `0 0 0 2px #0e0c22, inset 0 0 0 1px ${r.color}70` : `inset 0 0 0 1px ${r.color}70`,
      }}
    >
      {r.iniciales}
    </span>
  )
}

export function Avatares({ ids, tam = 22 }: { ids: string[]; tam?: number }) {
  if (!ids.length) return null
  return (
    <span className="inline-flex -space-x-1.5">
      {ids.map((id) => (
        <Avatar key={id} id={id} tam={tam} />
      ))}
    </span>
  )
}

/** Pastilla de color (etiquetas, áreas, estados). */
export function Pastilla({ color, children, tam = "sm", solida }: { color: string; children: ReactNode; tam?: "xs" | "sm"; solida?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-semibold whitespace-nowrap ${tam === "xs" ? "px-1.5 py-px text-[10px]" : "px-2 py-0.5 text-[11px]"}`}
      style={solida ? { background: color, color: "#0e0c22" } : { background: `${color}1f`, color, boxShadow: `inset 0 0 0 1px ${color}45` }}
    >
      {children}
    </span>
  )
}

/** Chip seleccionable de los filtros y formularios. */
export function Chip({ activo, onClick, color, children, titulo }: { activo: boolean; onClick: () => void; color?: string; children: ReactNode; titulo?: string }) {
  const c = color ?? "#e0642f"
  return (
    <button
      type="button"
      onClick={onClick}
      title={titulo}
      aria-pressed={activo}
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-150 whitespace-nowrap"
      style={
        activo
          ? { background: `${c}26`, color: "#fff", boxShadow: `inset 0 0 0 1px ${c}90` }
          : { background: "rgba(255,255,255,0.03)", color: t.suave, boxShadow: `inset 0 0 0 1px ${t.borde}` }
      }
    >
      {children}
    </button>
  )
}

const VENC: Record<NonNullable<EstadoVencimiento>, { bg: string; color: string }> = {
  vencida: { bg: "rgba(251,113,133,0.15)", color: "#fda4af" },
  hoy: { bg: "rgba(250,204,21,0.15)", color: "#fde047" },
  pronto: { bg: "rgba(251,146,60,0.12)", color: "#fdba74" },
  futura: { bg: "rgba(255,255,255,0.05)", color: "rgba(244,242,238,0.6)" },
}

export function InsigniaFecha({ estado, completada, children }: { estado: EstadoVencimiento; completada?: boolean; children: ReactNode }) {
  const c = completada ? { bg: "rgba(52,211,153,0.15)", color: "#6ee7b7" } : estado ? VENC[estado] : VENC.futura
  return (
    <span className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular" style={{ background: c.bg, color: c.color }}>
      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" aria-hidden>
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 16H5V9h14v11Z" />
      </svg>
      {children}
    </span>
  )
}

/** Ventana modal con fondo, cierre con Escape y clic afuera. */
export function Modal({ abierto, onCerrar, children, ancho = "max-w-3xl", etiqueta }: { abierto: boolean; onCerrar: () => void; children: ReactNode; ancho?: string; etiqueta: string }) {
  useEffect(() => {
    if (!abierto) return
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && onCerrar()
    document.addEventListener("keydown", tecla)
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", tecla)
      document.body.style.overflow = overflow
    }
  }, [abierto, onCerrar])

  if (!abierto) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-0 sm:p-6 sm:pt-16"
      style={{ background: "rgba(4,3,14,0.78)", backdropFilter: "blur(5px)" }}
      onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}
      role="dialog"
      aria-modal="true"
      aria-label={etiqueta}
    >
      <div className={`relative w-full ${ancho} min-h-[100dvh] sm:min-h-0 sm:rounded-2xl`} style={{ background: "#0f0d24", border: `1px solid ${t.borde}`, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
        {children}
      </div>
    </div>
  )
}

export function BotonCerrar({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="icon-btn" aria-label="Cerrar">
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
      </svg>
    </button>
  )
}

export function Seccion({ titulo, icono, accion, children }: { titulo: string; icono?: ReactNode; accion?: ReactNode; children: ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: t.suave }}>
          {icono}
          {titulo}
        </h3>
        {accion}
      </div>
      {children}
    </section>
  )
}
