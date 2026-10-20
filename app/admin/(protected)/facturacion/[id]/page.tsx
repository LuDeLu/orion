import Link from "next/link"
import { notFound } from "next/navigation"
import { leerDocumento } from "@/lib/facturacion/documentos"
import {
  CONCEPTOS,
  condicionIva,
  dinero,
  fechaAr,
  formatoCuit,
  hoyAr,
  nombreDocumento,
  numeroCbte,
  tipoCbte,
  tipoDoc,
} from "@/lib/facturacion/modelo"
import { AccionesDocumento } from "@/components/admin/facturacion/acciones-documento"
import { Aviso, EncabezadoPagina, Insignia, Tarjeta, tinta } from "@/components/admin/facturacion/ui"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const metadata = { title: "Comprobante · Orion" }

export default async function DocumentoPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ nuevo?: string }> }) {
  const id = decodeURIComponent((await params).id)
  const { nuevo } = await searchParams
  const doc = await leerDocumento(id)
  if (!doc) notFound()

  const esP = doc.clase === "presupuesto"
  const numero = esP ? `P-${String(doc.numero).padStart(6, "0")}` : numeroCbte(doc.puntoVenta, doc.numero)
  const pdf = `/admin/facturacion/${encodeURIComponent(doc.id)}/pdf`
  const venceValidez = esP && doc.validezDias ? new Date(new Date(doc.fecha).getTime() + doc.validezDias * 864e5).toISOString().slice(0, 10) : null
  const vencido = esP && doc.estado === "vigente" && venceValidez && venceValidez < hoyAr()
  const t = tipoCbte(doc.tipo)

  return (
    <div className="space-y-6">
      <div className="text-xs" style={{ color: tinta.suave }}>
        <Link href="/admin/facturacion" className="hover:text-white transition-colors">← Facturación</Link>
      </div>
      <EncabezadoPagina antetitulo={numero} titulo={nombreDocumento(doc)} bajada={`${doc.receptor.nombre} · ${fechaAr(doc.fecha)}`} />

      {nuevo && doc.estado === "emitido" && (
        <Aviso tono="ok">
          Comprobante autorizado por ARCA con CAE <b className="tabular">{doc.cae}</b>
          {doc.entorno === "homologacion" ? " (homologación: sin validez fiscal)" : ""}. Ya podés descargar el PDF.
        </Aviso>
      )}
      {nuevo && esP && <Aviso tono="ok">Presupuesto guardado. Cuando el cliente lo apruebe, facturalo con un clic.</Aviso>}
      {doc.estado === "pendiente" && (
        <Aviso tono="alerta">
          La comunicación con ARCA se cortó durante la emisión y no sabemos si quedó autorizado. Tocá <b>Verificar en ARCA</b> para confirmarlo.
        </Aviso>
      )}
      {doc.mensajesArca?.length ? <Aviso tono="info">Observaciones de ARCA: {doc.mensajesArca.join(" · ")}</Aviso> : null}

      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-4 items-start">
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#fff" }}>
          <iframe src={`${pdf}#view=FitH&toolbar=0`} title="PDF del comprobante" className="w-full h-[78vh] min-h-[520px] block" />
        </div>

        <aside className="space-y-3 lg:sticky lg:top-20">
          <Tarjeta>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs uppercase tracking-widest" style={{ color: tinta.suave }}>Total</span>
              <span className="text-2xl font-bold text-white tabular">
                {t?.clase === "nc" ? "− " : ""}
                {dinero(doc.totales.total, doc.moneda)}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              <Insignia estado={vencido ? "vencido" : doc.estado} />
              {!esP && doc.entorno === "homologacion" && <Insignia estado="homologacion" texto="Homologación" />}
            </div>
            <AccionesDocumento
              id={doc.id}
              clase={doc.clase}
              estado={doc.estado}
              pdf={pdf}
              puedeAjustar={!esP && doc.estado === "emitido" && t?.clase !== "nc"}
            />
          </Tarjeta>

          <Tarjeta titulo="Datos">
            <dl className="space-y-2 text-sm">
              <Dato etiqueta="Cliente" valor={doc.receptor.nombre} />
              {doc.receptor.docTipo !== 99 && (
                <Dato etiqueta={tipoDoc(doc.receptor.docTipo)} valor={doc.receptor.docTipo === 80 ? formatoCuit(doc.receptor.docNro) : doc.receptor.docNro} />
              )}
              <Dato etiqueta="Condición IVA" valor={condicionIva(doc.receptor.condicionIva)?.nombre} />
              <Dato etiqueta="Email" valor={doc.receptor.email} />
              {!esP && <Dato etiqueta="Concepto" valor={CONCEPTOS.find((c) => c.id === doc.concepto)?.nombre} />}
              {doc.servicioDesde && doc.concepto !== 1 && <Dato etiqueta="Período" valor={`${fechaAr(doc.servicioDesde)} – ${fechaAr(doc.servicioHasta)}`} />}
              {doc.vencimientoPago && <Dato etiqueta="Vence el pago" valor={fechaAr(doc.vencimientoPago)} />}
              {venceValidez && <Dato etiqueta="Válido hasta" valor={fechaAr(venceValidez)} />}
              {doc.cae && <Dato etiqueta="CAE" valor={doc.cae} />}
              {doc.caeVencimiento && <Dato etiqueta="Vto. CAE" valor={fechaAr(doc.caeVencimiento)} />}
              {doc.asociado && <Dato etiqueta="Asociado a" valor={`${tipoCbte(doc.asociado.tipo)?.nombre} ${numeroCbte(doc.asociado.puntoVenta, doc.asociado.numero)}`} />}
              {doc.vinculo && (
                <div className="flex justify-between gap-3">
                  <dt style={{ color: tinta.suave }}>{esP ? "Facturado en" : "Presupuesto"}</dt>
                  <dd>
                    <Link href={`/admin/facturacion/${encodeURIComponent(doc.vinculo)}`} className="underline" style={{ color: "rgba(244,170,130,0.95)" }}>
                      Ver
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </Tarjeta>
        </aside>
      </div>
    </div>
  )
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor?: string }) {
  if (!valor) return null
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0" style={{ color: tinta.suave }}>{etiqueta}</dt>
      <dd className="text-right break-words min-w-0 tabular" style={{ color: tinta.media }}>{valor}</dd>
    </div>
  )
}
