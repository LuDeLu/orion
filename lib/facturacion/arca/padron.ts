// Padrón: constancia de inscripción (ws_sr_constancia_inscripcion, ex padrón A5).
// Devuelve razón social, domicilio fiscal y la situación frente al IVA de un CUIT.
import { escaparXml, ErrorArca, lista, postSoap } from "./soap"
import type { Credenciales } from "./wsfe"
import type { Entorno } from "./wsaa"

export const SERVICIO_PADRON = "ws_sr_constancia_inscripcion"

const URL_PADRON: Record<Entorno, string> = {
  homologacion: "https://awshomo.afip.gov.ar/sr-padron/webservices/personaServiceA5",
  produccion: "https://aws.afip.gov.ar/sr-padron/webservices/personaServiceA5",
}

export interface Persona {
  cuit: string
  nombre: string
  tipoPersona: "FISICA" | "JURIDICA" | string
  domicilio: string
  localidad: string
  provincia: string
  codigoPostal: string
  /** Condición frente al IVA con el id de FEParamGetCondicionIvaReceptor */
  condicionIva: number
  condicionIvaNombre: string
  categoriaMonotributo: string | null
  actividad: string | null
  estado: string
}

const titulo = (s: string) =>
  s.toLowerCase().replace(/(^|[\s.,(/-])([a-záéíóúñü])/g, (_, a, b) => a + b.toUpperCase())

export async function consultarPersona(cred: Credenciales, cuit: string): Promise<Persona> {
  const env = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:a5="http://a5.soap.ws.server.puc.sr/"><soapenv:Header/><soapenv:Body><a5:getPersona_v2><token>${cred.token}</token><sign>${cred.sign}</sign><cuitRepresentada>${cred.cuit}</cuitRepresentada><idPersona>${escaparXml(cuit)}</idPersona></a5:getPersona_v2></soapenv:Body></soapenv:Envelope>`
  let cuerpo
  try {
    cuerpo = await postSoap(URL_PADRON[cred.entorno], "", env)
  } catch (e) {
    if (/no existe persona/i.test((e as Error).message)) throw new ErrorArca(`El CUIT ${cuit} no figura en el padrón de ARCA.`, "NO_EXISTE")
    throw e
  }
  const p = cuerpo.getPersona_v2Response?.personaReturn
  if (!p) throw new ErrorArca("ARCA no devolvió datos para ese CUIT")

  const g = p.datosGenerales ?? {}
  // Cuando la constancia tiene problemas (ej. domicilio no declarado) ARCA manda
  // errorConstancia con los datos mínimos en vez de datosGenerales.
  const ec = p.errorConstancia
  if (!p.datosGenerales && !ec) throw new ErrorArca("ARCA no devolvió datos para ese CUIT")

  const nombre = g.razonSocial
    ? String(g.razonSocial)
    : [g.apellido ?? ec?.apellido, g.nombre ?? ec?.nombre].filter(Boolean).join(" ") || String(ec?.razonSocial ?? "")
  const dom = g.domicilioFiscal ?? {}

  const impuestosRG = lista(p.datosRegimenGeneral?.impuesto).map((i: any) => Number(i.idImpuesto))
  const impuestosMono = lista(p.datosMonotributo?.impuesto).map((i: any) => Number(i.idImpuesto))
  const categoria = p.datosMonotributo?.categoriaMonotributo?.descripcionCategoria ?? null
  const actividad =
    lista(p.datosRegimenGeneral?.actividad ?? p.datosMonotributo?.actividadMonotributista)
      .map((a: any) => a.descripcionActividad)
      .filter(Boolean)[0] ?? null

  // 20 = monotributo, 30 = IVA, 32 = IVA exento, 33 = IVA responsable no inscripto
  let condicionIva = 5
  if (impuestosMono.includes(20) || categoria) condicionIva = 6
  else if (impuestosRG.includes(30)) condicionIva = 1
  else if (impuestosRG.includes(32)) condicionIva = 4

  const nombres: Record<number, string> = {
    1: "IVA Responsable Inscripto",
    4: "IVA Sujeto Exento",
    5: "Consumidor Final",
    6: "Responsable Monotributo",
  }

  return {
    cuit,
    nombre: titulo(nombre.trim()),
    tipoPersona: String(g.tipoPersona ?? ""),
    domicilio: dom.direccion ? titulo(String(dom.direccion)) : "",
    localidad: dom.localidad ? titulo(String(dom.localidad)) : "",
    provincia: dom.descripcionProvincia ? titulo(String(dom.descripcionProvincia)) : "",
    codigoPostal: dom.codPostal ? String(dom.codPostal) : "",
    condicionIva,
    condicionIvaNombre: nombres[condicionIva],
    categoriaMonotributo: categoria ? String(categoria) : null,
    actividad: actividad ? String(actividad) : null,
    estado: String(g.estadoClave ?? ec?.estadoClave ?? ""),
  }
}

export const domicilioCompleto = (p: Pick<Persona, "domicilio" | "localidad" | "provincia" | "codigoPostal">) =>
  [p.domicilio, p.localidad, p.codigoPostal ? `CP ${p.codigoPostal}` : "", p.provincia].filter(Boolean).join(", ")
