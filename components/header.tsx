"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { href: "#nosotros", label: "Nosotros", id: "nosotros" },
  { href: "#equipo", label: "Equipo", id: "equipo" },
  { href: "#servicios", label: "Servicios", id: "servicios" },
  { href: "#casos", label: "Casos", id: "casos" },
  { href: "#contacto", label: "Contacto", id: "contacto" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("")

  // Detectar scroll para modo compacto
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Detectar sección activa con IntersectionObserver
  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

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

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Bloquear scroll cuando menú móvil abierto
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleLinkClick = () => setIsOpen(false)

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/75 backdrop-blur-2xl border-b border-foreground/8 shadow-lg shadow-background/40"
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
              aria-label="Orion Marketing - Inicio"
            >
              <div className="relative">
                <span className="absolute inset-0 bg-primary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                <img
                  src="/logohorizontal3.png"
                  alt="Orion MKT"
                  className={`relative w-auto object-contain transition-all duration-500 group-hover:scale-105 ${
                    scrolled ? "h-10" : "h-12"
                  }`}
                />
              </div>
            </Link>

            {/* Nav pill (desktop) */}
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
              <ul className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-foreground/[0.04] border border-foreground/8 backdrop-blur-xl">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id
                  return (
                    <li key={link.href} className="relative">
                      <Link
                        href={link.href}
                        className={`relative z-10 inline-flex items-center px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded-full ${
                          isActive
                            ? "text-foreground"
                            : "text-foreground/55 hover:text-foreground/90"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/25 shadow-[0_0_18px_rgba(234,88,12,0.15)]"
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                            }}
                          />
                        )}
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* CTA + status (desktop) */}
            <div className="hidden lg:flex items-center gap-4">
              <Button
                size="sm"
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:opacity-95 text-foreground font-semibold rounded-full pl-5 pr-4 py-5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-300"
                asChild
              >
                <Link href="#contacto">
                  <span className="flex items-center gap-1.5">
                    Pedir propuesta
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </Button>
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-foreground/[0.04] border border-foreground/8 hover:bg-foreground/[0.08] transition-all duration-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
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
            className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-2xl pt-24 pb-10 px-6"
          >
            {/* Glow ambiental */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative h-full flex flex-col">
              <nav className="flex-1 flex flex-col justify-center">
                <ul className="space-y-2">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 + index * 0.06 }}
                    >
                      <Link
                        href={link.href}
                        onClick={handleLinkClick}
                        className={`group flex items-center justify-between py-4 border-b border-foreground/8 transition-colors duration-300 ${
                          activeSection === link.id
                            ? "text-foreground"
                            : "text-foreground/65 hover:text-foreground"
                        }`}
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="text-[11px] font-mono font-semibold text-primary/60 tabular-nums">
                            0{index + 1}
                          </span>
                          <span className="text-3xl font-display font-bold tracking-tight">
                            {link.label}
                          </span>
                        </span>
                        <ArrowUpRight className="w-5 h-5 text-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
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
                  className="w-full bg-gradient-to-r from-primary to-accent text-foreground rounded-full font-semibold py-6 text-base shadow-xl shadow-primary/20"
                  asChild
                  onClick={handleLinkClick}
                >
                  <Link href="#contacto">
                    <span className="flex items-center justify-center gap-2">
                      Pedir mi propuesta
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </Link>
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-foreground/50">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                  </span>
                  Disponible para nuevos proyectos
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
