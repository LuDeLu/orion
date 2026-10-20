"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { area as buscarArea, estadoCliente, estadoVencimiento, ESTADOS_CLIENTE, fechaCorta, inicialesDe } from "@/lib/crm/modelo"
import { useCrm } from "./use-crm"
import { Avatar, Chip, Pastilla, t } from "./piezas"

const normal = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

export function VistaClientes({ busqueda, onNuevo }: { busqueda: string; onNuevo: () => void }) {
  const { datos } = useCrm()
  const [estados, setEstados] = useState<string[]>(["prospecto", "activo", "pausado"])

  const filas = useMemo(() => {
    const q = normal(busqueda.trim())
    return datos.clientes
      .filter((c) => !estados.length || estados.includes(c.estado))
      .filter((c) => !q || normal([c.nombre, c.contacto, c.rubro, c.email, c.cuit].join(" ")).includes(q))
      .map((c) => {
        const ts = datos.tareas.filter((x) => x.clienteId === c.id)
        const abiertas = ts.filter((x) => !x.completada)
        const vencidas = abiertas.filter((x) => estadoVencimiento(x) === "vencida").length
        const proxima = abiertas.filter((x) => x.vence).sort((a, b) => a.vence!.localeCompare(b.vence!))[0]
        const hace30 = new Date(Date.now() - 30 * 864e5).toISOString()
        const hechas30 = ts.filter((x) => x.completada && x.completada >= hace30).length
        return { c, abiertas: abiertas.length, vencidas, proxima, hechas30 }
      })
      .sort((a, b) => b.vencidas - a.vencidas || b.abiertas - a.abiertas || a.c.nombre.localeCompare(b.c.nombre, "es"))
  }, [datos, estados, busqueda])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-1.5">
        {ESTADOS_CLIENTE.map((e) => (
          <Chip key={e.id} activo={estados.includes(e.id)} onClick={() => setEstados((s) => (s.includes(e.id) ? s.filter((x) => x !== e.id) : [...s, e.id]))} color={e.color}>
            {e.nombre} · {datos.clientes.filter((c) => c.estado === e.id).length}
          </Chip>
        ))}
      </div>

      {filas.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: t.suave }}>{datos.clientes.length ? "No hay clientes con ese filtro." : "Todavía no cargaste clientes."}</p>
          <button type="button" onClick={onNuevo} className="mt-3 text-sm font-medium" style={{ color: "#e0642f" }}>+ Agregar cliente</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filas.map(({ c, abiertas, vencidas, proxima, hechas30 }) => {
            const est = estadoCliente(c.estado)
            return (
              <Link
                key={c.id}
                href={`/admin/crm/clientes/${c.id}`}
                className="group block rounded-xl p-4 transition-all hover:-translate-y-0.5"
                style={{ background: t.panel, boxShadow: `inset 0 0 0 1px ${t.borde}, inset 3px 0 0 ${c.color}` }}
              >
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0" style={{ background: `${c.color}26`, color: c.color }}>
                    {inicialesDe(c.nombre)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white truncate group-hover:underline">{c.nombre}</p>
                    <p className="text-xs truncate" style={{ color: t.suave }}>{[c.contacto, c.rubro].filter(Boolean).join(" · ") || "—"}</p>
                  </div>
                  {c.responsable && <Avatar id={c.responsable} tam={24} conBorde={false} />}
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {est && <Pastilla color={est.color} tam="xs">{est.nombre}</Pastilla>}
                  {c.areas.map((a) => {
                    const ar = buscarArea(a)
                    return ar ? <Pastilla key={a} color={ar.color} tam="xs">{ar.nombre}</Pastilla> : null
                  })}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <Dato valor={abiertas} etiqueta="abiertas" />
                  <Dato valor={vencidas} etiqueta="vencidas" color={vencidas ? "#fda4af" : undefined} />
                  <Dato valor={hechas30} etiqueta="hechas 30d" color={hechas30 ? "#6ee7b7" : undefined} />
                </div>
                {proxima && (
                  <p className="text-xs mt-3 truncate" style={{ color: t.suave }}>
                    Próximo: <span style={{ color: t.media }}>{proxima.titulo}</span> · {fechaCorta(proxima.vence!)}
                  </p>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Dato({ valor, etiqueta, color }: { valor: number; etiqueta: string; color?: string }) {
  return (
    <div className="rounded-lg py-2" style={{ background: "rgba(255,255,255,0.03)" }}>
      <div className="text-lg font-bold tabular" style={{ color: color ?? "#fff" }}>{valor}</div>
      <div className="text-[10px] uppercase tracking-wider" style={{ color: t.tenue }}>{etiqueta}</div>
    </div>
  )
}
