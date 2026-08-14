"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { useAreas } from "@/hooks/use-areas"
import { useT } from "@/components/i18n-provider"


export function About() {
  const t = useT()
  const areas = useAreas()
  const features = t.about.features
  const factSheet = t.about.sheet
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section
      ref={ref}
      id="nosotros"
      className="relative py-24 px-4 md:px-6 scroll-mt-24"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-start">
          {/* ── Columna editorial ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-md bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-6">
              {t.about.kicker}
            </span>

            <h2
              id="about-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-foreground mb-7 text-balance leading-[1.08] tracking-tight"
            >
              {t.about.titleStart}{" "}
              <span className="text-primary">{t.about.titleHighlight}</span>
            </h2>

            <div className="space-y-5 mb-9">
              <p className="text-foreground/65 text-lg leading-relaxed text-pretty">
                {t.about.p1}
              </p>
              <p className="text-foreground/65 text-lg leading-relaxed text-pretty">
                {t.about.p2}
              </p>
            </div>

            {/* Diferenciales, en lista con reglas */}
            <ul className="border-t border-[var(--hairline)]">
              {features.map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.07 }}
                  className="flex items-center gap-3 py-3.5 border-b border-[var(--hairline)]"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-foreground/85">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* ── Ficha institucional ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:sticky lg:top-24"
          >
            <div className="rounded-xl overflow-hidden border border-[var(--hairline)] bg-[var(--tint-1)]">
              {/* Cabecera */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--hairline)]">
                <div className="w-10 h-10 rounded-md bg-primary/12 border border-primary/25 flex items-center justify-center shrink-0">
                  <Image
                    src="/logo.png"
                    alt=""
                    width={28}
                    height={28}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="leading-tight">
                  <p className="font-display font-extrabold text-foreground tracking-tight">
                    Orion Marketing
                  </p>
                  <p className="text-xs uppercase tracking-[0.22em] text-foreground/65">
                    {t.about.sheetTitle}
                  </p>
                </div>
              </div>

              {/* Datos duros */}
              <dl>
                {factSheet.map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.35, delay: 0.3 + i * 0.05 }}
                    className="flex items-baseline justify-between gap-4 px-6 py-3.5 border-b border-[var(--hairline)]"
                  >
                    <dt className="text-xs uppercase tracking-[0.16em] text-foreground/65 shrink-0">
                      {row.label}
                    </dt>
                    <dd className="text-sm text-foreground/85 text-right font-medium">
                      {row.value}
                    </dd>
                  </motion.div>
                ))}
              </dl>

              {/* Accesos a las tres áreas */}
              <div className="p-3 grid gap-1.5">
                {areas.map((area, i) => {
                  const Icon = area.icon
                  return (
                    <motion.div
                      key={area.slug}
                      initial={{ opacity: 0, y: 8 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.35, delay: 0.55 + i * 0.06 }}
                    >
                      <Link
                        href={area.href}
                        className="group flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors duration-300 hover:bg-[var(--tint-1)]"
                      >
                        <span
                          className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                          style={{
                            background: `rgba(${area.accent.rgb},0.12)`,
                            border: `1px solid rgba(${area.accent.rgb},0.25)`,
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: area.accent.hex }} />
                        </span>
                        <span className="text-sm text-foreground/75 flex-1 min-w-0 truncate">
                          {area.name}
                        </span>
                        <ArrowRight
                          className="w-4 h-4 shrink-0 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                          style={{ color: area.accent.hex }}
                        />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
