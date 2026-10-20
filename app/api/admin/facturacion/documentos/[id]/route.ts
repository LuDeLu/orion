import { conAdmin } from "@/lib/admin-api"
import { borrarDocumento, leerDocumento } from "@/lib/facturacion/documentos"
import { cambiarEstadoPresupuesto, ErrorValidacion, verificarPendiente } from "@/lib/facturacion/emitir"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_: Request, { params }: Ctx) {
  return conAdmin(async () => {
    const doc = await leerDocumento((await params).id)
    if (!doc) throw new ErrorValidacion(["No existe ese documento"])
    return doc
  })
}

export async function PATCH(req: Request, { params }: Ctx) {
  return conAdmin(async () => {
    const { id } = await params
    const body = await req.json()
    if (body.accion === "verificar") return verificarPendiente(id)
    if (body.accion === "estado") return cambiarEstadoPresupuesto(id, body.estado)
    throw new ErrorValidacion(["Acción desconocida"])
  })
}

/** Solo se pueden borrar presupuestos: los comprobantes con CAE se anulan con nota de crédito. */
export async function DELETE(_: Request, { params }: Ctx) {
  return conAdmin(async () => {
    const { id } = await params
    const doc = await leerDocumento(id)
    if (!doc || doc.clase !== "presupuesto") throw new ErrorValidacion(["Solo se pueden eliminar presupuestos"])
    await borrarDocumento(id)
  })
}
