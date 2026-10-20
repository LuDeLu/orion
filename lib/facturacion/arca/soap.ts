// Cliente SOAP mínimo para los web services de ARCA (ex AFIP).
import https from "node:https"
import { XMLParser } from "fast-xml-parser"

// Producción de WSFEv1 ofrece DHE con claves chicas que OpenSSL 3 rechaza
// ("dh key too small"): se fuerzan suites ECDHE/RSA, que ARCA acepta en todos sus servidores.
const agente = new https.Agent({
  keepAlive: true,
  minVersion: "TLSv1.2",
  ciphers:
    "ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-GCM-SHA256",
})

const parser = new XMLParser({ ignoreAttributes: true, removeNSPrefix: true, parseTagValue: false, trimValues: true })

export class ErrorArca extends Error {
  constructor(mensaje: string, public codigo?: string) {
    super(mensaje)
    this.name = "ErrorArca"
  }
}

export function escaparXml(s: string | number): string {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

export async function postSoap(url: string, soapAction: string, envelope: string, timeoutMs = 25_000): Promise<Record<string, any>> {
  const body = Buffer.from(envelope, "utf8")
  const texto = await new Promise<string>((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: "POST",
        agent: agente,
        timeout: timeoutMs,
        headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: `"${soapAction}"`, "Content-Length": body.length },
      },
      (res) => {
        const partes: Buffer[] = []
        res.on("data", (c) => partes.push(c))
        res.on("end", () => resolve(Buffer.concat(partes).toString("utf8")))
      },
    )
    req.on("timeout", () => req.destroy(new ErrorArca("ARCA no respondió a tiempo. Probá de nuevo en unos minutos.", "TIMEOUT")))
    req.on("error", (e) => reject(e instanceof ErrorArca ? e : new ErrorArca(`No se pudo conectar con ARCA: ${e.message}`, "RED")))
    req.end(body)
  })
  let xml: Record<string, any>
  try {
    xml = parser.parse(texto)
  } catch {
    throw new ErrorArca(`Respuesta inválida de ARCA: ${texto.slice(0, 200)}`)
  }
  const cuerpo = xml?.Envelope?.Body
  if (!cuerpo) throw new ErrorArca(`Respuesta inesperada de ARCA: ${texto.slice(0, 200)}`)
  if (cuerpo.Fault) {
    const f = cuerpo.Fault
    throw new ErrorArca(String(f.faultstring ?? "Error de ARCA"), String(f.faultcode ?? ""))
  }
  return cuerpo
}

/** Normaliza a array un nodo que puede venir como objeto único o lista. */
export const lista = <T>(v: T | T[] | undefined | null): T[] => (v == null ? [] : Array.isArray(v) ? v : [v])

export const parsearXml = (s: string) => parser.parse(s)
