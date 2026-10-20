/**
 * Analítica propia del sitio, sin cookies y sin guardar IPs.
 *
 * - Visitante único: hash diario de (IP + navegador + sal del día). La sal cambia
 *   cada día, así que no se puede seguir a nadie entre días (mismo criterio que Plausible).
 * - Todo se guarda como contadores por día en Redis: páginas, fuentes, países,
 *   dispositivos, horas, eventos. Las claves expiran a los 400 días.
 * - Las dimensiones de "visita" (fuente, país, dispositivo…) se cuentan una vez
 *   por sesión, en la página de entrada; las páginas vistas se cuentan todas.
 */
import crypto from "node:crypto"
import { kvContadores, kvPipeline, type Comando } from "@/lib/kv"
import { parseUA } from "@/lib/ua-parser"

const TTL = 400 * 86400
const VIVO_MS = 5 * 60_000

export const DIMENSIONES = ["pag", "ent", "ref", "fuente", "camp", "pais", "ciudad", "disp", "nav", "so", "hora", "ev", "idioma"] as const
export type Dimension = (typeof DIMENSIONES)[number]

const k = (fecha: string, dim: string) => `an:${fecha}:${dim}`

/** Fecha y hora de Argentina (UTC-3, sin horario de verano). */
export function fechaHoraAr(d = new Date()) {
  const ar = new Date(d.getTime() - 3 * 3600_000).toISOString()
  return { fecha: ar.slice(0, 10), hora: ar.slice(11, 13) }
}

const BOTS =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python|axios|node-fetch|go-http|java\/|vercel|monitor|uptime|pingdom|gtmetrix/i

export function esBot(ua: string | null) {
  return !ua || BOTS.test(ua) || parseUA(ua).device === "bot"
}

function visitante(ip: string, ua: string, fecha: string) {
  const sal = crypto.createHash("sha256").update(`${process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASS ?? "orion"}:${fecha}`).digest("hex")
  return crypto.createHash("sha256").update(`${sal}|${ip}|${ua}`).digest("hex").slice(0, 16)
}

const dominio = (url?: string) => {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, "").toLowerCase() : ""
  } catch {
    return ""
  }
}

const BUSCADORES = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|yandex|baidu|brave|search)\./
const REDES =
  /(^|\.)(instagram|facebook|fb|messenger|t\.co|twitter|x\.com|linkedin|lnkd|tiktok|youtube|youtu\.be|whatsapp|wa\.me|pinterest|threads|reddit|telegram)/

/** Canal de adquisición de la visita. */
export function canal(refDominio: string, utm: { source?: string; medium?: string }, qr: boolean) {
  const medio = (utm.medium ?? "").toLowerCase()
  if (qr || utm.source?.toLowerCase() === "qr") return "QR"
  if (/cpc|ppc|paid|ads|cpm/.test(medio)) return "Publicidad"
  if (/email|newsletter|mail/.test(medio)) return "Email"
  if (utm.source) return "Campañas"
  if (!refDominio) return "Directo"
  if (BUSCADORES.test(refDominio)) return "Buscadores"
  if (REDES.test(refDominio)) return "Redes sociales"
  return "Otros sitios"
}

export interface Hit {
  tipo: "vista" | "salida" | "evento"
  ruta: string
  entrada?: boolean
  ref?: string
  utm?: { source?: string; medium?: string; campaign?: string }
  qr?: boolean
  idioma?: string
  segundos?: number
  evento?: string
}

const limpio = (s: unknown, max = 120) => String(s ?? "").replace(/[\r\n\t]/g, " ").trim().slice(0, max)

/** Registra un hit del navegador. Devuelve false si se descartó (bot, admin, basura). */
export async function registrar(hit: Hit, h: Headers, host: string): Promise<boolean> {
  const ua = h.get("user-agent")
  if (esBot(ua)) return false
  const ruta = limpio(hit.ruta, 160).split("?")[0] || "/"
  if (ruta.startsWith("/admin") || ruta.startsWith("/api")) return false

  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "0"
  const ahora = new Date()
  const { fecha, hora } = fechaHoraAr(ahora)
  const v = visitante(ip, ua!, fecha)
  const tocadas = new Set<string>()
  const cmds: Comando[] = []
  const inc = (dim: string, campo: string, n = 1) => {
    if (!campo) return
    cmds.push(["HINCRBY", k(fecha, dim), limpio(campo), n])
    tocadas.add(k(fecha, dim))
  }

  if (hit.tipo === "salida") {
    const s = Math.round(Number(hit.segundos))
    if (!(s > 0)) return false
    inc("tot", "seg", Math.min(s, 1800))
    inc("tot", "nseg")
  } else if (hit.tipo === "evento") {
    inc("ev", limpio(hit.evento, 40))
  } else {
    inc("tot", "pv")
    inc("pag", ruta)
    inc("hora", hora)
    cmds.push(["PFADD", k(fecha, "uv"), v])
    tocadas.add(k(fecha, "uv"))
    if (ruta === "/gracias") inc("ev", "formulario")

    if (hit.entrada) {
      const ref = dominio(hit.ref)
      const propio = ref && (ref === host.replace(/^www\./, "") || ref.endsWith("orionmkt.com.ar"))
      const refFinal = propio ? "" : ref
      const utm = { source: limpio(hit.utm?.source, 60), medium: limpio(hit.utm?.medium, 60), campaign: limpio(hit.utm?.campaign, 80) }
      const p = parseUA(ua)
      const pais = h.get("x-vercel-ip-country") ?? ""
      const ciudad = h.get("x-vercel-ip-city") ? decodeURIComponent(h.get("x-vercel-ip-city")!) : ""

      inc("tot", "ses")
      inc("ent", ruta)
      inc("ref", refFinal || "Directo")
      inc("fuente", canal(refFinal, utm, !!hit.qr))
      if (utm.source) inc("camp", [utm.source, utm.medium, utm.campaign].filter(Boolean).join(" / "))
      inc("pais", pais || "??")
      if (ciudad) inc("ciudad", `${ciudad}|${pais}`)
      inc("disp", p.device)
      inc("nav", p.browser)
      inc("so", p.os.replace(/\s[\d./]+$/, ""))
      inc("idioma", limpio(hit.idioma, 5).slice(0, 2).toLowerCase() || "??")
    }
  }

  // En vivo: últimos 5 minutos
  if (hit.tipo !== "salida") {
    cmds.push(["ZADD", "an:vivo", ahora.getTime(), v], ["HSET", "an:vivo:pag", v, ruta], ["ZREMRANGEBYSCORE", "an:vivo", "-inf", ahora.getTime() - VIVO_MS])
  }
  if (hit.entrada) for (const clave of tocadas) cmds.push(["EXPIRE", clave, TTL])

  await kvPipeline(cmds)
  return true
}

/** Eventos que se registran desde el servidor (ej. escaneo del QR). */
export async function registrarEvento(nombre: string, h?: Headers) {
  if (h && esBot(h.get("user-agent"))) return
  const { fecha } = fechaHoraAr()
  await kvPipeline([
    ["HINCRBY", k(fecha, "ev"), nombre, 1],
    ["EXPIRE", k(fecha, "ev"), TTL],
  ])
}

// ── Lectura ──────────────────────────────────────────────────────────────────

export function diasDelRango(desde: string, hasta: string): string[] {
  const dias: string[] = []
  for (let d = new Date(`${desde}T12:00:00Z`); d.toISOString().slice(0, 10) <= hasta; d = new Date(d.getTime() + 864e5))
    dias.push(d.toISOString().slice(0, 10))
  return dias
}

const sumar = (a: Record<string, number>, b: Record<string, number>) => {
  for (const [c, n] of Object.entries(b)) a[c] = (a[c] ?? 0) + n
  return a
}

export interface Estadisticas {
  dias: { fecha: string; visitantes: number; vistas: number; visitas: number }[]
  totales: { visitantes: number; vistas: number; visitas: number; segundos: number; nSegundos: number }
  dims: Record<Dimension, Record<string, number>>
}

export async function leerEstadisticas(desde: string, hasta: string): Promise<Estadisticas> {
  const dias = diasDelRango(desde, hasta)
  const cmdsUv: Comando[] = [...dias.map((d) => ["PFCOUNT", k(d, "uv")] as Comando), ["PFCOUNT", ...dias.map((d) => k(d, "uv"))]]
  const [uvs, tots, ...porDim] = await Promise.all([
    kvPipeline(cmdsUv) as Promise<number[]>,
    kvContadores(dias.map((d) => k(d, "tot"))),
    ...DIMENSIONES.map((dim) => kvContadores(dias.map((d) => k(d, dim)))),
  ])

  const dims = {} as Estadisticas["dims"]
  DIMENSIONES.forEach((dim, i) => (dims[dim] = porDim[i].reduce(sumar, {})))
  const tot = tots.reduce(sumar, {})
  return {
    dias: dias.map((fecha, i) => ({ fecha, visitantes: Number(uvs[i]) || 0, vistas: tots[i].pv ?? 0, visitas: tots[i].ses ?? 0 })),
    totales: {
      visitantes: Number(uvs[dias.length]) || 0,
      vistas: tot.pv ?? 0,
      visitas: tot.ses ?? 0,
      segundos: tot.seg ?? 0,
      nSegundos: tot.nseg ?? 0,
    },
    dims,
  }
}

/** Totales livianos (para comparar contra el período anterior). */
export async function leerTotales(desde: string, hasta: string) {
  const dias = diasDelRango(desde, hasta)
  const [[uv], tots, evs] = await Promise.all([
    kvPipeline([["PFCOUNT", ...dias.map((d) => k(d, "uv"))]]) as Promise<number[]>,
    kvContadores(dias.map((d) => k(d, "tot"))),
    kvContadores(dias.map((d) => k(d, "ev"))),
  ])
  const t = tots.reduce(sumar, {})
  const ev = evs.reduce(sumar, {})
  return {
    visitantes: Number(uv) || 0,
    vistas: t.pv ?? 0,
    visitas: t.ses ?? 0,
    segundos: t.seg ?? 0,
    nSegundos: t.nseg ?? 0,
    conversiones: Object.values(ev).reduce((s, n) => s + n, 0),
  }
}

export async function enVivo(): Promise<{ total: number; paginas: Record<string, number> }> {
  const ahora = Date.now()
  const [, miembros, mapa] = (await kvPipeline([
    ["ZREMRANGEBYSCORE", "an:vivo", "-inf", ahora - VIVO_MS],
    ["ZRANGE", "an:vivo", 0, -1],
    ["HGETALL", "an:vivo:pag"],
  ])) as [unknown, string[], string[]]
  const pag: Record<string, string> = {}
  for (let i = 0; mapa && i < mapa.length; i += 2) pag[mapa[i]] = mapa[i + 1]
  const paginas: Record<string, number> = {}
  for (const m of miembros ?? []) paginas[pag[m] ?? "/"] = (paginas[pag[m] ?? "/"] ?? 0) + 1
  // Limpieza ocasional del hash de páginas en vivo
  const vivos = new Set(miembros ?? [])
  const viejos = Object.keys(pag).filter((v) => !vivos.has(v))
  if (viejos.length > 50) await kvPipeline([["HDEL", "an:vivo:pag", ...viejos]])
  return { total: miembros?.length ?? 0, paginas }
}
