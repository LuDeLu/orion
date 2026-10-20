import { Check, CircleDot, Clock, PackageCheck, ShieldCheck, Wrench } from "lucide-react"
import type { Seguimiento } from "@/lib/mintaka"
import {
  TEXTO_EQUIPO,
  TONO_ORDEN,
  COLOR_TONO,
  diasHasta,
  fecha,
  fechaHora,
  plata,
} from "@/lib/portal-formato"
import { Carta, Dato, Etiqueta, Marco } from "./portal-ui"

const ACENTO = "var(--area-it)"
const ACENTO_RGB = "var(--area-it-rgb)"

/**
 * Estados que no están en la barra de progreso porque son desvíos del circuito.
 * En vez de dejar la barra vacía, la anclamos al paso equivalente y mostramos
 * un cartel explicando dónde está realmente el equipo.
 */
const DESVIOS: Record<string, { ancla: string; texto: string; tono: "espera" | "mal" }> = {
  ESPERANDO_REPUESTO: {
    ancla: "EN_REPARACION",
    texto: "Estamos esperando que llegue un repuesto para seguir. Te avisamos apenas entre.",
    tono: "espera",
  },
  CONTROL_CALIDAD: {
    ancla: "EN_REPARACION",
    texto: "La reparación terminó y está pasando el control de calidad antes de entregártelo.",
    tono: "espera",
  },
  GARANTIA: {
    ancla: "EN_DIAGNOSTICO",
    texto: "Es un reingreso por garantía: lo estamos revisando de nuevo sin costo.",
    tono: "espera",
  },
  SIN_REPARACION: {
    ancla: "EN_DIAGNOSTICO",
    texto:
      "No pudimos repararlo. Pasá a retirarlo cuando puedas y te contamos en detalle qué encontramos.",
    tono: "mal",
  },
  ABANDONADO: {
    ancla: "LISTO",
    texto:
      "El equipo está listo hace tiempo y todavía no lo retiraste. Pasá por el local o escribinos.",
    tono: "mal",
  },
}

export function SeguimientoVista({ datos }: { datos: Seguimiento }) {
  const desvio = DESVIOS[datos.estado]
  const tono = TONO_ORDEN[datos.estado] ?? "neutro"

  // Fecha real de cada paso, sacada del historial: la barra deja de ser una
  // promesa y pasa a contar lo que efectivamente ocurrió.
  const fechaDePaso = new Map<string, string>()
  for (const l of datos.linea) {
    if (!fechaDePaso.has(l.estado)) fechaDePaso.set(l.estado, l.fecha)
  }

  const pasos = datos.pasos.map((p) => ({ ...p, fecha: fechaDePaso.get(p.estado) ?? null }))

  // Si el estado es un desvío, damos por alcanzado hasta su paso ancla.
  const indiceAncla = desvio ? pasos.findIndex((p) => p.estado === desvio.ancla) : -1
  const alcanzados = pasos.map((p, i) => p.alcanzado || (indiceAncla >= 0 && i <= indiceAncla))
  const ultimoAlcanzado = alcanzados.lastIndexOf(true)
  const progresoPct =
    pasos.length > 1 ? Math.max(0, (ultimoAlcanzado / (pasos.length - 1)) * 100) : 0

  const listo = datos.estado === "LISTO"
  const entregado = datos.estado === "ENTREGADO"
  const diasPrometida = datos.fechaPrometida ? diasHasta(datos.fechaPrometida) : null

  return (
    <Marco
      titulo={datos.equipo}
      bajada={`Orden ${datos.numero} · a nombre de ${datos.cliente}`}
      chip={<Etiqueta tono={tono}>{datos.estadoTexto}</Etiqueta>}
    >
      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        {/* ---- Progreso ------------------------------------------------- */}
        <Carta titulo="En qué anda tu equipo">
          {listo && (
            <div
              className="mb-5 flex items-start gap-3 rounded-xl p-4"
              style={{
                background: `rgba(${ACENTO_RGB},0.12)`,
                border: `1px solid rgba(${ACENTO_RGB},0.3)`,
              }}
            >
              <PackageCheck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ACENTO }} />
              <div className="text-sm">
                <p className="font-semibold text-foreground">Ya lo podés pasar a retirar</p>
                <p className="mt-0.5 text-foreground/65">
                  Está listo desde el {fecha(datos.fechaListo)}.
                  {datos.total ? ` El total a abonar es ${plata(datos.total)}.` : ""}
                </p>
              </div>
            </div>
          )}

          {desvio && (
            <div
              className="mb-5 flex items-start gap-3 rounded-xl p-4 text-sm"
              style={{
                background: COLOR_TONO[desvio.tono].bg,
                border: `1px solid ${COLOR_TONO[desvio.tono].borde}`,
              }}
            >
              <Clock
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: COLOR_TONO[desvio.tono].fg }}
              />
              <div>
                <p className="font-semibold text-foreground">{datos.estadoTexto}</p>
                <p className="mt-0.5 text-foreground/65">{desvio.texto}</p>
              </div>
            </div>
          )}

          {/* Barra: en el celular es una línea vertical con los pasos al costado. */}
          <div className="relative">
            <span
              className="absolute left-[11px] top-2 bottom-2 w-0.5 rounded-full"
              style={{ background: "var(--hairline)" }}
              aria-hidden
            />
            <span
              className="absolute left-[11px] top-2 w-0.5 rounded-full transition-all"
              style={{
                background: ACENTO,
                height: `calc((100% - 1rem) * ${progresoPct / 100})`,
              }}
              aria-hidden
            />

            <ol className="space-y-4">
              {pasos.map((p, i) => {
                const hecho = alcanzados[i]
                const actual = i === ultimoAlcanzado && !entregado
                return (
                  <li key={p.estado} className="relative flex items-start gap-4 pl-0">
                    <span
                      className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: hecho ? ACENTO : "var(--surface)",
                        border: `2px solid ${hecho ? ACENTO : "var(--hairline-strong)"}`,
                        boxShadow: actual ? `0 0 0 4px rgba(${ACENTO_RGB},0.18)` : undefined,
                      }}
                    >
                      {hecho ? (
                        actual ? (
                          <CircleDot className="h-3.5 w-3.5 text-[var(--background)]" />
                        ) : (
                          <Check className="h-3.5 w-3.5 text-[var(--background)]" />
                        )
                      ) : null}
                    </span>

                    <div className="min-w-0 flex-1 pb-0.5">
                      <p
                        className={
                          hecho
                            ? "text-sm font-semibold text-foreground"
                            : "text-sm text-foreground/40"
                        }
                      >
                        {p.texto}
                      </p>
                      {p.fecha && (
                        <p className="mt-0.5 text-xs text-foreground/45">{fechaHora(p.fecha)}</p>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </Carta>

        {/* ---- Ficha del equipo ------------------------------------------ */}
        <div className="space-y-5">
          <Carta titulo="El equipo">
            <dl className="grid grid-cols-2 gap-4">
              <Dato etiqueta="Tipo">{TEXTO_EQUIPO[datos.tipoEquipo] ?? datos.tipoEquipo}</Dato>
              <Dato etiqueta="Ingresó">{fecha(datos.fechaIngreso)}</Dato>

              {datos.fechaPrometida && !entregado && (
                <Dato etiqueta="Fecha estimada">
                  <span
                    style={
                      diasPrometida !== null && diasPrometida < 0 && !listo
                        ? { color: "var(--brand-gold)" }
                        : undefined
                    }
                  >
                    {fecha(datos.fechaPrometida)}
                  </span>
                </Dato>
              )}

              {datos.tecnico && <Dato etiqueta="Técnico a cargo">{datos.tecnico}</Dato>}
              {datos.fechaEntrega && <Dato etiqueta="Entregado">{fecha(datos.fechaEntrega)}</Dato>}

              <div className="col-span-2">
                <Dato etiqueta="Lo que nos contaste">{datos.falla}</Dato>
              </div>
            </dl>

            {datos.esGarantia && (
              <p className="mt-4 flex items-center gap-2 text-xs font-semibold" style={{ color: ACENTO }}>
                <ShieldCheck className="h-4 w-4" />
                Reingreso por garantía, sin costo
              </p>
            )}
          </Carta>

          {datos.total !== null && (
            <Carta>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-foreground/55">
                  {entregado ? "Total abonado" : "Total presupuestado"}
                </span>
                <span className="tabular font-display text-2xl font-extrabold text-foreground">
                  {plata(datos.total)}
                </span>
              </div>
            </Carta>
          )}

          {datos.garantiaHasta && (
            <Carta>
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ACENTO }} />
                <div className="text-sm">
                  <p className="font-semibold text-foreground">
                    {diasHasta(datos.garantiaHasta) >= 0 ? "Con garantía" : "Garantía vencida"}
                  </p>
                  <p className="mt-0.5 text-foreground/60">
                    {diasHasta(datos.garantiaHasta) >= 0
                      ? `Hasta el ${fecha(datos.garantiaHasta)}. Si vuelve a fallar lo mismo, traelo y lo vemos sin cargo.`
                      : `Venció el ${fecha(datos.garantiaHasta)}.`}
                  </p>
                </div>
              </div>
            </Carta>
          )}
        </div>
      </div>

      {/* ---- Historial completo ------------------------------------------ */}
      {datos.linea.length > 0 && (
        <Carta className="mt-5" titulo="Historial" detalle="Todo lo que pasó con tu equipo, en orden.">
          <ol className="space-y-3">
            {[...datos.linea].reverse().map((l, i) => (
              <li key={`${l.estado}-${l.fecha}-${i}`} className="flex items-start gap-3 text-sm">
                <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-foreground/30" />
                <span className="flex-1 text-foreground/85">{l.texto}</span>
                <span className="shrink-0 text-xs text-foreground/45">{fechaHora(l.fecha)}</span>
              </li>
            ))}
          </ol>
        </Carta>
      )}
    </Marco>
  )
}
