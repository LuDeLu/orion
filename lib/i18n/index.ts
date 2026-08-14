import type { Dict, Locale } from "./types"
import { es } from "./dictionaries/es"
import { en } from "./dictionaries/en"
import { pt } from "./dictionaries/pt"

export const dictionaries: Record<Locale, Dict> = { es, en, pt }

/** El español es el idioma canónico: es lo que renderiza el servidor. */
export const DEFAULT_LOCALE: Locale = "es"

export const STORAGE_KEY = "orion-lang"

/** Reemplaza marcadores tipo {year} o {items} en un string del diccionario. */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m))
}

export type { Dict, Locale }
