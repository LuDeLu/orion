import { conAdmin } from "@/lib/admin-api"
import { guardarTablero } from "@/lib/crm/datos"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function PUT(req: Request) {
  return conAdmin(async () => guardarTablero(await req.json()))
}
