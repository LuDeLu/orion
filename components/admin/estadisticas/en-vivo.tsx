"use client"

import { useEffect, useState } from "react"

type Vivo = { total: number; paginas: Record<string, number> }

/** Visitantes activos en los últimos 5 minutos, refrescado cada 15 segundos. */
export function EnVivo({ inicial }: { inicial: Vivo }) {
  const [vivo, setVivo] = useState(inicial)

  useEffect(() => {
    const t = setInterval(async () => {
      if (document.visibilityState !== "visible") return
      try {
        const r = await fetch("/api/admin/analitica/vivo", { cache: "no-store" })
        if (r.ok) setVivo(await r.json())
      } catch {}
    }, 15_000)
    return () => clearInterval(t)
  }, [])

  const paginas = Object.entries(vivo.paginas).sort((a, b) => b[1] - a[1]).slice(0, 4)

  return (
    <div className="rounded-xl p-4 sm:p-5 h-full" style={{ background: "rgba(14,12,34,0.70)", border: "1px solid rgba(52,211,153,0.18)" }}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(244,242,238,0.45)" }}>En vivo</span>
        <span className="relative flex w-2.5 h-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
          <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-emerald-400" />
        </span>
      </div>
      <div className="mt-2 text-3xl font-bold text-white tabular">{vivo.total}</div>
      <div className="text-xs" style={{ color: "rgba(244,242,238,0.38)" }}>{vivo.total === 1 ? "persona" : "personas"} en el sitio ahora</div>
      {paginas.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs">
          {paginas.map(([p, n]) => (
            <li key={p} className="flex justify-between gap-2" style={{ color: "rgba(244,242,238,0.65)" }}>
              <span className="truncate">{p}</span>
              <span className="tabular">{n}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
