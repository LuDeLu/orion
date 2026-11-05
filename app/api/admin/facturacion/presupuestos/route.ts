import { conAdmin } from "@/lib/admin-api"
import { guardarPresupuesto } from "@/lib/facturacion/emitir"
import { registrar } from "@/lib/facturacion/actividad"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  return conAdmin(async (sesion) => {
    const { datos, id } = await req.json()
    const doc = await guardarPresupuesto(datos, id)
    await registrar(sesion.username, id ? "Editó presupuesto" : "Creó presupuesto", `P-${String(doc.numero).padStart(6, "0")} para ${doc.receptor.nombre}`, `/admin/facturacion/${encodeURIComponent(doc.id)}`)
    return doc
  })
}
