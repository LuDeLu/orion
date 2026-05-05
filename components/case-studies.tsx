"use client"

import { ArrowRight, TrendingUp, Target, Search, Database, LayoutDashboard, Workflow } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const cases = [
  {
    client: "Schepens",
    industry: "SEO & Marketing Digital",
    title: "De un sitio sin alcance a referente digital del rubro",
    challenge:
      "Schepens tenía un sitio web sin conversiones, sin alcance orgánico y con un diseño que no transmitía la calidad real de su producto. Cada visita se perdía sin generar contacto y la marca era prácticamente invisible en buscadores.",
    solution:
      "Rediseñamos el sitio completo con foco en conversión, implementamos una estrategia de SEO técnico y de contenidos, y reforzamos la presencia digital con una propuesta visual mucho más atractiva y alineada a la marca.",
    results: [
      { icon: Search, metric: "SEO+", label: "Posicionamiento orgánico" },
      { icon: TrendingUp, metric: "Visitas", label: "Crecimiento sostenido" },
      { icon: Target, metric: "Conversiones", label: "Mejora real en leads" },
    ],
  },
  {
    client: "ADN Developers",
    industry: "Desarrollo a medida",
    title: "De información dispersa a un CRM que cierra ventas",
    challenge:
      "ADN era una inmobiliaria con la información de proyectos y unidades dispersa entre planillas, mails y carpetas. Difundir datos actualizados a clientes era lento y confuso, y eso frenaba el cierre de operaciones y el crecimiento del negocio.",
    solution:
      "Diseñamos y desarrollamos un CRM interno a medida que centraliza absolutamente todo: proyectos, departamentos uno a uno, estados, clientes y seguimiento de ventas. Una sola fuente de verdad para todo el equipo.",
    results: [
      { icon: Database, metric: "100%", label: "Información centralizada" },
      { icon: LayoutDashboard, metric: "Unidad x unidad", label: "Trazabilidad total" },
      { icon: Workflow, metric: "Más ventas", label: "Cierre más ágil" },
    ],
  },
]

export function CaseStudies() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} id="casos" className="relative py-28 px-4" aria-labelledby="cases-heading">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="h-px w-8 bg-primary/40" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary/80">
              Casos de éxito
            </span>
            <span className="h-px w-8 bg-primary/40" />
          </div>
          <h2
            id="cases-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 text-balance leading-[1.05]"
          >
            Soluciones reales para{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              problemas concretos
            </span>
          </h2>
          <p className="text-foreground/55 text-lg md:text-xl text-pretty leading-relaxed">
            Cada proyecto parte de un desafío distinto. Estos son dos ejemplos de cómo lo resolvimos.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {cases.map((caseStudy, index) => (
            <motion.article
              key={caseStudy.client}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.01] border border-foreground/10 hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
            >
              {/* Glow accent */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Top decorative line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              {/* Watermark number */}
              <span
                aria-hidden
                className="absolute top-4 right-6 text-[110px] md:text-[140px] font-display font-bold leading-none text-foreground/[0.025] select-none pointer-events-none"
              >
                0{index + 1}
              </span>

              <div className="relative p-8 md:p-10">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/70">
                      Caso 0{index + 1}
                    </span>
                    <span className="h-px flex-1 bg-foreground/10" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {caseStudy.industry}
                    </span>
                  </div>

                  <p className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/40 mb-2">
                    Cliente
                  </p>
                  <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-5 leading-tight">
                    {caseStudy.client}
                  </h3>

                  <p className="text-lg md:text-xl text-foreground/75 font-display leading-snug text-balance">
                    {caseStudy.title}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent mb-8" />

                {/* Desafío + Solución */}
                <div className="space-y-6 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="w-1 h-4 rounded-full bg-foreground/30" />
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/45">
                        El desafío
                      </h4>
                    </div>
                    <p className="text-foreground/65 leading-relaxed pl-3">{caseStudy.challenge}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="w-1 h-4 rounded-full bg-primary" />
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/80">
                        Nuestra solución
                      </h4>
                    </div>
                    <p className="text-foreground/75 leading-relaxed pl-3">{caseStudy.solution}</p>
                  </div>
                </div>

                {/* Resultados */}
                <div className="pt-6 border-t border-foreground/8">
                  <div className="flex items-center gap-2 mb-4">
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary/80">
                      Resultados
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {caseStudy.results.map((result, i) => (
                      <div
                        key={i}
                        className="relative bg-foreground/[0.03] hover:bg-primary/5 border border-foreground/8 hover:border-primary/25 rounded-xl p-3 md:p-4 transition-all duration-300 overflow-hidden group/metric"
                      >
                        <result.icon className="w-4 h-4 text-primary/70 mb-2 transition-transform duration-300 group-hover/metric:scale-110" />
                        <div className="text-sm md:text-base font-bold text-foreground leading-tight mb-1 break-words">
                          {result.metric}
                        </div>
                        <div className="text-[10px] md:text-xs text-foreground/45 leading-tight">
                          {result.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-foreground/50 text-sm mb-5">
            ¿Querés mejores resultados para tu negocio?
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-foreground px-8 py-6 text-base font-semibold group rounded-full hover-lift"
            asChild
          >
            <Link href="#contacto">
              <span className="flex items-center justify-center">
                Sí, quiero mi propuesta
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
