import type { AreaSlug } from "@/lib/areas"

/**
 * Texto traducible de un área.
 *
 * `lib/areas.ts` sigue siendo la fuente estructural (slug, href, ícono, color,
 * estrella, ids de familia) y además el original en español. Estos diccionarios
 * solo reemplazan el texto visible, emparejando las familias por `id`.
 */
export interface AreaText {
  name: string
  navLabel: string
  teaser: string
  chips: string[]
  owner: { role: string; title: string; area: string }
  hero: {
    eyebrow: string
    titleStart: string
    titleHighlight: string
    subtitle: string
    bullets: string[]
  }
  problems: { title: string; description: string }[]
  /** Clave = `id` de la familia en lib/areas.ts */
  families: Record<string, { title: string; summary: string; items: string[] }>
  process: { title: string; description: string }[]
  metrics: { value: string; label: string }[]
  /** Clave = slug del área destino */
  crossSell: Partial<Record<AreaSlug, string>>
  seo: { title: string; description: string }
}

export type AreaTexts = Record<AreaSlug, AreaText>
