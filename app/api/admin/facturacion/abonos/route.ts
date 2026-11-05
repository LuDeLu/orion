import { conAdmin } from "@/lib/admin-api"
import { registrar } from "@/lib/facturacion/actividad"
import { borrarAbono, cambiarActivo, guardarAbono, leerAbono, listarAbonos, totalAbono } from "@/lib/facturacion/abonos"
import { ErrorValidacion } from "@/lib/facturacion/emitir"
import { dinero } from "@/lib/facturacion/modelo"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return conAdmin(async () => ({ abonos: await listarAbonos() }))
}

/** { abono } para alta/edición, o { id, activo } para pausar/reanudar */
export async function POST(req: Request) {
  return conAdmin(async (sesion) => {
    const body = await req.json()
    if (body.id && typeof body.activo === "boolean") {
      const abono = await cambiarActivo(body.id, body.activo)
      await registrar(sesion.username, body.activo ? "Reanudó abono" : "Pausó abono", abono.nombre, "/admin/facturacion/abonos")
      return { abono }
    }
    const abono = await guardarAbono(body.abono ?? {})
    await registrar(
      sesion.username,
      body.abono?.id ? "Editó abono" : "Creó abono",
      `${abono.nombre} · ${dinero(totalAbono(abono), abono.moneda)} por mes`,
      "/admin/facturacion/abonos",
    )
    return { abono }
  })
}

export async function DELETE(req: Request) {
  return conAdmin(async (sesion) => {
    const id = new URL(req.url).searchParams.get("id")
    if (!id) throw new ErrorValidacion(["Falta el abono"])
    const previo = await leerAbono(id)
    await borrarAbono(id)
    await registrar(sesion.username, "Borró abono", previo?.nombre ?? id, "/admin/facturacion/abonos")
    return { ok: true }
  })
}
