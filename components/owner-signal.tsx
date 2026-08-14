"use client"

import type { Area } from "@/lib/areas"
import { useT } from "@/components/i18n-provider"
import { fill } from "@/lib/i18n"

/**
 * Señales de "esta área la maneja un dueño".
 *
 * Se usan en las cuatro superficies donde el cliente elige o consulta un área
 * (tríptico del home, grilla de servicios, landing del área y contacto) para
 * que el argumento aparezca siempre y no solo en la página del área.
 *
 * El cargo hace el trabajo solo: no hace falta un sello encima repitiéndolo.
 */

/**
 * Identidad del dueño: iniciales, nombre y —lo importante— el cargo.
 * `size="sm"` es la variante para tarjetas; `md` para la ficha de la landing.
 * En tarjetas se muestra sólo el cargo societario: el directivo es más largo
 * y terminaba recortado.
 */
export function OwnerIdentity({
  area,
  size = "sm",
  showTitle = false,
}: {
  area: Area
  size?: "sm" | "md"
  showTitle?: boolean
}) {
  const rgb = area.accent.rgb
  const md = size === "md"

  return (
    <div className="flex items-center gap-3 min-w-0">
      <div
        className={`${md ? "w-14 h-14 text-lg rounded-xl" : "w-9 h-9 text-xs rounded-lg"} flex items-center justify-center font-bold shrink-0`}
        style={{
          background: `rgba(${rgb},0.18)`,
          border: `1px solid rgba(${rgb},0.35)`,
          color: area.accent.hex,
        }}
        aria-hidden
      >
        {area.owner.initials}
      </div>
      <div className="min-w-0">
        <p
          className={`${md ? "" : "text-sm"} font-bold text-foreground leading-tight truncate`}
        >
          {area.owner.name}
        </p>
        <p
          className={`${md ? "text-sm mt-0.5" : "text-xs mt-px"} font-semibold leading-snug`}
          style={{ color: area.accent.hex }}
        >
          {area.owner.role}
        </p>
        {showTitle && (
          <p className={`${md ? "text-sm" : "text-xs"} text-foreground/65 leading-snug`}>
            {area.owner.title}
          </p>
        )}
      </div>
    </div>
  )
}

/** Frase larga: quién lleva el proyecto y con quién NO vas a hablar. */
export function OwnerDirectLine({ area, className = "" }: { area: Area; className?: string }) {
  const t = useT().owner

  return (
    <p className={`text-sm text-foreground/65 leading-relaxed ${className}`}>
      {fill(t.direct, { name: area.owner.name, role: area.owner.role.toLowerCase() })}{" "}
      <span className="text-foreground/80 font-medium">{t.noAccountManager}</span>
    </p>
  )
}
