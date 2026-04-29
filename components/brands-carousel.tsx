"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const brands = [
  { name: "RR Sintetico", logo: "/logos/Rrsintetico.png", url: "https://rrsintetico.com/" },
  { name: "Soul Security", logo: "/logos/Soulsecurity.png", url: "https://soulsecurity.com.ar/" },
  { name: "Monaco Cortinas", logo: "/logos/Monacocortinas.png", url: "https://www.monacocortinas.com.ar/" },
  { name: "Schepens", logo: "/logos/scheppens.png", url: "https://www.schepens.com.ar/" },
  { name: "Vittal", logo: "/logos/vittal.png", url: "https://www.vittal.com.ar/" },
  { name: "PlotChain", logo: "/logos/Plotchain.png", url: "http://plotchain.io/" },
]

export function BrandsCarousel() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="relative pt-2 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-10"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-foreground/15" />
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-foreground/45 whitespace-nowrap">
            Empresas que confían en nosotros
          </p>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-foreground/15" />
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {brands.map((brand, index) => (
            <motion.a
              key={brand.name}
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative aspect-[5/3] flex items-center justify-center bg-background/30 backdrop-blur-sm border border-foreground/10 rounded-2xl px-6 py-5 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 hover:border-primary/40 hover:bg-background/50 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              aria-label={`Sitio web de ${brand.name}`}
              title={brand.name}
            >
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                loading="lazy"
                className="max-h-12 md:max-h-14 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
