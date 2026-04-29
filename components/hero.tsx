"use client"

import { ArrowRight, Sparkles, MapPin, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 md:px-6">
      <div className="scan-effect" />
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold uppercase tracking-wider mb-8"
        >
          Soluciones a medida para cada cliente
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-foreground mb-8 leading-[1.05] tracking-tight text-balance px-2 select-none"
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
          className="text-lg md:text-xl lg:text-2xl text-foreground/65 max-w-3xl mx-auto mb-12 leading-relaxed text-pretty px-2 select-none"
        >
          No vendemos paquetes cerrados. Estudiamos tu rubro, tus objetivos y tu equipo, y
          diseñamos un plan único de marketing, diseño y desarrollo que se adapta a cómo trabajás vos.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 px-4 select-none"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-foreground px-10 py-7 text-lg font-semibold group rounded-full relative overflow-hidden hover-lift w-full sm:w-auto"
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
            className="border-primary/30 text-foreground hover:bg-primary/60 px-10 py-7 text-lg font-semibold rounded-full bg-transparent backdrop-blur-sm hover-lift w-full sm:w-auto"
            asChild
          >
            <Link href="#equipo">Conocer al equipo</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-foreground/55 select-none"
        >
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-4 h-4 text-primary" />
            Diagnóstico sin costo
          </span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-foreground/20" />
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-4 h-4 text-primary" />
            Trato directo con los fundadores
          </span>
          <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-foreground/20" />
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-primary" />
            Buenos Aires, Argentina
          </span>
        </motion.div>
      </div>
    </section>
  )
}
