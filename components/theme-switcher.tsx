"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

/**
 * Alterna entre la paleta oscura (por defecto) y la clara.
 *
 * `next-themes` escribe data-theme en <html> antes del primer pintado, así que
 * no hay destello. Hasta que monta no sabemos cuál está activo: mientras tanto
 * renderizamos el botón deshabilitado para no cambiar el layout.
 */
export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isLight = mounted && resolvedTheme === "light"
  const label = isLight ? "Activar tema oscuro" : "Activar tema claro"

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={label}
      title={label}
      className={`relative w-9 h-9 rounded-md border border-[var(--hairline)] bg-[var(--tint-1)] flex items-center justify-center text-foreground/65 transition-colors duration-300 hover:text-primary hover:border-primary/40 hover:bg-primary/[0.08] ${className}`}
    >
      {/* Ambos íconos montados: el cruce evita el salto al cambiar */}
      <Sun
        className="absolute w-4 h-4 transition-all duration-300"
        style={{
          opacity: isLight ? 0 : 1,
          transform: isLight ? "rotate(-70deg) scale(0.6)" : "rotate(0) scale(1)",
        }}
        aria-hidden
      />
      <Moon
        className="absolute w-4 h-4 transition-all duration-300"
        style={{
          opacity: isLight ? 1 : 0,
          transform: isLight ? "rotate(0) scale(1)" : "rotate(70deg) scale(0.6)",
        }}
        aria-hidden
      />
    </button>
  )
}
