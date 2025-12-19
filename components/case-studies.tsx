"use client"

import { ArrowRight, TrendingUp, Users, Target } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const cases = [
  {
    industry: "E-commerce",
    title: "Crecimiento en ventas del 250% con Performance Ads",
    challenge:
      "Una tienda online local buscaba aumentar sus ventas y presencia digital en un mercado competitivo de e-commerce en Argentina.",
    solution:
      "Implementamos una estrategia integral de pauta digital con Facebook Ads e Instagram Ads, optimización de conversión en el sitio web y gestión profesional de redes sociales.",
    results: [
      { icon: TrendingUp, metric: "250%", label: "Aumento en ventas" },
      { icon: Users, metric: "5x", label: "Más tráfico web" },
      { icon: Target, metric: "180%", label: "ROI en pauta" },
    ],
  },
  {
    industry: "Servicios",
    title: "De startup a referente del sector con Marketing Digital",
    challenge:
      "Una startup de servicios profesionales necesitaba construir su marca desde cero y generar confianza en el mercado argentino.",
    solution:
      "Desarrollamos identidad de marca completa con branding profesional, estrategia de contenido en LinkedIn y campaña de awareness con Google Ads.",
    results: [
      { icon: Users, metric: "3,000+", label: "Nuevos seguidores" },
      { icon: Target, metric: "85%", label: "Engagement rate" },
      { icon: TrendingUp, metric: "200%", label: "Leads calificados" },
    ],
  },
]

export function CaseStudies() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} id="casos" className="relative py-24 px-4" aria-labelledby="cases-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Casos de Éxito
          </span>
          <h2
            id="cases-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4 mb-6 text-balance"
          >
            Resultados de Marketing Digital que{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              hablan por sí solos
            </span>
          </h2>
          <p className="text-foreground/60 text-xl text-pretty">
            Conocé cómo ayudamos a PyMEs y Startups como la tuya a crecer en el mundo digital con estrategias de
            marketing efectivas y medibles
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {cases.map((caseStudy, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="glass-card rounded-2xl p-8 hover-lift"
            >
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                {caseStudy.industry}
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">{caseStudy.title}</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-foreground/80 mb-2">El Desafío</h4>
                  <p className="text-foreground/60 text-sm">{caseStudy.challenge}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground/80 mb-2">La Solución</h4>
                  <p className="text-foreground/60 text-sm">{caseStudy.solution}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                {caseStudy.results.map((result, idx) => (
                  <div key={idx} className="text-center">
                    <result.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                    <div className="text-xl font-bold text-foreground">{result.metric}</div>
                    <div className="text-xs text-foreground/60 mt-1">{result.label}</div>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-foreground px-8 py-6 text-base font-semibold group rounded-full hover-lift"
            asChild
          >
            <Link href="#contacto">
              <span className="flex items-center justify-center">
                Quiero resultados como estos
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
