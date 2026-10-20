import { leerConfig } from "@/lib/facturacion/config"
import { listarDocumentos } from "@/lib/facturacion/documentos"
import { estadoCertificado } from "@/lib/facturacion/arca"
import { dinero, hoyAr, tipoCbte } from "@/lib/facturacion/modelo"
import { StatCard } from "@/components/admin/stat-card"
import { ListaDocumentos } from "@/components/admin/facturacion/lista-documentos"
import { Aviso, BotonLink, EncabezadoPagina, ICONOS, Icono } from "@/components/admin/facturacion/ui"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const metadata = { title: "Facturación · Orion" }

const corto = (n: number) => `$ ${Math.round(n).toLocaleString("es-AR")}`
const plural = (n: number, s: string) => `${n} ${s}${n === 1 ? "" : "s"}`

export default async function FacturacionPage() {
  const [cfg, docs] = await Promise.all([leerConfig(), listarDocumentos()])
  const cert = await estadoCertificado(cfg.entorno)

  const hoy = hoyAr()
  const mes = hoy.slice(0, 7)
  const haceUnAnio = new Date(Date.now() - 365 * 864e5).toISOString().slice(0, 10)

  // Solo comprobantes del entorno activo; las NC restan
  const facturas = docs.filter((d) => d.clase === "factura" && d.estado === "emitido" && d.entorno === cfg.entorno)
  const signo = (tipo: number) => (tipoCbte(tipo)?.clase === "nc" ? -1 : 1)
  const enPesos = (d: (typeof docs)[number]) => d.totales.total * (d.cotizacion || 1) * signo(d.tipo)
  const delMes = facturas.filter((d) => d.fecha.startsWith(mes)).reduce((s, d) => s + enPesos(d), 0)
  const anual = facturas.filter((d) => d.fecha >= haceUnAnio).reduce((s, d) => s + enPesos(d), 0)
  const presupuestos = docs.filter((d) => d.clase === "presupuesto" && d.estado === "vigente")
  const montoPresupuestos = presupuestos.reduce((s, d) => s + d.totales.total * (d.cotizacion || 1), 0)

  const listo = cert.tieneCertificado && cert.tieneClave && !!cfg.razonSocial

  return (
    <div className="space-y-6">
      <EncabezadoPagina
        antetitulo="Facturación ARCA"
        titulo="Facturación"
        bajada={
          <>
            Facturas electrónicas y presupuestos con la marca de Orion · CUIT {cfg.cuit} ·{" "}
            {cfg.entorno === "produccion" ? "Producción" : "Homologación (pruebas)"}
          </>
        }
        acciones={
          <>
            <BotonLink href="/admin/facturacion/configuracion" aria-label="Configuración">
              <Icono d={ICONOS.engranaje} />
              <span className="hidden sm:inline">Configuración</span>
            </BotonLink>
            <BotonLink href="/admin/facturacion/nuevo?modo=presupuesto" variante="secundario">
              <Icono d={ICONOS.recibo} />
              Presupuesto
            </BotonLink>
            <BotonLink href="/admin/facturacion/nuevo" variante="primario">
              <Icono d={ICONOS.mas} />
              Nueva factura
            </BotonLink>
          </>
        }
      />

      {!listo && (
        <Aviso tono="alerta">
          Todavía falta configurar ARCA para emitir facturas.{" "}
          <Link href="/admin/facturacion/configuracion" className="underline font-medium">
            Completá la configuración
          </Link>{" "}
          (son 4 pasos). Mientras tanto ya podés armar presupuestos.
        </Aviso>
      )}
      {listo && cfg.entorno === "homologacion" && (
        <Aviso tono="info">
          Estás en <b>homologación</b>: los comprobantes son de prueba y no tienen validez fiscal. Cuando esté todo probado, pasá a
          producción desde Configuración.
        </Aviso>
      )}
      {cert.certificado && cert.certificado.diasRestantes < 30 && (
        <Aviso tono={cert.certificado.diasRestantes < 0 ? "error" : "alerta"}>
          El certificado de ARCA {cert.certificado.diasRestantes < 0 ? "venció" : `vence en ${cert.certificado.diasRestantes} días`}.
          Renovalo desde Configuración para no quedarte sin facturar.
        </Aviso>
      )}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <StatCard label="Facturado este mes" value={corto(delMes)} hint={plural(facturas.filter((d) => d.fecha.startsWith(mes)).length, "comprobante")} accent="orange" />
        <StatCard
          label="Últimos 12 meses"
          value={corto(anual)}
          hint={cfg.condicionIva === "monotributo" ? `Para recategorización${cfg.categoriaMonotributo ? ` · cat. ${cfg.categoriaMonotributo}` : ""}` : "Neto de notas de crédito"}
          accent="gold"
        />
        <StatCard label="Presupuestos vigentes" value={presupuestos.length} hint={`${dinero(montoPresupuestos)} en total`} accent="sky" />
        <StatCard label="Comprobantes emitidos" value={facturas.length} hint={cfg.entorno === "produccion" ? "En producción" : "En homologación"} accent="emerald" />
      </section>

      <ListaDocumentos docs={docs} hoy={hoy} />
    </div>
  )
}
