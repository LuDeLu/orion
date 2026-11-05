import { conAdmin } from "@/lib/admin-api"
import { registrar } from "@/lib/facturacion/actividad"
import { borrarServicio, guardarServicio, listarCatalogo } from "@/lib/facturacion/catalogo"
import { ErrorValidacion } from "@/lib/facturacion/emitir"
import { dinero } from "@/lib/facturacion/modelo"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return conAdmin(async () => ({ servicios: await listarCatalogo() }))
}

export async function POST(req: Request) {
  return conAdmin(async (sesion) => {
    const body = await req.json()
    const servicio = await guardarServicio(body.servicio ?? {})
    await registrar(
      sesion.username,
      body.servicio?.id ? "Editó servicio del catálogo" : "Agregó servicio al catálogo",
      `${servicio.descripcion} · ${dinero(servicio.precio, servicio.moneda)}`,
      "/admin/facturacion/catalogo",
    )
    return { servicio }
  })
}

export async function DELETE(req: Request) {
  return conAdmin(async (sesion) => {
    const id = new URL(req.url).searchParams.get("id")
    if (!id) throw new ErrorValidacion(["Falta el servicio"])
    const previo = (await listarCatalogo()).find((s) => s.id === id)
    await borrarServicio(id)
    await registrar(sesion.username, "Quitó servicio del catálogo", previo?.descripcion ?? id, "/admin/facturacion/catalogo")
    return { ok: true }
  })
}
