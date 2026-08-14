"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { DEFAULT_LOCALE, STORAGE_KEY, dictionaries } from "@/lib/i18n"
import { LOCALES, type Dict, type Locale } from "@/lib/i18n/types"

interface I18nValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Dict
  locales: Locale[]
}

const I18nContext = createContext<I18nValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: dictionaries[DEFAULT_LOCALE],
  locales: LOCALES,
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // El servidor siempre renderiza español (idioma canónico y el que indexa
  // Google). La preferencia guardada se aplica al montar, para no romper
  // la hidratación.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    let stored: string | null = null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
    } catch {
      /* Safari en modo privado */
    }

    // Solo se aplica una preferencia elegida a mano. Antes se miraba
    // navigator.language, pero eso mostraba el sitio en inglés a clientes
    // argentinos con el celular configurado en otro idioma.
    if (stored && (LOCALES as string[]).includes(stored)) {
      setLocaleState(stored as Locale)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = dictionaries[locale].locale
  }, [locale])

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ignorado */
    }
  }, [])

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: dictionaries[locale], locales: LOCALES }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

/** Atajo cuando solo hace falta el diccionario. */
export function useT() {
  return useContext(I18nContext).t
}
