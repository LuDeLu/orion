"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useT } from "@/components/i18n-provider"

/**
 * Cáscara común de privacidad y términos: el contenido vive en el diccionario
 * para que las tres versiones de idioma no se desincronicen.
 */
export function LegalPage({ doc }: { doc: "privacy" | "terms" }) {
  const t = useT().legal
  const title = doc === "privacy" ? t.privacyTitle : t.termsTitle
  const lead = doc === "privacy" ? t.privacyLead : t.termsLead
  const sections = doc === "privacy" ? t.privacySections : t.termsSections

  return (
    <main className="relative min-h-screen flex flex-col bg-background">
      <Header />

      <article className="flex-1 px-4 pt-32 pb-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground tracking-tight leading-[1.1]">
            {title}
          </h1>
          <p className="mt-3 text-base text-foreground/70 leading-relaxed">{lead}</p>
          <p className="mt-2 text-sm text-foreground/65">{t.updated}</p>

          <div className="mt-10 space-y-9">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-2.5">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.body.map((paragraph, i) => (
                    <p key={i} className="text-[15px] text-foreground/75 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <Link
            href="/"
            className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-[gap]"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backHome}
          </Link>
        </div>
      </article>

      <Footer />
    </main>
  )
}
