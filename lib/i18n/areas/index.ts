import { areas as areasEs, type Area, type AreaSlug } from "@/lib/areas"
import type { Locale } from "@/lib/i18n/types"
import type { AreaTexts } from "./types"
import { areasEn } from "./en"
import { areasPt } from "./pt"

export type { AreaText, AreaTexts } from "./types"

const texts: Partial<Record<Locale, AreaTexts>> = {
  en: areasEn,
  pt: areasPt,
}

/**
 * Devuelve las áreas con el texto del idioma pedido.
 *
 * En español devuelve `lib/areas.ts` tal cual: es el original y evita una
 * copia paralela que se pueda desincronizar. Para el resto, fusiona la
 * estructura (íconos, colores, slugs, ids) con el diccionario, emparejando
 * las familias por `id` y el cross-sell por slug.
 */
export function localizeAreas(locale: Locale): Area[] {
  const dict = texts[locale]
  if (!dict) return areasEs

  return areasEs.map((area): Area => {
    const tr = dict[area.slug]
    if (!tr) return area

    return {
      ...area,
      name: tr.name,
      navLabel: tr.navLabel,
      teaser: tr.teaser,
      chips: tr.chips,
      owner: {
        ...area.owner,
        role: tr.owner.role,
        title: tr.owner.title,
        area: tr.owner.area,
      },
      hero: tr.hero,
      problems: tr.problems,
      families: area.families.map((f) => {
        const ft = tr.families[f.id]
        return ft ? { ...f, title: ft.title, summary: ft.summary, items: ft.items } : f
      }),
      // El número de paso es estructural; solo cambian título y descripción.
      process: area.process.map((p, i) => ({ ...p, ...(tr.process[i] ?? {}) })),
      metrics: tr.metrics,
      crossSell: area.crossSell.map((cs) => ({
        ...cs,
        reason: tr.crossSell[cs.slug] ?? cs.reason,
      })),
      seo: { ...area.seo, title: tr.seo.title, description: tr.seo.description },
    }
  })
}

export function localizeArea(slug: AreaSlug, locale: Locale): Area {
  return localizeAreas(locale).find((a) => a.slug === slug)!
}
