import { listarClientes } from "@/lib/facturacion/documentos"
import { AgendaClientes } from "@/components/admin/facturacion/agenda-clientes"
import { BotonLink, EncabezadoPagina, ICONOS, Icono } from "@/components/admin/facturacion/ui"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const metadata = { title: "Clientes · Facturación · Orion" }

export default async function ClientesPage() {
  const clientes = await listarClientes()
  return (
    <div className="space-y-6">
      <EncabezadoPagina
        antetitulo="Facturación"
        titulo="Clientes"
        bajada="Cargá el CUIT y la razón social, el domicilio y la condición de IVA se traen de ARCA. El alias es para reconocerlos en el panel."
        acciones={
          <BotonLink href="/admin/facturacion">
            <Icono d={ICONOS.recibo} />
            Comprobantes
          </BotonLink>
        }
      />
      <AgendaClientes inicial={clientes} />
    </div>
  )
}
