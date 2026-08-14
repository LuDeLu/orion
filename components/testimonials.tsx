"use client"

import { Quote, Star } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { useT } from "@/components/i18n-provider"

const authors = ["Diego Alacore", "Diego Rivis", "Lucina Schepens"]

export function Testimonials() {
  const t = useT()
  const testimonials = t.testimonials.items.map((x, i) => ({ ...x, author: authors[i], rating: 5 }))
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
          <span className="inline-block px-4 py-2 rounded-md bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            {t.testimonials.kicker}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground mt-4 mb-6 text-balance leading-[1.08] tracking-tight">
            {t.testimonials.titleStart}{" "}
            <span className="text-primary">{t.testimonials.titleHighlight}</span>
          </h2>
          <p className="text-foreground/65 text-lg md:text-xl text-pretty">
            {t.testimonials.lead}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-background/40 backdrop-blur-sm border border-[var(--hairline)] rounded-xl p-8 hover:border-primary/40 hover:bg-background/60 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 transition-[transform,box-shadow,border-color,background-color] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/15 group-hover:text-primary/40 group-hover:scale-110 transition-[color,transform] duration-[400ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <div className="font-bold text-foreground">{t.author}</div>
                <div className="text-sm text-foreground/65">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
