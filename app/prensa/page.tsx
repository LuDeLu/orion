import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { notas } from "@/lib/prensa"

const BASE = "https://orionmkt.com.ar"

export const metadata: Metadata = {
  title: "Prensa | Elbio Stoler y los desarrollos de ADN Developers",
  description:
    "Notas y columnas sobre Elbio Stoler, director de ADN Developers, y sus desarrollos inmobiliarios premium en Buenos Aires: Dome Green Soho, Av. Córdoba, Palermo y más.",
  keywords: [
    "Elbio Stoler",
    "Elbio Stoler ADN Developers",
    "ADN Developers prensa",
    "Elbio Stoler notas",
    "desarrollos inmobiliarios Buenos Aires",
  ],
  alternates: { canonical: `${BASE}/prensa` },
  openGraph: {
    title: "Prensa | Elbio Stoler y ADN Developers",
    description:
      "Notas y columnas sobre Elbio Stoler, director de ADN Developers, y sus desarrollos inmobiliarios en Buenos Aires.",
    url: `${BASE}/prensa`,
    siteName: "Orion Marketing",
    locale: "es_AR",
    type: "website",
    images: [{ url: `${BASE}/prensa/dome-green-soho.jpg`, width: 698, height: 364 }],
  },
}

export default function PrensaIndex() {
  return (
    <main className="relative min-h-screen flex flex-col bg-background">
      <Header />

      <section className="flex-1 px-4 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Prensa</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-display font-extrabold text-foreground tracking-tight leading-[1.05]">
            Elbio Stoler y ADN Developers en los medios
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-foreground/75 leading-relaxed">
            Una selección de notas y columnas sobre Elbio Stoler, director y fundador de ADN
            Developers, y sus desarrollos inmobiliarios premium en Buenos Aires.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {notas.map((nota) => (
              <Link
                key={nota.slug}
                href={`/prensa/${nota.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/40"
              >
                <div className="relative aspect-[698/364] w-full overflow-hidden">
                  <Image
                    src={nota.hero.src}
                    alt={nota.hero.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {nota.eyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-xl font-bold text-foreground leading-snug">
                    {nota.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm text-foreground/70 leading-relaxed">
                    {nota.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Leer nota
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-[gap]"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
