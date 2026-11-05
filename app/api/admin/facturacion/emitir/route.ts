import { conAdmin } from "@/lib/admin-api"
import { emitirFactura } from "@/lib/facturacion/emitir"
import { registrar } from "@/lib/facturacion/actividad"
import { nombreDocumento, numeroCbte } from "@/lib/facturacion/modelo"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  return conAdmin(async (sesion) => {
    const { datos, presupuestoId, abonoId } = await req.json()
    const doc = await emitirFactura(datos, { presupuestoId, abonoId })
    await registrar(
      sesion.username,
      "Emitió comprobante",
      `${nombreDocumento(doc)} ${numeroCbte(doc.puntoVenta, doc.numero)} a ${doc.receptor.nombre}${doc.entorno === "homologacion" ? " (homologación)" : ""}`,
      `/admin/facturacion/${encodeURIComponent(doc.id)}`,
    )
    return doc
  })
}
