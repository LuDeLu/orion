import { conAdmin } from "@/lib/admin-api"
import { registrar } from "@/lib/facturacion/actividad"
import { listarDocumentos } from "@/lib/facturacion/documentos"
import { ErrorValidacion } from "@/lib/facturacion/emitir"
import { leerConfig } from "@/lib/facturacion/config"
import {
  CONCEPTOS,
  condicionIva,
  estadoCobro,
  fechaAr,
  formatoCuit,
  hoyAr,
  nombreDocumento,
  numeroCbte,
  saldoComprobante,
  tipoCbte,
  tipoDoc,
} from "@/lib/facturacion/modelo"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const TEXTO_COBRO: Record<string, string> = { cobrada: "Cobrada", parcial: "Cobro parcial", a_cobrar: "A cobrar", vencida: "Vencida", anulada: "Anulada por NC" }

/** Excel en español abre bien el CSV con ";" como separador y coma decimal. */
const num = (n: number | undefined) => (n === undefined ? "" : n.toFixed(2).replace(".", ","))
const celda = (v: unknown) => {
  const s = String(v ?? "")
  return /[;"\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/**
 * GET ?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&que=comprobantes|presupuestos
 * Solo comprobantes emitidos del entorno activo (las NC van en negativo).
 */
export async function GET(req: Request) {
  return conAdmin(async (sesion) => {
    const sp = new URL(req.url).searchParams
    const desde = sp.get("desde") ?? ""
    const hasta = sp.get("hasta") ?? ""
    const que = sp.get("que") === "presupuestos" ? "presupuestos" : "comprobantes"
    const fecha = /^\d{4}-\d{2}-\d{2}$/
    if (!fecha.test(desde) || !fecha.test(hasta) || desde > hasta) throw new ErrorValidacion(["Elegí un rango de fechas válido"])

    const [cfg, docs] = await Promise.all([leerConfig(), listarDocumentos()])
    const hoy = hoyAr()
    const emitidos = docs.filter((d) => d.clase === "factura" && d.estado === "emitido" && d.entorno === cfg.entorno)
    const enRango = (d: { fecha: string }) => d.fecha >= desde && d.fecha <= hasta

    let filas: unknown[][]
    let cantidad = 0
    if (que === "comprobantes") {
      const encabezado = [
        "Fecha", "Tipo", "Punto de venta", "Número", "CAE", "Vto. CAE", "Cliente", "Tipo doc.", "Nro. doc.", "Condición IVA cliente",
        "Concepto", "Período desde", "Período hasta", "Moneda", "Cotización", "Neto gravado", "IVA", "Exento", "No gravado", "Total",
        "Total en pesos", "Estado de cobro", "Fecha de cobro", "Medio de cobro", "Cobrado", "Saldo", "Vto. pago",
      ]
      filas = [
        encabezado,
        ...emitidos
          .filter(enRango)
          .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.numero - b.numero)
          .map((d) => {
            const s = tipoCbte(d.tipo)?.clase === "nc" ? -1 : 1
            return [
              fechaAr(d.fecha), nombreDocumento(d), d.puntoVenta, d.numero, d.cae, fechaAr(d.caeVencimiento),
              d.receptor.nombre, tipoDoc(d.receptor.docTipo), d.receptor.docTipo === 80 ? formatoCuit(d.receptor.docNro) : d.receptor.docNro,
              condicionIva(d.receptor.condicionIva)?.nombre, CONCEPTOS.find((c) => c.id === d.concepto)?.nombre,
              d.concepto !== 1 ? fechaAr(d.servicioDesde) : "", d.concepto !== 1 ? fechaAr(d.servicioHasta) : "",
              d.moneda, num(d.cotizacion), num(s * d.totales.neto), num(s * d.totales.iva), num(s * d.totales.exento), num(s * d.totales.noGravado),
              num(s * d.totales.total), num(s * d.totales.total * (d.cotizacion || 1)),
              TEXTO_COBRO[estadoCobro(d, emitidos, hoy) ?? ""] ?? "", fechaAr(d.cobro?.fecha), d.cobro?.medio, num(d.cobro?.monto),
              num(saldoComprobante(d, emitidos)), fechaAr(d.vencimientoPago),
            ]
          }),
      ]
      cantidad = filas.length - 1
      // Total al pie para controlar contra lo declarado
      const total = emitidos.filter(enRango).reduce((t, d) => t + (tipoCbte(d.tipo)?.clase === "nc" ? -1 : 1) * d.totales.total * (d.cotizacion || 1), 0)
      filas.push([], ["Total del período en pesos", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", num(total)])
    } else {
      filas = [
        ["Fecha", "Número", "Cliente", "Nro. doc.", "Estado", "Moneda", "Total", "Validez (días)"],
        ...docs
          .filter((d) => d.clase === "presupuesto" && enRango(d))
          .sort((a, b) => a.fecha.localeCompare(b.fecha))
          .map((d) => [fechaAr(d.fecha), `P-${String(d.numero).padStart(6, "0")}`, d.receptor.nombre, d.receptor.docNro, d.estado, d.moneda, num(d.totales.total), d.validezDias]),
      ]
      cantidad = filas.length - 1
    }

    const csv = "﻿" + filas.map((f) => f.map(celda).join(";")).join("\r\n")
    const nombre = `orion-${que}-${desde}-a-${hasta}${cfg.entorno === "homologacion" ? "-homologacion" : ""}.csv`
    await registrar(sesion.username, "Exportó a Excel", `${que === "comprobantes" ? "Comprobantes" : "Presupuestos"} del ${fechaAr(desde)} al ${fechaAr(hasta)} (${cantidad} ${cantidad === 1 ? "comprobante" : "comprobantes"})`)
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${nombre}"`,
        "Cache-Control": "no-store",
      },
    })
  })
}
