"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useLenis } from "lenis/react"
import { useTheme } from "next-themes"
import { useAreas } from "@/hooks/use-areas"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { useT } from "@/components/i18n-provider"

// El orden sigue el de las secciones en la home.
// `key` apunta al diccionario; `id` es el ancla que observa el IntersectionObserver.
const navLinks = [
  { href: "/#casos", id: "casos", key: "casos" },
  { href: "/#nosotros", id: "nosotros", key: "nosotros" },
  { href: "/#equipo", id: "equipo", key: "equipo" },
  { href: "/#contacto", id: "contacto", key: "contacto" },
] as const

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("")
  const [areasOpen, setAreasOpen] = useState(false)
  const t = useT()
  const areas = useAreas()
  const pathname = usePathname()
  const isHome = pathname === "/"

  // El servidor siempre renderiza el logo oscuro (tema por defecto). Recién al
  // montar sabemos si el visitante venía con el tema claro guardado, así que
  // el swap a logo2.png ocurre después, sin romper la hidratación.
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isLight = mounted && resolvedTheme === "light"

  // Detectar scroll para modo compacto
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Detectar sección activa con IntersectionObserver.
  // Algunas secciones se montan tarde (ej: Servicios está dentro de un <Suspense>
  // por useSearchParams). Por eso observamos lo que existe ahora y además usamos
  // un MutationObserver para enganchar las secciones cuando aparecen.
  useEffect(() => {
    // Las secciones ancladas solo existen en la home; en /marketing, /software
    // y /it no hay nada que observar.
    if (!isHome) {
      setActiveSection("")
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          setActiveSection(visible[0].target.id)
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.1, 0.3, 0.5],
      }
    )

    const observed = new Set<string>()
    const observeAvailable = () => {
      for (const link of navLinks) {
        if (observed.has(link.id)) continue
        const el = document.getElementById(link.id)
        if (el) {
          observer.observe(el)
          observed.add(link.id)
        }
      }
      return observed.size === navLinks.length
    }

    const allFound = observeAvailable()

    let mutation: MutationObserver | undefined
    if (!allFound) {
      mutation = new MutationObserver(() => {
        if (observeAvailable()) mutation?.disconnect()
      })
      mutation.observe(document.body, { childList: true, subtree: true })
    }

    return () => {
      observer.disconnect()
      mutation?.disconnect()
    }
  }, [isHome])

  const lenis = useLenis()

  // Bloquear scroll cuando el menú móvil está abierto. Con overflow:hidden solo
  // no alcanza: Lenis mueve la página por su cuenta y hay que frenarlo aparte.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    if (isOpen) lenis?.stop()
    else lenis?.start()
    return () => {
      document.body.style.overflow = ""
      lenis?.start()
    }
  }, [isOpen, lenis])

  // Escape cierra lo que esté abierto: menú móvil o desplegable de áreas.
  useEffect(() => {
    if (!isOpen && !areasOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setIsOpen(false)
      setAreasOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, areasOpen])

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Fuera de la home dejamos que Next navegue a /#seccion normalmente.
      const hash = href.startsWith("/#") ? href.slice(1) : href.startsWith("#") ? href : null
      if (!hash || !isHome) {
        setIsOpen(false)
        return
      }
      const target = document.getElementById(hash.slice(1))
      if (!target) return
      e.preventDefault()
      setIsOpen(false)
      if (lenis) {
        lenis.scrollTo(target, {
          offset: -88,
          duration: 1.1,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        })
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" })
      }
      if (history.replaceState) history.replaceState(null, "", hash)
    },
    [lenis, isHome]
  )

  const handleLinkClick = () => setIsOpen(false)

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/75 backdrop-blur-2xl border-b border-[var(--hairline)] shadow-lg shadow-background/40"
            : "bg-transparent backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              scrolled ? "h-16" : "h-20"
            }`}
          >
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group relative"
              aria-label={t.a11y.home}
            >
              <div className="relative">
                <span className="absolute inset-0 bg-primary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] rounded-full" />
                {/* 135x48 es la proporción real de los dos logos (2.81:1).
                    Declarar 180x48 hacía que Next avisara por relación de
                    aspecto rota. Sin `priority`: el src depende del tema, que
                    se resuelve al montar, así que el preload apuntaba a un
                    archivo que en tema claro nunca se usaba. */}
                <Image
                  src={isLight ? "/logo2.png" : "/logohorizontal3.png"}
                  alt="Orion MKT"
                  width={135}
                  height={48}
                  loading="eager"
                  className={`relative w-auto object-contain transition-[transform,height] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${
                    scrolled ? "h-10" : "h-12"
                  }`}
                />
              </div>
            </Link>

            {/* Nav pill (desktop) */}
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
              <ul className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-[var(--tint-1)] border border-[var(--hairline)] backdrop-blur-xl">
                {/* Dropdown de áreas */}
                <li
                  className="relative"
                  onMouseEnter={() => setAreasOpen(true)}
                  onMouseLeave={() => setAreasOpen(false)}
                  onBlur={(e) => {
                    // Tabular fuera del desplegable también lo cierra.
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                      setAreasOpen(false)
                    }
                  }}
                >
                  <button
                    onClick={() => setAreasOpen((v) => !v)}
                    aria-expanded={areasOpen}
                    aria-haspopup="true"
                    className={`relative z-10 inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded-md ${
                      areasOpen || !isHome
                        ? "text-foreground"
                        : "text-foreground/65 hover:text-foreground/90"
                    }`}
                  >
                    {t.nav.areas}
                    <ChevronDown
                      className="w-3.5 h-3.5 transition-transform duration-300"
                      style={{ transform: areasOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>

                  <AnimatePresence>
                    {areasOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[22rem]"
                      >
                        <div className="rounded-xl p-2 bg-background/95 backdrop-blur-2xl border border-[var(--hairline)] shadow-2xl shadow-background/60">
                          {areas.map((area) => {
                            const AreaIcon = area.icon
                            const active = pathname === area.href
                            return (
                              <Link
                                key={area.slug}
                                href={area.href}
                                onClick={() => setAreasOpen(false)}
                                className="group flex items-start gap-3 p-3 rounded-xl transition-colors duration-200 hover:bg-[var(--tint-2)]"
                                style={active ? { background: `rgba(${area.accent.rgb},0.10)` } : undefined}
                              >
                                <div
                                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                                  style={{
                                    background: `rgba(${area.accent.rgb},0.13)`,
                                    border: `1px solid rgba(${area.accent.rgb},0.26)`,
                                  }}
                                >
                                  <AreaIcon className="w-4 h-4" style={{ color: area.accent.hex }} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-foreground leading-tight">
                                    {area.name}
                                  </p>
                                  <p className="text-xs text-foreground/65 leading-snug mt-0.5">
                                    {area.teaser}
                                  </p>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>

                {navLinks.map((link) => {
                  const isActive = activeSection === link.id
                  return (
                    <li key={link.href} className="relative">
                      <Link
                        href={link.href}
                        onClick={(e) => handleAnchorClick(e, link.href)}
                        className={`relative z-10 inline-flex items-center px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded-md ${
                          isActive
                            ? "text-foreground"
                            : "text-foreground/65 hover:text-foreground/90"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 -z-10 rounded-md bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/25 shadow-[0_0_18px_rgba(234,88,12,0.15)]"
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                            }}
                          />
                        )}
                        {t.nav[link.key]}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Utilidades + CTA (desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
              <Button
                size="sm"
                className="group bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-md pl-5 pr-4 py-5 shadow-lg shadow-primary/20 btn-shine ml-1"
                asChild
              >
                <Link href="/#contacto" onClick={(e) => handleAnchorClick(e, "/#contacto")}>
                  <span className="relative z-10 flex items-center gap-1.5">
                    {t.nav.cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Button>
            </div>

            {/* Utilidades + toggle (mobile) */}
            <div className="lg:hidden flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>

            <button
              className="lg:hidden relative w-9 h-9 flex items-center justify-center rounded-md bg-[var(--tint-1)] border border-[var(--hairline)] hover:bg-[var(--tint-2)] transition-all duration-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? t.a11y.closeMenu : t.a11y.openMenu}
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <X className="h-5 w-5 text-foreground" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -45, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                  >
                    <Menu className="h-5 w-5 text-foreground" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Línea de gradient sutil debajo cuando hay scroll */}
        {scrolled && (
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />
        )}
      </motion.header>

      {/* Mobile menu fullscreen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.areas}
            className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl pt-20 pb-8 px-6"
          >
            {/* Glow ambiental */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative h-full flex flex-col overflow-y-auto">
              {/* Áreas primero: es la decisión principal */}
              <div className="pt-1 pb-4">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/65 mb-2.5">
                  {t.nav.areas}
                </p>
                <div className="grid gap-1.5">
                  {areas.map((area, index) => {
                    const AreaIcon = area.icon
                    return (
                      <motion.div
                        key={area.slug}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.05 + index * 0.06 }}
                      >
                        <Link
                          href={area.href}
                          onClick={handleLinkClick}
                          className="flex items-center gap-3 p-3 rounded-xl"
                          style={{
                            background: `rgba(${area.accent.rgb},0.08)`,
                            border: `1px solid rgba(${area.accent.rgb},0.20)`,
                          }}
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              background: `rgba(${area.accent.rgb},0.14)`,
                              border: `1px solid rgba(${area.accent.rgb},0.28)`,
                            }}
                          >
                            <AreaIcon className="w-4 h-4" style={{ color: area.accent.hex }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-display font-extrabold text-foreground leading-tight">
                              {area.name}
                            </p>
                            <p className="text-xs text-foreground/65 leading-snug mt-0.5">
                              {area.teaser}
                            </p>
                          </div>
                          <ArrowUpRight
                            className="w-4 h-4 shrink-0"
                            style={{ color: area.accent.hex }}
                          />
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </div>

              <nav className="flex flex-col">
                <ul className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + index * 0.06 }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => handleAnchorClick(e, link.href)}
                        className={`group flex items-center justify-between py-3.5 border-b border-[var(--hairline)] transition-colors duration-300 ${
                          activeSection === link.id
                            ? "text-foreground"
                            : "text-foreground/65 hover:text-foreground"
                        }`}
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="text-xs font-mono font-semibold text-primary/60 tabular-nums">
                            0{index + 1}
                          </span>
                          <span className="text-2xl font-display font-extrabold tracking-tight">
                            {t.nav[link.key]}
                          </span>
                        </span>
                        <ArrowUpRight className="w-5 h-5 text-foreground/65 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-[transform,color] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* CTA + info inferior */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="space-y-4 pt-6"
              >
                <Button
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-md font-semibold py-6 text-base shadow-xl shadow-primary/20"
                  asChild
                >
                  <Link href="/#contacto" onClick={(e) => handleAnchorClick(e, "/#contacto")}>
                    <span className="flex items-center justify-center gap-2">
                      {t.nav.ctaLong}
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </Link>
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-foreground/65">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                  </span>
                  {t.nav.available}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
