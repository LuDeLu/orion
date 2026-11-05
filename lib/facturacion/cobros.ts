// Registro de cobros de facturas y notas de débito.
import { ErrorValidacion } from "@/lib/admin-api"
import { guardarDocumento, leerDocumento } from "./documentos"
import { esCobrable, type Cobro, type Documento } from "./modelo"

export const MEDIOS_COBRO = ["Transferencia bancaria", "Efectivo", "Mercado Pago", "Tarjeta de débito", "Tarjeta de crédito", "Cheque", "Otro"]

export async function registrarCobro(
  id: string,
  datos: { fecha?: string; medio?: string; monto?: number; nota?: string },
  usuario?: string,
): Promise<Documento> {
  const doc = await leerDocumento(id)
  if (!doc || !esCobrable(doc)) throw new ErrorValidacion(["Solo se registran cobros de facturas o notas de débito emitidas"])
  const fecha = String(datos.fecha ?? "")
  const monto = Math.round(Number(datos.monto) * 100) / 100
  const e: string[] = []
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) e.push("Indicá la fecha de cobro")
  if (!datos.medio) e.push("Indicá el medio de pago")
  if (!(monto > 0)) e.push("El monto cobrado tiene que ser mayor a cero")
  if (monto > doc.totales.total + 0.005) e.push("El monto cobrado supera el total del comprobante")
  if (e.length) throw new ErrorValidacion(e)

  const cobro: Cobro = { fecha, medio: String(datos.medio), monto, nota: datos.nota?.trim() || undefined, registrado: new Date().toISOString(), usuario }
  const actualizado = { ...doc, cobro }
  await guardarDocumento(actualizado)
  return actualizado
}

export async function anularCobro(id: string): Promise<Documento> {
  const doc = await leerDocumento(id)
  if (!doc) throw new ErrorValidacion(["No existe ese comprobante"])
  const { cobro: _, ...resto } = doc
  await guardarDocumento(resto)
  return resto
}
