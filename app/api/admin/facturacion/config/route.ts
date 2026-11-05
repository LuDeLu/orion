import { conAdmin } from "@/lib/admin-api"
import { guardarConfig, leerConfig } from "@/lib/facturacion/config"
import { registrar } from "@/lib/facturacion/actividad"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return conAdmin(leerConfig)
}

export async function PUT(req: Request) {
  return conAdmin(async (sesion) => {
    const antes = await leerConfig()
    const cfg = await guardarConfig(await req.json())
    const cambio = antes.entorno !== cfg.entorno ? `Pasó a ${cfg.entorno === "produccion" ? "producción" : "homologación"}` : "Datos del emisor y opciones"
    await registrar(sesion.username, "Cambió la configuración", cambio, "/admin/facturacion/configuracion")
    return cfg
  })
}
