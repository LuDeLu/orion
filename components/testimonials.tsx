"use client"

import { Quote, Star } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

const testimonials = [
  {
    quote:
      "Excelente y rápido trabajo de los chicos, bastante cómodo todo. No hay nada de lo cual quejarse.",
    author: "Diego Alacore",
    role: "Dueño · Soul Security",
    rating: 5,
  },
  {
    quote:
      "Súper conforme con todo el servicio. La verdad me potenció mucho el crecimiento. Recomendados.",
    author: "Diego Rivis",
    role: "Dueño · RR Sintético",
    rating: 5,
  },
  {
    quote:
      "Orion nos ayudó a ordenar nuestro mensaje y a enfocarnos en los clientes correctos. Desde entonces, la calidad de nuestros leads mejoró notablemente.",
    author: "Lucina Schepens",
    role: "Brand Manager · Schepens",
    rating: 5,
  },
]

export function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="relative py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Testimonios
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4 mb-6 text-balance">
            Lo que dicen quienes ya{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              trabajaron con nosotros
            </span>
          </h2>
          <p className="text-foreground/60 text-lg md:text-xl text-pretty">
            Cada cliente recibe una solución pensada para su realidad. Esto es lo que cuentan.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative bg-background/40 backdrop-blur-sm border border-foreground/10 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/15" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <div className="font-bold text-foreground">{t.author}</div>
                <div className="text-sm text-foreground/55">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
