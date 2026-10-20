"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { dinero, fechaAr, formatoCuit, nombreDocumento, numeroCbte, tipoCbte, type Documento } from "@/lib/facturacion/modelo"
import { Icono, ICONOS, Insignia, Segmentos, Tarjeta, tinta } from "./ui"

type Filtro = "todos" | "facturas" | "presupuestos"

function estadoVisible(d: Documento, hoy: string) {
  if (d.clase === "presupuesto" && d.estado === "vigente" && d.validezDias) {
    const vence = new Date(new Date(d.fecha).getTime() + d.validezDias * 864e5).toISOString().slice(0, 10)
    if (vence < hoy) return "vencido"
  }
  return d.estado
}

export function ListaDocumentos({ docs, hoy }: { docs: Documento[]; hoy: string }) {
  const [filtro, setFiltro] = useState<Filtro>("todos")
  const [q, setQ] = useState("")

  const visibles = useMemo(() => {
    const t = q.trim().toLowerCase()
    return docs.filter((d) => {
      if (filtro === "facturas" && d.clase !== "factura") return false
      if (filtro === "presupuestos" && d.clase !== "presupuesto") return false
      if (!t) return true
      return [d.receptor.nombre, d.receptor.docNro, nombreDocumento(d), numeroCbte(d.puntoVenta, d.numero), d.cae, ...d.items.map((i) => i.descripcion)]
        .join(" ")
        .toLowerCase()
        .includes(t)
    })
  }, [docs, filtro, q])

  return (
    <Tarjeta>
      <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between mb-4">
        <Segmentos<Filtro>
          tam="sm"
          valor={filtro}
          onCambio={setFiltro}
          opciones={[
            { valor: "todos", etiqueta: `Todos (${docs.length})` },
            { valor: "facturas", etiqueta: "Facturas" },
            { valor: "presupuestos", etiqueta: "Presupuestos" },
          ]}
        />
        <div className="relative sm:w-72">
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tinta.tenue }}>
            <Icono d={ICONOS.buscar} className="w-3.5 h-3.5" />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar cliente, número, CAE…"
            aria-label="Buscar comprobantes"
            className="input-orion w-full rounded-lg pl-9 pr-3 py-2 text-sm"
          />
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="py-14 text-center">
          <p className="text-sm" style={{ color: tinta.suave }}>
            {docs.length === 0 ? "Todavía no hay comprobantes." : "No hay resultados con ese filtro."}
          </p>
          {docs.length === 0 && (
            <Link href="/admin/facturacion/nuevo" className="inline-block mt-3 text-sm font-medium" style={{ color: "#e0642f" }}>
              Emitir la primera factura →
            </Link>
          )}
        </div>
      ) : (
        <div className="-mx-4 sm:-mx-5 overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest" style={{ color: tinta.tenue }}>
                <th className="font-semibold px-4 sm:px-5 pb-2">Fecha</th>
                <th className="font-semibold px-2 pb-2">Comprobante</th>
                <th className="font-semibold px-2 pb-2">Cliente</th>
                <th className="font-semibold px-2 pb-2 text-right">Total</th>
                <th className="font-semibold px-2 pb-2">Estado</th>
                <th className="px-4 sm:px-5 pb-2" />
              </tr>
            </thead>
            <tbody>
              {visibles.map((d) => {
                const esNc = tipoCbte(d.tipo)?.clase === "nc"
                const href = `/admin/facturacion/${encodeURIComponent(d.id)}`
                return (
                  <tr key={d.id} className="row-hover-orange border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <td className="px-4 sm:px-5 py-3 whitespace-nowrap tabular" style={{ color: tinta.media }}>
                      {fechaAr(d.fecha)}
                    </td>
                    <td className="px-2 py-3">
                      <Link href={href} className="block hover:underline">
                        <span className="text-white font-medium">{nombreDocumento(d)}</span>
                        <span className="block text-xs tabular" style={{ color: tinta.suave }}>
                          {d.clase === "presupuesto" ? `P-${String(d.numero).padStart(6, "0")}` : numeroCbte(d.puntoVenta, d.numero)}
                        </span>
                      </Link>
                    </td>
                    <td className="px-2 py-3 max-w-[220px]">
                      <span className="block truncate" style={{ color: tinta.media }}>{d.receptor.nombre}</span>
                      {d.receptor.docTipo !== 99 && (
                        <span className="block text-xs tabular" style={{ color: tinta.tenue }}>
                          {d.receptor.docTipo === 80 ? formatoCuit(d.receptor.docNro) : d.receptor.docNro}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-3 text-right whitespace-nowrap tabular font-semibold" style={{ color: esNc ? "rgba(253,164,175,0.95)" : "#fff" }}>
                      {esNc ? "− " : ""}
                      {dinero(d.totales.total, d.moneda)}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex gap-1 flex-wrap">
                        <Insignia estado={estadoVisible(d, hoy)} />
                        {d.clase === "factura" && d.entorno === "homologacion" && <Insignia estado="homologacion" />}
                      </div>
                    </td>
                    <td className="px-4 sm:px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        <a href={`${href}/pdf`} target="_blank" rel="noopener" className="icon-btn" title="Ver PDF" aria-label="Ver PDF">
                          <Icono d={ICONOS.pdf} className="w-3.5 h-3.5" />
                        </a>
                        <a href={`${href}/pdf?descargar=1`} className="icon-btn" title="Descargar PDF" aria-label="Descargar PDF">
                          <Icono d={ICONOS.descargar} className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Tarjeta>
  )
}
