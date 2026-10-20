// WSAA: autenticación con el certificado digital. Devuelve token y sign válidos por 12 horas.
import forge from "node-forge"
import { ErrorArca, parsearXml, postSoap } from "./soap"

export type Entorno = "homologacion" | "produccion"

const URL_WSAA: Record<Entorno, string> = {
  homologacion: "https://wsaahomo.afip.gov.ar/ws/services/LoginCms",
  produccion: "https://wsaa.afip.gov.ar/ws/services/LoginCms",
}

export interface TicketAcceso {
  token: string
  sign: string
  vence: string
}

/** Ticket de requerimiento de acceso (TRA). Ventana de ±10 min para tolerar relojes desfasados. */
function crearTra(servicio: string, ahora = new Date()): string {
  const fmt = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, "Z")
  return `<?xml version="1.0" encoding="UTF-8"?><loginTicketRequest version="1.0"><header><uniqueId>${Math.floor(ahora.getTime() / 1000)}</uniqueId><generationTime>${fmt(new Date(ahora.getTime() - 10 * 60_000))}</generationTime><expirationTime>${fmt(new Date(ahora.getTime() + 10 * 60_000))}</expirationTime></header><service>${servicio}</service></loginTicketRequest>`
}

/** Firma el TRA en formato CMS (PKCS#7 SignedData con el contenido incluido), en base64. */
function firmarCms(contenido: string, certPem: string, clavePem: string): string {
  const cert = forge.pki.certificateFromPem(certPem)
  const key = forge.pki.privateKeyFromPem(clavePem)
  const p7 = forge.pkcs7.createSignedData()
  p7.content = forge.util.createBuffer(contenido, "utf8")
  p7.addCertificate(cert)
  p7.addSigner({
    key,
    certificate: cert,
    digestAlgorithm: forge.pki.oids.sha256,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
      { type: forge.pki.oids.messageDigest },
      { type: forge.pki.oids.signingTime, value: new Date() as unknown as string },
    ],
  })
  p7.sign()
  return forge.util.encode64(forge.asn1.toDer(p7.toAsn1()).getBytes())
}

export async function loginCms(entorno: Entorno, servicio: string, certPem: string, clavePem: string): Promise<TicketAcceso> {
  const cms = firmarCms(crearTra(servicio), certPem, clavePem)
  const envelope = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsaa="http://wsaa.view.sua.dvadac.desein.afip.gov"><soapenv:Header/><soapenv:Body><wsaa:loginCms><wsaa:in0>${cms}</wsaa:in0></wsaa:loginCms></soapenv:Body></soapenv:Envelope>`
  let cuerpo
  try {
    cuerpo = await postSoap(URL_WSAA[entorno], "", envelope)
  } catch (e) {
    const msg = (e as Error).message
    if (/ya posee un TA valido/i.test(msg))
      throw new ErrorArca(
        "ARCA ya entregó un acceso vigente para este certificado que no quedó guardado (por ejemplo, desde otro sistema). Hay que esperar a que venza, hasta 12 horas.",
        "TA_VIGENTE",
      )
    if (/no autorizado|not authorized|notAuthorized/i.test(msg))
      throw new ErrorArca(
        `El certificado no está autorizado para el servicio "${servicio}". Asocialo en ARCA → Administrador de Relaciones de Clave Fiscal.`,
        "NO_AUTORIZADO",
      )
    if (/untrusted|AC de confianza/i.test(msg))
      throw new ErrorArca(
        `ARCA no reconoce el certificado en ${entorno === "produccion" ? "producción" : "homologación"}. Revisá que sea del mismo entorno (los de WSASS solo sirven para homologación).`,
        "CERT_NO_CONFIABLE",
      )
    if (/generationTime|expirationTime/i.test(msg))
      throw new ErrorArca("La hora del servidor no coincide con la de ARCA. Revisá el reloj del servidor.", "RELOJ")
    if (/cert/i.test(msg) && /expir|venc/i.test(msg))
      throw new ErrorArca("El certificado de ARCA está vencido. Generá uno nuevo desde Configuración.", "CERT_VENCIDO")
    throw e
  }
  const ret = cuerpo.loginCmsResponse?.loginCmsReturn
  if (!ret) throw new ErrorArca("ARCA no devolvió el ticket de acceso")
  const tr = parsearXml(String(ret)).loginTicketResponse
  const token = tr?.credentials?.token
  const sign = tr?.credentials?.sign
  const vence = tr?.header?.expirationTime
  if (!token || !sign) throw new ErrorArca("El ticket de acceso de ARCA vino incompleto")
  return { token: String(token), sign: String(sign), vence: String(vence) }
}
