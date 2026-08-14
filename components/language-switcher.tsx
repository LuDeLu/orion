"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Globe } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useI18n } from "@/components/i18n-provider"
import { dictionaries } from "@/lib/i18n"
import type { Locale } from "@/lib/i18n/types"

export function LanguageSwitcher({ align = "right" }: { align?: "right" | "left" }) {
  const { locale, setLocale, locales, t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const pick = (l: Locale) => {
    setLocale(l)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t.a11y.changeLanguage}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-1.5 h-9 px-2.5 rounded-md border transition-colors duration-300 ${
          open
            ? "border-primary/40 text-primary bg-primary/[0.08]"
            : "border-[var(--hairline)] bg-[var(--tint-1)] text-foreground/65 hover:text-primary hover:border-primary/40"
        }`}
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.14em]">
          {t.langShort}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute top-[calc(100%+8px)] z-50 w-[180px] overflow-hidden rounded-xl border border-[var(--hairline)] bg-popover p-1.5 shadow-2xl shadow-background/60 ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            {locales.map((l) => {
              const d = dictionaries[l]
              const active = l === locale
              return (
                <li key={l}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => pick(l)}
                    className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-200 ${
                      active
                        ? "bg-primary/12 text-primary"
                        : "text-foreground/75 hover:bg-[var(--tint-2)] hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] opacity-60">
                        {d.langShort}
                      </span>
                      <span className="text-sm font-medium">{d.langName}</span>
                    </span>
                    {active && <Check className="w-4 h-4 shrink-0" />}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
