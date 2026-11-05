import Link from "next/link"
import { notFound } from "next/navigation"
import { listarAbonos, totalAbono } from "@/lib/facturacion/abonos"
import { claveCliente, leerClientePorClave, listarDocumentos } from "@/lib/facturacion/documentos"
import {
  condicionIva,
  dinero,
  estadoCobro,
  fechaAr,
  formatoCuit,
  hoyAr,
  nombreDocumento,
  numeroCbte,
  saldoComprobante,
  tipoCbte,
  tipoDoc,
} from "@/lib/facturacion/modelo"
import { StatCard } from "@/components/admin/stat-card"
import { BotonLink, EncabezadoPagina, Icono, ICONOS, Insignia, Tarjeta, TEXTO_COBRO, tinta } from "@/components/admin/facturacion/ui"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const metadata = { title: "Cuenta corriente · Orion" }

const corto = (n: number) => `$ ${Math.round(n).toLocaleString("es-AR")}`

export default async function CuentaCorrientePage({ params }: { params: Promise<{ clave: string }> }) {
  const clave = decodeURIComponent((await params).clave)
  const [cliente, docs, abonos] = await Promise.all([leerClientePorClave(clave), listarDocumentos(), listarAbonos()])
  if (!cliente) notFound()

  const hoy = hoyAr()
  const propios = docs.filter((d) => d.receptor.docTipo !== 99 && claveCliente(d.receptor) === clave)
  const comprobantes = propios.filter((d) => d.clase === "factura" && d.estado === "emitido")
  const presupuestos = propios.filter((d) => d.clase === "presupuesto")
  const susAbonos = abonos.filter((a) => a.clienteClave === clave)

  // Todo en pesos: lo emitido en otra moneda se convierte con su cotización
  const enPesos = (n: number, cot: number) => n * (cot || 1)
  const signo = (tipo: number) => (tipoCbte(tipo)?.clase === "nc" ? -1 : 1)
  const facturado = comprobantes.reduce((s, d) => s + signo(d.tipo) * enPesos(d.totales.total, d.cotizacion), 0)
  const cobrado = comprobantes.reduce((s, d) => s + enPesos(d.cobro?.monto ?? 0, d.cotizacion), 0)
  const saldo = comprobantes.reduce((s, d) => s + enPesos(saldoComprobante(d, comprobantes), d.cotizacion), 0)
  const vencidas = comprobantes.filter((d) => estadoCobro(d, comprobantes, hoy) === "vencida").length
  const esCuit = cliente.docTipo === 80 || cliente.docTipo === 86

  const contacto = [
    ["Domicilio", cliente.domicilio],
    ["Email", cliente.email],
    ["Notas", cliente.notas],
    ["Presupuestos", presupuestos.length ? `${presupuestos.length} (${presupuestos.filter((p) => p.estado === "vigente").length} vigentes)` : ""],
  ].filter(([, v]) => v)

  return (
    <div className="space-y-6">
      <div className="text-xs" style={{ color: tinta.suave }}>
        <Link href="/admin/facturacion/clientes" className="hover:text-white transition-colors">
          ← Clientes
        </Link>
      </div>
      <EncabezadoPagina
        antetitulo="Cuenta corriente"
        titulo={cliente.alias || cliente.nombre}
        bajada={
          <>
            {cliente.alias ? `${cliente.nombre} · ` : ""}
            {tipoDoc(cliente.docTipo)} {esCuit ? formatoCuit(cliente.docNro) : cliente.docNro} · {condicionIva(cliente.condicionIva)?.nombre}
          </>
        }
        acciones={
          <>
            <BotonLink href={`/admin/facturacion/clientes?editar=${encodeURIComponent(clave)}`}>
              <Icono d={ICONOS.lapiz} />
              Editar ficha
            </BotonLink>
            <BotonLink href={`/admin/facturacion/nuevo?receptor=${encodeURIComponent(clave)}`} variante="primario">
              <Icono d={ICONOS.mas} />
              Facturar
            </BotonLink>
          </>
        }
      />

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <StatCard label="Facturado" value={corto(facturado)} hint="Neto de notas de crédito" accent="orange" />
        <StatCard label="Cobrado" value={corto(cobrado)} hint={`${comprobantes.filter((d) => d.cobro).length} pagos registrados`} accent="emerald" />
        <StatCard label="Saldo a cobrar" value={corto(saldo)} hint={vencidas ? `${vencidas} vencida${vencidas === 1 ? "" : "s"}` : "Sin vencidas"} accent="gold" />
        <StatCard label="Abonos activos" value={susAbonos.filter((a) => a.activo).length} hint={susAbonos.length ? `${susAbonos.length} en total` : "Sin abonos"} accent="sky" />
      </section>

      <Tarjeta titulo="Movimientos">
        {comprobantes.length === 0 ? (
          <p className="text-center py-8 text-sm" style={{ color: tinta.suave }}>
            Todavía no hay comprobantes emitidos para este cliente.
          </p>
        ) : (
          <div className="-mx-4 sm:-mx-5 overflow-x-auto">
            <table className="w-full text-sm min-w-[620px]">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest" style={{ color: tinta.tenue }}>
                  <th className="font-semibold px-4 sm:px-5 pb-2">Fecha</th>
                  <th className="font-semibold px-2 pb-2">Comprobante</th>
                  <th className="font-semibold px-2 pb-2 text-right">Importe</th>
                  <th className="font-semibold px-2 pb-2">Cobro</th>
                  <th className="font-semibold px-4 sm:px-5 pb-2 text-right">Saldo</th>
                </tr>
              </thead>
              <tbody>
                {comprobantes.map((d) => {
                  const esNc = tipoCbte(d.tipo)?.clase === "nc"
                  const ec = estadoCobro(d, comprobantes, hoy)
                  const s = saldoComprobante(d, comprobantes)
                  return (
                    <tr key={d.id} className="row-hover-orange border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <td className="px-4 sm:px-5 py-3 whitespace-nowrap tabular" style={{ color: tinta.media }}>
                        {fechaAr(d.fecha)}
                      </td>
                      <td className="px-2 py-3">
                        <Link href={`/admin/facturacion/${encodeURIComponent(d.id)}`} className="hover:underline">
                          <span className="text-white">{nombreDocumento(d)}</span>{" "}
                          <span className="text-xs tabular" style={{ color: tinta.suave }}>
                            {numeroCbte(d.puntoVenta, d.numero)}
                          </span>
                        </Link>
                        {d.entorno === "homologacion" && (
                          <span className="ml-1.5">
                            <Insignia estado="homologacion" />
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-3 text-right tabular whitespace-nowrap" style={{ color: esNc ? "rgba(253,164,175,0.95)" : "#fff" }}>
                        {esNc ? "− " : ""}
                        {dinero(d.totales.total, d.moneda)}
                      </td>
                      <td className="px-2 py-3">
                        {ec ? (
                          <Insignia estado={TEXTO_COBRO[ec].estado} texto={TEXTO_COBRO[ec].texto} />
                        ) : (
                          <span className="text-xs" style={{ color: tinta.tenue }}>
                            —
                          </span>
                        )}
                        {d.cobro && (
                          <span className="block text-[11px] mt-0.5" style={{ color: tinta.suave }}>
                            {fechaAr(d.cobro.fecha)} · {d.cobro.medio}
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-5 py-3 text-right tabular whitespace-nowrap font-semibold" style={{ color: s > 0 ? "#fff" : tinta.tenue }}>
                        {s > 0 ? dinero(s, d.moneda) : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Tarjeta>

      <div className="grid lg:grid-cols-2 gap-4">
        <Tarjeta
          titulo="Abonos"
          accion={
            <Link href="/admin/facturacion/abonos" className="text-xs underline" style={{ color: tinta.suave }}>
              Administrar
            </Link>
          }
        >
          {susAbonos.length === 0 ? (
            <p className="text-sm" style={{ color: tinta.suave }}>
              No tiene abonos mensuales.
            </p>
          ) : (
            <ul className="space-y-2">
              {susAbonos.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate" style={{ color: a.activo ? tinta.media : tinta.tenue }}>
                    {a.nombre}
                    {a.activo ? "" : " (pausado)"}
                  </span>
                  <span className="tabular text-white whitespace-nowrap">{dinero(totalAbono(a), a.moneda)}/mes</span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
        <Tarjeta titulo="Datos de contacto">
          {contacto.length === 0 ? (
            <p className="text-sm" style={{ color: tinta.suave }}>
              Sin domicilio ni email cargados.
            </p>
          ) : (
            <dl className="space-y-1.5 text-sm">
              {contacto.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt style={{ color: tinta.suave }}>{k}</dt>
                  <dd className="text-right break-words min-w-0" style={{ color: tinta.media }}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </Tarjeta>
      </div>
    </div>
  )
}
