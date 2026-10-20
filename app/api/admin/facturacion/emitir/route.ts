import { conAdmin } from "@/lib/admin-api"
import { emitirFactura } from "@/lib/facturacion/emitir"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  return conAdmin(async () => {
    const { datos, presupuestoId } = await req.json()
    return emitirFactura(datos, { presupuestoId })
  })
}
