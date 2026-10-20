"use client"

import { useEffect, useState } from "react"

const CLAVE = "orion_no_medir"

/** Excluye este navegador de las estadísticas (para no contar las visitas del equipo). */
export function NoMedir() {
  const [excluido, setExcluido] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      setExcluido(localStorage.getItem(CLAVE) === "1")
    } catch {
      setExcluido(false)
    }
  }, [])

  if (excluido === null) return null

  function alternar() {
    try {
      if (excluido) localStorage.removeItem(CLAVE)
      else localStorage.setItem(CLAVE, "1")
      setExcluido(!excluido)
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={alternar}
      className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full transition-colors"
      style={{
        background: excluido ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${excluido ? "rgba(52,211,153,0.25)" : "rgba(255,255,255,0.08)"}`,
        color: excluido ? "rgba(110,231,183,0.9)" : "rgba(244,242,238,0.5)",
      }}
      title="Guarda una marca en este navegador para que tus propias visitas no se cuenten"
    >
      {excluido ? "✓ Este navegador no se cuenta" : "No contar este navegador"}
    </button>
  )
}
