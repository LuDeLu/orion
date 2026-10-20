// WSFEv1: factura electrónica con CAE. Manual del Desarrollador RG 4291, v4.8.
import { escaparXml, ErrorArca, lista, postSoap } from "./soap"
import type { Entorno, TicketAcceso } from "./wsaa"

const URL_WSFE: Record<Entorno, string> = {
  homologacion: "https://wswhomo.afip.gov.ar/wsfev1/service.asmx",
  produccion: "https://servicios1.afip.gov.ar/wsfev1/service.asmx",
}
const NS = "http://ar.gov.afip.dif.FEV1/"

export interface Credenciales extends TicketAcceso {
  cuit: string
  entorno: Entorno
}

function envelope(metodo: string, cred: Credenciales | null, cuerpo: string) {
  const auth = cred
    ? `<ar:Auth><ar:Token>${cred.token}</ar:Token><ar:Sign>${cred.sign}</ar:Sign><ar:Cuit>${cred.cuit}</ar:Cuit></ar:Auth>`
    : ""
  return `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="${NS}"><soap:Body><ar:${metodo}>${auth}${cuerpo}</ar:${metodo}></soap:Body></soap:Envelope>`
}

async function llamar(entorno: Entorno, metodo: string, cred: Credenciales | null, cuerpo = "") {
  const r = await postSoap(URL_WSFE[entorno], NS + metodo, envelope(metodo, cred, cuerpo))
  const res = r[`${metodo}Response`]?.[`${metodo}Result`]
  if (!res) throw new ErrorArca(`ARCA no respondió ${metodo}`)
  return res
}

const errores = (res: any) => lista(res?.Errors?.Err).map((e: any) => `${e.Code}: ${e.Msg}`)

function exigirSinErrores(res: any) {
  const errs = errores(res)
  if (errs.length) throw new ErrorArca(`ARCA: ${errs.join(" | ")}`)
}

export async function dummy(entorno: Entorno) {
  const r = await llamar(entorno, "FEDummy", null)
  return { app: String(r.AppServer), db: String(r.DbServer), auth: String(r.AuthServer) }
}

export async function ultimoAutorizado(cred: Credenciales, ptoVta: number, cbteTipo: number): Promise<number> {
  const r = await llamar(cred.entorno, "FECompUltimoAutorizado", cred, `<ar:PtoVta>${ptoVta}</ar:PtoVta><ar:CbteTipo>${cbteTipo}</ar:CbteTipo>`)
  exigirSinErrores(r)
  return Number(r.CbteNro)
}

export async function puntosDeVenta(cred: Credenciales) {
  const r = await llamar(cred.entorno, "FEParamGetPtosVenta", cred)
  // Sin puntos de venta habilitados ARCA responde con el error 602: no es una falla.
  if (lista(r?.Errors?.Err).some((e: any) => String(e.Code) === "602")) return []
  exigirSinErrores(r)
  return lista(r.ResultGet?.PtoVenta).map((p: any) => ({
    numero: Number(p.Nro),
    sistema: String(p.EmisionTipo ?? ""),
    bloqueado: String(p.Bloqueado) === "S",
    baja: p.FchBaja && String(p.FchBaja) !== "NULL" ? String(p.FchBaja) : null,
  }))
}

export async function cotizacion(cred: Credenciales, monId: string): Promise<{ valor: number; fecha: string }> {
  const r = await llamar(cred.entorno, "FEParamGetCotizacion", cred, `<ar:MonId>${escaparXml(monId)}</ar:MonId>`)
  exigirSinErrores(r)
  return { valor: Number(r.ResultGet?.MonCotiz), fecha: String(r.ResultGet?.FchCotiz ?? "") }
}

export interface SolicitudCae {
  ptoVta: number
  cbteTipo: number
  numero: number
  concepto: number
  fecha: string // YYYYMMDD
  servicioDesde?: string
  servicioHasta?: string
  vencimientoPago?: string
  docTipo: number
  docNro: string
  condicionIvaReceptor: number
  impTotal: number
  impNeto: number
  impTotConc: number
  impOpEx: number
  impIva: number
  monId: string
  monCotiz: number
  alicuotas: { id: number; base: number; importe: number }[]
  asociado?: { tipo: number; ptoVta: number; nro: number; cuit: string; fecha: string }
  opcionales?: { id: string; valor: string }[]
}

export interface RespuestaCae {
  aprobado: boolean
  cae: string
  vencimiento: string // YYYYMMDD
  resultado: string
  observaciones: string[]
  errores: string[]
}

const imp = (n: number) => n.toFixed(2)
const tag = (nombre: string, valor: string | number | undefined) =>
  valor === undefined || valor === "" ? "" : `<ar:${nombre}>${escaparXml(valor)}</ar:${nombre}>`

/** Arma FeCAEReq respetando el orden de elementos del WSDL (FECAEDetRequest). */
export function cuerpoSolicitud(s: SolicitudCae): string {
  const asoc = s.asociado
    ? `<ar:CbtesAsoc><ar:CbteAsoc>${tag("Tipo", s.asociado.tipo)}${tag("PtoVta", s.asociado.ptoVta)}${tag("Nro", s.asociado.nro)}${tag("Cuit", s.asociado.cuit)}${tag("CbteFch", s.asociado.fecha)}</ar:CbteAsoc></ar:CbtesAsoc>`
    : ""
  const iva = s.alicuotas.length
    ? `<ar:Iva>${s.alicuotas.map((a) => `<ar:AlicIva><ar:Id>${a.id}</ar:Id><ar:BaseImp>${imp(a.base)}</ar:BaseImp><ar:Importe>${imp(a.importe)}</ar:Importe></ar:AlicIva>`).join("")}</ar:Iva>`
    : ""
  const opc = s.opcionales?.length
    ? `<ar:Opcionales>${s.opcionales.map((o) => `<ar:Opcional>${tag("Id", o.id)}${tag("Valor", o.valor)}</ar:Opcional>`).join("")}</ar:Opcionales>`
    : ""
  return (
    `<ar:FeCAEReq><ar:FeCabReq><ar:CantReg>1</ar:CantReg><ar:PtoVta>${s.ptoVta}</ar:PtoVta><ar:CbteTipo>${s.cbteTipo}</ar:CbteTipo></ar:FeCabReq><ar:FeDetReq><ar:FECAEDetRequest>` +
    tag("Concepto", s.concepto) +
    tag("DocTipo", s.docTipo) +
    tag("DocNro", s.docNro || "0") +
    tag("CbteDesde", s.numero) +
    tag("CbteHasta", s.numero) +
    tag("CbteFch", s.fecha) +
    tag("ImpTotal", imp(s.impTotal)) +
    tag("ImpTotConc", imp(s.impTotConc)) +
    tag("ImpNeto", imp(s.impNeto)) +
    tag("ImpOpEx", imp(s.impOpEx)) +
    tag("ImpTrib", "0.00") +
    tag("ImpIVA", imp(s.impIva)) +
    tag("FchServDesde", s.servicioDesde) +
    tag("FchServHasta", s.servicioHasta) +
    tag("FchVtoPago", s.vencimientoPago) +
    tag("MonId", s.monId) +
    tag("MonCotiz", s.monId === "PES" ? "1" : s.monCotiz.toFixed(6)) +
    (s.monId === "PES" ? "" : tag("CanMisMonExt", "N")) +
    tag("CondicionIVAReceptorId", s.condicionIvaReceptor) +
    asoc +
    iva +
    opc +
    `</ar:FECAEDetRequest></ar:FeDetReq></ar:FeCAEReq>`
  )
}

export async function solicitarCae(cred: Credenciales, s: SolicitudCae): Promise<RespuestaCae> {
  const r = await llamar(cred.entorno, "FECAESolicitar", cred, cuerpoSolicitud(s))
  const det = lista(r.FeDetResp?.FECAEDetResponse)[0] as any
  const resultado = String(det?.Resultado ?? r.FeCabResp?.Resultado ?? "R")
  return {
    aprobado: resultado === "A" && !!det?.CAE,
    cae: det?.CAE ? String(det.CAE) : "",
    vencimiento: det?.CAEFchVto ? String(det.CAEFchVto) : "",
    resultado,
    observaciones: lista(det?.Observaciones?.Obs).map((o: any) => `${o.Code}: ${o.Msg}`),
    errores: errores(r),
  }
}

export async function consultarComprobante(cred: Credenciales, ptoVta: number, cbteTipo: number, numero: number) {
  const r = await llamar(
    cred.entorno,
    "FECompConsultar",
    cred,
    `<ar:FeCompConsReq><ar:CbteTipo>${cbteTipo}</ar:CbteTipo><ar:CbteNro>${numero}</ar:CbteNro><ar:PtoVta>${ptoVta}</ar:PtoVta></ar:FeCompConsReq>`,
  )
  if (errores(r).length) return null
  const g = r.ResultGet
  return g
    ? {
        cae: String(g.CodAutorizacion ?? ""),
        vencimiento: String(g.FchVto ?? ""),
        total: Number(g.ImpTotal),
        docNro: String(g.DocNro),
        fecha: String(g.CbteFch),
      }
    : null
}
