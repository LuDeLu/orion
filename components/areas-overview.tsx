"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useAreas } from "@/hooks/use-areas"
import { useT } from "@/components/i18n-provider"
import { OwnerIdentity } from "@/components/owner-signal"
import { fill } from "@/lib/i18n"

export function AreasOverview() {
  const t = useT()
  const areas = useAreas()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.05 })

  const totalFamilies = areas.reduce((acc, a) => acc + a.families.length, 0)
  const totalItems = areas.reduce(
    (acc, a) => acc + a.families.reduce((s, f) => s + f.items.length, 0),
    0
  )

  return (
    <section
      ref={ref}
      id="servicios"
      className="relative py-24 px-4 md:px-6 scroll-mt-20"
      aria-labelledby="areas-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-md bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            {t.areasSection.kicker}
          </span>
          <h2
            id="areas-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground mt-4 mb-6 text-balance leading-[1.06]"
          >
            {t.areasSection.titleStart}{" "}
            <span className="text-primary">
              {t.areasSection.titleHighlight}
            </span>
          </h2>
          <p className="text-foreground/65 text-lg md:text-xl text-pretty leading-relaxed">
            {fill(t.areasSection.lead, { families: totalFamilies, items: Math.floor(totalItems / 10) * 10 })}
          </p>
        </motion.div>

        {/* Las tres áreas */}
        <div className="grid lg:grid-cols-3 gap-5">
          {areas.map((area, i) => {
            const Icon = area.icon
            const rgb = area.accent.rgb
            const itemCount = area.families.reduce((s, f) => s + f.items.length, 0)

            return (
              <motion.div
                key={area.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.12 }}
              >
                <Link
                  href={area.href}
                  className="group relative flex h-full flex-col overflow-hidden rounded-xl p-7 md:p-8 transition-all duration-[450ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2"
                  style={{
                    background: `linear-gradient(165deg, rgba(${rgb},0.09) 0%, var(--tint-1) 55%)`,
                    border: `1px solid rgba(${rgb},0.18)`,
                  }}
                >
                  {/* Glow al hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `rgba(${rgb},0.16)` }}
                  />

                  {/* Cabecera */}
                  <div className="relative flex items-center gap-3 mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        background: `rgba(${rgb},0.14)`,
                        border: `1px solid rgba(${rgb},0.3)`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: area.accent.hex }} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xl font-display font-extrabold text-foreground leading-tight">
                        {area.name}
                      </h3>
                      <span className="text-xs uppercase tracking-[0.22em] text-foreground/65">
                        {area.star}
                      </span>
                    </div>
                  </div>

                  {/* Quién la maneja, antes del catálogo: primero el
                     interlocutor, después la lista de servicios. */}
                  <div
                    className="relative rounded-xl p-4 mb-5"
                    style={{
                      background: `rgba(${rgb},0.06)`,
                      border: `1px solid rgba(${rgb},0.16)`,
                    }}
                  >
                    <OwnerIdentity area={area} showTitle />
                  </div>

                  <p className="relative text-sm text-foreground/65 leading-relaxed mb-6">
                    {area.teaser}
                  </p>

                  {/* Familias de servicios */}
                  <ul className="relative space-y-2 mb-6">
                    {area.families.map((family) => (
                      <li
                        key={family.id}
                        className="flex items-start gap-2.5 text-sm text-foreground/70"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0 mt-[0.45rem]"
                          style={{ background: area.accent.hex }}
                        />
                        <span className="leading-snug">{family.title}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Pie */}
                  <div
                    className="relative mt-auto pt-5 flex items-center justify-between gap-3"
                    style={{ borderTop: `1px solid rgba(${rgb},0.15)` }}
                  >
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5"
                      style={{ color: area.accent.hex }}
                    >
                      {t.hero.viewArea}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                    <span className="text-xs text-foreground/65 tabular shrink-0">
                      {itemCount} {t.areasSection.servicesLabel}
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Alcance sin techo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 rounded-xl p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-5 justify-between"
          style={{
            background: "var(--tint-1)",
            border: "1px solid var(--hairline)",
          }}
        >
          <div className="max-w-2xl">
            <h3 className="font-display font-extrabold text-foreground mb-1.5">
              {t.areasSection.noFitTitle}
            </h3>
            <p className="text-sm text-foreground/65 leading-relaxed">
              {t.areasSection.noFitBody}
            </p>
          </div>
          <Link
            href="#contacto"
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-semibold bg-primary/12 border border-primary/30 text-primary transition-all duration-300 hover:gap-3 hover:bg-primary/20"
          >
            {t.areasSection.noFitCta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
