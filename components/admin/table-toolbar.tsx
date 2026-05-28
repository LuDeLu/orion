"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

type Filter = { name: string; label: string; options: { value: string; label: string }[] }

export function TableToolbar({
  filters = [],
  exportHref,
  totalLabel,
}: {
  filters?: Filter[]
  exportHref?: string
  totalLabel?: string
}) {
  const router = useRouter()
  const params = useSearchParams()
  const [pending, start] = useTransition()
  const [q, setQ] = useState(params.get("q") || "")

  useEffect(() => {
    setQ(params.get("q") || "")
  }, [params])

  function update(next: Record<string, string | null>) {
    const p = new URLSearchParams(params)
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === "") p.delete(k)
      else p.set(k, v)
    }
    start(() => router.replace(`?${p.toString()}`))
  }

  const hasAny = ["q", "country", "device", "from", "to"].some((k) => params.get(k))

  const inputCls = "input-orion rounded-lg px-2.5 py-1.5 text-xs text-white/80 min-w-0"

  return (
    <div className="space-y-2.5 mb-4">
      {/* Search row */}
      <div className="flex items-center gap-2">
        {/* Search input */}
        <div className="relative flex-1 min-w-0">
          <svg
            viewBox="0 0 24 24"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none fill-current"
            style={{ color: "rgba(244,242,238,0.35)" }}
          >
            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.51 6.51 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14Zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14Z" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") update({ q })
            }}
            onBlur={() => params.get("q") !== q && update({ q })}
            placeholder="Buscar..."
            aria-label="Buscar"
            className="input-orion w-full rounded-lg pl-9 pr-3 py-2 text-sm"
          />
        </div>

        {/* Export CSV */}
        {exportHref && (
          <a
            href={exportHref}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors duration-150 shrink-0 whitespace-nowrap"
            style={{
              background: "rgba(224,100,47,0.10)",
              border: "1px solid rgba(224,100,47,0.22)",
              color: "rgba(224,100,47,0.85)",
            }}
            title="Exportar a CSV"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
              <path d="M5 20h14v-2H5v2ZM19 9h-4V3H9v6H5l7 7 7-7Z" />
            </svg>
            <span className="hidden sm:inline">Exportar CSV</span>
          </a>
        )}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="text-[10px] font-semibold uppercase tracking-widest shrink-0"
          style={{ color: "rgba(244,242,238,0.28)" }}
        >
          Filtros
        </span>

        <input
          type="date"
          defaultValue={params.get("from") || ""}
          onChange={(e) => update({ from: e.target.value || null })}
          aria-label="Desde"
          className={`${inputCls} flex-1 sm:flex-initial sm:w-auto`}
        />
        <span style={{ color: "rgba(244,242,238,0.25)" }} className="text-xs">→</span>
        <input
          type="date"
          defaultValue={params.get("to") || ""}
          onChange={(e) => update({ to: e.target.value || null })}
          aria-label="Hasta"
          className={`${inputCls} flex-1 sm:flex-initial sm:w-auto`}
        />

        {filters.map((f) => (
          <select
            key={f.name}
            defaultValue={params.get(f.name) || ""}
            onChange={(e) => update({ [f.name]: e.target.value || null })}
            aria-label={f.label}
            className={`${inputCls} max-w-[150px] sm:max-w-none`}
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            <option value="">{f.label}</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}

        {hasAny && (
          <button
            onClick={() => start(() => router.replace("?"))}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-lg transition-colors duration-150"
            style={{
              color: "rgba(224,100,47,0.75)",
              border: "1px solid rgba(224,100,47,0.20)",
              background: "rgba(224,100,47,0.06)",
            }}
          >
            Limpiar filtros
          </button>
        )}

        <div className="flex-1" />

        {totalLabel && (
          <span
            className="text-[11px] whitespace-nowrap tabular"
            style={{ color: "rgba(244,242,238,0.35)" }}
          >
            {totalLabel}
          </span>
        )}

        {pending && (
          <svg className="w-3.5 h-3.5 animate-spin shrink-0" viewBox="0 0 24 24" fill="none" style={{ color: "#e0642f" }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </div>
  )
}
