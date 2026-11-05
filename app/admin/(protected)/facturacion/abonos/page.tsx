import { generalizarMes, listarAbonos } from "@/lib/facturacion/abonos"
import { listarCatalogo } from "@/lib/facturacion/catalogo"
import { claveCliente, leerDocumento, listarClientes } from "@/lib/facturacion/documentos"
import { hoyAr } from "@/lib/facturacion/modelo"
import { GestorAbonos } from "@/components/admin/facturacion/gestor-abonos"
import { EncabezadoPagina } from "@/components/admin/facturacion/ui"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const metadata = { title: "Abonos · Facturación · Orion" }

export default async function AbonosPage({ searchParams }: { searchParams: Promise<{ desde?: string }> }) {
  const { desde } = await searchParams
  const [abonos, clientes, catalogo] = await Promise.all([listarAbonos(), listarClientes(), listarCatalogo()])

  // "Crear abono" desde una factura: se copian cliente, ítems y condiciones
  const doc = desde ? await leerDocumento(desde) : null
  const borrador =
    doc && doc.receptor.docTipo !== 99
      ? {
          nombre: "",
          clienteClave: claveCliente(doc.receptor),
          items: doc.items.map((i) => ({ ...i, descripcion: generalizarMes(i.descripcion) })),
          moneda: doc.moneda,
          condicionVenta: doc.condicionVenta,
          // Si la factura era por un mes anterior al de emisión, el abono es "mes vencido"
          mesFacturado: (doc.servicioDesde && doc.servicioDesde.slice(0, 7) < doc.fecha.slice(0, 7) ? "anterior" : "actual") as "anterior" | "actual",
          diasVencimiento: doc.vencimientoPago ? Math.max(0, Math.round((new Date(doc.vencimientoPago).getTime() - new Date(doc.fecha).getTime()) / 864e5)) : 10,
          observaciones: doc.observaciones,
        }
      : null

  return (
    <div className="space-y-6">
      <EncabezadoPagina
        antetitulo="Facturación"
        titulo="Abonos mensuales"
        bajada="Lo que le facturás todos los meses a cada cliente. Cada mes ves cuáles faltan y los emitís con un clic, revisando antes de confirmar."
      />
      <GestorAbonos
        inicial={abonos}
        clientes={clientes.map((c) => ({ clave: claveCliente(c), nombre: c.nombre, alias: c.alias }))}
        catalogo={catalogo}
        hoy={hoyAr()}
        borradorInicial={borrador}
      />
    </div>
  )
}
