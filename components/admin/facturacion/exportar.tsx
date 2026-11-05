"use client"

import { useState } from "react"
import { Boton, Campo, Entrada, Icono, ICONOS, Segmentos, tinta } from "./ui"

const iso = (d: Date) => d.toISOString().slice(0, 10)

function rango(id: string, hoy: string): [string, string] {
  const [a, m] = hoy.split("-").map(Number)
  switch (id) {
    case "mes_pasado":
      return [iso(new Date(Date.UTC(a, m - 2, 1))), iso(new Date(Date.UTC(a, m - 1, 0)))]
    case "anio":
      return [`${a}-01-01`, hoy]
    case "12m":
      return [iso(new Date(Date.UTC(a - 1, m - 1, Number(hoy.slice(8)) + 1))), hoy]
    default:
      return [`${hoy.slice(0, 8)}01`, hoy]
  }
}

const ATAJOS = [
  { id: "mes", nombre: "Este mes" },
  { id: "mes_pasado", nombre: "Mes pasado" },
  { id: "anio", nombre: "Este año" },
  { id: "12m", nombre: "12 meses" },
]

/** Botón "Exportar" con un panel para elegir período y qué exportar (CSV que abre Excel). */
export function ExportarCsv({ hoy }: { hoy: string }) {
  const [abierto, setAbierto] = useState(false)
  const [[desde, hasta], setRango] = useState<[string, string]>(rango("mes", hoy))
  const [que, setQue] = useState<"comprobantes" | "presupuestos">("comprobantes")

  const url = `/api/admin/facturacion/exportar?desde=${desde}&hasta=${hasta}&que=${que}`

  return (
    <div className="relative">
      <Boton onClick={() => setAbierto((x) => !x)} aria-expanded={abierto}>
        <Icono d={ICONOS.descargar} />
        <span className="hidden sm:inline">Exportar</span>
      </Boton>
      {abierto && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setAbierto(false)} aria-hidden />
          <div
            className="absolute z-30 right-0 mt-2 w-[min(340px,calc(100vw-32px))] rounded-xl p-4 space-y-3 shadow-2xl"
            style={{ background: "#16132f", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <p className="text-sm font-semibold text-white">Exportar a Excel</p>
            <Segmentos
              tam="sm"
              valor={que}
              onCambio={setQue}
              opciones={[
                { valor: "comprobantes", etiqueta: "Comprobantes" },
                { valor: "presupuestos", etiqueta: "Presupuestos" },
              ]}
            />
            <div className="flex flex-wrap gap-1.5">
              {ATAJOS.map((a) => {
                const [d, h] = rango(a.id, hoy)
                const activo = d === desde && h === hasta
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setRango([d, h])}
                    className="rounded-full px-2.5 py-1 text-xs transition-colors"
                    style={
                      activo
                        ? { background: "rgba(224,100,47,0.18)", color: "#fff", boxShadow: "inset 0 0 0 1px rgba(224,100,47,0.45)" }
                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: tinta.media }
                    }
                  >
                    {a.nombre}
                  </button>
                )
              })}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Campo etiqueta="Desde">
                <Entrada type="date" value={desde} max={hasta} onChange={(e) => setRango([e.target.value, hasta])} />
              </Campo>
              <Campo etiqueta="Hasta">
                <Entrada type="date" value={hasta} min={desde} onChange={(e) => setRango([desde, e.target.value])} />
              </Campo>
            </div>
            <a
              href={url}
              onClick={() => setTimeout(() => setAbierto(false), 300)}
              className="flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-white transition hover:brightness-110"
              style={{ background: "linear-gradient(135deg,#e0642f,#c9521f)" }}
            >
              <Icono d={ICONOS.descargar} /> Descargar CSV
            </a>
            <p className="text-[11px] leading-relaxed" style={{ color: tinta.tenue }}>
              Se abre directo en Excel o Google Sheets. Incluye CAE, importes, cobros y saldo de cada comprobante del entorno activo.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
