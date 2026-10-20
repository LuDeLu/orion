import { NextResponse } from "next/server"
import { conAdmin } from "@/lib/admin-api"
import { calcularTotales } from "@/lib/facturacion/calculo"
import { leerConfig } from "@/lib/facturacion/config"
import { normalizar } from "@/lib/facturacion/emitir"
import { discriminaIva, tipoCbte, type Documento } from "@/lib/facturacion/modelo"
import { generarPdf } from "@/lib/facturacion/pdf"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** PDF del formulario tal como está, sin pedir CAE ni guardar nada. */
export async function POST(req: Request) {
  return conAdmin(async () => {
    const cfg = await leerConfig()
    const d = normalizar((await req.json()).datos)
    const esPresupuesto = d.tipo === 0
    const letra = tipoCbte(d.tipo)?.letra
    const discrimina = esPresupuesto ? cfg.condicionIva === "responsable_inscripto" : !!letra && discriminaIva(letra)
    const doc: Documento = {
      ...d,
      validezDias: esPresupuesto ? (d.validezDias ?? cfg.validezPresupuesto) : undefined,
      id: "vista-previa",
      clase: esPresupuesto ? "presupuesto" : "factura",
      estado: esPresupuesto ? "vigente" : "pendiente",
      creado: new Date().toISOString(),
      // Marca de agua "sin validez fiscal" en la vista previa de facturas
      entorno: "homologacion",
      puntoVenta: cfg.puntoVenta,
      numero: 0,
      totales: calcularTotales(d.items, discrimina, d.preciosConIva),
    }
    const pdf = await generarPdf(doc, cfg, [esPresupuesto ? "ORIGINAL" : "VISTA PREVIA"])
    return new NextResponse(new Uint8Array(pdf), { headers: { "Content-Type": "application/pdf", "Cache-Control": "no-store" } })
  })
}
