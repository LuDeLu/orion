"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4">
      <div className="scan-effect" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-8 futuristic-glow">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-foreground/80 font-medium">Marketing Digital para PyMEs & Startups</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-8 leading-[1.1] tracking-tight">
          Hacemos que tu marca
          <br />
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent relative">
            brille
            <span className="absolute inset-0 blur-2xl opacity-50 bg-primary" />
          </span>{" "}
          tan fuerte como una
          <br />

          constelacion en las          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent relative">
            redes
            <span className="absolute inset-0 blur-3xl opacity-40 bg-gradient-to-r from-secondary to-primary" />
          </span>{" "} 
        </h1>

        <p className="text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto mb-12 leading-relaxed">
          Estrategias que conectan, diseños que impactan, resultados que hablan por sí solos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg font-semibold group rounded-full relative overflow-hidden futuristic-glow"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center">
              Iniciar Proyecto
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-foreground/20 text-foreground hover:bg-foreground/5 px-10 py-7 text-lg font-semibold rounded-full bg-transparent backdrop-blur-sm"
          >
            Ver Portafolio
          </Button>
        </div>
      </div>
    </section>
  )
}
