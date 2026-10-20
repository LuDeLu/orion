/**
 * Orquesta certificado, clave privada y tickets de acceso de ARCA.
 *
 * - El certificado y la clave pueden venir de variables de entorno
 *   (ARCA_CERT / ARCA_KEY, en PEM o en base64) o cargarse desde el panel.
 *   Desde el panel, la clave se guarda cifrada (AES-256-GCM) en el KV.
 * - El ticket de acceso (TA) dura 12 h y ARCA no entrega otro mientras esté
 *   vigente, así que se comparte entre todas las instancias vía KV.
 */
import crypto from "node:crypto"
import { promises as fs } from "node:fs"
import path from "node:path"
import forge from "node-forge"
import { getSessionSecret } from "@/lib/auth"
import { kvDel, kvGet, kvSet } from "@/lib/kv"
import { leerConfig, type ConfigFacturacion } from "../config"
import { ErrorArca } from "./soap"
import { loginCms, type Entorno, type TicketAcceso } from "./wsaa"
import type { Credenciales } from "./wsfe"

export { ErrorArca } from "./soap"
export type { Entorno } from "./wsaa"

// ── Cifrado de la clave privada ──────────────────────────────────────────────

function claveCifrado() {
  return crypto.createHash("sha256").update(process.env.ARCA_SECRET || getSessionSecret()).digest()
}

function cifrar(texto: string): string {
  const iv = crypto.randomBytes(12)
  const c = crypto.createCipheriv("aes-256-gcm", claveCifrado(), iv)
  const datos = Buffer.concat([c.update(texto, "utf8"), c.final()])
  return Buffer.concat([iv, c.getAuthTag(), datos]).toString("base64")
}

function descifrar(b64: string): string | null {
  try {
    const buf = Buffer.from(b64, "base64")
    const d = crypto.createDecipheriv("aes-256-gcm", claveCifrado(), buf.subarray(0, 12))
    d.setAuthTag(buf.subarray(12, 28))
    return Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString("utf8")
  } catch {
    return null
  }
}

// ── Certificado y clave ──────────────────────────────────────────────────────

const k = (entorno: Entorno, nombre: string) => `fac:arca:${entorno}:${nombre}`

/** Acepta PEM directo, PEM con "\n" escapados (típico de un .env) o base64 del PEM. */
function pemDeEnv(v: string | undefined): string | null {
  if (!v) return null
  const t = v.trim().replace(/\\n/g, "\n")
  if (t.includes("-----BEGIN")) return t
  try {
    const d = Buffer.from(t, "base64").toString("utf8")
    return d.includes("-----BEGIN") ? d : null
  } catch {
    return null
  }
}

/** Carpeta con el par .crt + .key de cada entorno. Está en .gitignore: el repo es público. */
export const CARPETA_ARCA = path.join(process.cwd(), "arca")

async function leerArchivo(nombre: string) {
  try {
    return await fs.readFile(path.join(CARPETA_ARCA, nombre), "utf8")
  } catch {
    return null
  }
}

export type OrigenCertificado = "env" | "archivos" | "panel" | null

/**
 * Prioridad: variables de entorno → archivos arca/<entorno>.crt + .key → panel.
 * Certificado y clave van siempre de a par: uno sin el otro no se usa.
 */
async function material(entorno: Entorno): Promise<{ cert: string | null; clave: string | null; origen: OrigenCertificado }> {
  const envCert = pemDeEnv(process.env.ARCA_CERT)
  const envClave = pemDeEnv(process.env.ARCA_KEY)
  if (envCert && envClave) return { cert: envCert, clave: envClave, origen: "env" }
  const [archCert, archClave] = await Promise.all([leerArchivo(`${entorno}.crt`), leerArchivo(`${entorno}.key`)])
  if (archCert && archClave) return { cert: limpiarPem(archCert), clave: limpiarPem(archClave), origen: "archivos" }
  const cert = await kvGet<string>(k(entorno, "cert"))
  const cif = await kvGet<string>(k(entorno, "clave"))
  return { cert, clave: cif ? descifrar(cif) : null, origen: cert || cif ? "panel" : null }
}

/** Normaliza un PEM: saltos de línea de Windows y espacios de más. */
export function limpiarPem(texto: string) {
  return `${String(texto ?? "")
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n")}\n`
}

const modulo = (pem: string, tipo: "cert" | "clave") =>
  tipo === "cert"
    ? (forge.pki.certificateFromPem(pem).publicKey as forge.pki.rsa.PublicKey).n.toString(16)
    : (forge.pki.privateKeyFromPem(pem) as forge.pki.rsa.PrivateKey).n.toString(16)

/**
 * Genera una clave RSA 2048 y el pedido de certificado (CSR) para subir a ARCA.
 * La clave queda como "pendiente" hasta que se cargue el .crt que le corresponde,
 * así no rompe un certificado que ya esté funcionando. También se devuelve, para
 * que quede guardada como archivo .key junto al .crt (respaldo).
 */
export async function generarCsr(cfg: ConfigFacturacion, alias = "orionfacturacion"): Promise<{ csr: string; clave: string }> {
  if (cfg.cuit.length !== 11) throw new ErrorArca("El CUIT del emisor no es válido")
  const { privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
    publicKeyEncoding: { type: "spki", format: "pem" },
  })
  const clave = forge.pki.privateKeyFromPem(privateKey) as forge.pki.rsa.PrivateKey
  const csr = forge.pki.createCertificationRequest()
  csr.publicKey = forge.pki.setRsaPublicKey(clave.n, clave.e)
  csr.setSubject([
    { name: "countryName", value: "AR" },
    { name: "organizationName", value: (cfg.razonSocial || cfg.nombreFantasia || "Orion").slice(0, 60) },
    { name: "commonName", value: alias.replace(/[^a-z0-9]/gi, "").slice(0, 30) || "orionfacturacion" },
    { type: "2.5.4.5", value: `CUIT ${cfg.cuit}` }, // serialNumber
  ])
  csr.sign(clave, forge.md.sha256.create())
  await kvSet(k(cfg.entorno, "clave-nueva"), cifrar(privateKey))
  return { csr: forge.pki.certificationRequestToPem(csr), clave: privateKey }
}

/**
 * Carga el par .crt + .key. Si no viene la .key, usa la que se generó desde el
 * panel con "Generar pedido". Solo se acepta si certificado y clave son pareja,
 * del CUIT del emisor y del entorno correcto (prueba / producción).
 */
export async function cargarCertificado(cfg: ConfigFacturacion, crt: string, key?: string) {
  const pem = limpiarPem(crt)
  let cert: forge.pki.Certificate
  try {
    cert = forge.pki.certificateFromPem(pem)
  } catch {
    throw new ErrorArca("El .crt no se puede leer. Tiene que ser el certificado que descargaste de ARCA (empieza con -----BEGIN CERTIFICATE-----).")
  }
  const serial = String(cert.subject.getField({ type: "2.5.4.5" })?.value ?? "").replace(/\D/g, "")
  if (serial && serial !== cfg.cuit) throw new ErrorArca(`El certificado es del CUIT ${serial} y el emisor está configurado con ${cfg.cuit}.`)
  if (cert.validity.notAfter.getTime() < Date.now()) throw new ErrorArca("Ese certificado ya está vencido.")
  // El de homologación lo firma «Computadores Test»
  const dePrueba = /test/i.test(String(cert.issuer.getField("CN")?.value ?? ""))
  if (dePrueba !== (cfg.entorno === "homologacion"))
    throw new ErrorArca(
      dePrueba
        ? "Es un certificado de PRUEBA (lo emite «Computadores Test»). Pasá el entorno a Homologación para cargarlo."
        : "Es un certificado de PRODUCCIÓN. Pasá el entorno a Producción para cargarlo.",
    )

  const mod = modulo(pem, "cert")
  let clave: string | undefined
  if (key?.trim()) {
    const pemKey = limpiarPem(key)
    if (/ENCRYPTED/.test(pemKey)) throw new ErrorArca("La .key tiene contraseña. Exportala sin contraseña (openssl rsa -in clave.key -out clave-sin-pass.key).")
    try {
      if (modulo(pemKey, "clave") !== mod) throw new ErrorArca("La .key no corresponde a este .crt: son de pedidos distintos.")
    } catch (e) {
      if (e instanceof ErrorArca) throw e
      throw new ErrorArca("La .key no se puede leer. Tiene que ser la clave privada en texto (empieza con -----BEGIN … PRIVATE KEY-----).")
    }
    clave = pemKey
  } else {
    for (const nombre of ["clave-nueva", "clave"]) {
      const c = await kvGet<string>(k(cfg.entorno, nombre))
      const pemClave = c ? descifrar(c) : null
      if (pemClave && modulo(pemClave, "clave") === mod) clave = pemClave
    }
    if (!clave)
      throw new ErrorArca("Falta la .key de este certificado. Subí también el archivo .key (o generá el pedido desde este panel).")
  }
  await kvSet(k(cfg.entorno, "clave"), cifrar(clave))
  await kvSet(k(cfg.entorno, "cert"), pem)
  await kvDel(k(cfg.entorno, "clave-nueva"))
}

/** El .crt vigente, para descargarlo como respaldo (es público, no es secreto). */
export async function certificadoActual(entorno: Entorno) {
  return (await material(entorno)).cert
}

export async function borrarCertificado(entorno: Entorno) {
  await Promise.all(["cert", "clave", "clave-nueva"].map((n) => kvDel(k(entorno, n))))
}

// ── Ticket de acceso ─────────────────────────────────────────────────────────

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function credenciales(servicio: string, cfgDada?: ConfigFacturacion): Promise<Credenciales> {
  const cfg = cfgDada ?? (await leerConfig())
  const { cert, clave } = await material(cfg.entorno)
  if (!cert || !clave) throw new ErrorArca("Falta configurar el certificado de ARCA (Facturación → Configuración).", "SIN_CERT")
  const huella = crypto.createHash("sha1").update(cert).digest("hex").slice(0, 12)
  const claveTa = `fac:ta:${cfg.entorno}:${servicio}:${huella}`
  const base = { cuit: cfg.cuit, entorno: cfg.entorno }

  const vigente = (t: TicketAcceso | null) => t && new Date(t.vence).getTime() - Date.now() > 5 * 60_000

  let ta = await kvGet<TicketAcceso>(claveTa)
  if (vigente(ta)) return { ...ta!, ...base }

  // Un solo login a la vez: si otra instancia lo está pidiendo, esperamos su resultado
  const candado = `${claveTa}:lock`
  if (!(await kvSet(candado, 1, { nx: true, ex: 30 }))) {
    for (let i = 0; i < 20; i++) {
      await esperar(500)
      ta = await kvGet<TicketAcceso>(claveTa)
      if (vigente(ta)) return { ...ta!, ...base }
    }
  }
  try {
    ta = await loginCms(cfg.entorno, servicio, cert, clave)
    const ttl = Math.max(60, Math.floor((new Date(ta.vence).getTime() - Date.now()) / 1000))
    await kvSet(claveTa, ta, { ex: ttl })
    return { ...ta, ...base }
  } finally {
    await kvDel(candado)
  }
}

// ── Estado para el panel ─────────────────────────────────────────────────────

export interface EstadoCertificado {
  origen: OrigenCertificado
  tieneCertificado: boolean
  tieneClave: boolean
  /** El .crt y la .key son pareja (null si falta alguno) */
  parOk: boolean | null
  clavePendiente: boolean
  certificado: { sujeto: string; emisor: string; desde: string; vence: string; diasRestantes: number; homologacion: boolean } | null
}

export async function estadoCertificado(entorno: Entorno): Promise<EstadoCertificado> {
  const m = await material(entorno)
  const pendiente = !!(await kvGet<string>(k(entorno, "clave-nueva")))
  let certificado: EstadoCertificado["certificado"] = null
  if (m.cert) {
    try {
      const c = forge.pki.certificateFromPem(m.cert)
      const emisor = String(c.issuer.getField("CN")?.value ?? "")
      certificado = {
        sujeto: String(c.subject.getField("CN")?.value ?? ""),
        emisor,
        desde: c.validity.notBefore.toISOString(),
        vence: c.validity.notAfter.toISOString(),
        diasRestantes: Math.floor((c.validity.notAfter.getTime() - Date.now()) / 864e5),
        homologacion: /test|homo/i.test(emisor),
      }
    } catch {
      certificado = null
    }
  }
  let parOk: boolean | null = null
  if (m.cert && m.clave) {
    try {
      parOk = modulo(m.cert, "cert") === modulo(m.clave, "clave")
    } catch {
      parOk = false
    }
  }
  return { origen: m.origen, tieneCertificado: !!certificado, tieneClave: !!m.clave, parOk, clavePendiente: pendiente, certificado }
}
