import { leerConfig } from "@/lib/facturacion/config"
import { estadoCertificado } from "@/lib/facturacion/arca"
import { buscarCliente, leerDocumento, listarClientes, listarDocumentos } from "@/lib/facturacion/documentos"
import { leerCliente } from "@/lib/crm/datos"
import { tipoCbte, type Documento } from "@/lib/facturacion/modelo"
import { FormularioComprobante, type Inicial } from "@/components/admin/facturacion/formulario"
import { EncabezadoPagina } from "@/components/admin/facturacion/ui"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const metadata = { title: "Nuevo comprobante · Orion" }

type Busqueda = Promise<{ modo?: string; desde?: string; nc?: string; nd?: string; presupuesto?: string; editar?: string; cliente?: string }>

/**
 * Puntos de entrada:
 *   ?modo=presupuesto        presupuesto en blanco
 *   ?presupuesto=<id>        facturar un presupuesto
 *   ?editar=<id>             editar un presupuesto
 *   ?desde=<id>              duplicar cualquier documento
 *   ?nc=<id> / ?nd=<id>      nota de crédito / débito sobre una factura
 *   ?cliente=<id CRM>        con los datos de un cliente del CRM
 */
export default async function NuevoPage({ searchParams }: { searchParams: Busqueda }) {
  const sp = await searchParams
  const [cfg, clientes, docs] = await Promise.all([leerConfig(), listarClientes(), listarDocumentos(400)])
  const cert = await estadoCertificado(cfg.entorno)

  const origenId = sp.presupuesto || sp.editar || sp.desde || sp.nc || sp.nd
  const origen: Documento | null = origenId ? await leerDocumento(origenId) : null

  let inicial: Inicial = { modo: sp.modo === "presupuesto" || sp.editar ? "presupuesto" : "factura" }
  if (origen) {
    const base = {
      receptor: origen.receptor,
      items: origen.items,
      concepto: origen.concepto,
      moneda: origen.moneda,
      cotizacion: origen.cotizacion,
      condicionVenta: origen.condicionVenta,
      preciosConIva: origen.preciosConIva,
      observaciones: sp.nc || sp.nd ? "" : origen.observaciones,
      servicioDesde: origen.servicioDesde,
      servicioHasta: origen.servicioHasta,
    }
    if (sp.editar && origen.clase === "presupuesto")
      inicial = { modo: "presupuesto", datos: { ...base, fecha: origen.fecha, validezDias: origen.validezDias }, editarId: origen.id }
    else if (sp.presupuesto) inicial = { modo: "factura", datos: base, presupuestoId: origen.id }
    else if ((sp.nc || sp.nd) && origen.clase === "factura" && origen.cae) {
      const t = tipoCbte(origen.tipo)
      inicial = {
        modo: "factura",
        clase: sp.nc ? "nc" : "nd",
        fce: t?.fce,
        datos: { ...base, asociado: { tipo: origen.tipo, puntoVenta: origen.puntoVenta, numero: origen.numero, fecha: origen.fecha } },
      }
    } else inicial = { modo: origen.clase === "presupuesto" ? "presupuesto" : "factura", datos: base }
  }

  // Desde la ficha de un cliente del CRM: si ya se le facturó se usan esos datos; si no, se completa por CUIT
  if (!origen && sp.cliente) {
    const c = await leerCliente(sp.cliente)
    if (c) {
      const agenda = c.cuit ? await buscarCliente(c.cuit) : null
      inicial = {
        ...inicial,
        buscarReceptor: !agenda && c.cuit.length === 11,
        datos: {
          receptor: agenda ?? {
            docTipo: c.cuit.length === 11 ? 80 : 99,
            docNro: c.cuit,
            nombre: c.cuit ? c.nombre : "Consumidor Final",
            condicionIva: 5,
            domicilio: "",
            email: c.email,
          },
        },
      }
    }
  }

  const facturas = docs
    .filter((d) => d.clase === "factura" && d.estado === "emitido" && d.entorno === cfg.entorno)
    .map((d) => ({ id: d.id, tipo: d.tipo, puntoVenta: d.puntoVenta, numero: d.numero, fecha: d.fecha, cliente: d.receptor.nombre, total: d.totales.total, moneda: d.moneda }))

  const titulo = inicial.editarId
    ? "Editar presupuesto"
    : inicial.clase === "nc"
      ? "Nota de crédito"
      : inicial.clase === "nd"
        ? "Nota de débito"
        : inicial.modo === "presupuesto"
          ? "Nuevo presupuesto"
          : "Nueva factura"

  return (
    <div className="space-y-6">
      <EncabezadoPagina antetitulo="Facturación" titulo={titulo} />
      <FormularioComprobante
        inicial={inicial}
        config={{
          condicionIva: cfg.condicionIva,
          entorno: cfg.entorno,
          puntoVenta: cfg.puntoVenta,
          validezPresupuesto: cfg.validezPresupuesto,
          tieneCbu: !!cfg.cbu,
          arcaListo: cert.tieneCertificado && cert.tieneClave,
        }}
        clientes={clientes.slice(0, 50)}
        facturas={facturas}
      />
    </div>
  )
}
