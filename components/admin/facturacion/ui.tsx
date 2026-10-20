// Piezas visuales del módulo de facturación, con el lenguaje del panel admin.
import Link from "next/link"
import type { ComponentProps, ReactNode } from "react"

export const tinta = {
  suave: "rgba(244,242,238,0.45)",
  tenue: "rgba(244,242,238,0.30)",
  media: "rgba(244,242,238,0.70)",
}

export function Tarjeta({ titulo, accion, children, className = "", id }: { titulo?: ReactNode; accion?: ReactNode; children: ReactNode; className?: string; id?: string }) {
  return (
    <section
      id={id}
      className={`rounded-xl p-4 sm:p-5 ${className}`}
      style={{ background: "rgba(14,12,34,0.60)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
    >
      {(titulo || accion) && (
        <div className="flex items-center justify-between gap-3 mb-4">
          {titulo && <h2 className="text-sm font-semibold text-white">{titulo}</h2>}
          {accion}
        </div>
      )}
      {children}
    </section>
  )
}

type Variante = "primario" | "secundario" | "fantasma" | "peligro"

const estilos: Record<Variante, { background: string; border: string; color: string }> = {
  primario: { background: "linear-gradient(135deg,#e0642f,#c9521f)", border: "1px solid rgba(224,100,47,0.6)", color: "#fff" },
  secundario: { background: "rgba(224,100,47,0.10)", border: "1px solid rgba(224,100,47,0.25)", color: "rgba(244,170,130,0.95)" },
  fantasma: { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(244,242,238,0.75)" },
  peligro: { background: "rgba(251,113,133,0.08)", border: "1px solid rgba(251,113,133,0.25)", color: "rgba(253,164,175,0.95)" },
}

const claseBoton =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150 hover:brightness-110 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"

export function Boton({ variante = "fantasma", className = "", style, ...props }: ComponentProps<"button"> & { variante?: Variante }) {
  return <button type="button" className={`${claseBoton} ${className}`} style={{ ...estilos[variante], ...style }} {...props} />
}

export function BotonLink({ variante = "fantasma", className = "", ...props }: ComponentProps<typeof Link> & { variante?: Variante }) {
  return <Link className={`${claseBoton} ${className}`} style={estilos[variante]} {...props} />
}

export function Etiqueta({ children, ayuda }: { children: ReactNode; ayuda?: ReactNode }) {
  return (
    <span className="flex items-baseline justify-between gap-2 mb-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: tinta.suave }}>
        {children}
      </span>
      {ayuda && <span className="text-[10px] normal-case" style={{ color: tinta.tenue }}>{ayuda}</span>}
    </span>
  )
}

export function Campo({ etiqueta, ayuda, className = "", children }: { etiqueta: ReactNode; ayuda?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <Etiqueta ayuda={ayuda}>{etiqueta}</Etiqueta>
      {children}
    </label>
  )
}

export const claseInput = "input-orion w-full rounded-lg px-3 py-2 text-sm"

export function Entrada(props: ComponentProps<"input">) {
  return <input {...props} className={`${claseInput} ${props.className ?? ""}`} />
}

export function Selector({ children, ...props }: ComponentProps<"select">) {
  return (
    <select {...props} className={`${claseInput} ${props.className ?? ""}`} style={{ background: "rgba(255,255,255,0.04)" }}>
      {children}
    </select>
  )
}

/** Grupo de botones excluyentes. */
export function Segmentos<T extends string | number>({
  opciones,
  valor,
  onCambio,
  tam = "md",
}: {
  opciones: { valor: T; etiqueta: ReactNode; deshabilitado?: boolean }[]
  valor: T
  onCambio: (v: T) => void
  tam?: "sm" | "md"
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} role="radiogroup">
      {opciones.map((o) => {
        const activo = o.valor === valor
        return (
          <button
            key={String(o.valor)}
            type="button"
            role="radio"
            aria-checked={activo}
            disabled={o.deshabilitado}
            onClick={() => onCambio(o.valor)}
            className={`rounded-lg font-medium transition-all duration-150 disabled:opacity-40 ${tam === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm"}`}
            style={
              activo
                ? { background: "rgba(224,100,47,0.18)", color: "#fff", boxShadow: "inset 0 0 0 1px rgba(224,100,47,0.45)" }
                : { color: tinta.suave }
            }
          >
            {o.etiqueta}
          </button>
        )
      })}
    </div>
  )
}

const coloresEstado: Record<string, { bg: string; border: string; color: string; texto: string }> = {
  emitido: { bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.22)", color: "rgba(110,231,183,0.95)", texto: "Emitido" },
  pendiente: { bg: "rgba(219,172,52,0.10)", border: "rgba(219,172,52,0.28)", color: "rgba(253,224,71,0.90)", texto: "Pendiente" },
  rechazado: { bg: "rgba(251,113,133,0.08)", border: "rgba(251,113,133,0.22)", color: "rgba(253,164,175,0.95)", texto: "Rechazado" },
  vigente: { bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.22)", color: "rgba(125,211,252,0.95)", texto: "Vigente" },
  aceptado: { bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.22)", color: "rgba(110,231,183,0.95)", texto: "Aceptado" },
  facturado: { bg: "rgba(224,100,47,0.10)", border: "rgba(224,100,47,0.25)", color: "rgba(244,170,130,0.95)", texto: "Facturado" },
  vencido: { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.10)", color: "rgba(244,242,238,0.50)", texto: "Vencido" },
  homologacion: { bg: "rgba(219,172,52,0.10)", border: "rgba(219,172,52,0.28)", color: "rgba(253,224,71,0.90)", texto: "Prueba" },
}

export function Insignia({ estado, texto }: { estado: string; texto?: string }) {
  const c = coloresEstado[estado] ?? coloresEstado.vencido
  return (
    <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
      {texto ?? c.texto}
    </span>
  )
}

export function Aviso({ tono = "info", children }: { tono?: "info" | "alerta" | "error" | "ok"; children: ReactNode }) {
  const c = {
    info: { bg: "rgba(56,189,248,0.06)", border: "rgba(56,189,248,0.20)", color: "rgba(186,230,253,0.90)" },
    alerta: { bg: "rgba(219,172,52,0.08)", border: "rgba(219,172,52,0.25)", color: "rgba(253,230,138,0.92)" },
    error: { bg: "rgba(251,113,133,0.07)", border: "rgba(251,113,133,0.25)", color: "rgba(254,205,211,0.95)" },
    ok: { bg: "rgba(52,211,153,0.07)", border: "rgba(52,211,153,0.22)", color: "rgba(167,243,208,0.95)" },
  }[tono]
  return (
    <div className="rounded-lg px-3.5 py-2.5 text-sm leading-relaxed" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}>
      {children}
    </div>
  )
}

export function EncabezadoPagina({ antetitulo, titulo, bajada, acciones }: { antetitulo: string; titulo: string; bajada?: ReactNode; acciones?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 flex-wrap">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] mb-1" style={{ color: "rgba(219,172,52,0.70)" }}>
          {antetitulo}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{titulo}</h1>
        {bajada && <p className="text-sm mt-1" style={{ color: tinta.suave }}>{bajada}</p>}
      </div>
      {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
    </div>
  )
}

export function Icono({ d, className = "w-4 h-4" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} fill-current shrink-0`} aria-hidden>
      <path d={d} />
    </svg>
  )
}

export const ICONOS = {
  mas: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z",
  pdf: "M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2Zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1Zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3Zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5ZM9 9.5h1v-1H9v1ZM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6Zm10 5.5h1v-3h-1v3Z",
  descargar: "M5 20h14v-2H5v2ZM19 9h-4V3H9v6H5l7 7 7-7Z",
  engranaje: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58ZM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2Z",
  check: "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17Z",
  cruz: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z",
  basura: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z",
  ojo: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5ZM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  buscar: "M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5Zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14Z",
  recibo: "M18 17H6v-2h12v2Zm0-4H6v-2h12v2Zm0-4H6V7h12v2ZM3 22l1.5-1.5L6 22l1.5-1.5L9 22l1.5-1.5L12 22l1.5-1.5L15 22l1.5-1.5L18 22l1.5-1.5L21 22V2l-1.5 1.5L18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2 4.5 3.5 3 2v20Z",
  copiar: "M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1Zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Zm0 16H8V7h11v14Z",
  deshacer: "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62A7.96 7.96 0 0 1 12.5 10c3.54 0 6.55 2.31 7.6 5.5l2.37-.78A10.02 10.02 0 0 0 12.5 8Z",
  rayo: "M7 2v11h3v9l7-12h-4l4-8H7Z",
}
