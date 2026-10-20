import { conAdmin } from "@/lib/admin-api"
import { guardarPresupuesto } from "@/lib/facturacion/emitir"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  return conAdmin(async () => {
    const { datos, id } = await req.json()
    return guardarPresupuesto(datos, id)
  })
}
