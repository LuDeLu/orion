"use client"

import { useState } from "react"
import type { Abono } from "@/lib/facturacion/abonos"
import { periodoAFacturar } from "@/lib/facturacion/periodos"
import type { Servicio } from "@/lib/facturacion/catalogo"
import { CONDICIONES_VENTA, dinero, MONEDAS, type Item } from "@/lib/facturacion/modelo"
import { SelectorCatalogo } from "./editor-catalogo"
import { Aviso, Boton, BotonLink, Campo, Entrada, Icono, ICONOS, Insignia, Selector, Tarjeta, tinta } from "./ui"

export interface ClienteAgenda {
  clave: string
  nombre: string
  alias?: string
}

type Borrador = {
  id?: string
  nombre: string
  clienteClave: string
  items: Item[]
  moneda: string
  condicionVenta: string
  diasVencimiento: number
  mesFacturado: "actual" | "anterior"
  observaciones: string
}

const itemVacio = (): Item => ({ descripcion: "", cantidad: 1, unidad: "u.", precio: 0, bonificacion: 0, iva: 5 })
const total = (items: Item[]) => items.reduce((s, i) => s + (i.cantidad || 0) * (i.precio || 0) * (1 - (i.bonificacion || 0) / 100), 0)

async function pedir<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, init)
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j.errores?.join(" · ") ?? j.error ?? "Error inesperado")
  return j as T
}

const nombreMes = (periodo: string) => {
  const [a, m] = periodo.split("-").map(Number)
  return new Date(Date.UTC(a, m - 1, 15)).toLocaleDateString("es-AR", { month: "long", year: "numeric", timeZone: "UTC" })
}

interface Props {
  inicial: Abono[]
  clientes: ClienteAgenda[]
  catalogo: Servicio[]
  /** YYYY-MM-DD */
  hoy: string
  /** Borrador precargado (ej. "crear abono desde esta factura") */
  borradorInicial?: Borrador | null
}

export function GestorAbonos({ inicial, clientes, catalogo, hoy, borradorInicial = null }: Props) {
  const [abonos, setAbonos] = useState(inicial)
  const [b, setB] = useState<Borrador | null>(borradorInicial)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState("")

  const activos = abonos.filter((a) => a.activo)
  const toca = (a: Pick<Abono, "mesFacturado">) => periodoAFacturar(a, hoy)
  // Al día = ya se facturó el período que corresponde (o uno posterior)
  const alDia = (a: Abono) => !!a.ultimoPeriodo && a.ultimoPeriodo >= toca(a)
  const faltan = activos.filter((a) => !alDia(a))
  const montoFalta = faltan.filter((a) => a.moneda === "PES").reduce((s, a) => s + total(a.items), 0)

  const set = <K extends keyof Borrador>(k: K, v: Borrador[K]) => setB((x) => (x ? { ...x, [k]: v } : x))
  const setItem = (i: number, cambio: Partial<Item>) => setB((x) => (x ? { ...x, items: x.items.map((it, j) => (j === i ? { ...it, ...cambio } : it)) } : x))

  function nuevo() {
    setError("")
    setB({ nombre: "", clienteClave: clientes[0]?.clave ?? "", items: [itemVacio()], moneda: "PES", condicionVenta: "Transferencia bancaria", diasVencimiento: 10, mesFacturado: "actual", observaciones: "" })
  }

  function editar(a: Abono) {
    setError("")
    setB({ id: a.id, nombre: a.nombre, clienteClave: a.clienteClave, items: a.items, moneda: a.moneda, condicionVenta: a.condicionVenta, diasVencimiento: a.diasVencimiento, mesFacturado: a.mesFacturado ?? "actual", observaciones: a.observaciones })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function guardar() {
    if (!b) return
    setOcupado(true)
    setError("")
    try {
      const { abono } = await pedir<{ abono: Abono }>("/api/admin/facturacion/abonos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ abono: b }),
      })
      setAbonos((xs) => [...xs.filter((x) => x.id !== abono.id), abono].sort((x, y) => x.nombre.localeCompare(y.nombre, "es")))
      setB(null)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setOcupado(false)
    }
  }

  async function activar(a: Abono, activo: boolean) {
    try {
      const { abono } = await pedir<{ abono: Abono }>("/api/admin/facturacion/abonos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: a.id, activo }),
      })
      setAbonos((xs) => xs.map((x) => (x.id === abono.id ? abono : x)))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  async function borrar(a: Abono) {
    if (!confirm(`¿Borrar el abono "${a.nombre}"? Las facturas ya emitidas no se tocan.`)) return
    try {
      await pedir(`/api/admin/facturacion/abonos?id=${encodeURIComponent(a.id)}`, { method: "DELETE" })
      setAbonos((xs) => xs.filter((x) => x.id !== a.id))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <div className="space-y-5">
      {abonos.length > 0 && (
        <Aviso tono={faltan.length ? "alerta" : "ok"}>
          {faltan.length ? (
            <>
              Faltan facturar <b>{faltan.length}</b> de {activos.length} abonos
              {montoFalta ? (
                <>
                  {" "}
                  (<b>{dinero(montoFalta)}</b>
                  {faltan.some((a) => a.moneda !== "PES") ? " más los de otras monedas" : ""})
                </>
              ) : null}
              .
            </>
          ) : (
            <>Todos los abonos activos están al día.</>
          )}
        </Aviso>
      )}

      {b && (
        <Tarjeta titulo={b.id ? "Editar abono" : "Nuevo abono"}>
          {clientes.length === 0 ? (
            <Aviso tono="alerta">
              Primero cargá el cliente en la{" "}
              <a href="/admin/facturacion/clientes" className="underline font-medium">
                agenda de clientes
              </a>
              .
            </Aviso>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                <Campo etiqueta="Cliente">
                  <Selector value={b.clienteClave} onChange={(e) => set("clienteClave", e.target.value)}>
                    {!clientes.some((c) => c.clave === b.clienteClave) && <option value={b.clienteClave}>(cliente borrado de la agenda)</option>}
                    {clientes.map((c) => (
                      <option key={c.clave} value={c.clave}>
                        {c.alias ? `${c.alias} — ${c.nombre}` : c.nombre}
                      </option>
                    ))}
                  </Selector>
                </Campo>
                <Campo etiqueta="Nombre del abono" ayuda="opcional">
                  <Entrada placeholder="Ej.: Redes sociales – plan mensual" value={b.nombre} onChange={(e) => set("nombre", e.target.value)} />
                </Campo>
              </div>

              <div className="mt-4 space-y-2">
                <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_70px_130px_32px] gap-2 text-[10px] font-semibold uppercase tracking-widest px-1" style={{ color: tinta.tenue }}>
                  <span>Descripción</span>
                  <span className="text-right">Cant.</span>
                  <span className="text-right">Precio unit.</span>
                  <span />
                </div>
                {b.items.map((it, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_32px] sm:grid-cols-[minmax(0,1fr)_70px_130px_32px] gap-2">
                    <Entrada
                      className="col-span-3 sm:col-span-1"
                      placeholder="Ej.: Gestión de redes sociales"
                      aria-label="Descripción"
                      value={it.descripcion}
                      onChange={(e) => setItem(i, { descripcion: e.target.value })}
                    />
                    <Entrada type="number" min={0} step="any" aria-label="Cantidad" className="text-right tabular" value={it.cantidad} onChange={(e) => setItem(i, { cantidad: Number(e.target.value) })} />
                    <Entrada type="number" min={0} step="0.01" aria-label="Precio" className="text-right tabular" placeholder="0,00" value={it.precio || ""} onChange={(e) => setItem(i, { precio: Number(e.target.value) })} />
                    <button
                      type="button"
                      className="icon-btn self-center"
                      aria-label="Quitar ítem"
                      onClick={() => set("items", b.items.length > 1 ? b.items.filter((_, j) => j !== i) : [itemVacio()])}
                    >
                      <Icono d={ICONOS.basura} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2 pt-1">
                  <Boton onClick={() => set("items", [...b.items, itemVacio()])}>
                    <Icono d={ICONOS.mas} className="w-3.5 h-3.5" /> Agregar ítem
                  </Boton>
                  <SelectorCatalogo
                    servicios={catalogo}
                    onElegir={(s) => {
                      const item: Item = { descripcion: s.descripcion, cantidad: 1, unidad: s.unidad, precio: s.precio, bonificacion: 0, iva: s.iva }
                      const vacio = b.items.length === 1 && !b.items[0].descripcion && !b.items[0].precio
                      setB((x) => (x ? { ...x, moneda: vacio ? s.moneda : x.moneda, items: vacio ? [item] : [...x.items, item] } : x))
                    }}
                  />
                  <span className="self-center text-[11px]" style={{ color: tinta.tenue }}>
                    Tip: escribí <code>{"{mes}"}</code> y se reemplaza por el mes facturado.
                  </span>
                  <span className="ml-auto self-center text-sm" style={{ color: tinta.media }}>
                    Por mes: <b className="text-white tabular">{dinero(total(b.items), b.moneda)}</b>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                <Campo etiqueta="Mes que se factura">
                  <Selector value={b.mesFacturado} onChange={(e) => set("mesFacturado", e.target.value as "actual" | "anterior")}>
                    <option value="actual">El mes en curso</option>
                    <option value="anterior">El mes anterior (vencido)</option>
                  </Selector>
                </Campo>
                <Campo etiqueta="Moneda">
                  <Selector value={b.moneda} onChange={(e) => set("moneda", e.target.value)}>
                    {MONEDAS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </Selector>
                </Campo>
                <Campo etiqueta="Condición de venta">
                  <Selector value={b.condicionVenta} onChange={(e) => set("condicionVenta", e.target.value)}>
                    {CONDICIONES_VENTA.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </Selector>
                </Campo>
                <Campo etiqueta="Días para pagar">
                  <Entrada type="number" min={0} max={90} value={b.diasVencimiento} onChange={(e) => set("diasVencimiento", Number(e.target.value))} />
                </Campo>
                <Campo etiqueta="Observaciones" ayuda="opcional">
                  <Entrada value={b.observaciones} onChange={(e) => set("observaciones", e.target.value)} />
                </Campo>
              </div>
            </>
          )}
          {error && <div className="mt-3"><Aviso tono="error">{error}</Aviso></div>}
          <div className="flex justify-end gap-2 mt-4">
            <Boton onClick={() => setB(null)}>Cancelar</Boton>
            {clientes.length > 0 && (
              <Boton variante="primario" disabled={ocupado} onClick={guardar}>
                <Icono d={ICONOS.check} />
                {ocupado ? "Guardando…" : "Guardar abono"}
              </Boton>
            )}
          </div>
        </Tarjeta>
      )}

      <Tarjeta
        titulo={`Abonos (${abonos.length})`}
        accion={
          !b && (
            <Boton variante="primario" onClick={nuevo}>
              <Icono d={ICONOS.mas} />
              Nuevo abono
            </Boton>
          )
        }
      >
        {!b && error && <div className="mb-3"><Aviso tono="error">{error}</Aviso></div>}
        {abonos.length === 0 ? (
          <p className="text-center py-10 text-sm" style={{ color: tinta.suave }}>
            Un abono es la factura que le hacés todos los meses a un cliente. Cargalo una vez y cada mes lo facturás con un clic.
            <br />
            También podés crearlo desde una factura ya emitida.
          </p>
        ) : (
          <ul>
            {abonos.map((a) => {
              const hecho = alDia(a)
              const cliente = clientes.find((c) => c.clave === a.clienteClave)
              return (
                <li key={a.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-3 border-t first:border-t-0" style={{ borderColor: "rgba(255,255,255,0.06)", opacity: a.activo ? 1 : 0.55 }}>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white truncate">{a.nombre}</span>
                      {!a.activo ? <Insignia estado="vencido" texto="Pausado" /> : hecho ? <Insignia estado="emitido" texto="Al día" /> : <Insignia estado="pendiente" texto={`Falta ${nombreMes(toca(a))}`} />}
                    </div>
                    <p className="text-xs truncate mt-0.5" style={{ color: tinta.suave }}>
                      {cliente ? cliente.alias || cliente.nombre : a.receptor.nombre} · {dinero(total(a.items), a.moneda)} por mes
                      {a.ultimoPeriodo ? ` · último: ${nombreMes(a.ultimoPeriodo)}` : " · nunca facturado"}
                    </p>
                  </div>
                  <div className="flex gap-1.5 shrink-0 flex-wrap">
                    {a.activo && !hecho && (
                      <BotonLink href={`/admin/facturacion/nuevo?abono=${encodeURIComponent(a.id)}`} variante="primario" className="!px-3 !py-1.5 !text-xs">
                        <Icono d={ICONOS.recibo} className="w-3.5 h-3.5" />
                        Facturar {nombreMes(toca(a))}
                      </BotonLink>
                    )}
                    {hecho && a.ultimaFactura && (
                      <BotonLink href={`/admin/facturacion/${encodeURIComponent(a.ultimaFactura)}`} className="!px-3 !py-1.5 !text-xs">
                        Ver factura
                      </BotonLink>
                    )}
                    <Boton className="!px-3 !py-1.5 !text-xs" onClick={() => activar(a, !a.activo)}>
                      {a.activo ? "Pausar" : "Reanudar"}
                    </Boton>
                    <Boton className="!px-2.5 !py-1.5" title="Editar" aria-label={`Editar ${a.nombre}`} onClick={() => editar(a)}>
                      <Icono d={ICONOS.lapiz} className="w-3.5 h-3.5" />
                    </Boton>
                    <Boton variante="peligro" className="!px-2.5 !py-1.5" title="Borrar" aria-label={`Borrar ${a.nombre}`} onClick={() => borrar(a)}>
                      <Icono d={ICONOS.basura} className="w-3.5 h-3.5" />
                    </Boton>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Tarjeta>
    </div>
  )
}
