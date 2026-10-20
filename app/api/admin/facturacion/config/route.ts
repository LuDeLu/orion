import { conAdmin } from "@/lib/admin-api"
import { guardarConfig, leerConfig } from "@/lib/facturacion/config"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return conAdmin(leerConfig)
}

export async function PUT(req: Request) {
  return conAdmin(async () => guardarConfig(await req.json()))
}
