"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function Hero() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4 md:px-6">
      <div className="scan-effect" />
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold text-foreground mb-8 leading-[1.1] tracking-tight text-balance px-2 select-none"
        >
          Agencia de Marketing Digital en Argentina que hace{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            brillar tu marca
          </span>{" "}
          en las redes sociales
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl text-foreground/60 max-w-2xl mx-auto mb-12 leading-relaxed text-pretty px-2 select-none"
        >
          Hacemos crecer tu negocio en el mundo digital con estrategias de marketing personalizadas que generan resultados reales, medibles y sostenibles.
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
                Quiero crecer mi negocio
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
            <Link href="#casos">Ver expertise</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
