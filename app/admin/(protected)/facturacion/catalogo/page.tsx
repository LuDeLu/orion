import { listarCatalogo } from "@/lib/facturacion/catalogo"
import { leerConfig } from "@/lib/facturacion/config"
import { EditorCatalogo } from "@/components/admin/facturacion/editor-catalogo"
import { EncabezadoPagina } from "@/components/admin/facturacion/ui"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const metadata = { title: "Catálogo · Facturación · Orion" }

export default async function CatalogoPage() {
  const [servicios, cfg] = await Promise.all([listarCatalogo(), leerConfig()])
  return (
    <div className="space-y-6">
      <EncabezadoPagina
        antetitulo="Facturación"
        titulo="Catálogo de servicios"
        bajada="Los servicios que facturás seguido, con su precio. Se agregan a facturas, presupuestos y abonos con un clic."
      />
      <EditorCatalogo inicial={servicios} discrimina={cfg.condicionIva === "responsable_inscripto"} />
    </div>
  )
}
