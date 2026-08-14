"use client"

import Link from "next/link"
import Image from "next/image"
import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, ChevronDown, Check, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Area, AreaSlug } from "@/lib/areas"
import { useAreas, useArea } from "@/hooks/use-areas"
import { useT } from "@/components/i18n-provider"
import { OwnerIdentity, OwnerDirectLine } from "@/components/owner-signal"
import { fill } from "@/lib/i18n"

const WA_NUMBER = "5491156566083"

function waHref(text: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`
}

/* ── Hero del área ─────────────────────────────────────────── */

function AreaHero({ area }: { area: Area }) {
  const t = useT().areaPage
  const owner = useT().owner
  const rgb = area.accent.rgb
  const Icon = area.icon

  return (
    <section className="relative pt-32 pb-16 px-4 md:px-6 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse 50% 40% at 15% 0%, rgba(${rgb},0.13) 0%, transparent 60%), radial-gradient(ellipse 40% 35% at 90% 20%, rgba(${rgb},0.07) 0%, transparent 60%)`,
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Volver */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-foreground/65 hover:text-foreground/80 transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          {useT().a11y.backToAreas}
        </Link>

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-7"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `rgba(${rgb},0.14)`, border: `1px solid rgba(${rgb},0.3)` }}
              >
                <Icon className="w-5 h-5" style={{ color: area.accent.hex }} />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xs font-semibold uppercase tracking-[0.28em]"
                  style={{ color: area.accent.hex }}
                >
                  {area.hero.eyebrow}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-foreground/65">
                  {t.starLabel} {area.star}
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-foreground mb-6 leading-[1.06] tracking-tight text-balance"
            >
              {area.hero.titleStart}{" "}
              <span
                style={{
                  background: `linear-gradient(90deg, ${area.accent.hex}, var(--foreground) 140%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {area.hero.titleHighlight}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="text-base md:text-lg text-foreground/65 leading-relaxed text-pretty mb-8 max-w-2xl"
            >
              {area.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Button
                size="lg"
                className="text-foreground px-8 py-6 text-base font-semibold rounded-md group btn-shine w-full sm:w-auto"
                style={{
                  background: `linear-gradient(135deg, ${area.accent.hex} 0%, rgba(${rgb},0.75) 100%)`,
                }}
                asChild
              >
                <Link href="#contacto-area">
                  <span className="relative z-10 flex items-center justify-center">
                    {t.quoteCta}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-base font-semibold rounded-md bg-transparent backdrop-blur-sm hover-lift w-full sm:w-auto text-foreground"
                style={{ borderColor: `rgba(${rgb},0.35)` }}
                asChild
              >
                <Link href="#catalogo">{t.seeAllCta}</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-foreground/65"
            >
              {area.hero.bullets.map((b) => (
                <span key={b} className="inline-flex items-center gap-1.5">
                  <Check className="w-4 h-4 shrink-0" style={{ color: area.accent.hex }} />
                  {b}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Tarjeta del responsable + métricas */}
          <motion.div
            initial={{ opacity: 0, x: 26 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div
              className="rounded-xl p-7 md:p-8 backdrop-blur-md"
              style={{
                background: `linear-gradient(160deg, rgba(${rgb},0.10) 0%, var(--panel) 60%)`,
                border: `1px solid rgba(${rgb},0.22)`,
              }}
            >
              <p className="text-xs uppercase tracking-[0.25em] text-foreground/65 mb-3">
                {owner.label}
              </p>
              <OwnerIdentity area={area} size="md" showTitle />
              <OwnerDirectLine area={area} className="mt-4" />

              <div className="h-px w-full my-6" style={{ background: `linear-gradient(90deg, rgba(${rgb},0.4), transparent)` }} />

              <div className="grid grid-cols-2 gap-4">
                {area.metrics.map((m) => (
                  <div key={m.label}>
                    <p
                      className="text-xl md:text-2xl font-display font-extrabold leading-none mb-1.5"
                      style={{ color: area.accent.hex }}
                    >
                      {m.value}
                    </p>
                    <p className="text-xs text-foreground/65 leading-snug">{m.label}</p>
                  </div>
                ))}
              </div>

              <a
                href={waHref(`Hola! Quiero consultar sobre el área de ${area.name}`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-semibold transition-all duration-300 hover:brightness-110"
                style={{ background: `rgba(${rgb},0.14)`, border: `1px solid rgba(${rgb},0.3)`, color: area.accent.hex }}
              >
                <MessageCircle className="w-4 h-4" />
                {t.whatsappCta}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── Problemas que resolvemos ──────────────────────────────── */

function AreaProblems({ area }: { area: Area }) {
  const t = useT().areaPage
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const rgb = area.accent.rgb

  return (
    <section ref={ref} className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-14"
        >
          <span
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: area.accent.hex }}
          >
            {t.problemsKicker}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-foreground mt-4 text-balance leading-[1.1]">
            {t.problemsTitle}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {area.problems.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 26 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-xl p-7 transition-all duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5"
              style={{
                background: "var(--tint-1)",
                border: "1px solid var(--hairline)",
              }}
            >
              <span
                aria-hidden
                className="block text-5xl font-display font-extrabold leading-none mb-5 leading-[1.08] tracking-tight"
                style={{ color: `rgba(${rgb},0.28)` }}
              >
                0{i + 1}
              </span>
              <h3 className="text-lg font-display font-extrabold text-foreground mb-3 leading-snug">
                {p.title}
              </h3>
              <p className="text-sm text-foreground/65 leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Catálogo completo (acordeón por familia) ──────────────── */

function AreaCatalog({ area }: { area: Area }) {
  const t = useT().areaPage
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.05 })
  const [open, setOpen] = useState<string | null>(area.families[0]?.id ?? null)
  const rgb = area.accent.rgb
  const totalItems = area.families.reduce((acc, f) => acc + f.items.length, 0)

  return (
    <section ref={ref} id="catalogo" className="relative py-20 px-4 md:px-6 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-14"
        >
          <span
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: area.accent.hex }}
          >
            {t.catalogKicker}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-foreground mt-4 mb-5 text-balance leading-[1.1]">
            {fill(t.catalogTitle, { area: area.name })}
          </h2>
          <p className="text-foreground/65 text-lg text-pretty leading-relaxed">
            {fill(t.catalogLead, { families: area.families.length, items: totalItems })}
          </p>
        </motion.div>

        <div className="space-y-2.5">
          {area.families.map((family, i) => {
            const isOpen = open === family.id
            const FamilyIcon = family.icon

            return (
              <motion.div
                key={family.id}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.4) }}
                className="rounded-xl overflow-hidden transition-colors duration-300"
                style={{
                  background: isOpen ? `rgba(${rgb},0.05)` : "var(--tint-1)",
                  border: `1px solid rgba(${rgb},${isOpen ? 0.28 : 0.09})`,
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : family.id)}
                  aria-expanded={isOpen}
                  aria-controls={`family-${family.id}`}
                  className="w-full flex items-center gap-4 p-5 md:p-6 text-left group"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110"
                    style={{
                      background: `rgba(${rgb},0.12)`,
                      border: `1px solid rgba(${rgb},0.24)`,
                    }}
                  >
                    <FamilyIcon className="w-5 h-5" style={{ color: area.accent.hex }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-display font-extrabold text-foreground leading-snug">
                      {family.title}
                    </h3>
                    <p className="text-sm text-foreground/65 leading-snug mt-0.5 line-clamp-2">
                      {family.summary}
                    </p>
                  </div>

                  <span
                    className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-1 rounded-md shrink-0 tabular"
                    style={{ background: `rgba(${rgb},0.10)`, color: `rgba(${rgb},0.85)` }}
                  >
                    {family.items.length}
                  </span>

                  <ChevronDown
                    className="w-5 h-5 shrink-0 transition-transform duration-[400ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      color: isOpen ? area.accent.hex : "var(--foreground-subtle)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`family-${family.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-6">
                        <div
                          className="h-px w-full mb-5"
                          style={{ background: `linear-gradient(90deg, rgba(${rgb},0.3), transparent)` }}
                        />
                        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2.5">
                          {family.items.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/70">
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0 mt-[0.45rem]"
                                style={{ background: area.accent.hex }}
                              />
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>

                        <a
                          href={waHref(`Hola! Quiero consultar sobre ${family.title} (${area.name})`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold transition-all duration-300 hover:gap-2.5"
                          style={{ color: area.accent.hex }}
                        >
                          {t.consultPrefix} {family.title.toLowerCase()}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── "¿No está en la lista?" — alcance sin techo ───────────── */

function CapabilityBlock({ area }: { area: Area }) {
  const capabilityPitch = useT().capability
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const rgb = area.accent.rgb

  return (
    <section ref={ref} className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-xl overflow-hidden p-8 md:p-12 lg:p-14"
          style={{
            background: `linear-gradient(150deg, rgba(${rgb},0.12) 0%, var(--panel) 55%)`,
            border: `1px solid rgba(${rgb},0.24)`,
          }}
        >
          <div
            aria-hidden
            className="absolute -top-32 -right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none"
            style={{ background: `rgba(${rgb},0.12)` }}
          />

          <div className="relative grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
            <div>
              <span
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: area.accent.hex }}
              >
                {capabilityPitch.eyebrow}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-foreground mt-4 mb-5 leading-[1.08] text-balance">
                {capabilityPitch.title}{" "}
                <span style={{ color: area.accent.hex }}>{capabilityPitch.highlight}</span>
              </h2>
              <p className="text-foreground/65 leading-relaxed text-pretty">
                {capabilityPitch.description}
              </p>

              <a
                href={waHref("Hola! Tengo un proyecto y quiero saber si lo pueden hacer")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-7 rounded-md px-6 py-3 text-sm font-semibold transition-all duration-300 hover:gap-3"
                style={{
                  background: `rgba(${rgb},0.14)`,
                  border: `1px solid rgba(${rgb},0.32)`,
                  color: area.accent.hex,
                }}
              >
                {capabilityPitch.cta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {capabilityPitch.points.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.08 }}
                  className="rounded-xl p-5"
                  style={{
                    background: "var(--tint-2)",
                    border: "1px solid var(--tint-3)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <Check className="w-4 h-4 shrink-0" style={{ color: area.accent.hex }} />
                    <h3 className="text-sm font-bold text-foreground leading-tight">{p.title}</h3>
                  </div>
                  <p className="text-xs text-foreground/65 leading-relaxed">{p.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Proceso ───────────────────────────────────────────────── */

function AreaProcess({ area }: { area: Area }) {
  const t = useT().areaPage
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const rgb = area.accent.rgb

  return (
    <section ref={ref} className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-14"
        >
          <span
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: area.accent.hex }}
          >
            {t.processKicker}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-foreground mt-4 text-balance leading-[1.1]">
            {t.processTitle}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {area.process.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-xl p-6 h-full flex flex-col transition-all duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5"
              style={{
                background: "var(--tint-1)",
                border: "1px solid var(--hairline)",
              }}
            >
              <div
                aria-hidden
                className="absolute top-0 left-6 right-6 h-px"
                style={{ background: `linear-gradient(90deg, rgba(${rgb},0.5), transparent)` }}
              />
              <span
                className="text-3xl font-display font-extrabold leading-none mb-4"
                style={{ color: `rgba(${rgb},0.55)` }}
              >
                {step.number}
              </span>
              <h3 className="font-display font-extrabold text-foreground mb-2.5 leading-snug">
                {step.title}
              </h3>
              <p className="text-sm text-foreground/65 leading-relaxed flex-1">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Cross-sell hacia las otras dos áreas ──────────────────── */

function AreaCrossSell({ area }: { area: Area }) {
  const t = useT().areaPage
  const allAreas = useAreas()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section ref={ref} className="relative py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-foreground/65">
            {t.crossKicker}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-foreground mt-4 mb-4 text-balance leading-[1.12]">
            {t.crossTitle}
          </h2>
          <p className="text-foreground/65 text-lg text-pretty leading-relaxed">
            {t.crossLead}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {area.crossSell.map((cs, i) => {
            const other = allAreas.find((a) => a.slug === cs.slug)!
            const rgb = other.accent.rgb
            const OtherIcon = other.icon

            return (
              <motion.div
                key={cs.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <Link
                  href={other.href}
                  className="group flex flex-col h-full rounded-xl p-7 transition-all duration-[420ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5"
                  style={{
                    background: `linear-gradient(155deg, rgba(${rgb},0.08) 0%, var(--tint-1) 60%)`,
                    border: `1px solid rgba(${rgb},0.18)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-[420ms] group-hover:scale-110"
                      style={{ background: `rgba(${rgb},0.14)`, border: `1px solid rgba(${rgb},0.28)` }}
                    >
                      <OtherIcon className="w-4 h-4" style={{ color: other.accent.hex }} />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-foreground leading-tight">
                        {other.name}
                      </h3>
                      <span className="text-xs uppercase tracking-[0.2em] text-foreground/65">
                        {other.star}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-foreground/65 leading-relaxed mb-5">{cs.reason}</p>

                  <span
                    className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-300 group-hover:gap-2.5"
                    style={{ color: other.accent.hex }}
                  >
                    {useT().hero.viewArea}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── CTA final del área ────────────────────────────────────── */

function AreaCta({ area }: { area: Area }) {
  const t = useT().areaPage
  const owner = useT().owner
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.25 })
  const rgb = area.accent.rgb

  return (
    <section
      ref={ref}
      id="contacto-area"
      className="relative py-24 px-4 md:px-6 scroll-mt-20"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-7">
            <Image src="/logo.png" alt="Orion" width={48} height={48} className="w-12 h-12 object-contain opacity-80" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-foreground mb-5 text-balance leading-[1.1]">
            {t.ctaTitlePrefix}{" "}
            <span style={{ color: area.accent.hex }}>{area.name}</span>
          </h2>
          <p className="text-foreground/65 text-lg mb-6 max-w-2xl mx-auto text-pretty leading-relaxed">
            {t.ctaLead}
          </p>

          {/* Último recordatorio antes del botón: no escribís a un buzón
             genérico, te contesta el dueño del área. */}
          <div className="flex justify-center mb-9">
            <span
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
              style={{
                background: `rgba(${rgb},0.10)`,
                border: `1px solid rgba(${rgb},0.26)`,
                color: "var(--foreground)",
              }}
            >
              <span
                className="w-7 h-7 rounded-md flex items-center justify-center text-[0.625rem] font-bold shrink-0"
                style={{ background: `rgba(${rgb},0.2)`, color: area.accent.hex }}
                aria-hidden
              >
                {area.owner.initials}
              </span>
              {fill(owner.ctaLine, { name: area.owner.name })}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="text-foreground px-9 py-6 text-base font-semibold rounded-md group btn-shine w-full sm:w-auto"
              style={{ background: `linear-gradient(135deg, ${area.accent.hex} 0%, rgba(${rgb},0.75) 100%)` }}
              asChild
            >
              {/* Llevamos el área en la URL: el select del formulario llega resuelto */}
              <Link href={`/?area=${area.slug}#contacto`}>
                <span className="relative z-10 flex items-center justify-center">
                  {t.ctaForm}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-9 py-6 text-base font-semibold rounded-md bg-transparent text-foreground w-full sm:w-auto hover-lift"
              style={{ borderColor: `rgba(${rgb},0.35)` }}
              asChild
            >
              <a
                href={waHref(`Hola! Quiero consultar sobre ${area.name}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.ctaWhatsapp}
              </a>
            </Button>
          </div>

          <p className="text-sm text-foreground/65 mt-8">
            {t.ctaMail}{" "}
            <a href="mailto:hola@orionmkt.com.ar" className="hover:text-foreground/70 transition-colors">
              hola@orionmkt.com.ar
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Composición ───────────────────────────────────────────── */

export function AreaLanding({ slug }: { slug: AreaSlug }) {
  const area = useArea(slug)

  return (
    <>
      <AreaHero area={area} />
      <div className="cv-auto">
        <AreaProblems area={area} />
      </div>
      <AreaCatalog area={area} />
      <div className="cv-auto">
        <CapabilityBlock area={area} />
      </div>
      <div className="cv-auto">
        <AreaProcess area={area} />
      </div>
      <div className="cv-auto">
        <AreaCrossSell area={area} />
      </div>
      <AreaCta area={area} />
    </>
  )
}
