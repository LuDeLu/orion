"use client"

import { useMemo } from "react"
import { useI18n } from "@/components/i18n-provider"
import { localizeAreas } from "@/lib/i18n/areas"
import type { Area, AreaSlug } from "@/lib/areas"

/** Las tres áreas con el texto del idioma activo. */
export function useAreas(): Area[] {
  const { locale } = useI18n()
  return useMemo(() => localizeAreas(locale), [locale])
}

/** Un área puntual, ya traducida. */
export function useArea(slug: AreaSlug): Area {
  const areas = useAreas()
  return useMemo(() => areas.find((a) => a.slug === slug)!, [areas, slug])
}
