/**
 * Emisión de comprobantes con CAE y guardado de presupuestos.
 * Toda la validación de negocio vive acá: el formulario valida para guiar,
 * pero lo que manda es esto.
 */
import { kvDel, kvIncr, kvSet } from "@/lib/kv"
import { ErrorValidacion } from "@/lib/admin-api"
export { ErrorValidacion }
import { leerConfig, type ConfigFacturacion } from "./config"
import { credenciales, ErrorArca } from "./arca"
import { consultarComprobante, solicitarCae, ultimoAutorizado, type SolicitudCae } from "./arca/wsfe"
import { calcularTotales } from "./calculo"
import { borrarDocumento, guardarCliente, guardarDocumento, leerDocumento } from "./documentos"
import {
  condicionIva,
  cuitValido,
  discriminaIva,
  letrasEmisor,
  soloDigitos,
  tipoCbte,
  type DatosComprobante,
  type Documento,
  type Item,
} from "./modelo"


const aArca = (iso?: string) => (iso ? iso.replace(/-/g, "") : undefined)
const deArca = (s?: string) => (s && s.length === 8 ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : "")

/** Limpia lo que llega del navegador: tipos, espacios y valores por defecto. */
export function normalizar(d: DatosComprobante): DatosComprobante {
  const items: Item[] = (d.items ?? [])
    .map((it) => ({
      descripcion: String(it.descripcion ?? "").trim(),
      cantidad: Number(it.cantidad) || 0,
      unidad: String(it.unidad ?? "").trim() || "u.",
      precio: Math.round((Number(it.precio) || 0) * 100) / 100,
      bonificacion: Math.min(Math.max(Number(it.bonificacion) || 0, 0), 100),
      iva: Number(it.iva) || 5,
    }))
    .filter((it) => it.descripcion || it.precio)
  const r = d.receptor ?? ({} as DatosComprobante["receptor"])
  const docTipo = Number(r.docTipo) || 99
  return {
    tipo: Number(d.tipo) || 0,
    fecha: d.fecha,
    concepto: Number(d.concepto) || 2,
    servicioDesde: d.servicioDesde || undefined,
    servicioHasta: d.servicioHasta || undefined,
    vencimientoPago: d.vencimientoPago || undefined,
    receptor: {
      docTipo,
      docNro: docTipo === 99 ? "0" : soloDigitos(String(r.docNro ?? "")),
      nombre: String(r.nombre ?? "").trim() || (docTipo === 99 ? "Consumidor Final" : ""),
      condicionIva: Number(r.condicionIva) || 5,
      domicilio: String(r.domicilio ?? "").trim(),
      email: String(r.email ?? "").trim(),
    },
    items,
    preciosConIva: !!d.preciosConIva,
    moneda: d.moneda || "PES",
    cotizacion: d.moneda && d.moneda !== "PES" ? Number(d.cotizacion) || 0 : 1,
    condicionVenta: String(d.condicionVenta ?? "").trim() || "Contado",
    observaciones: String(d.observaciones ?? "").trim(),
    asociado: d.asociado?.numero
      ? {
          tipo: Number(d.asociado.tipo),
          puntoVenta: Number(d.asociado.puntoVenta),
          numero: Number(d.asociado.numero),
          fecha: d.asociado.fecha,
        }
      : undefined,
    anulacion: !!d.anulacion,
    validezDias: Number(d.validezDias) || undefined,
  }
}

function validarComun(d: DatosComprobante): string[] {
  const e: string[] = []
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d.fecha ?? "")) e.push("La fecha no es válida")
  if (!d.items.length) e.push("Agregá al menos un ítem")
  d.items.forEach((it, i) => {
    if (!it.descripcion) e.push(`Ítem ${i + 1}: falta la descripción`)
    if (it.cantidad <= 0) e.push(`Ítem ${i + 1}: la cantidad tiene que ser mayor a cero`)
    if (it.precio < 0) e.push(`Ítem ${i + 1}: el precio no puede ser negativo`)
  })
  if (d.receptor.docTipo !== 99 && !d.receptor.docNro) e.push("Falta el número de documento del cliente")
  if ([80, 86].includes(d.receptor.docTipo) && !cuitValido(d.receptor.docNro)) e.push("El CUIT/CUIL del cliente no es válido")
  if (d.receptor.docTipo !== 99 && !d.receptor.nombre) e.push("Falta el nombre o razón social del cliente")
  if (d.moneda !== "PES" && !(d.cotizacion > 0)) e.push("Falta la cotización de la moneda")
  return e
}

export function validarFactura(d: DatosComprobante, cfg: ConfigFacturacion): string[] {
  const e = validarComun(d)
  const t = tipoCbte(d.tipo)
  if (!t) return [...e, "Elegí el tipo de comprobante"]
  if (!letrasEmisor(cfg.condicionIva).includes(t.letra))
    e.push(`Con la condición de ${cfg.condicionIva === "monotributo" ? "monotributista" : "IVA configurada"} no se puede emitir ${t.nombre}`)
  const cond = condicionIva(d.receptor.condicionIva)
  if (!cond) e.push("Elegí la condición frente al IVA del cliente")
  else if (!cond.letras.includes(t.letra)) e.push(`${t.nombre} no corresponde a un cliente "${cond.nombre}"`)
  if (t.letra === "A" || t.letra === "M" || t.fce) {
    if (d.receptor.docTipo !== 80) e.push(`${t.nombre} requiere el CUIT del cliente`)
  }
  if (d.concepto !== 1) {
    if (!d.servicioDesde || !d.servicioHasta) e.push("Para servicios hay que indicar el período facturado")
    else if (d.servicioDesde > d.servicioHasta) e.push("El período de servicio termina antes de empezar")
  }
  const necesitaVto = (d.concepto !== 1 && !(t.fce && t.clase !== "factura")) || (t.fce && t.clase === "factura")
  if (necesitaVto && !d.vencimientoPago) e.push("Falta la fecha de vencimiento del pago")
  if ((t.clase === "nc" || t.clase === "nd") && !d.asociado) e.push("Las notas de crédito y débito tienen que indicar el comprobante que ajustan")
  if (t.fce && t.clase === "factura" && !soloDigitos(cfg.cbu)) e.push("Para Factura de Crédito MiPyME hay que cargar el CBU en Configuración")
  const tot = calcularTotales(d.items, discriminaIva(t.letra), d.preciosConIva)
  if (!(tot.total > 0)) e.push("El total tiene que ser mayor a cero")
  return e
}

const idFactura = (cfg: ConfigFacturacion, tipo: number, pv: number, n: number) =>
  `${cfg.entorno === "produccion" ? "F" : "H"}${tipo}-${pv}-${n}`

/** Pide el CAE. Si ARCA rechaza, no se guarda nada y el número no se consume. */
export async function emitirFactura(datos: DatosComprobante, opciones: { presupuestoId?: string } = {}): Promise<Documento> {
  const cfg = await leerConfig()
  const d = normalizar(datos)
  const errores = validarFactura(d, cfg)
  if (errores.length) throw new ErrorValidacion(errores)

  const t = tipoCbte(d.tipo)!
  const pv = cfg.puntoVenta
  const totales = calcularTotales(d.items, discriminaIva(t.letra), d.preciosConIva)
  const cred = await credenciales("wsfe", cfg)

  // Candado por punto de venta y tipo: dos emisiones simultáneas pedirían el mismo número
  const candado = `fac:lock:${cfg.entorno}:${pv}:${d.tipo}`
  if (!(await kvSet(candado, 1, { nx: true, ex: 60 })))
    throw new ErrorArca("Hay otra emisión del mismo tipo en curso. Esperá unos segundos y probá de nuevo.")

  try {
    const numero = (await ultimoAutorizado(cred, pv, d.tipo)) + 1
    const solicitud: SolicitudCae = {
      ptoVta: pv,
      cbteTipo: d.tipo,
      numero,
      concepto: d.concepto,
      fecha: aArca(d.fecha)!,
      servicioDesde: d.concepto !== 1 ? aArca(d.servicioDesde) : undefined,
      servicioHasta: d.concepto !== 1 ? aArca(d.servicioHasta) : undefined,
      vencimientoPago: t.fce && t.clase !== "factura" ? undefined : aArca(d.vencimientoPago),
      docTipo: d.receptor.docTipo,
      docNro: d.receptor.docNro,
      condicionIvaReceptor: d.receptor.condicionIva,
      impTotal: totales.total,
      impNeto: totales.neto,
      impTotConc: totales.noGravado,
      impOpEx: totales.exento,
      impIva: totales.iva,
      monId: d.moneda,
      monCotiz: d.cotizacion,
      alicuotas: totales.ivas,
      asociado: d.asociado
        ? { tipo: d.asociado.tipo, ptoVta: d.asociado.puntoVenta, nro: d.asociado.numero, cuit: cfg.cuit, fecha: aArca(d.asociado.fecha)! }
        : undefined,
      opcionales: t.fce
        ? t.clase === "factura"
          ? [
              { id: "2101", valor: soloDigitos(cfg.cbu) },
              ...(cfg.alias ? [{ id: "2102", valor: cfg.alias }] : []),
              { id: "27", valor: "SCA" },
            ]
          : [{ id: "22", valor: d.anulacion ? "S" : "N" }]
        : undefined,
    }

    const doc: Documento = {
      ...d,
      id: idFactura(cfg, d.tipo, pv, numero),
      clase: "factura",
      estado: "pendiente",
      creado: new Date().toISOString(),
      entorno: cfg.entorno,
      puntoVenta: pv,
      numero,
      totales,
      vinculo: opciones.presupuestoId,
    }
    // Se guarda antes de llamar: si la respuesta se pierde, queda para verificar
    await guardarDocumento(doc)

    let resp
    try {
      resp = await solicitarCae(cred, solicitud)
    } catch (e) {
      const c = await consultarComprobante(cred, pv, d.tipo, numero).catch(() => undefined)
      if (c?.cae) resp = { aprobado: true, cae: c.cae, vencimiento: c.vencimiento, resultado: "A", observaciones: [], errores: [] }
      else if (c === null) {
        // ARCA confirma que no existe: se descarta
        await borrarDocumento(doc.id)
        throw e
      } else throw new ErrorArca(`${(e as Error).message}. El comprobante quedó como pendiente: verificalo desde su detalle.`)
    }

    if (!resp.aprobado) {
      await borrarDocumento(doc.id)
      throw new ErrorArca(`ARCA rechazó el comprobante: ${[...resp.errores, ...resp.observaciones].join(" | ") || resp.resultado}`, "RECHAZADO")
    }

    doc.estado = "emitido"
    doc.cae = resp.cae
    doc.caeVencimiento = deArca(resp.vencimiento)
    doc.mensajesArca = resp.observaciones
    await guardarDocumento(doc)
    await guardarCliente(d.receptor)

    if (opciones.presupuestoId) {
      const p = await leerDocumento(opciones.presupuestoId)
      if (p?.clase === "presupuesto") await guardarDocumento({ ...p, estado: "facturado", vinculo: doc.id })
    }
    return doc
  } finally {
    await kvDel(candado)
  }
}

/** Reintenta confirmar un comprobante que quedó pendiente por un corte de comunicación. */
export async function verificarPendiente(id: string): Promise<Documento> {
  const doc = await leerDocumento(id)
  if (!doc || doc.clase !== "factura") throw new ErrorArca("No existe ese comprobante")
  if (doc.estado !== "pendiente") return doc
  const cfg = await leerConfig()
  const cred = await credenciales("wsfe", { ...cfg, entorno: doc.entorno ?? cfg.entorno })
  const c = await consultarComprobante(cred, doc.puntoVenta, doc.tipo, doc.numero)
  if (!c) {
    await borrarDocumento(doc.id)
    throw new ErrorArca("ARCA no tiene registrado ese comprobante: se descartó. Podés volver a emitirlo.")
  }
  const actualizado: Documento = { ...doc, estado: "emitido", cae: c.cae, caeVencimiento: deArca(c.vencimiento) }
  await guardarDocumento(actualizado)
  return actualizado
}

// ── Presupuestos ─────────────────────────────────────────────────────────────

export async function guardarPresupuesto(datos: DatosComprobante, id?: string): Promise<Documento> {
  const cfg = await leerConfig()
  const d = normalizar({ ...datos, tipo: 0 })
  const errores = validarComun(d)
  if (errores.length) throw new ErrorValidacion(errores)
  const discrimina = cfg.condicionIva === "responsable_inscripto"
  const totales = calcularTotales(d.items, discrimina, d.preciosConIva)

  const previo = id ? await leerDocumento(id) : null
  if (previo && previo.clase !== "presupuesto") throw new ErrorValidacion(["Ese documento no es un presupuesto"])
  if (previo?.estado === "facturado") throw new ErrorValidacion(["El presupuesto ya fue facturado: no se puede modificar"])

  const numero = previo?.numero ?? (await kvIncr("fac:seq:presupuesto"))
  const doc: Documento = {
    ...d,
    validezDias: d.validezDias ?? cfg.validezPresupuesto,
    id: previo?.id ?? `P-${numero}`,
    clase: "presupuesto",
    estado: previo?.estado ?? "vigente",
    creado: previo?.creado ?? new Date().toISOString(),
    puntoVenta: cfg.puntoVenta,
    numero,
    totales,
  }
  await guardarDocumento(doc)
  await guardarCliente(d.receptor)
  return doc
}

export async function cambiarEstadoPresupuesto(id: string, estado: "vigente" | "aceptado" | "rechazado") {
  const p = await leerDocumento(id)
  if (!p || p.clase !== "presupuesto") throw new ErrorValidacion(["No existe ese presupuesto"])
  if (p.estado === "facturado") throw new ErrorValidacion(["El presupuesto ya fue facturado"])
  await guardarDocumento({ ...p, estado })
}
