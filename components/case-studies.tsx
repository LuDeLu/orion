"use client"

import { ArrowRight, TrendingUp, Target, Search, Database, LayoutDashboard, Workflow } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { useT } from "@/components/i18n-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const clientNames = ["Schepens", "ADN Developers"]
const resultIcons = [
  [Search, TrendingUp, Target],
  [Database, LayoutDashboard, Workflow],
]

export function CaseStudies() {
  const t = useT()
  const cases = t.cases.items.map((x, i) => ({ ...x, client: clientNames[i], results: x.results.map((r, j) => ({ ...r, icon: resultIcons[i][j] })) }))
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section ref={ref} id="casos" className="relative py-28 px-4 scroll-mt-24" aria-labelledby="cases-heading">
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
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              {t.cases.kicker}
            </span>
            <span className="h-px w-8 bg-primary/40" />
          </div>
          <h2
            id="cases-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground mb-6 text-balance leading-[1.05]"
          >
            {t.cases.titleStart}{" "}
            <span className="text-primary">{t.cases.titleHighlight}</span>
          </h2>
          <p className="text-foreground/65 text-lg md:text-xl text-pretty leading-relaxed">
            {t.cases.lead}
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
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.01] border border-[var(--hairline)] hover:border-primary/30 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15 transition-[transform,box-shadow,border-color] duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            >
              {/* Glow accent */}
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Top decorative line */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              {/* Watermark number */}
              <span
                aria-hidden
                className="absolute top-4 right-6 text-[110px] md:text-[140px] font-display font-extrabold leading-none text-foreground/[0.025] select-none pointer-events-none"
              >
                0{index + 1}
              </span>

              <div className="relative p-8 md:p-10">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                      {t.cases.caseLabel} 0{index + 1}
                    </span>
                    <span className="h-px flex-1 bg-foreground/10" />
                    <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                      {caseStudy.industry}
                    </span>
                  </div>

                  <p className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/65 mb-2">
                    {t.cases.clientLabel}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mb-5 leading-tight leading-[1.08] tracking-tight">
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
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/65">
                        {t.cases.challengeLabel}
                      </h4>
                    </div>
                    <p className="text-foreground/65 leading-relaxed pl-3">{caseStudy.challenge}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="w-1 h-4 rounded-full bg-primary" />
                      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                        {t.cases.solutionLabel}
                      </h4>
                    </div>
                    <p className="text-foreground/75 leading-relaxed pl-3">{caseStudy.solution}</p>
                  </div>
                </div>

                {/* Resultados */}
                <div className="pt-6 border-t border-[var(--hairline)]">
                  <div className="flex items-center gap-2 mb-4">
                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                      {t.cases.resultsLabel}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {caseStudy.results.map((result, i) => (
                      <div
                        key={i}
                        className="relative bg-[var(--tint-1)] hover:bg-primary/5 border border-[var(--hairline)] hover:border-primary/25 rounded-xl p-3 md:p-4 transition-[background-color,border-color,transform] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 overflow-hidden group/metric"
                      >
                        <result.icon className="w-4 h-4 text-primary mb-2 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover/metric:scale-125" />
                        <div className="text-sm md:text-base font-bold text-foreground leading-tight mb-1 break-words">
                          {result.metric}
                        </div>
                        <div className="text-xs md:text-xs text-foreground/65 leading-tight">
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
          <p className="text-foreground/65 text-sm mb-5">
            {t.cases.ctaQuestion}
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-8 py-6 text-base font-semibold group rounded-md btn-shine"
            asChild
          >
            <Link href="#contacto">
              <span className="relative z-10 flex items-center justify-center">
                {t.cases.ctaButton}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
