import { conAdmin } from "@/lib/admin-api"
import { credenciales } from "@/lib/facturacion/arca"
import { cotizacion } from "@/lib/facturacion/arca/wsfe"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Cotización oficial que ARCA usa para validar MonCotiz. */
export async function GET(req: Request) {
  return conAdmin(async () => {
    const moneda = new URL(req.url).searchParams.get("moneda") || "DOL"
    return cotizacion(await credenciales("wsfe"), moneda)
  })
}
