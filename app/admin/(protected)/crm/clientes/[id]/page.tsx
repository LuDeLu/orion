import Link from "next/link"
import { notFound } from "next/navigation"
import { leerTodo } from "@/lib/crm/datos"
import { listarDocumentos } from "@/lib/facturacion/documentos"
import { CrmApp } from "@/components/admin/crm/crm-app"
import { FichaCliente } from "@/components/admin/crm/ficha-cliente"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const metadata = { title: "Cliente · Orion" }

export default async function ClientePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string>> }) {
  const [{ id }, sp, datos] = await Promise.all([params, searchParams, leerTodo()])
  const cliente = datos.clientes.find((c) => c.id === id)
  if (!cliente) notFound()

  // Comprobantes y presupuestos del cliente (por CUIT)
  const docs = cliente.cuit ? (await listarDocumentos(500)).filter((d) => d.receptor.docNro === cliente.cuit) : []

  return (
    <div className="space-y-5">
      <div className="text-xs" style={{ color: "rgba(244,242,238,0.45)" }}>
        <Link href="/admin/crm?vista=clientes" className="hover:text-white transition-colors">← Clientes</Link>
      </div>
      <CrmApp
        inicial={datos}
        query={new URLSearchParams(sp).toString()}
        clienteFijo={cliente.id}
        encabezado={
          <FichaCliente
            id={cliente.id}
            documentos={docs.map((d) => ({
              id: d.id,
              clase: d.clase,
              tipo: d.tipo,
              puntoVenta: d.puntoVenta,
              numero: d.numero,
              fecha: d.fecha,
              total: d.totales.total,
              moneda: d.moneda,
              estado: d.estado,
              entorno: d.entorno,
            }))}
          />
        }
      />
    </div>
  )
}
