import type { ReactNode } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { COLOR_TONO, linkWhatsApp, type Tono } from "@/lib/portal-formato"

/**
 * Piezas compartidas por las tres pantallas del portal del cliente.
 *
 * Son componentes de servidor a propósito (sin "use client" ni framer-motion):
 * el seguimiento tiene que pintar completo en el primer render, incluso en un
 * celular con mala señal en la vereda del local.
 *
 * El acento es el verde de Mintaka (`--area-it`), no el naranja de la agencia:
 * quien entra acá viene del área de IT.
 */

const ACENTO = "var(--area-it)"
const ACENTO_RGB = "var(--area-it-rgb)"

// ---------------------------------------------------------------------------

export function Marco({
  titulo,
  bajada,
  chip,
  children,
}: {
  titulo: string
  bajada?: string
  chip?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
      <header className="mb-8">
        <p
          className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{
            color: ACENTO,
            background: `rgba(${ACENTO_RGB},0.12)`,
            border: `1px solid rgba(${ACENTO_RGB},0.28)`,
          }}
        >
          Área IT · OrionMKT
        </p>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
              {titulo}
            </h1>
            {bajada && <p className="mt-2 max-w-2xl text-foreground/65">{bajada}</p>}
          </div>
          {chip}
        </div>
      </header>

      {children}

      <PieDeAyuda />
    </section>
  )
}

function PieDeAyuda() {
  return (
    <footer className="mt-12 flex flex-col items-start gap-3 border-t border-[var(--hairline)] pt-6 text-sm text-foreground/55 sm:flex-row sm:items-center sm:justify-between">
      <p>
        ¿Alguna duda con esto? Escribinos y lo vemos.{" "}
        <span className="text-foreground/40">Respondemos en horario comercial.</span>
      </p>
      <a
        href={linkWhatsApp("Hola! Te escribo por el portal del área IT")}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
        style={{
          color: ACENTO,
          background: `rgba(${ACENTO_RGB},0.12)`,
          border: `1px solid rgba(${ACENTO_RGB},0.28)`,
        }}
      >
        <MessageCircle className="h-4 w-4" />
        Escribinos por WhatsApp
      </a>
    </footer>
  )
}

// ---------------------------------------------------------------------------

export function Carta({
  titulo,
  detalle,
  accion,
  className,
  children,
}: {
  titulo?: string
  detalle?: string
  accion?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("glass-card rounded-2xl p-5 sm:p-6", className)}>
      {(titulo || accion) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {titulo && (
              <h2 className="font-display text-base font-bold text-foreground">{titulo}</h2>
            )}
            {detalle && <p className="mt-0.5 text-sm text-foreground/55">{detalle}</p>}
          </div>
          {accion}
        </div>
      )}
      {children}
    </div>
  )
}

export function Etiqueta({ tono = "neutro", children }: { tono?: Tono; children: ReactNode }) {
  const c = COLOR_TONO[tono]
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ color: c.fg, background: c.bg, border: `1px solid ${c.borde}` }}
    >
      {children}
    </span>
  )
}

export function Dato({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
        {etiqueta}
      </dt>
      <dd className="mt-1 break-words text-sm text-foreground/85">{children}</dd>
    </div>
  )
}

export function Vacio({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-[var(--hairline)] px-4 py-8 text-center text-sm text-foreground/45">
      {children}
    </p>
  )
}

// ---------------------------------------------------------------------------

/**
 * Pantalla de token inválido / API caída. Nunca dice "404" ni "500": el cliente
 * escaneó un QR, no está debugueando.
 */
export function PortalError({
  titulo,
  mensaje,
  detalle,
}: {
  titulo: string
  mensaje: string
  detalle?: string
}) {
  return (
    <section className="relative z-10 mx-auto flex w-full max-w-lg flex-col items-center px-4 pb-24 pt-32 text-center">
      <span
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "var(--brand-gold-dim)", border: "1px solid rgba(219,172,52,0.3)" }}
      >
        <AlertTriangle className="h-8 w-8" style={{ color: "var(--brand-gold)" }} />
      </span>

      <h1 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">{titulo}</h1>
      <p className="mt-3 text-foreground/65">{mensaje}</p>
      {detalle && <p className="mt-2 text-sm text-foreground/40">{detalle}</p>}

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <a
          href={linkWhatsApp("Hola! Tengo un problema para entrar al portal del área IT")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors sm:w-auto"
          style={{
            color: ACENTO,
            background: `rgba(${ACENTO_RGB},0.12)`,
            border: `1px solid rgba(${ACENTO_RGB},0.3)`,
          }}
        >
          <MessageCircle className="h-4 w-4" />
          Escribinos por WhatsApp
        </a>
        <Link
          href="/it"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-foreground/20 px-5 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.06] sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Ir al área de IT
        </Link>
      </div>
    </section>
  )
}
