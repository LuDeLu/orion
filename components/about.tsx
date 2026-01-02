"use client"

import { CheckCircle2, Users, Trophy, TrendingUp, Star, Calendar } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const features = [
  "Equipo multidisciplinario de expertos",
  "Metodologías ágiles y resultados rápidos",
  "Atención personalizada 24/7",
  "Precios accesibles para startups",
  "Reportes claros y transparentes",
  "Más de 5 proyectos exitosos",
]

const stats = [
  { icon: Calendar, value: "3+", label: "Años de experiencia" },
  { icon: Users, value: "10+", label: "Clientes activos" },
  { icon: Trophy, value: "100%", label: "Satisfacción" },
  { icon: TrendingUp, value: "3x", label: "ROI Promedio" },
]

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section ref={ref} id="nosotros" className="relative py-24 px-4 overflow-hidden" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto lg:mx-0"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e0642f]/10 to-[#f7d785]/10 border border-[#e0642f]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm font-bold text-[#e0642f]">Nosotros</span>
            </div>
            <h2
              id="about-heading"
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4 mb-6 text-balance"
            >
              Agencia de Marketing Digital especializada en{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                PyMEs y Startups
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed text-pretty">
              Orion Marketing es una agencia de marketing digital con base en Buenos Aires, Argentina, que trabaja con PyMEs y
              startups de todo el país. Entendemos que cada negocio tiene sueños ambiciosos, por eso combinamos
              estrategias de branding, social media marketing, performance ads y diseño web con resultados medibles y
              ROI garantizado.
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed text-pretty">
              Nuestro equipo de expertos en community management, publicidad digital (Facebook Ads, Instagram Ads,
              Google Ads), desarrollo web y estrategia de contenidos trabaja para que tu marca destaque en el mundo
              digital. Modalidad flexible, presupuestos accesibles y presencia en toda Argentina.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="glass-card rounded-xl p-4 text-center hover-lift"
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl glass-card p-8 lg:p-12 overflow-hidden hover-lift">
              <div className="absolute inset-0 opacity-30">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Stars */}
                  {[
                    { cx: 50, cy: 50, r: 3 },
                    { cx: 150, cy: 40, r: 2 },
                    { cx: 100, cy: 100, r: 4 },
                    { cx: 40, cy: 150, r: 2 },
                    { cx: 160, cy: 140, r: 3 },
                    { cx: 80, cy: 180, r: 2 },
                    { cx: 120, cy: 60, r: 2.5 },
                    { cx: 70, cy: 120, r: 2 },
                  ].map((star, i) => (
                    <motion.circle
                      key={i}
                      cx={star.cx}
                      cy={star.cy}
                      r={star.r}
                      fill={i % 2 === 0 ? "#f7d785" : "#e0642f"}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                    />
                  ))}
                  {/* Connection lines */}
                  {[
                    { x1: 50, y1: 50, x2: 100, y2: 100 },
                    { x1: 150, y1: 40, x2: 100, y2: 100 },
                    { x1: 100, y1: 100, x2: 40, y2: 150 },
                    { x1: 100, y1: 100, x2: 160, y2: 140 },
                    { x1: 120, y1: 60, x2: 100, y2: 100 },
                    { x1: 100, y1: 100, x2: 70, y2: 120 },
                  ].map((line, i) => (
                    <motion.line
                      key={i}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke="#f7d785"
                      strokeWidth="0.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                      transition={{ duration: 0.8, delay: 1.5 + i * 0.1 }}
                    />
                  ))}
                </svg>
              </div>

              <div className="relative z-10 h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex flex-col items-center gap-4"
                >
                  <img src="/logo.png" alt="Orion MKT" className="h-32 w-32 object-contain" />
                  <p className="text-muted-foreground text-lg">Transformando negocios digitalmente</p>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="absolute -top-4 -right-4 bg-primary text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-primary/20"
            >
              <Star className="w-4 h-4 inline mr-1" />
              Modalidad de trabajo flexible
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={isInView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="absolute -bottom-4 -left-4 bg-secondary text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg shadow-secondary/20"
            >
              <Star className="w-4 h-4 inline mr-1" />
              Toda Argentina
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
