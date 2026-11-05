import { conAdmin } from "@/lib/admin-api"
import { borrarDocumento, leerDocumento } from "@/lib/facturacion/documentos"
import { cambiarEstadoPresupuesto, ErrorValidacion, verificarPendiente } from "@/lib/facturacion/emitir"
import { anularCobro, registrarCobro } from "@/lib/facturacion/cobros"
import { registrar } from "@/lib/facturacion/actividad"
import { dinero, nombreDocumento, numeroCbte, type Documento } from "@/lib/facturacion/modelo"

const etiqueta = (d: Documento) =>
  d.clase === "presupuesto" ? `P-${String(d.numero).padStart(6, "0")}` : `${nombreDocumento(d)} ${numeroCbte(d.puntoVenta, d.numero)}`
const enlace = (id: string) => `/admin/facturacion/${encodeURIComponent(id)}`

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
  return conAdmin(async (sesion) => {
    const { id } = await params
    const body = await req.json()
    const u = sesion.username
    switch (body.accion) {
      case "verificar": {
        const d = await verificarPendiente(id)
        await registrar(u, "Verificó en ARCA", etiqueta(d), enlace(id))
        return d
      }
      case "estado": {
        await cambiarEstadoPresupuesto(id, body.estado)
        const d = await leerDocumento(id)
        if (d) await registrar(u, "Cambió estado de presupuesto", `${etiqueta(d)} → ${body.estado}`, enlace(id))
        return d
      }
      case "cobro": {
        const d = await registrarCobro(id, body, u)
        await registrar(u, "Registró cobro", `${etiqueta(d)} · ${dinero(d.cobro!.monto, d.moneda)} por ${d.cobro!.medio}`, enlace(id))
        return d
      }
      case "anularCobro": {
        const d = await anularCobro(id)
        await registrar(u, "Anuló cobro", etiqueta(d), enlace(id))
        return d
      }
    }
    throw new ErrorValidacion(["Acción desconocida"])
  })
}

/** Solo se pueden borrar presupuestos: los comprobantes con CAE se anulan con nota de crédito. */
export async function DELETE(_: Request, { params }: Ctx) {
  return conAdmin(async (sesion) => {
    const { id } = await params
    const doc = await leerDocumento(id)
    if (!doc || doc.clase !== "presupuesto") throw new ErrorValidacion(["Solo se pueden eliminar presupuestos"])
    await borrarDocumento(id)
    await registrar(sesion.username, "Eliminó presupuesto", `${etiqueta(doc)} de ${doc.receptor.nombre}`)
  })
}
