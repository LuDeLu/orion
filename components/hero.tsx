"use client"

import { ArrowRight, MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useEffect, useState } from "react"

const showcaseScreens = [
  {
    src: "/previews/I51.png",
    label: "Pagina web",
    client: "Imperio 51",
    url: "Imperio51.com.ar",
  },
  {
    src: "/previews/schepens.png",
    label: "Renovacion de pagina web + SEO",
    client: "Schepens",
    url: "www.schepens.com.ar/",
  },
  {
    src: "/previews/rrseguimientos.png",
    label: "Tracking logístico",
    client: "RR Sintético",
    url: "rrsintetico.com/track",
  },
    {
    src: "/previews/soulsecurity.png",
    label: "Pagina web empresarial",
    client: "Soul Security",
    url: "soulsecurity.com.ar",
  },
]

function BrowserMockup() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % showcaseScreens.length)
    }, 4500)
    return () => clearInterval(interval)
  }, [])

  const current = showcaseScreens[index]

  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto">
      {/* Glow ambiental detrás */}
      <div className="absolute -inset-12 bg-gradient-to-tr from-primary/15 via-accent/10 to-transparent blur-3xl opacity-70 -z-10 pointer-events-none" />

      {/* Card flotante con animación sutil */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative rounded-2xl overflow-hidden border border-foreground/10 bg-background/40 backdrop-blur-md shadow-2xl shadow-primary/10"
        >
          {/* Browser chrome */}
          <div className="relative flex items-center gap-2 px-4 py-3 bg-foreground/[0.04] border-b border-foreground/8">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-background/40 border border-foreground/8 text-[10px] text-foreground/45 font-mono truncate">
              <AnimatePresence mode="wait">
                <motion.span
                  key={current.url}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {current.url}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-primary/70">
                Live
              </span>
            </div>
          </div>

          {/* Screenshot area */}
          <div className="relative aspect-[16/10] bg-foreground/[0.02] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.src}
                src={current.src}
                alt={current.label}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
            </AnimatePresence>

            {/* Gradiente bottom para el label */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/95 via-background/60 to-transparent pointer-events-none" />

            {/* Label inferior */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col"
                >
                  <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-primary/70">
                    Cliente · {current.client}
                  </span>
                  <span className="text-sm font-semibold text-foreground/90">
                    {current.label}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Indicators */}
              <div className="flex gap-1.5">
                {showcaseScreens.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Ver ${showcaseScreens[i].label}`}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      i === index ? "w-6 bg-primary" : "w-1 bg-foreground/25 hover:bg-foreground/45"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tarjeta flotante con stat */}
        <motion.div
          initial={{ opacity: 0, y: 20, x: -10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="absolute -bottom-5 -left-3 md:-left-6 hidden sm:flex items-center gap-3 px-4 py-3 rounded-2xl bg-background/90 backdrop-blur-xl border border-foreground/10 shadow-xl"
        >
          <div className="flex -space-x-2">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-foreground border-2 border-background">
              LB
            </span>
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-[10px] font-bold text-foreground border-2 border-background">
              DC
            </span>
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-[10px] font-bold text-foreground border-2 border-background">
              AO
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest font-semibold text-foreground/40">
              Equipo activo
            </span>
            <span className="text-xs font-semibold text-foreground/85">
              Trato directo con fundadores
            </span>
          </div>
        </motion.div>

        {/* Tarjeta flotante superior derecha */}
        <motion.div
          initial={{ opacity: 0, y: -10, x: 10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="absolute -top-3 -right-2 md:-right-4 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-background/90 backdrop-blur-xl border border-primary/20 shadow-xl"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
          <span className="text-xs font-semibold text-foreground/85">
            Proyectos en producción
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-32 pb-20 px-4 md:px-6 [clip-path:inset(0_0_-100vh_0)]">
      {/* Glow ambiental — extiende suavemente más allá del hero para evitar cortes */}
      <div className="absolute top-1/4 left-[15%] w-[42rem] h-[42rem] bg-primary/[0.07] rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute -bottom-40 right-[15%] w-[44rem] h-[44rem] bg-accent/[0.06] rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute -bottom-60 left-1/2 -translate-x-1/2 w-[60rem] h-[24rem] bg-primary/[0.04] rounded-[50%] blur-[120px] pointer-events-none -z-10" />

      <div className="scan-effect" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-10 items-center">
          {/* Columna texto */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-semibold uppercase tracking-wider mb-7"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              Soluciones a medida para cada cliente
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground mb-6 leading-[1.05] tracking-tight text-balance select-none"
            >
              Estrategias hechas a la medida de{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                tu negocio
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-lg lg:text-xl text-foreground/65 max-w-2xl mx-auto lg:mx-0 mb-9 leading-relaxed text-pretty select-none"
            >
              No vendemos paquetes cerrados. Estudiamos tu rubro, tus objetivos y tu equipo, y diseñamos un plan único de marketing, diseño y desarrollo que se adapta a cómo trabajás vos.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8 select-none"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-foreground px-9 py-7 text-base md:text-lg font-semibold group rounded-full relative overflow-hidden hover-lift w-full sm:w-auto"
                asChild
              >
                <Link href="#contacto">
                  <span className="relative z-10 flex items-center justify-center">
                    Pedir mi propuesta
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 text-foreground hover:bg-primary/60 px-9 py-7 text-base md:text-lg font-semibold rounded-full bg-transparent backdrop-blur-sm hover-lift w-full sm:w-auto"
                asChild
              >
                <Link href="#equipo">Conocer al equipo</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-sm text-foreground/55 select-none"
            >
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" />
                Diagnóstico sin costo
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-foreground/20" />
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" />
                Trato directo con fundadores
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-foreground/20" />
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                Buenos Aires, Argentina
              </span>
            </motion.div>
          </div>

          {/* Columna mockup */}
          <div className="w-full">
            <BrowserMockup />
          </div>
        </div>
      </div>
    </section>
  )
}
