"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Home, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useAreas } from "@/hooks/use-areas"
import { useT } from "@/components/i18n-provider"

export function NotFoundContent() {
  const t = useT()
  const areas = useAreas()

  return (
    <main className="relative min-h-screen flex flex-col bg-background">
      <Header />

      <section className="flex-1 flex items-center justify-center px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-5 px-3 py-1 rounded-md bg-primary/10 border border-primary/20">
            {t.notFound.kicker}
          </span>

          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-foreground mb-4 tracking-tight leading-[1.08]">
            {t.notFound.title}
          </h1>

          <p className="text-base text-foreground/65 max-w-lg mx-auto leading-relaxed mb-8">
            {t.notFound.lead}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-lg shadow-primary/20 btn-shine"
            >
              <Home className="w-4 h-4" />
              {t.notFound.home}
            </Link>
            <Link
              href="/#contacto"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto h-12 px-6 rounded-xl border border-[var(--hairline-strong)] text-foreground font-semibold hover:bg-[var(--tint-2)] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {t.notFound.contact}
            </Link>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/65 mb-4">
            {t.notFound.areasLabel}
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {areas.map((area) => {
              const Icon = area.icon
              return (
                <Link
                  key={area.slug}
                  href={area.href}
                  className="group flex items-center gap-3 p-4 rounded-xl border text-left transition-colors"
                  style={{
                    background: `rgba(${area.accent.rgb},0.06)`,
                    borderColor: `rgba(${area.accent.rgb},0.22)`,
                  }}
                >
                  <span
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `rgba(${area.accent.rgb},0.14)` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: area.accent.hex }} />
                  </span>
                  <span className="text-sm font-semibold text-foreground leading-tight">
                    {area.name}
                  </span>
                  <ArrowRight className="w-4 h-4 ml-auto text-foreground/65 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )
            })}
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
