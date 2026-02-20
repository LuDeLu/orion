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
            <div className="relative rounded-3xl glass-card p-10 lg:p-16 overflow-hidden hover-lift">
              <div className="absolute inset-0 opacity-50">
                {/* Orion constellation — pixel-perfect from wikipedia.org/wiki/File:ConstellationOrion.svg (200×200 viewBox) */}
                <svg viewBox="55 25 100 130" className="w-full h-full">
                  {/* Lines drawn first so stars sit on top */}
                  {(
                    [
                      // x1,         y1,          x2,          y2
                      [86.864,  84.589,  104.187,  75.806], // Betelgeuse → Meissa area
                      [104.187,  75.806,  112.899,  88.281], // → Bellatrix
                      [112.899,  88.281,  106.977, 109.422], // Bellatrix → Alnilam
                      [106.977, 109.422,  122.087, 139.035], // Alnilam → Rigel
                      [122.087, 139.035,   93.287, 144.136], // Rigel → Saiph
                      [ 93.287, 144.136,   99.338, 117.247], // Saiph → belt (Alnitak)
                      [ 99.338, 117.247,   86.864,  84.589], // Alnitak → Betelgeuse
                      // Left arm chain
                      [ 86.864,  84.589,   80.719,  76.733],
                      [ 80.719,  76.733,   72.873,  60.744],
                      [ 72.873,  60.744,   76.626,  58.846],
                      [ 76.626,  58.846,   80.191,  40.266],
                      [ 72.873,  60.744,   71.016,  43.516], // branch
                      // Right arm chain
                      [112.899,  88.281,  143.391,  85.843],
                      [138.756,  74.734,  142.552,  79.054],
                      [142.552,  79.054,  143.391,  85.843],
                      [143.391,  85.843,  142.307,  90.619],
                      [142.307,  90.619,  139.821, 101.753],
                      [139.821, 101.753,  136.110, 104.336],
                    ] as [number, number, number, number][]
                  ).map(([x1, y1, x2, y2], i) => (
                    <motion.line
                      key={i}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="#f7d785"
                      strokeWidth="0.7"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={isInView ? { pathLength: 1, opacity: 0.75 } : {}}
                      transition={{ duration: 0.7, delay: 1.2 + i * 0.07 }}
                    />
                  ))}
                  {/* Stars — exact cx/cy/r from the Wikimedia SVG, recoloured to brand palette */}
                  {(
                    [
                      // [id,              cx,       cy,       r,     fill]
                      ["betelgeuse",   86.864,  84.589,  4.440, "#f7d785"], // α Ori — left shoulder
                      ["bellatrix",   104.187,  75.806,  2.088, "#f7d785"], // γ Ori — right shoulder (head side)
                      ["mintaka",     112.899,  88.281,  3.488, "#f7d785"], // δ Ori — belt right
                      ["alnilam",     106.977, 109.422,  3.000, "#f7d785"], // ε Ori — belt centre
                      ["rigel",       122.087, 139.035,  4.656, "#e0642f"], // β Ori — right foot (brightest)
                      ["saiph",        93.287, 144.136,  3.144, "#e0642f"], // κ Ori — left foot
                      ["alnitak",      99.338, 117.247,  3.408, "#f7d785"], // ζ Ori — belt left
                      // Left arm
                      ["pi5ori",       80.719,  76.733,  1.504, "#f7d785"],
                      ["pi3ori",       72.873,  60.744,  1.240, "#f7d785"],
                      ["pi4ori",       76.626,  58.846,  1.264, "#f7d785"],
                      ["pi2ori",       80.191,  40.266,  1.088, "#f7d785"],
                      ["pi1ori",       71.016,  43.516,  0.640, "#f7d785"],
                      // Right arm
                      ["chi2ori",     143.391,  85.843,  2.248, "#f7d785"],
                      ["chi1ori",     138.756,  74.734,  1.088, "#f7d785"],
                      ["mu_ori",      142.552,  79.054,  1.320, "#f7d785"],
                      ["nu_ori",      142.307,  90.619,  1.856, "#f7d785"],
                      ["xi_ori",      139.821, 101.753,  1.832, "#f7d785"],
                      ["omicron_ori", 136.110, 104.336,  1.224, "#f7d785"],
                    ] as [string, number, number, number, string][]
                  ).map(([id, cx, cy, r, fill], i) => (
                    <motion.circle
                      key={id as string}
                      cx={cx as number} cy={cy as number} r={r as number}
                      fill={fill as string}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.8 + i * 0.06 }}
                      style={{ transformOrigin: `${cx}px ${cy}px` }}
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
