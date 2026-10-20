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
  actualizado: string
}

export async function listarClientes(): Promise<Cliente[]> {
  const mapa = (await kvGet<Record<string, Cliente>>(CLIENTES)) ?? {}
  return Object.values(mapa).sort((a, b) => b.actualizado.localeCompare(a.actualizado))
}

export async function guardarCliente(r: Receptor) {
  if (!r.docNro || r.docTipo === 99 || !r.nombre) return
  const mapa = (await kvGet<Record<string, Cliente>>(CLIENTES)) ?? {}
  mapa[`${r.docTipo}-${r.docNro}`] = { ...r, actualizado: new Date().toISOString() }
  await kvSet(CLIENTES, mapa)
}

export async function buscarCliente(docNro: string): Promise<Cliente | null> {
  const mapa = (await kvGet<Record<string, Cliente>>(CLIENTES)) ?? {}
  return Object.values(mapa).find((c) => c.docNro === docNro) ?? null
}
