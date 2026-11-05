// Períodos de abonos. Sin dependencias de servidor: se usa también en el navegador.

/** Mes (YYYY-MM) que corresponde facturar hoy para este abono. */
export function periodoAFacturar(a: { mesFacturado?: "actual" | "anterior" }, hoy: string): string {
  const [y, m] = hoy.split("-").map(Number)
  if (a.mesFacturado !== "anterior") return hoy.slice(0, 7)
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`
}

/** Primer y último día de un período YYYY-MM. */
export function limitesPeriodo(periodo: string): [string, string] {
  const [y, m] = periodo.split("-").map(Number)
  return [`${periodo}-01`, new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10)]
}

