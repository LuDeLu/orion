import { NextResponse } from "next/server"
import { sesionValida } from "@/lib/admin-api"
import { leerConfig } from "@/lib/facturacion/config"
import { leerDocumento } from "@/lib/facturacion/documentos"
import { generarPdf, nombreArchivo } from "@/lib/facturacion/pdf"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** ?copias=1|2|3 (original, duplicado, triplicado) · ?descargar=1 fuerza la descarga. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await sesionValida())) return new NextResponse("Unauthorized", { status: 401 })
  const doc = await leerDocumento(decodeURIComponent((await params).id))
  if (!doc) return new NextResponse("No existe ese documento", { status: 404 })

  const url = new URL(req.url)
  const n = Math.min(Math.max(Number(url.searchParams.get("copias")) || 1, 1), 3)
  const copias = (["ORIGINAL", "DUPLICADO", "TRIPLICADO"] as const).slice(0, n)
  const pdf = await generarPdf(doc, await leerConfig(), [...copias])

  const archivo = nombreArchivo(doc)
  const disp = url.searchParams.get("descargar") ? "attachment" : "inline"
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disp}; filename="${archivo.replace(/[^\x20-\x7e]/g, "_")}"; filename*=UTF-8''${encodeURIComponent(archivo)}`,
      "Cache-Control": "private, no-store",
    },
  })
}
