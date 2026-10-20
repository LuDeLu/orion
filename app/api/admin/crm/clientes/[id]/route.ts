import { conAdmin } from "@/lib/admin-api"
import { actualizarCliente, borrarCliente } from "@/lib/crm/datos"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: Ctx) {
  return conAdmin(async () => actualizarCliente((await params).id, await req.json()))
}

export async function DELETE(_: Request, { params }: Ctx) {
  return conAdmin(async () => borrarCliente((await params).id))
}
