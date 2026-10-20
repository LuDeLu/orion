"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  CalendarClock,
  FileText,
  HardDrive,
  Loader2,
  LifeBuoy,
  Plus,
  Receipt,
  Repeat,
  Wrench,
} from "lucide-react"
import type { PanelCliente } from "@/lib/mintaka"
import { mensajeDeError, portalPost } from "@/lib/portal-cliente"
import {
  TEXTO_COMPROBANTE,
  TEXTO_EQUIPO,
  TEXTO_ORDEN,
  TEXTO_PRESUPUESTO,
  TEXTO_PRIORIDAD,
  TEXTO_TICKET,
  TEXTO_TIPO_COMPROBANTE,
  TONO_ACTIVO,
  TONO_COMPROBANTE,
  TONO_ORDEN,
  TONO_PRESUPUESTO,
  TONO_PRIORIDAD,
  TONO_TICKET,
  TONO_VISITA,
  fecha,
  humanizar,
  numero as fmtNumero,
  plata,
  relativo,
} from "@/lib/portal-formato"
import { Carta, Dato, Etiqueta, Marco, Vacio } from "./portal-ui"

const ACENTO = "var(--area-it)"
const ACENTO_RGB = "var(--area-it-rgb)"

type Pestana = "equipos" | "soporte" | "visitas" | "activos" | "dinero"

const PESTANAS: { id: Pestana; texto: string; Icono: typeof Wrench }[] = [
  { id: "equipos", texto: "Reparaciones", Icono: Wrench },
  { id: "soporte", texto: "Soporte", Icono: LifeBuoy },
  { id: "visitas", texto: "Visitas", Icono: CalendarClock },
  { id: "activos", texto: "Mis equipos", Icono: HardDrive },
  { id: "dinero", texto: "Facturación", Icono: Receipt },
]

/**
 * Panel del cliente: todo lo suyo en una pantalla, entrando por el link mágico.
 * Los datos llegan ya filtrados desde `GET /api/portal/acceso/:token`.
 */
export function PanelVista({ datos, token }: { datos: PanelCliente; token: string }) {
  const [pestana, setPestana] = useState<Pestana>("equipos")

  const abiertos = datos.tickets.filter(
    (t) => !["RESUELTO", "CERRADO", "CANCELADO"].includes(t.estado),
  ).length
  const enTaller = datos.ordenes.filter(
    (o) => !["ENTREGADO", "ABANDONADO", "SIN_REPARACION"].includes(o.estado),
  ).length
  const aPagar = datos.comprobantes
    .filter((c) => ["EMITIDO", "PARCIAL", "VENCIDO"].includes(c.estado))
    .reduce((acc, c) => acc + (c.total - c.pagado), 0)

  return (
    <Marco
      titulo={`Hola, ${datos.cliente.nombre}`}
      bajada="Todo lo que tenemos con vos, en un solo lugar."
    >
      {/* ---- Números de arriba -------------------------------------------- */}
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Kpi etiqueta="Equipos en el taller" valor={String(enTaller)} />
        <Kpi etiqueta="Tickets abiertos" valor={String(abiertos)} />
        <Kpi
          etiqueta="Pendiente de pago"
          valor={plata(aPagar)}
          alerta={aPagar > 0}
        />
      </div>

      {/* ---- Pestañas ------------------------------------------------------ */}
      <div className="mb-5 flex gap-1 overflow-x-auto rounded-2xl p-1" style={{ background: "var(--tint-2)" }}>
        {PESTANAS.map(({ id, texto, Icono }) => (
          <button
            key={id}
            type="button"
            onClick={() => setPestana(id)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors"
            style={
              pestana === id
                ? { background: `rgba(${ACENTO_RGB},0.16)`, color: ACENTO }
                : { color: "var(--foreground-muted)" }
            }
          >
            <Icono className="h-4 w-4" />
            {texto}
          </button>
        ))}
      </div>

      {pestana === "equipos" && <Reparaciones datos={datos} />}
      {pestana === "soporte" && <Soporte datos={datos} token={token} />}
      {pestana === "visitas" && <Visitas datos={datos} />}
      {pestana === "activos" && <Activos datos={datos} />}
      {pestana === "dinero" && <Dinero datos={datos} />}
    </Marco>
  )
}

// ---------------------------------------------------------------------------

function Kpi({ etiqueta, valor, alerta }: { etiqueta: string; valor: string; alerta?: boolean }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
        {etiqueta}
      </p>
      <p
        className="tabular mt-1 font-display text-2xl font-extrabold"
        style={{ color: alerta ? "var(--brand-gold)" : "var(--foreground)" }}
      >
        {valor}
      </p>
    </div>
  )
}

function Reparaciones({ datos }: { datos: PanelCliente }) {
  return (
    <div className="space-y-5">
      <Carta titulo="Equipos en reparación" detalle="Tocá cualquiera para ver el seguimiento completo.">
        {datos.ordenes.length === 0 ? (
          <Vacio>Todavía no nos trajiste ningún equipo al taller.</Vacio>
        ) : (
          <ul className="divide-y divide-[var(--hairline)]">
            {datos.ordenes.map((o) => {
              const equipo =
                [o.marca, o.modelo].filter(Boolean).join(" ") || TEXTO_EQUIPO[o.tipoEquipo] || "Equipo"
              const cuerpo = (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{equipo}</p>
                    <p className="mt-0.5 text-xs text-foreground/45">
                      {o.numero} · ingresó el {fecha(o.fechaIngreso)}
                      {o.presupuestoMonto > 0 && ` · ${plata(o.presupuestoMonto)}`}
                    </p>
                  </div>
                  <Etiqueta tono={TONO_ORDEN[o.estado] ?? "neutro"}>
                    {TEXTO_ORDEN[o.estado] ?? humanizar(o.estado)}
                  </Etiqueta>
                  {o.qrToken && <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground/30" />}
                </>
              )

              return (
                <li key={o.id}>
                  {o.qrToken ? (
                    <Link
                      href={`/it/seguimiento/${o.qrToken}`}
                      className="flex items-center gap-3 py-3 transition-opacity hover:opacity-75"
                    >
                      {cuerpo}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 py-3">{cuerpo}</div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Carta>

      {datos.presupuestos.length > 0 && (
        <Carta titulo="Presupuestos" detalle="Los que están esperando respuesta se pueden aprobar acá.">
          <ul className="divide-y divide-[var(--hairline)]">
            {datos.presupuestos.map((p) => {
              const abrible = p.tokenPortal && ["ENVIADO", "EN_NEGOCIACION"].includes(p.estado)
              const cuerpo = (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{p.titulo}</p>
                    <p className="mt-0.5 text-xs text-foreground/45">
                      {p.numero} · {fecha(p.fecha)} · {plata(p.total)}
                    </p>
                  </div>
                  <Etiqueta tono={TONO_PRESUPUESTO[p.estado] ?? "neutro"}>
                    {TEXTO_PRESUPUESTO[p.estado] ?? humanizar(p.estado)}
                  </Etiqueta>
                  {abrible && <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground/30" />}
                </>
              )

              return (
                <li key={p.id}>
                  {abrible ? (
                    <Link
                      href={`/it/presupuesto/${p.tokenPortal}`}
                      className="flex items-center gap-3 py-3 transition-opacity hover:opacity-75"
                    >
                      {cuerpo}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 py-3">{cuerpo}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </Carta>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------

function Soporte({ datos, token }: { datos: PanelCliente; token: string }) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [asunto, setAsunto] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [prioridad, setPrioridad] = useState("MEDIA")
  const [activoId, setActivoId] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [listo, setListo] = useState<string | null>(null)

  async function crear(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      const r = await portalPost<{ mensaje: string }>(`acceso/${token}/tickets`, {
        asunto: asunto.trim(),
        descripcion: descripcion.trim(),
        prioridad,
        activoId: activoId ? Number(activoId) : null,
      })
      setListo(r.mensaje)
      setAbierto(false)
      setAsunto("")
      setDescripcion("")
      setActivoId("")
      router.refresh()
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="space-y-5">
      {listo && (
        <div
          className="rounded-2xl p-4 text-sm"
          style={{
            background: `rgba(${ACENTO_RGB},0.12)`,
            border: `1px solid rgba(${ACENTO_RGB},0.3)`,
          }}
        >
          <p className="font-semibold text-foreground">Ticket abierto</p>
          <p className="mt-0.5 text-foreground/70">{listo}</p>
        </div>
      )}

      <Carta
        titulo="Tickets de soporte"
        detalle="Cualquier problema que tengas, abrilo acá y queda con seguimiento."
        accion={
          !abierto && (
            <button
              type="button"
              onClick={() => {
                setAbierto(true)
                setListo(null)
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: `rgba(${ACENTO_RGB},0.14)`, color: ACENTO }}
            >
              <Plus className="h-4 w-4" />
              Nuevo ticket
            </button>
          )
        }
      >
        {abierto && (
          <form
            onSubmit={crear}
            className="mb-5 space-y-4 rounded-xl p-4"
            style={{ background: "var(--tint-2)", border: "1px solid var(--hairline)" }}
          >
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
                ¿Qué pasa?
              </span>
              <input
                required
                minLength={3}
                maxLength={180}
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                placeholder="No anda el wifi en el depósito"
                className="input-orion h-11 w-full rounded-xl px-3 text-sm"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
                Contanos un poco más
              </span>
              <textarea
                required
                minLength={5}
                maxLength={5000}
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Desde ayer a la tarde, las terminales del fondo pierden la conexión cada 10 minutos…"
                className="input-orion w-full resize-y rounded-xl px-3 py-2 text-sm"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
                  ¿Qué tan urgente es?
                </span>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value)}
                  className="input-orion h-11 w-full rounded-xl px-3 text-sm"
                >
                  <option value="BAJA">Baja · puede esperar</option>
                  <option value="MEDIA">Media · molesta pero seguimos</option>
                  <option value="ALTA">Alta · nos complica el día</option>
                  <option value="CRITICA">Crítica · estamos parados</option>
                </select>
              </label>

              {datos.activos.length > 0 && (
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
                    ¿Sobre qué equipo? (opcional)
                  </span>
                  <select
                    value={activoId}
                    onChange={(e) => setActivoId(e.target.value)}
                    className="input-orion h-11 w-full rounded-xl px-3 text-sm"
                  >
                    <option value="">No es de un equipo puntual</option>
                    {datos.activos.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre} {a.serie ? `· ${a.serie}` : ""}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            {error && (
              <p
                className="rounded-xl p-3 text-sm"
                style={{
                  background: "rgba(224,82,82,0.12)",
                  border: "1px solid rgba(224,82,82,0.28)",
                  color: "var(--destructive)",
                }}
              >
                {error}
              </p>
            )}

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                disabled={enviando}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: ACENTO }}
              >
                {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <LifeBuoy className="h-4 w-4" />}
                Abrir el ticket
              </button>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                disabled={enviando}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-foreground/20 px-4 text-sm font-semibold text-foreground/70 transition-colors hover:bg-foreground/[0.06] disabled:opacity-40"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {datos.tickets.length === 0 ? (
          <Vacio>No tenés tickets. Ojalá siga así.</Vacio>
        ) : (
          <ul className="divide-y divide-[var(--hairline)]">
            {datos.tickets.map((t) => (
              <li key={t.id} className="flex items-start gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{t.asunto}</p>
                  <p className="mt-0.5 text-xs text-foreground/45">
                    {t.numero} · {relativo(t.createdAt)}
                    {t.categoria && ` · ${t.categoria}`}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Etiqueta tono={TONO_TICKET[t.estado] ?? "neutro"}>
                    {TEXTO_TICKET[t.estado] ?? humanizar(t.estado)}
                  </Etiqueta>
                  {["ALTA", "CRITICA"].includes(t.prioridad) && (
                    <Etiqueta tono={TONO_PRIORIDAD[t.prioridad]}>
                      {TEXTO_PRIORIDAD[t.prioridad]}
                    </Etiqueta>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Carta>

      {datos.contratos.length > 0 && <Contratos datos={datos} />}
    </div>
  )
}

function Contratos({ datos }: { datos: PanelCliente }) {
  return (
    <Carta titulo="Tus abonos" detalle="Lo que tenés contratado con nosotros.">
      <div className="space-y-4">
        {datos.contratos.map((c) => (
          <div
            key={c.id}
            className="rounded-xl p-4"
            style={{ background: "var(--tint-2)", border: "1px solid var(--hairline)" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{c.nombre}</p>
                <p className="mt-0.5 text-xs text-foreground/45">
                  {c.numero} · {humanizar(c.tipo)}
                  {c.vigenciaHasta && ` · hasta el ${fecha(c.vigenciaHasta)}`}
                </p>
              </div>
              <span className="tabular text-sm font-semibold" style={{ color: ACENTO }}>
                {plata(c.precio)}
              </span>
            </div>

            {c.horas.map((h, i) => {
              const pct = h.compradas > 0 ? (h.consumidas / h.compradas) * 100 : 0
              return (
                <div key={i} className="mt-3">
                  <div className="mb-1 flex justify-between text-xs text-foreground/55">
                    <span>Bolsa de horas</span>
                    <span className="tabular">
                      {fmtNumero(h.restantes)} de {fmtNumero(h.compradas)} h disponibles
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--tint-3)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        background: pct > 85 ? "var(--brand-gold)" : ACENTO,
                      }}
                    />
                  </div>
                </div>
              )
            })}

            {c.servicios.length > 0 && (
              <ul className="mt-3 space-y-1">
                {c.servicios.map((s, i) => (
                  <li
                    key={i}
                    className={`text-xs ${s.incluido ? "text-foreground/70" : "text-foreground/35 line-through"}`}
                  >
                    · {s.descripcion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Carta>
  )
}

// ---------------------------------------------------------------------------

function Visitas({ datos }: { datos: PanelCliente }) {
  return (
    <Carta titulo="Visitas técnicas" detalle="Las que hicimos y las que están agendadas.">
      {datos.visitas.length === 0 ? (
        <Vacio>Todavía no fuimos a ninguna sede tuya.</Vacio>
      ) : (
        <ul className="divide-y divide-[var(--hairline)]">
          {datos.visitas.map((v) => (
            <li key={v.id} className="flex items-start gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{v.titulo}</p>
                <p className="mt-0.5 text-xs text-foreground/45">
                  {v.numero} · {humanizar(v.tipo)} · {fecha(v.fechaInicio)}
                  {v.direccion && ` · ${v.direccion}`}
                </p>
              </div>
              <Etiqueta tono={TONO_VISITA[v.estado] ?? "neutro"}>{humanizar(v.estado)}</Etiqueta>
            </li>
          ))}
        </ul>
      )}
    </Carta>
  )
}

function Activos({ datos }: { datos: PanelCliente }) {
  return (
    <Carta titulo="Tus equipos" detalle="El inventario que administramos para vos.">
      {datos.activos.length === 0 ? (
        <Vacio>Todavía no cargamos equipos tuyos en el inventario.</Vacio>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {datos.activos.map((a) => (
            <div
              key={a.id}
              className="rounded-xl p-4"
              style={{ background: "var(--tint-2)", border: "1px solid var(--hairline)" }}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <p className="min-w-0 truncate text-sm font-semibold text-foreground">{a.nombre}</p>
                <Etiqueta tono={TONO_ACTIVO[a.estado] ?? "neutro"}>{humanizar(a.estado)}</Etiqueta>
              </div>
              <dl className="grid grid-cols-2 gap-3">
                <Dato etiqueta="Tipo">{TEXTO_EQUIPO[a.tipo] ?? humanizar(a.tipo)}</Dato>
                <Dato etiqueta="Código">{a.codigo}</Dato>
                {(a.marca || a.modelo) && (
                  <Dato etiqueta="Modelo">{[a.marca, a.modelo].filter(Boolean).join(" ")}</Dato>
                )}
                {a.serie && <Dato etiqueta="Serie">{a.serie}</Dato>}
                {a.ubicacionFisica && <Dato etiqueta="Dónde está">{a.ubicacionFisica}</Dato>}
                {a.garantiaHasta && <Dato etiqueta="Garantía">{fecha(a.garantiaHasta)}</Dato>}
              </dl>
            </div>
          ))}
        </div>
      )}
    </Carta>
  )
}

function Dinero({ datos }: { datos: PanelCliente }) {
  return (
    <div className="space-y-5">
      {datos.cliente.saldo !== 0 && (
        <Carta>
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-foreground/55">
              {datos.cliente.saldo > 0 ? "Saldo en cuenta corriente" : "Saldo a tu favor"}
            </span>
            <span
              className="tabular font-display text-2xl font-extrabold"
              style={{ color: datos.cliente.saldo > 0 ? "var(--brand-gold)" : ACENTO }}
            >
              {plata(Math.abs(datos.cliente.saldo))}
            </span>
          </div>
        </Carta>
      )}

      <Carta titulo="Comprobantes" detalle="Facturas, recibos y notas de crédito.">
        {datos.comprobantes.length === 0 ? (
          <Vacio>Todavía no te emitimos ningún comprobante.</Vacio>
        ) : (
          <ul className="divide-y divide-[var(--hairline)]">
            {datos.comprobantes.map((c) => (
              <li key={c.id} className="flex items-start gap-3 py-3">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-foreground/30" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {TEXTO_TIPO_COMPROBANTE[c.tipo] ?? humanizar(c.tipo)}{" "}
                    <span className="tabular font-normal text-foreground/55">
                      {String(c.puntoVenta).padStart(4, "0")}-{c.numero}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-foreground/45">
                    {fecha(c.fecha)}
                    {c.vencimiento && ` · vence el ${fecha(c.vencimiento)}`}
                    {c.pagado > 0 && c.pagado < c.total && ` · pagaste ${plata(c.pagado)}`}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="tabular text-sm font-semibold text-foreground">
                    {plata(c.total)}
                  </span>
                  <Etiqueta tono={TONO_COMPROBANTE[c.estado] ?? "neutro"}>
                    {TEXTO_COMPROBANTE[c.estado] ?? humanizar(c.estado)}
                  </Etiqueta>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Carta>

      <p className="flex items-center gap-2 text-xs text-foreground/40">
        <Repeat className="h-3.5 w-3.5" />
        Para pagar o pedir un comprobante fiscal, escribinos y lo resolvemos.
      </p>
    </div>
  )
}
