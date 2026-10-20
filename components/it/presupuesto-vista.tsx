"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  ClipboardList,
  Loader2,
  Lock,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from "lucide-react"
import type { MotivoRechazo, PresupuestoPortal } from "@/lib/mintaka"
import { mensajeDeError, portalPost } from "@/lib/portal-cliente"
import {
  TEXTO_PRESUPUESTO,
  TONO_PRESUPUESTO,
  diasHasta,
  fecha,
  numero as fmtNumero,
  plata,
} from "@/lib/portal-formato"
import { Carta, Etiqueta, Marco } from "./portal-ui"
import { FirmaPad, type FirmaPadHandle } from "./firma-pad"

const ACENTO = "var(--area-it)"
const ACENTO_RGB = "var(--area-it-rgb)"

const TITULO_SECCION: Record<string, string> = {
  MATERIALES: "Materiales y equipos",
  MANO_DE_OBRA: "Mano de obra",
  SERVICIO_MENSUAL: "Servicio mensual",
  OTROS: "Otros conceptos",
}

type Decision = "aprobado" | "rechazado"

export function PresupuestoVista({
  datos,
  motivos,
  token,
}: {
  datos: PresupuestoPortal
  motivos: MotivoRechazo[]
  token: string
}) {
  const router = useRouter()
  const [refrescando, startRefresh] = useTransition()

  const [opcionales, setOpcionales] = useState<Record<number, boolean>>(() => {
    const inicial: Record<number, boolean> = {}
    for (const s of datos.secciones) {
      for (const i of s.items) if (i.opcional) inicial[i.id] = i.aceptado
    }
    return inicial
  })

  const [panel, setPanel] = useState<"ninguno" | "aprobar" | "rechazar">("ninguno")
  const [decision, setDecision] = useState<{ tipo: Decision; mensaje: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hayOpcionales = Object.keys(opcionales).length > 0
  const diasParaVencer = diasHasta(datos.venceEn)

  /**
   * El total lo calcula siempre el backend (hay IVA por ítem y descuentos que
   * el portal no ve). Mandamos la elección y refrescamos la página para leer
   * los números autoritativos, con un respiro para no disparar un request por
   * cada click.
   */
  function cambiarOpcional(itemId: number, aceptado: boolean) {
    const siguiente = { ...opcionales, [itemId]: aceptado }
    setOpcionales(siguiente)
    setError(null)

    if (debounce.current) clearTimeout(debounce.current)
    debounce.current = setTimeout(() => {
      void portalPost(`presupuesto/${token}/opcionales`, {
        opcionales: Object.entries(siguiente).map(([id, ok]) => ({
          itemId: Number(id),
          aceptado: ok,
        })),
      })
        .then(() => startRefresh(() => router.refresh()))
        .catch((err) => setError(mensajeDeError(err)))
    }, 600)
  }

  const firmaRef = useRef<FirmaPadHandle>(null)
  const [nombreFirmante, setNombreFirmante] = useState(datos.cliente.nombre)
  const [comentario, setComentario] = useState("")
  const [tieneFirma, setTieneFirma] = useState(false)

  const [motivoId, setMotivoId] = useState<string>("")
  const [nota, setNota] = useState("")

  async function aprobar() {
    setEnviando(true)
    setError(null)
    try {
      const r = await portalPost<{ mensaje: string }>(`presupuesto/${token}/aprobar`, {
        firma: firmaRef.current?.valor() ?? null,
        nombreFirmante: nombreFirmante.trim() || null,
        comentario: comentario.trim() || null,
        ...(hayOpcionales
          ? {
              opcionales: Object.entries(opcionales).map(([id, ok]) => ({
                itemId: Number(id),
                aceptado: ok,
              })),
            }
          : {}),
      })
      setDecision({ tipo: "aprobado", mensaje: r.mensaje })
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  async function rechazar() {
    setEnviando(true)
    setError(null)
    try {
      const r = await portalPost<{ mensaje: string }>(`presupuesto/${token}/rechazar`, {
        motivoRechazoId: motivoId ? Number(motivoId) : null,
        nota: nota.trim() || null,
      })
      setDecision({ tipo: "rechazado", mensaje: r.mensaje })
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  // ---- Pantalla de cierre --------------------------------------------------
  if (decision) {
    const ok = decision.tipo === "aprobado"
    return (
      <Marco titulo={ok ? "¡Gracias! Quedó aprobado" : "Listo, quedó registrado"}>
        <Carta>
          <div className="flex flex-col items-center py-8 text-center">
            {ok ? (
              <CheckCircle2 className="h-14 w-14" style={{ color: ACENTO }} />
            ) : (
              <XCircle className="h-14 w-14 text-foreground/30" />
            )}
            <p className="mt-5 max-w-md text-foreground/75">{decision.mensaje}</p>
            <p className="mt-2 text-sm text-foreground/45">
              Presupuesto {datos.numero} · {datos.titulo}
            </p>
          </div>
        </Carta>
      </Marco>
    )
  }

  const cerrado = !datos.decidible

  return (
    <Marco
      titulo={datos.titulo}
      bajada={`Presupuesto ${datos.numero} · preparado para ${datos.cliente.razonSocial || datos.cliente.nombre}`}
      chip={
        <Etiqueta tono={TONO_PRESUPUESTO[datos.estado] ?? "neutro"}>
          {TEXTO_PRESUPUESTO[datos.estado] ?? datos.estado}
        </Etiqueta>
      }
    >
      {cerrado && <AvisoCerrado datos={datos} />}

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        {/* ---- Detalle ---------------------------------------------------- */}
        <div className="space-y-5">
          {datos.descripcion && (
            <Carta titulo="De qué se trata">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/75">
                {datos.descripcion}
              </p>
            </Carta>
          )}

          {datos.secciones.map((seccion) => (
            <Carta
              key={seccion.id}
              titulo={seccion.titulo || TITULO_SECCION[seccion.tipo] || "Detalle"}
              detalle={seccion.alternativa ? `Alternativa ${seccion.alternativa}` : undefined}
            >
              <ul className="divide-y divide-[var(--hairline)]">
                {seccion.items.map((item) => {
                  const elegido = item.opcional ? (opcionales[item.id] ?? item.aceptado) : true
                  const suma = !item.opcional || elegido

                  return (
                    <li key={item.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                      {item.opcional && (
                        <input
                          type="checkbox"
                          checked={elegido}
                          disabled={cerrado}
                          onChange={(e) => cambiarOpcional(item.id, e.target.checked)}
                          className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded accent-[var(--area-it)] disabled:cursor-not-allowed"
                          aria-label={`Incluir ${item.descripcion}`}
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <p
                          className={
                            suma ? "text-sm text-foreground" : "text-sm text-foreground/40"
                          }
                        >
                          {item.descripcion}
                        </p>
                        <p className="mt-0.5 text-xs text-foreground/45">
                          {fmtNumero(item.cantidad)} {item.unidad} × {plata(item.precioUnit)}
                          {item.descuentoPct > 0 && ` · ${fmtNumero(item.descuentoPct)} % off`}
                          {item.opcional && (
                            <span className="ml-1.5 font-semibold" style={{ color: ACENTO }}>
                              opcional
                            </span>
                          )}
                        </p>
                      </div>

                      <span
                        className={`tabular shrink-0 text-sm font-semibold ${
                          suma ? "text-foreground" : "text-foreground/30 line-through"
                        }`}
                      >
                        {plata(item.subtotal)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Carta>
          ))}

          {datos.textoLegal && (
            <Carta titulo="Condiciones">
              <p className="whitespace-pre-line text-xs leading-relaxed text-foreground/55">
                {datos.textoLegal}
              </p>
            </Carta>
          )}
        </div>

        {/* ---- Totales y decisión ----------------------------------------- */}
        <div className="space-y-5 lg:sticky lg:top-28">
          <Carta>
            <dl className="space-y-2 text-sm">
              <Fila etiqueta="Subtotal" valor={plata(datos.subtotal)} />
              {datos.descuento > 0 && (
                <Fila etiqueta="Descuento" valor={`− ${plata(datos.descuento)}`} />
              )}
              {datos.impuestos > 0 && <Fila etiqueta="IVA" valor={plata(datos.impuestos)} />}
            </dl>

            <div className="mt-4 flex items-baseline justify-between border-t border-[var(--hairline)] pt-4">
              <span className="font-semibold text-foreground">Total</span>
              <span className="tabular font-display text-2xl font-extrabold" style={{ color: ACENTO }}>
                {plata(datos.total)}
              </span>
            </div>

            {refrescando && (
              <p className="mt-2 flex items-center justify-end gap-1.5 text-xs text-foreground/45">
                <Loader2 className="h-3 w-3 animate-spin" />
                Actualizando el total…
              </p>
            )}

            <p className="mt-3 text-xs text-foreground/45">
              {datos.vencido
                ? `Venció el ${fecha(datos.venceEn)}.`
                : diasParaVencer === 0
                  ? "Vence hoy."
                  : `Válido hasta el ${fecha(datos.venceEn)} (${diasParaVencer} día${diasParaVencer === 1 ? "" : "s"}).`}
            </p>

            {!cerrado && panel === "ninguno" && (
              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setPanel("aprobar")
                    setError(null)
                  }}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: ACENTO }}
                >
                  <ThumbsUp className="h-4 w-4" />
                  Aprobar el presupuesto
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPanel("rechazar")
                    setError(null)
                  }}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-foreground/20 text-sm font-semibold text-foreground/70 transition-colors hover:bg-foreground/[0.06]"
                >
                  <ThumbsDown className="h-4 w-4" />
                  No, gracias
                </button>
              </div>
            )}
          </Carta>

          {/* ---- Aprobar ---------------------------------------------------- */}
          {panel === "aprobar" && (
            <Carta titulo="Confirmá la aprobación">
              <div className="space-y-4">
                <Campo etiqueta="¿Quién aprueba?">
                  <input
                    value={nombreFirmante}
                    onChange={(e) => setNombreFirmante(e.target.value)}
                    maxLength={120}
                    className="input-orion h-11 w-full rounded-xl px-3 text-sm"
                    placeholder="Nombre y apellido"
                  />
                </Campo>

                <FirmaPad ref={firmaRef} onCambio={setTieneFirma} />

                <Campo etiqueta="¿Querés aclarar algo? (opcional)">
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    maxLength={2000}
                    rows={3}
                    className="input-orion w-full resize-y rounded-xl px-3 py-2 text-sm"
                    placeholder="Coordinemos para la semana que viene…"
                  />
                </Campo>

                {error && <Error mensaje={error} />}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void aprobar()}
                    disabled={enviando || !tieneFirma || !nombreFirmante.trim()}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ background: ACENTO }}
                  >
                    {enviando ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Confirmar por {plata(datos.total)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanel("ninguno")}
                    disabled={enviando}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-foreground/20 px-4 text-sm font-semibold text-foreground/70 transition-colors hover:bg-foreground/[0.06] disabled:opacity-40"
                  >
                    Volver
                  </button>
                </div>

                {!tieneFirma && (
                  <p className="text-xs text-foreground/40">
                    Necesitamos tu firma para dejar constancia de la aprobación.
                  </p>
                )}
              </div>
            </Carta>
          )}

          {/* ---- Rechazar --------------------------------------------------- */}
          {panel === "rechazar" && (
            <Carta titulo="Contanos por qué">
              <div className="space-y-4">
                <p className="text-sm text-foreground/60">
                  No hace falta que expliques nada, pero si nos decís el motivo podemos mejorar la
                  próxima propuesta.
                </p>

                {motivos.length > 0 && (
                  <Campo etiqueta="Motivo (opcional)">
                    <select
                      value={motivoId}
                      onChange={(e) => setMotivoId(e.target.value)}
                      className="input-orion h-11 w-full rounded-xl px-3 text-sm"
                    >
                      <option value="">Prefiero no decirlo</option>
                      {motivos.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nombre}
                        </option>
                      ))}
                    </select>
                  </Campo>
                )}

                <Campo etiqueta="Comentario (opcional)">
                  <textarea
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    maxLength={2000}
                    rows={3}
                    className="input-orion w-full resize-y rounded-xl px-3 py-2 text-sm"
                    placeholder="Nos fuimos de presupuesto, lo vemos más adelante…"
                  />
                </Campo>

                {error && <Error mensaje={error} />}

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void rechazar()}
                    disabled={enviando}
                    className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-foreground/25 text-sm font-semibold text-foreground transition-colors hover:bg-foreground/[0.06] disabled:opacity-40"
                  >
                    {enviando ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ThumbsDown className="h-4 w-4" />
                    )}
                    Confirmar el rechazo
                  </button>
                  <button
                    type="button"
                    onClick={() => setPanel("ninguno")}
                    disabled={enviando}
                    className="inline-flex h-11 items-center justify-center rounded-xl px-4 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                    style={{ background: `rgba(${ACENTO_RGB},0.14)`, color: ACENTO }}
                  >
                    Mejor no
                  </button>
                </div>
              </div>
            </Carta>
          )}

          <Carta titulo="Tu contacto">
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-foreground">{datos.vendedor.nombre}</p>
              {datos.vendedor.email && (
                <a
                  href={`mailto:${datos.vendedor.email}`}
                  className="block break-all text-foreground/60 transition-colors hover:text-foreground"
                >
                  {datos.vendedor.email}
                </a>
              )}
              {datos.vendedor.telefono && (
                <a
                  href={`tel:${datos.vendedor.telefono}`}
                  className="block text-foreground/60 transition-colors hover:text-foreground"
                >
                  {datos.vendedor.telefono}
                </a>
              )}
            </div>
          </Carta>
        </div>
      </div>
    </Marco>
  )
}

// ---------------------------------------------------------------------------

function AvisoCerrado({ datos }: { datos: PresupuestoPortal }) {
  const texto =
    datos.estado === "APROBADO"
      ? "Ya nos llegó tu aprobación. Si necesitás cambiar algo, escribinos."
      : datos.estado === "RECHAZADO"
        ? "Registramos que este presupuesto no va. Quedamos a disposición."
        : datos.vencido
          ? "Este presupuesto venció. Escribinos y te lo recotizamos al toque."
          : "Este presupuesto todavía no está disponible para responder."

  return (
    <div
      className="mb-5 flex items-start gap-3 rounded-2xl p-4"
      style={{ background: "var(--tint-2)", border: "1px solid var(--hairline)" }}
    >
      <Lock className="mt-0.5 h-5 w-5 shrink-0 text-foreground/40" />
      <div className="text-sm">
        <p className="font-semibold text-foreground">Solo para mirar</p>
        <p className="mt-0.5 text-foreground/65">{texto}</p>
      </div>
    </div>
  )
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-foreground/55">{etiqueta}</dt>
      <dd className="tabular text-foreground/85">{valor}</dd>
    </div>
  )
}

function Campo({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
        {etiqueta}
      </span>
      {children}
    </label>
  )
}

function Error({ mensaje }: { mensaje: string }) {
  return (
    <p
      className="flex items-start gap-2 rounded-xl p-3 text-sm"
      style={{
        background: "rgba(224,82,82,0.12)",
        border: "1px solid rgba(224,82,82,0.28)",
        color: "var(--destructive)",
      }}
    >
      <ClipboardList className="mt-0.5 h-4 w-4 shrink-0" />
      {mensaje}
    </p>
  )
}
