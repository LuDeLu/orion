"use client"

import { ArrowRight, TrendingUp, Users, Target } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const cases = [
  {
    industry: "E-commerce",
    title: "Más visibilidad y ventas para una tienda online local",
    challenge:
      "Una tienda online local necesitaba aumentar su presencia digital y atraer clientes nuevos en un mercado cada vez más competitivo.",
    solution:
      "Estructuramos campañas de Meta Ads con segmentación precisa, ajustamos el perfil de Instagram y mejoramos la comunicación visual de los productos.",
    results: [
      { icon: TrendingUp, metric: "+40%", label: "Ventas en 3 meses" },
      { icon: Users, metric: "×2", label: "Alcance orgánico" },
      { icon: Target, metric: "Menor CPL", label: "Costo por cliente" },
    ],
  },
  {
    industry: "Servicios",
    title: "Construcción de marca desde cero para una startup",
    challenge:
      "Una startup de servicios profesionales no tenía presencia digital definida ni identidad de marca que le generara confianza frente a sus clientes potenciales.",
    solution:
      "Desarrollamos su identidad visual, creamos sus perfiles en redes sociales y lanzamos una estrategia de contenido enfocada en posicionarse en su rubro.",
    results: [
      { icon: Users, metric: "+500", label: "Seguidores en 60 días" },
      { icon: Target, metric: "Marca definida", label: "Identidad cohesiva" },
      { icon: TrendingUp, metric: "Consultas", label: "Primeros leads reales" },
    ],
  },
  {
    industry: "Diseño & Branding",
    title: "Renovación visual para conectar mejor con la audiencia",
    challenge:
      "Una marca con tiempo en el mercado sentía que su imagen no la representaba y que le costaba diferenciarse visualmente de la competencia.",
    solution:
      "Rediseñamos su identidad visual y adaptamos el lenguaje gráfico a sus redes sociales, logrando una comunicación más coherente y atractiva.",
    results: [
      { icon: Users, metric: "Engagement", label: "Mejor conexión con el público" },
      { icon: Target, metric: "Imagen clara", label: "Diferenciación lograda" },
      { icon: TrendingUp, metric: "Consistencia", label: "Comunicación unificada" },
    ],
  },
]

export function CaseStudies() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} id="casos" className="relative py-16 px-4" aria-labelledby="cases-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Expertise
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
              className={`glass-card rounded-2xl p-8 hover-lift ${cases.length % 2 === 1 && index === cases.length - 1 ? 'md:col-span-2 md:w-1/2 md:mx-auto' : ''
                }`}
            >
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                {caseStudy.industry}
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">{caseStudy.title}</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-foreground/80 mb-2">El Desafío</h4>
                  <p className="text-foreground/60 text-m">{caseStudy.challenge}</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground/80 mb-2">La Solución</h4>
                  <p className="text-foreground/60 text-m">{caseStudy.solution}</p>
                </div>
              </div>

              <div className="border-t border-border/40 pt-5">
                <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-4">Resultados</p>
                <div className="grid grid-cols-3 gap-3">
                  {caseStudy.results.map((result, i) => (
                    <div key={i} className="bg-primary/5 border border-primary/15 rounded-xl p-3 text-center">
                      <result.icon className="w-4 h-4 text-primary mx-auto mb-1.5" />
                      <div className="text-xl font-bold text-foreground">{result.metric}</div>
                      <div className="text-xs text-foreground/50 leading-tight mt-0.5">{result.label}</div>
                    </div>
                  ))}
                </div>
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
