import { conAdmin } from "@/lib/admin-api"
import { borrarCliente, guardarFichaCliente, listarClientes, type Cliente } from "@/lib/facturacion/documentos"
import { ErrorValidacion } from "@/lib/facturacion/emitir"
import { condicionIva, cuitValido, soloDigitos, TIPOS_DOC } from "@/lib/facturacion/modelo"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  return conAdmin(async () => ({ clientes: await listarClientes() }))
}

/** Alta o edición de una ficha. Body: { cliente, claveAnterior? } */
export async function POST(req: Request) {
  return conAdmin(async () => {
    const body = (await req.json()) as { cliente?: Partial<Cliente>; claveAnterior?: string }
    const c = body.cliente ?? {}
    const docTipo = Number(c.docTipo)
    const docNro = soloDigitos(String(c.docNro ?? ""))
    const nombre = String(c.nombre ?? "").trim()
    const cond = Number(c.condicionIva)

    const e: string[] = []
    if (!TIPOS_DOC.some((t) => t.id === docTipo) || docTipo === 99) e.push("Elegí el tipo de documento")
    if (!docNro) e.push("Falta el número de documento")
    else if ([80, 86].includes(docTipo) && !cuitValido(docNro)) e.push("El CUIT/CUIL no es válido (revisá el dígito verificador)")
    if (!nombre) e.push("Falta el nombre o razón social")
    if (!condicionIva(cond)) e.push("Elegí la condición frente al IVA")
    if (e.length) throw new ErrorValidacion(e)

    const cliente = await guardarFichaCliente(
      {
        docTipo,
        docNro,
        nombre,
        condicionIva: cond,
        domicilio: String(c.domicilio ?? "").trim(),
        email: String(c.email ?? "").trim(),
        alias: String(c.alias ?? ""),
        notas: String(c.notas ?? ""),
      },
      body.claveAnterior,
    )
    return { cliente }
  })
}

export async function DELETE(req: Request) {
  return conAdmin(async () => {
    const clave = new URL(req.url).searchParams.get("clave")
    if (!clave) throw new ErrorValidacion(["Falta el cliente a borrar"])
    await borrarCliente(clave)
    return { ok: true }
  })
}
