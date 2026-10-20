import { conAdmin } from "@/lib/admin-api"
import { crearTarea } from "@/lib/crm/datos"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  return conAdmin(async () => crearTarea(await req.json()))
}
