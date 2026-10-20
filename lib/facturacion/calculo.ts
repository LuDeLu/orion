/**
 * Cálculo de importes. Se trabaja en centavos enteros para que la suma que
 * valida ARCA (ImpTotal = ImpTotConc + ImpNeto + ImpOpEx + ImpTrib + ImpIVA)
 * cierre siempre al centavo.
 */
import { alicuota, type Item, type Totales } from "./modelo"

const cent = (n: number) => Math.round(n * 100)
const pesos = (c: number) => c / 100

/** Importe de la línea en centavos, con bonificación aplicada, tal como se cargó. */
export function subtotalItem(it: Item): number {
  const bruto = (Number(it.cantidad) || 0) * (Number(it.precio) || 0)
  const bonif = Math.min(Math.max(Number(it.bonificacion) || 0, 0), 100)
  return cent(bruto * (1 - bonif / 100))
}

/**
 * @param discrimina comprobantes A/B/M (el emisor es Responsable Inscripto)
 * @param preciosConIva los precios cargados ya incluyen el IVA
 */
export function calcularTotales(items: Item[], discrimina: boolean, preciosConIva: boolean): Totales {
  if (!discrimina) {
    const total = items.reduce((s, it) => s + subtotalItem(it), 0)
    return { neto: pesos(total), exento: 0, noGravado: 0, ivas: [], iva: 0, total: pesos(total) }
  }

  const grupos = new Map<number, number>()
  for (const it of items) grupos.set(it.iva, (grupos.get(it.iva) ?? 0) + subtotalItem(it))

  let neto = 0, iva = 0, exento = 0, noGravado = 0
  const ivas: Totales["ivas"] = []
  for (const [id, suma] of [...grupos].sort((a, b) => b[0] - a[0])) {
    if (id === -1) { exento += suma; continue }
    if (id === -2) { noGravado += suma; continue }
    const tasa = alicuota(id)?.tasa ?? 0
    const base = preciosConIva ? Math.round(suma / (1 + tasa)) : suma
    const importe = preciosConIva ? suma - base : Math.round(suma * tasa)
    neto += base
    iva += importe
    ivas.push({ id, base: pesos(base), importe: pesos(importe) })
  }
  return {
    neto: pesos(neto),
    exento: pesos(exento),
    noGravado: pesos(noGravado),
    ivas,
    iva: pesos(iva),
    total: pesos(neto + iva + exento + noGravado),
  }
}

/** Importe a mostrar por línea en el PDF: con IVA en B y C, sin IVA en A/M. */
export function importeLinea(it: Item, letraDiscriminaNeto: boolean, preciosConIva: boolean): number {
  const sub = subtotalItem(it)
  const tasa = it.iva > 0 ? (alicuota(it.iva)?.tasa ?? 0) : 0
  if (letraDiscriminaNeto) return pesos(preciosConIva ? Math.round(sub / (1 + tasa)) : sub)
  return pesos(preciosConIva ? sub : Math.round(sub * (1 + tasa)))
}
