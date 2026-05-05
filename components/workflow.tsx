"use client"

import { Search, ClipboardList, Rocket, TrendingUp } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

const workflowSteps = [
  {
    number: "01",
    icon: Search,
    title: "Descubrimiento y Análisis",
    description:
      "Nos sentamos con vos, escuchamos tu idea y entendemos a quién le querés vender. Antes de arrancar con cualquier estrategia, necesitamos tener claro el panorama completo.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Estrategia de Marketing Digital",
    description:
      "Antes de hacer cualquier cosa, entendemos el terreno: competencia, audiencia, oportunidades. De ahí sale el plan, con objetivos claros y forma de medir si está funcionando.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Ejecución y Optimización",
    description:
      "Ejecutamos todo: campañas en Meta, contenido, diseño web. Y mientras corre, estamos encima ajustando lo que haga falta para que los resultados mejoren cada día.",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Medición, Análisis y Escalado",
    description:
      "Reportes claros y concretos. Revisamos las métricas, tomamos decisiones y optimizamos todo el tiempo para que tu negocio siga creciendo.",
  },
]

export function Workflow() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-20 px-4 overflow-hidden" aria-labelledby="workflow-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Cómo Trabajamos
          </span>
          <h2
            id="workflow-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4 mb-6 text-balance"
          >
            Del diagnóstico a los resultados,{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              sin vueltas.
            </span>
          </h2>
          <p className="text-foreground/60 text-xl text-pretty">
            Cada cliente arranca con un diagnóstico real y termina con un plan hecho a su medida, con foco en resultados concretos y crecimiento sostenible.
          </p>
        </motion.div>

        {/* Workflow Steps - Desktop */}
        <div className="hidden lg:block relative mt-20">
          {/* Connection Lines */}
          <div className="absolute top-[80px] left-0 right-0 flex justify-between px-[12%]">
            {[0, 1, 2].map((index) => (
              <svg
                key={index}
                className="w-[22%]"
                height="4"
                viewBox="0 0 200 4"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="0"
                  y1="2"
                  x2="200"
                  y2="2"
                  stroke="url(#gradient)"
                  strokeWidth="2"
                  className={isVisible ? "flow-connector" : "opacity-0"}
                  style={{ animationDelay: `${index * 0.3}s` }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="0">
                    <stop offset="0%" stopColor="rgba(224, 100, 47, 0.3)" />
                    <stop offset="50%" stopColor="rgba(247, 215, 133, 0.5)" />
                    <stop offset="100%" stopColor="rgba(224, 100, 47, 0.3)" />
                  </linearGradient>
                </defs>
              </svg>
            ))}
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
              <div
                key={index}
                className={`relative group ${isVisible ? "animate-fade-in-scale" : "opacity-0"}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="glass-card rounded-2xl p-8 hover-lift h-full flex flex-col">
                  {/* Icon Circle */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center mb-6 mx-auto group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Step Number */}
                  <div className="text-6xl font-display font-bold text-foreground/10 absolute top-4 right-4 group-hover:text-foreground/20 transition-colors">
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 text-center flex-1 flex flex-col">
                    <h3 className="text-xl font-display font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-foreground/70 leading-relaxed text-sm flex-1">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Steps - Mobile/Tablet */}
        <div className="lg:hidden mt-12 space-y-6">
          {workflowSteps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < workflowSteps.length - 1 && (
                <div className="absolute left-8 top-[80px] bottom-[-24px] bg-gradient-to-b from-primary/30 via-accent/30 to-primary/30 mx-6 px-0 w-0.5 h-auto my-1 mb-1 mt-7 py-16" />
              )}

              <div
                className={`glass-card rounded-2xl p-6 hover-lift ${isVisible ? "animate-slide-in-left" : "opacity-0"}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex gap-4">
                  {/* Icon Circle */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-display font-bold text-foreground">{step.title}</h3>
                      <span className="text-3xl font-display font-bold text-foreground/10">{step.number}</span>
                    </div>
                    <p className="text-foreground/70 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
