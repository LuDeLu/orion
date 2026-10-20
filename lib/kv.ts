/**
 * Almacenamiento clave-valor del panel (facturación, CRM y analítica).
 *
 * En producción usa Upstash Redis por REST (se agrega desde el Marketplace de
 * Vercel y deja KV_REST_API_URL / KV_REST_API_TOKEN). Sin esas variables cae a
 * un archivo JSON local en `.data/` que emula los comandos usados, pensado SOLO
 * para desarrollo: en Vercel el disco es efímero y cada instancia tendría el suyo.
 */
import { promises as fs } from "node:fs"
import path from "node:path"

const URL_REDIS = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const TOKEN_REDIS = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

export const usaRedis = Boolean(URL_REDIS && TOKEN_REDIS)

export type Comando = (string | number)[]

async function redisPipeline(cmds: Comando[]): Promise<unknown[]> {
  const res = await fetch(`${URL_REDIS!.replace(/\/+$/, "")}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN_REDIS}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmds),
    cache: "no-store",
  })
  const data = (await res.json()) as { result?: unknown; error?: string }[] | { error: string }
  if (!res.ok || !Array.isArray(data)) throw new Error(`Redis: ${(data as { error?: string }).error ?? res.status}`)
  const err = data.find((d) => d.error)
  if (err) throw new Error(`Redis: ${err.error}`)
  return data.map((d) => d.result)
}

// ── Fallback de desarrollo: emulación mínima de Redis en un JSON ─────────────

type Archivo = {
  kv: Record<string, { v: string; exp?: number }>
  z: Record<string, Record<string, number>>
  h?: Record<string, Record<string, string>>
  s?: Record<string, string[]>
  exp?: Record<string, number>
}
const RUTA = path.join(process.cwd(), ".data", "panel.json")
let cola: Promise<unknown> = Promise.resolve()

function emular(a: Archivo, cmd: Comando): unknown {
  const [op, clave, ...args] = cmd.map(String)
  const h = (a.h ??= {})
  const s = (a.s ??= {})
  switch (op.toUpperCase()) {
    case "GET":
      return a.kv[clave]?.v ?? null
    case "MGET":
      return [clave, ...args].map((k) => a.kv[k]?.v ?? null)
    case "SET": {
      const nx = args.includes("NX")
      const i = args.indexOf("EX")
      if (nx && a.kv[clave]) return null
      a.kv[clave] = { v: args[0], exp: i >= 0 ? Date.now() + Number(args[i + 1]) * 1000 : undefined }
      return "OK"
    }
    case "DEL":
      for (const k of [clave, ...args]) {
        delete a.kv[k]
        delete a.z[k]
        delete h[k]
        delete s[k]
      }
      return 1
    case "INCR": {
      const n = Number(a.kv[clave]?.v ?? 0) + 1
      a.kv[clave] = { v: String(n) }
      return n
    }
    case "EXPIRE":
      ;(a.exp ??= {})[clave] = Date.now() + Number(args[0]) * 1000
      return 1
    case "ZADD":
      ;(a.z[clave] ??= {})[args[1]] = Number(args[0])
      return 1
    case "ZREM":
      delete a.z[clave]?.[args[0]]
      return 1
    case "ZRANGE": {
      const orden = Object.entries(a.z[clave] ?? {}).sort((x, y) => (args.includes("REV") ? y[1] - x[1] : x[1] - y[1]))
      const hasta = Number(args[1])
      return orden.slice(Number(args[0]), hasta < 0 ? undefined : hasta + 1).map(([m]) => m)
    }
    case "ZCOUNT": {
      const min = args[0] === "-inf" ? -Infinity : Number(args[0])
      const max = args[1] === "+inf" ? Infinity : Number(args[1])
      return Object.values(a.z[clave] ?? {}).filter((v) => v >= min && v <= max).length
    }
    case "ZREMRANGEBYSCORE": {
      const min = args[0] === "-inf" ? -Infinity : Number(args[0])
      const max = Number(args[1])
      for (const [m, v] of Object.entries(a.z[clave] ?? {})) if (v >= min && v <= max) delete a.z[clave][m]
      return 1
    }
    case "HSET": {
      const obj = (h[clave] ??= {})
      for (let i = 0; i < args.length; i += 2) obj[args[i]] = args[i + 1]
      return 1
    }
    case "HGET":
      return h[clave]?.[args[0]] ?? null
    case "HGETALL":
      return Object.entries(h[clave] ?? {}).flat()
    case "HDEL":
      for (const f of args) delete h[clave]?.[f]
      return 1
    case "HINCRBY": {
      const obj = (h[clave] ??= {})
      obj[args[0]] = String(Number(obj[args[0]] ?? 0) + Number(args[1]))
      return Number(obj[args[0]])
    }
    case "PFADD": {
      const set = new Set(s[clave] ?? [])
      args.forEach((x) => set.add(x))
      s[clave] = [...set]
      return 1
    }
    case "PFCOUNT":
      return new Set([clave, ...args].flatMap((k) => s[k] ?? [])).size
    default:
      throw new Error(`Comando no emulado en modo local: ${op}`)
  }
}

async function archivoPipeline(cmds: Comando[]): Promise<unknown[]> {
  // Serializa los accesos para que dos requests no se pisen el archivo
  const paso = cola.then(async () => {
    let a: Archivo
    try {
      a = JSON.parse(await fs.readFile(RUTA, "utf8"))
    } catch {
      a = { kv: {}, z: {} }
    }
    const ahora = Date.now()
    for (const [k, e] of Object.entries(a.kv)) if (e.exp && e.exp < ahora) delete a.kv[k]
    for (const [k, e] of Object.entries(a.exp ?? {}))
      if (e < ahora) {
        emular(a, ["DEL", k])
        delete a.exp![k]
      }
    const r = cmds.map((c) => emular(a, c))
    await fs.mkdir(path.dirname(RUTA), { recursive: true })
    await fs.writeFile(RUTA, JSON.stringify(a))
    return r
  })
  cola = paso.catch(() => undefined)
  return paso
}

/** Ejecuta varios comandos en un solo viaje. */
export function kvPipeline(cmds: Comando[]): Promise<unknown[]> {
  if (!cmds.length) return Promise.resolve([])
  return usaRedis ? redisPipeline(cmds) : archivoPipeline(cmds)
}

const uno = async <T>(cmd: Comando) => (await kvPipeline([cmd]))[0] as T

// ── Valores JSON ─────────────────────────────────────────────────────────────

export async function kvGet<T>(clave: string): Promise<T | null> {
  const raw = await uno<string | null>(["GET", clave])
  return raw == null ? null : (JSON.parse(raw) as T)
}

export async function kvMget<T>(claves: string[]): Promise<(T | null)[]> {
  if (!claves.length) return []
  const raws = await uno<(string | null)[]>(["MGET", ...claves])
  return raws.map((r) => (r == null ? null : (JSON.parse(r) as T)))
}

/** Guarda un valor. Con `nx` solo escribe si no existe y devuelve si lo escribió. */
export async function kvSet(clave: string, valor: unknown, opc: { ex?: number; nx?: boolean } = {}): Promise<boolean> {
  const cmd: Comando = ["SET", clave, JSON.stringify(valor)]
  if (opc.ex) cmd.push("EX", opc.ex)
  if (opc.nx) cmd.push("NX")
  return (await uno<string | null>(cmd)) === "OK"
}

export async function kvDel(clave: string): Promise<void> {
  await uno(["DEL", clave])
}

export const kvIncr = (clave: string) => uno<number>(["INCR", clave])

// ── Sorted sets ──────────────────────────────────────────────────────────────

export async function kvZadd(clave: string, puntaje: number, miembro: string): Promise<void> {
  await uno(["ZADD", clave, puntaje, miembro])
}

export async function kvZrem(clave: string, miembro: string): Promise<void> {
  await uno(["ZREM", clave, miembro])
}

/** Miembros ordenados de mayor a menor puntaje (los más nuevos primero). */
export const kvZrevrange = (clave: string, desde: number, hasta: number) =>
  uno<string[]>(["ZRANGE", clave, desde, hasta, "REV"])

// ── Hashes con valores JSON (una entidad por campo) ──────────────────────────

export async function kvHgetAll<T>(clave: string): Promise<Record<string, T>> {
  const plano = (await uno<string[] | null>(["HGETALL", clave])) ?? []
  const r: Record<string, T> = {}
  for (let i = 0; i < plano.length; i += 2) r[plano[i]] = JSON.parse(plano[i + 1]) as T
  return r
}

export async function kvHget<T>(clave: string, campo: string): Promise<T | null> {
  const raw = await uno<string | null>(["HGET", clave, campo])
  return raw == null ? null : (JSON.parse(raw) as T)
}

export async function kvHset(clave: string, campo: string, valor: unknown): Promise<void> {
  await uno(["HSET", clave, campo, JSON.stringify(valor)])
}

export async function kvHdel(clave: string, campo: string): Promise<void> {
  await uno(["HDEL", clave, campo])
}

/** HGETALL "crudo" (contadores numéricos), para varias claves en un viaje. */
export async function kvContadores(claves: string[]): Promise<Record<string, number>[]> {
  const res = (await kvPipeline(claves.map((k) => ["HGETALL", k]))) as (string[] | null)[]
  return res.map((plano) => {
    const r: Record<string, number> = {}
    for (let i = 0; plano && i < plano.length; i += 2) r[plano[i]] = Number(plano[i + 1]) || 0
    return r
  })
}
