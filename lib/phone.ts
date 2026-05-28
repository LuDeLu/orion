/**
 * Normaliza un número de teléfono al formato que espera wa.me/<numero>
 * (solo dígitos, sin símbolos, sin signo +).
 *
 * Heurística: optimizada para Argentina pero tolera números extranjeros.
 *
 * Para AR el formato correcto de WhatsApp para móviles es:
 *   54 + 9 + area + número  →  ej. 5491112345678
 *
 * Casos de entrada que normaliza correctamente:
 *   "+54 9 11 1234-5678"        → 5491112345678
 *   "+54 11 1234-5678"          → 5491112345678   (le agrega el 9)
 *   "54 11 1234-5678"           → 5491112345678
 *   "011 1234-5678"             → 5491112345678   (saca el 0 troncal)
 *   "11 1234-5678"              → 5491112345678
 *   "9 11 1234 5678"            → 5491112345678
 *   "0054 9 11 1234-5678"       → 5491112345678   (saca 00 internacional)
 *
 * Si el número tiene prefijo de país distinto a 54 (ej. +598, +56),
 * lo deja como vino (solo limpia no-dígitos).
 */
export function normalizeWhatsAppNumber(raw: string | null | undefined): string {
  let d = (raw || "").replace(/\D/g, "")
  if (!d) return ""

  // Prefijo internacional 00 → quitar
  if (d.startsWith("00")) d = d.slice(2)

  // Caso Argentina
  if (d.startsWith("54")) {
    let rest = d.slice(2)
    // Quitar prefijo móvil 9 si está, lo re-agregamos abajo de forma consistente
    if (rest.startsWith("9")) rest = rest.slice(1)
    // Quitar troncal local 0 (raro en internacional pero por las dudas)
    if (rest.startsWith("0")) rest = rest.slice(1)
    return "549" + rest
  }

  // Sin prefijo de país: si parece argentino por longitud (10–11 dígitos), asumir AR
  if (d.length >= 10 && d.length <= 11) {
    if (d.startsWith("0")) d = d.slice(1)
    if (d.startsWith("9")) d = d.slice(1)
    return "549" + d
  }

  // Otro país u otro formato — devolver dígitos tal cual
  return d
}

/**
 * Devuelve la URL completa de wa.me lista para `href`.
 */
export function waLink(raw: string | null | undefined, text?: string): string {
  const n = normalizeWhatsAppNumber(raw)
  if (!n) return "#"
  const base = `https://wa.me/${n}`
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}
