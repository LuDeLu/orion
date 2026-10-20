import { conAdmin } from "@/lib/admin-api"
import { credenciales } from "@/lib/facturacion/arca"
import { consultarPersona, domicilioCompleto, SERVICIO_PADRON } from "@/lib/facturacion/arca/padron"
import { buscarCliente } from "@/lib/facturacion/documentos"
import { ErrorValidacion } from "@/lib/facturacion/emitir"
import { cuitValido, soloDigitos } from "@/lib/facturacion/modelo"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * Autocompleta un cliente: primero la agenda propia, después el padrón de ARCA.
 * Si ARCA no responde pero el cliente ya existe, devuelve la agenda con un aviso.
 */
export async function GET(req: Request) {
  return conAdmin(async () => {
    const doc = soloDigitos(new URL(req.url).searchParams.get("doc") ?? "")
    const guardado = await buscarCliente(doc)
    if (doc.length !== 11) {
      if (guardado) return { fuente: "agenda", cliente: guardado }
      throw new ErrorValidacion(["Sin datos guardados para ese documento"])
    }
    if (!cuitValido(doc)) throw new ErrorValidacion(["El CUIT no es válido (revisá el dígito verificador)"])
    try {
      const p = await consultarPersona(await credenciales(SERVICIO_PADRON), doc)
      return {
        fuente: "arca",
        cliente: {
          docTipo: 80,
          docNro: doc,
          nombre: p.nombre,
          condicionIva: p.condicionIva,
          domicilio: domicilioCompleto(p),
          email: guardado?.email ?? "",
        },
        persona: p,
      }
    } catch (e) {
      if (guardado) return { fuente: "agenda", cliente: guardado, aviso: (e as Error).message }
      throw e
    }
  })
}
