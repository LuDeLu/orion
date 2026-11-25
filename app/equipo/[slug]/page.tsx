import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { areasBySlug } from "@/lib/areas"
import {
  BASE_URL,
  EQUIPO_URL,
  ORG_ID,
  faqSocio,
  getSocio,
  personSchema,
  socioId,
  socioUrl,
  socios,
  type Socio,
} from "@/lib/socios"

/**
 * Perfil individual de cada socio.
 *
 * Una URL, un título y un Person por persona: así, al buscar "Nicolás Hector
 * Mazzotti" o "Nazareno David Cabella", Google muestra la página de esa persona
 * con su propio nombre en el título, y no la página general del equipo.
 */

export function generateStaticParams() {
  return socios.map((s) => ({ slug: s.slug }))
}

export const dynamicParams = false

const tituloSocio = (s: Socio) => s.seoTitle

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const s = getSocio(slug)
  if (!s) return {}

  const url = socioUrl(s)
  const title = tituloSocio(s)

  return {
    title: { absolute: title },
    description: s.summary,
    keywords: [s.fullName, ...s.aliases, `${s.fullName} Orion Marketing`, s.title],
    authors: [{ name: s.fullName, url }],
    alternates: { canonical: url, languages: { "es-AR": url } },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      title,
      description: s.summary,
      url,
      siteName: "Orion Marketing",
      locale: "es_AR",
      type: "profile",
      firstName: s.givenName,
      lastName: s.familyName,
      images: [{ url: `${BASE_URL}/og-image-share.png`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description: s.summary },
  }
}

export default async function SocioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = getSocio(slug)
  if (!s) notFound()

  const url = socioUrl(s)
  const area = areasBySlug[s.areaSlug]
  const faq = faqSocio(s)
  const otros = socios.filter((o) => o.slug !== s.slug)

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${url}#page`,
        url,
        name: tituloSocio(s),
        description: s.summary,
        inLanguage: "es-AR",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": socioId(s) },
        mainEntity: { "@id": socioId(s) },
        speakable: { "@type": "SpeakableSpecification", cssSelector: [".socio-resumen"] },
      },
      personSchema(s),
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Equipo", item: EQUIPO_URL },
          { "@type": "ListItem", position: 3, name: s.fullName, item: url },
        ],
      },
      { "@type": "Organization", "@id": ORG_ID, name: "Orion Marketing", url: BASE_URL },
    ],
  }

  return (
    <main className="relative min-h-screen flex flex-col bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Header />

      <section className="flex-1 px-4 pt-32 pb-20">
        <article className="max-w-4xl mx-auto">
          <nav aria-label="Ruta" className="text-sm text-foreground/60">
            <Link href="/" className="hover:text-foreground">
              Inicio
            </Link>{" "}
            /{" "}
            <Link href="/equipo" className="hover:text-foreground">
              Equipo
            </Link>{" "}
            / <span className="text-foreground/80">{s.fullName}</span>
          </nav>

          <div className="mt-8 flex items-start gap-5">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-display font-extrabold"
              style={{
                background: `rgba(${area.accent.rgb},0.18)`,
                border: `1px solid rgba(${area.accent.rgb},0.35)`,
                color: area.accent.hex,
              }}
              aria-hidden
            >
              {s.initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {s.isOwner ? "Dueño y propietario de Orion Marketing" : "Socio de Orion Marketing"}
              </p>
              <h1 className="mt-2 text-3xl md:text-5xl font-display font-extrabold text-foreground tracking-tight leading-[1.05] text-balance">
                {s.fullName}
              </h1>
              <p className="mt-2 text-lg font-semibold" style={{ color: area.accent.hex }}>
                {s.role} · {s.title}
              </p>
              {s.aliases.length > 0 && (
                <p className="mt-1 text-sm text-foreground/60">
                  También conocido como {s.aliases.join(", ")}
                </p>
              )}
            </div>
          </div>

          <p className="socio-resumen mt-8 text-lg text-foreground/85 leading-relaxed font-medium">
            {s.summary}
          </p>
          {s.bio.map((p) => (
            <p key={p} className="mt-4 text-foreground/70 leading-relaxed">
              {p}
            </p>
          ))}

          <h2 className="mt-10 text-xl font-display font-bold text-foreground">
            Especialidades de {s.fullName}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {s.knowsAbout.map((k) => (
              <li
                key={k}
                className="rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground/80"
              >
                {k}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-sm font-semibold">
            <Link href={area.href} className="inline-flex items-center gap-1.5 text-primary hover:underline">
              Área que dirige: {area.name}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            {s.sameAs.map((u) => (
              <a
                key={u}
                href={u}
                target="_blank"
                rel="me noopener"
                className="inline-flex items-center gap-1.5 text-foreground/70 hover:text-foreground"
              >
                {u === s.portfolio ? "Portafolio personal: " : ""}
                {u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ))}
          </div>

          <section className="mt-14" aria-labelledby="faq-socio">
            <h2 id="faq-socio" className="text-2xl font-display font-extrabold text-foreground">
              Preguntas frecuentes sobre {s.fullName}
            </h2>
            <dl className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
              {faq.map(({ q, a }) => (
                <div key={q} className="p-6">
                  <dt className="font-display font-bold text-foreground">{q}</dt>
                  <dd className="mt-2 text-foreground/70 leading-relaxed">{a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Link
              href="/#contacto"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Hablar con {s.givenName}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/equipo"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-[gap]"
            >
              <ArrowLeft className="w-4 h-4" />
              Todo el equipo
            </Link>
          </div>

          <p className="mt-10 text-sm text-foreground/60">
            Otros socios de Orion Marketing:{" "}
            {otros.map((o, i) => (
              <span key={o.slug}>
                {i > 0 && " · "}
                <Link href={`/equipo/${o.slug}`} className="text-foreground/80 hover:text-foreground underline">
                  {o.fullName}
                </Link>
              </span>
            ))}
          </p>
        </article>
      </section>

      <Footer />
    </main>
  )
}
