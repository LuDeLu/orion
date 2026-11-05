import Link from "next/link"
import { listarActividad } from "@/lib/facturacion/actividad"
import { EncabezadoPagina, Tarjeta, tinta } from "@/components/admin/facturacion/ui"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const metadata = { title: "Actividad · Facturación · Orion" }

const dia = (iso: string) =>
  new Date(iso).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "America/Argentina/Buenos_Aires" })
const hora = (iso: string) => new Date(iso).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "America/Argentina/Buenos_Aires" })

export default async function ActividadPage() {
  const eventos = await listarActividad(400)

  // Agrupado por día (hora argentina)
  const grupos: { dia: string; eventos: typeof eventos }[] = []
  for (const ev of eventos) {
    const d = dia(ev.fecha)
    if (grupos.at(-1)?.dia !== d) grupos.push({ dia: d, eventos: [] })
    grupos.at(-1)!.eventos.push(ev)
  }

  return (
    <div className="space-y-6">
      <EncabezadoPagina
        antetitulo="Facturación"
        titulo="Registro de actividad"
        bajada="Quién emitió, cobró, editó o borró qué y cuándo. Se guardan los últimos 18 meses."
      />
      <Tarjeta>
        {grupos.length === 0 ? (
          <p className="text-center py-10 text-sm" style={{ color: tinta.suave }}>
            Todavía no hay actividad registrada. Desde ahora queda anotado cada comprobante, cobro y cambio de configuración.
          </p>
        ) : (
          <div className="space-y-6">
            {grupos.map((g) => (
              <section key={g.dia}>
                <h2 className="text-[11px] font-semibold uppercase tracking-widest mb-2 first-letter:uppercase" style={{ color: tinta.suave }}>
                  {g.dia}
                </h2>
                <ul>
                  {g.eventos.map((ev, i) => (
                    <li key={i} className="flex gap-3 py-2 border-t first:border-t-0 text-sm" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <span className="tabular shrink-0 w-12" style={{ color: tinta.tenue }}>
                        {hora(ev.fecha)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="text-white">{ev.accion}</span>
                        {ev.detalle && (
                          <>
                            {" · "}
                            {ev.href ? (
                              <Link href={ev.href} className="hover:underline" style={{ color: tinta.media }}>
                                {ev.detalle}
                              </Link>
                            ) : (
                              <span style={{ color: tinta.media }}>{ev.detalle}</span>
                            )}
                          </>
                        )}
                      </div>
                      <span className="shrink-0 text-xs self-center" style={{ color: tinta.suave }}>
                        {ev.usuario}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Tarjeta>
    </div>
  )
}
