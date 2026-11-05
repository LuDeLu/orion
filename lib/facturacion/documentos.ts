// Persistencia de comprobantes, presupuestos y agenda de clientes.
import { kvGet, kvMget, kvSet, kvZadd, kvZrem, kvZrevrange, kvDel } from "@/lib/kv"
import type { Documento, Receptor } from "./modelo"

const INDICE = "fac:docs"
const kDoc = (id: string) => `fac:doc:${id}`

export async function guardarDocumento(doc: Documento) {
  await kvSet(kDoc(doc.id), doc)
  await kvZadd(INDICE, new Date(doc.creado).getTime(), doc.id)
}

export async function borrarDocumento(id: string) {
  await kvDel(kDoc(id))
  await kvZrem(INDICE, id)
}

export const leerDocumento = (id: string) => kvGet<Documento>(kDoc(id))

export async function listarDocumentos(limite = 1000): Promise<Documento[]> {
  const ids = await kvZrevrange(INDICE, 0, limite - 1)
  const docs = await kvMget<Documento>(ids.map(kDoc))
  return docs.filter((d): d is Documento => !!d)
}

// ── Clientes ─────────────────────────────────────────────────────────────────
// Una sola clave con todo el directorio: para el volumen de una agencia sobra.

const CLIENTES = "fac:clientes"

export interface Cliente extends Receptor {
  /** Nombre de fantasía o como lo conocemos (ej. monotributista con marca). Solo para el panel. */
  alias?: string
  notas?: string
  actualizado: string
}

/** Lo que va a un comprobante: los datos fiscales, sin alias ni notas. */
export const soloReceptor = ({ docTipo, docNro, nombre, condicionIva, domicilio, email }: Receptor): Receptor => ({
  docTipo,
  docNro,
  nombre,
  condicionIva,
  domicilio,
  email,
})

export const claveCliente = (r: Pick<Receptor, "docTipo" | "docNro">) => `${r.docTipo}-${r.docNro.replace(/\D/g, "")}`

const leerMapa = async () => (await kvGet<Record<string, Cliente>>(CLIENTES)) ?? {}

export async function listarClientes(): Promise<Cliente[]> {
  return Object.values(await leerMapa()).sort((a, b) => b.actualizado.localeCompare(a.actualizado))
}

/** Al emitir: actualiza los datos fiscales y conserva alias y notas que ya tuviera. */
export async function guardarCliente(r: Receptor) {
  if (!r.docNro || r.docTipo === 99 || !r.nombre) return
  const mapa = await leerMapa()
  const k = claveCliente(r)
  mapa[k] = { ...mapa[k], ...soloReceptor(r), docNro: r.docNro.replace(/\D/g, ""), actualizado: new Date().toISOString() }
  await kvSet(CLIENTES, mapa)
}

/** Alta o edición desde la agenda. `claveAnterior` permite corregir el documento. */
export async function guardarFichaCliente(c: Omit<Cliente, "actualizado">, claveAnterior?: string): Promise<Cliente> {
  const mapa = await leerMapa()
  const ficha: Cliente = {
    ...soloReceptor(c),
    docNro: c.docNro.replace(/\D/g, ""),
    alias: c.alias?.trim() || undefined,
    notas: c.notas?.trim() || undefined,
    actualizado: new Date().toISOString(),
  }
  const k = claveCliente(ficha)
  if (claveAnterior && claveAnterior !== k) delete mapa[claveAnterior]
  mapa[k] = ficha
  await kvSet(CLIENTES, mapa)
  return ficha
}

export async function borrarCliente(clave: string) {
  const mapa = await leerMapa()
  delete mapa[clave]
  await kvSet(CLIENTES, mapa)
}

export async function buscarCliente(docNro: string): Promise<Cliente | null> {
  const d = docNro.replace(/\D/g, "")
  return Object.values(await leerMapa()).find((c) => c.docNro.replace(/\D/g, "") === d) ?? null
}

export async function leerClientePorClave(clave: string): Promise<Cliente | null> {
  return (await leerMapa())[clave] ?? null
}
