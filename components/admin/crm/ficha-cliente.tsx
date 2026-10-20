"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { area as buscarArea, estadoCliente, ESTADOS_CLIENTE, inicialesDe, responsable } from "@/lib/crm/modelo"
import { dinero, fechaAr, formatoCuit, nombreDocumento, numeroCbte, tipoCbte } from "@/lib/facturacion/modelo"
import { useCrm } from "./use-crm"
import { ModalCliente } from "./modal-cliente"
import { Avatar, Pastilla, t } from "./piezas"

export interface DocResumen {
  id: string
  clase: "factura" | "presupuesto"
  tipo: number
  puntoVenta: number
  numero: number
  fecha: string
  total: number
  moneda: string
  estado: string
  entorno?: string
}

const soloNumeros = (s: string) => s.replace(/\D/g, "")

/** Cabecera de la página de un cliente: datos, contacto, notas y facturación. */
export function FichaCliente({ id, documentos }: { id: string; documentos: DocResumen[] }) {
  const router = useRouter()
  const { datos, actualizarCliente, borrarCliente } = useCrm()
  const [editando, setEditando] = useState(false)
  const [notas, setNotas] = useState<string | null>(null)
  const c = datos.clientes.find((x) => x.id === id)
  if (!c) return null

  const est = estadoCliente(c.estado)
  const resp = c.responsable ? responsable(c.responsable) : null
  const tel = soloNumeros(c.telefono)
  const facturas = documentos.filter((d) => d.clase === "factura" && d.estado === "emitido" && d.entorno === "produccion")
  const hace12 = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10)
  const facturado = facturas
    .filter((d) => d.fecha >= hace12)
    .reduce((s, d) => s + (tipoCbte(d.tipo)?.clase === "nc" ? -d.total : d.total), 0)
  const presupuestos = documentos.filter((d) => d.clase === "presupuesto" && d.estado === "vigente")

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-4 mb-2">
      <section className="rounded-xl p-5" style={{ background: t.panel, boxShadow: `inset 0 0 0 1px ${t.borde}, inset 4px 0 0 ${c.color}` }}>
        <div className="flex items-start gap-4">
          <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0" style={{ background: `${c.color}26`, color: c.color }}>
            {inicialesDe(c.nombre)}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-white break-words">{c.nombre}</h1>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <select
                value={c.estado}
                onChange={(e) => actualizarCliente(c.id, { estado: e.target.value as typeof c.estado })}
                className="rounded-md px-2 py-0.5 text-[11px] font-semibold outline-none cursor-pointer"
                style={{ background: `${est?.color}1f`, color: est?.color, boxShadow: `inset 0 0 0 1px ${est?.color}45` }}
                aria-label="Estado del cliente"
              >
                {ESTADOS_CLIENTE.map((e) => (
                  <option key={e.id} value={e.id} style={{ background: "#16132f", color: "#fff" }}>{e.nombre}</option>
                ))}
              </select>
              {c.areas.map((a) => {
                const ar = buscarArea(a)
                return ar ? <Pastilla key={a} color={ar.color} tam="xs">{ar.nombre}</Pastilla> : null
              })}
              {c.rubro && <span className="text-xs" style={{ color: t.suave }}>· {c.rubro}</span>}
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button type="button" onClick={() => setEditando(true)} className="logout-btn rounded-lg px-3 py-1.5 text-xs">Editar</button>
            <button
              type="button"
              onClick={async () => {
                if (!confirm(`¿Eliminar a ${c.nombre}? Sus tareas quedan en el tablero como "sin cliente".`)) return
                await borrarCliente(c.id)
                router.push("/admin/crm?vista=clientes")
              }}
              className="icon-btn"
              aria-label="Eliminar cliente"
              title="Eliminar cliente"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12ZM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4Z" /></svg>
            </button>
          </div>
        </div>

        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-5 text-sm">
          {c.contacto && <Dato etiqueta="Contacto" valor={c.contacto} />}
          {c.cuit && <Dato etiqueta="CUIT" valor={formatoCuit(c.cuit)} />}
          {c.email && <Dato etiqueta="Email" valor={<a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>} />}
          {c.telefono && (
            <Dato
              etiqueta="Teléfono"
              valor={
                <span className="inline-flex items-center gap-2">
                  <a href={`tel:${tel}`} className="hover:underline">{c.telefono}</a>
                  {tel.length >= 8 && (
                    <a href={`https://wa.me/${tel}`} target="_blank" rel="noopener" className="text-xs font-semibold" style={{ color: "#4ade80" }}>WhatsApp ↗</a>
                  )}
                </span>
              }
            />
          )}
          {c.web && <Dato etiqueta="Web" valor={<a href={c.web.startsWith("http") ? c.web : `https://${c.web}`} target="_blank" rel="noopener" className="hover:underline">{c.web}</a>} />}
          {resp && (
            <Dato
              etiqueta="Socio a cargo"
              valor={
                <span className="inline-flex items-center gap-2">
                  <Avatar id={resp.id} tam={20} conBorde={false} />
                  {resp.nombre}
                </span>
              }
            />
          )}
        </dl>

        <div className="mt-5">
          <span className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: t.suave }}>Notas</span>
          <textarea
            value={notas ?? c.notas}
            onChange={(e) => setNotas(e.target.value)}
            onBlur={() => {
              if (notas !== null && notas !== c.notas) actualizarCliente(c.id, { notas })
              setNotas(null)
            }}
            rows={Math.min(10, Math.max(3, (notas ?? c.notas).split("\n").length + 1))}
            placeholder="Acuerdos, accesos, preferencias del cliente… (se guarda solo)"
            className="input-orion w-full rounded-lg px-3 py-2 text-sm resize-y"
          />
        </div>
      </section>

      <section className="rounded-xl p-5" style={{ background: t.panel, boxShadow: `inset 0 0 0 1px ${t.borde}` }}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-sm font-semibold text-white">Facturación</h2>
          <div className="flex gap-1.5">
            <Link href={`/admin/facturacion/nuevo?modo=presupuesto&cliente=${c.id}`} className="logout-btn rounded-lg px-2.5 py-1 text-xs">Presupuesto</Link>
            <Link href={`/admin/facturacion/nuevo?cliente=${c.id}`} className="rounded-lg px-2.5 py-1 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg,#e0642f,#c9521f)" }}>Facturar</Link>
          </div>
        </div>
        {!c.cuit ? (
          <p className="text-xs" style={{ color: t.suave }}>Cargá el CUIT del cliente para ver acá sus facturas y presupuestos.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: t.tenue }}>Facturado 12 meses</div>
                <div className="text-base font-bold text-white tabular mt-0.5">{dinero(facturado)}</div>
              </div>
              <div className="rounded-lg p-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: t.tenue }}>Presupuestos vigentes</div>
                <div className="text-base font-bold text-white tabular mt-0.5">{presupuestos.length}</div>
              </div>
            </div>
            {documentos.length === 0 ? (
              <p className="text-xs" style={{ color: t.suave }}>Sin comprobantes todavía.</p>
            ) : (
              <ul className="space-y-1 max-h-56 overflow-y-auto -mx-1">
                {documentos.slice(0, 20).map((d) => (
                  <li key={d.id}>
                    <Link href={`/admin/facturacion/${encodeURIComponent(d.id)}`} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-white/5">
                      <span className="min-w-0 truncate" style={{ color: t.media }}>
                        {nombreDocumento(d)} {d.clase === "presupuesto" ? `P-${String(d.numero).padStart(6, "0")}` : numeroCbte(d.puntoVenta, d.numero)}
                        <span style={{ color: t.tenue }}> · {fechaAr(d.fecha)}</span>
                      </span>
                      <span className="tabular shrink-0 text-white">{dinero(d.total, d.moneda)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      {editando && <ModalCliente cliente={c} onCerrar={() => setEditando(false)} />}
    </div>
  )
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: React.ReactNode }) {
  return (
    <div className="flex gap-3 min-w-0">
      <dt className="w-24 shrink-0 text-xs pt-0.5" style={{ color: t.suave }}>{etiqueta}</dt>
      <dd className="min-w-0 break-words" style={{ color: t.media }}>{valor}</dd>
    </div>
  )
}
