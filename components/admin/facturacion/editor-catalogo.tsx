"use client"

import { useState } from "react"
import type { Servicio } from "@/lib/facturacion/catalogo"
import { ALICUOTAS, dinero, MONEDAS } from "@/lib/facturacion/modelo"
import { Aviso, Boton, Campo, Entrada, Icono, ICONOS, Selector, Tarjeta, tinta } from "./ui"

type Borrador = Omit<Servicio, "id" | "actualizado"> & { id?: string; precioTexto: string }

const vacio: Borrador = { descripcion: "", precio: 0, precioTexto: "", moneda: "PES", unidad: "u.", iva: 5 }

async function pedir<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, init)
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j.errores?.join(" · ") ?? j.error ?? "Error inesperado")
  return j as T
}

export function EditorCatalogo({ inicial, discrimina }: { inicial: Servicio[]; discrimina: boolean }) {
  const [servicios, setServicios] = useState(inicial)
  const [borrador, setBorrador] = useState<Borrador | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState("")

  const set = <K extends keyof Borrador>(k: K, v: Borrador[K]) => setBorrador((b) => (b ? { ...b, [k]: v } : b))

  async function guardar() {
    if (!borrador) return
    setOcupado(true)
    setError("")
    try {
      const { servicio } = await pedir<{ servicio: Servicio }>("/api/admin/facturacion/catalogo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicio: { ...borrador, precio: Number(borrador.precioTexto.replace(",", ".")) } }),
      })
      setServicios((xs) => [...xs.filter((x) => x.id !== servicio.id), servicio].sort((a, b) => a.descripcion.localeCompare(b.descripcion, "es")))
      setBorrador(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setOcupado(false)
    }
  }

  async function borrar(s: Servicio) {
    if (!confirm(`¿Quitar "${s.descripcion}" del catálogo? Las facturas y abonos que ya lo usan no cambian.`)) return
    try {
      await pedir(`/api/admin/facturacion/catalogo?id=${encodeURIComponent(s.id)}`, { method: "DELETE" })
      setServicios((xs) => xs.filter((x) => x.id !== s.id))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="space-y-5">
      {borrador && (
        <Tarjeta titulo={borrador.id ? "Editar servicio" : "Nuevo servicio"}>
          <div className="grid sm:grid-cols-[minmax(0,1fr)_140px_110px_90px] gap-3">
            <Campo etiqueta="Descripción" ayuda="así sale en la factura">
              <Entrada autoFocus placeholder="Ej.: Gestión de redes sociales – plan básico" value={borrador.descripcion} onChange={(e) => set("descripcion", e.target.value)} />
            </Campo>
            <Campo etiqueta="Precio">
              <Entrada inputMode="decimal" className="text-right tabular" placeholder="0,00" value={borrador.precioTexto} onChange={(e) => set("precioTexto", e.target.value)} />
            </Campo>
            <Campo etiqueta="Moneda">
              <Selector value={borrador.moneda} onChange={(e) => set("moneda", e.target.value)}>
                {MONEDAS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </Selector>
            </Campo>
            <Campo etiqueta="Unidad">
              <Entrada value={borrador.unidad} onChange={(e) => set("unidad", e.target.value)} />
            </Campo>
            {discrimina && (
              <Campo etiqueta="IVA">
                <Selector value={borrador.iva} onChange={(e) => set("iva", Number(e.target.value))}>
                  {ALICUOTAS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </Selector>
              </Campo>
            )}
          </div>
          {error && <div className="mt-3"><Aviso tono="error">{error}</Aviso></div>}
          <div className="flex justify-end gap-2 mt-4">
            <Boton onClick={() => setBorrador(null)}>Cancelar</Boton>
            <Boton variante="primario" disabled={ocupado} onClick={guardar}>
              <Icono d={ICONOS.check} />
              {ocupado ? "Guardando…" : "Guardar"}
            </Boton>
          </div>
        </Tarjeta>
      )}

      <Tarjeta
        titulo={`Servicios (${servicios.length})`}
        accion={
          !borrador && (
            <Boton variante="primario" onClick={() => (setError(""), setBorrador({ ...vacio }))}>
              <Icono d={ICONOS.mas} />
              Nuevo servicio
            </Boton>
          )
        }
      >
        {!borrador && error && <div className="mb-3"><Aviso tono="error">{error}</Aviso></div>}
        {servicios.length === 0 ? (
          <p className="text-center py-10 text-sm" style={{ color: tinta.suave }}>
            Cargá los servicios que facturás seguido con su precio. Después los agregás a una factura o abono con un clic.
          </p>
        ) : (
          <ul>
            {servicios.map((s) => (
              <li key={s.id} className="py-3 flex items-center gap-3 border-t first:border-t-0" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white truncate">{s.descripcion}</p>
                  <p className="text-xs" style={{ color: tinta.suave }}>
                    por {s.unidad}
                    {discrimina ? ` · IVA ${ALICUOTAS.find((a) => a.id === s.iva)?.nombre ?? ""}` : ""}
                  </p>
                </div>
                <span className="text-sm font-semibold text-white tabular whitespace-nowrap">{dinero(s.precio, s.moneda)}</span>
                <Boton
                  className="!px-2.5 !py-1.5"
                  title="Editar"
                  aria-label={`Editar ${s.descripcion}`}
                  onClick={() => (setError(""), setBorrador({ ...s, precioTexto: String(s.precio).replace(".", ",") }))}
                >
                  <Icono d={ICONOS.lapiz} className="w-3.5 h-3.5" />
                </Boton>
                <Boton variante="peligro" className="!px-2.5 !py-1.5" title="Quitar" aria-label={`Quitar ${s.descripcion}`} onClick={() => borrar(s)}>
                  <Icono d={ICONOS.basura} className="w-3.5 h-3.5" />
                </Boton>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </div>
  )
}

/** Botón "Agregar del catálogo" para el detalle de una factura o un abono. */
export function SelectorCatalogo({ servicios, onElegir }: { servicios: Pick<Servicio, "id" | "descripcion" | "precio" | "moneda" | "unidad" | "iva">[]; onElegir: (s: (typeof servicios)[number]) => void }) {
  const [abierto, setAbierto] = useState(false)
  if (!servicios.length) return null
  return (
    <div className="relative inline-block">
      <Boton variante="secundario" onClick={() => setAbierto((a) => !a)} aria-expanded={abierto}>
        <Icono d={ICONOS.recibo} className="w-3.5 h-3.5" /> Agregar del catálogo
      </Boton>
      {abierto && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setAbierto(false)} aria-hidden />
          <ul
            className="absolute z-20 left-0 mt-1.5 w-[min(360px,85vw)] max-h-72 overflow-auto rounded-lg py-1 shadow-xl"
            style={{ background: "#16132f", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            {servicios.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors"
                  onClick={() => {
                    onElegir(s)
                    setAbierto(false)
                  }}
                >
                  <span className="text-sm text-white truncate">{s.descripcion}</span>
                  <span className="text-xs tabular whitespace-nowrap" style={{ color: tinta.media }}>{dinero(s.precio, s.moneda)}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
