import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { areasBySlug } from "@/lib/areas"
import {
  BASE_URL,
  EQUIPO_URL,
  ORG_ID,
  faqTitularidad,
  fraseTitularidad,
  listar,
  personRef,
  personSchema,
  propietario,
  socios,
} from "@/lib/socios"

/**
 * Página de titularidad: quién es el dueño de Orion y quiénes son los socios.
 *
 * Es un Server Component a propósito, sin animaciones ni modales: todo el
 * texto sale en el HTML inicial, que es lo que leen Google y los motores
 * generativos. La sección "Equipo" del home muestra las bios dentro de un
 * modal que no existe hasta que alguien hace clic, así que no alcanzaba.
 */

const otros = socios.filter((s) => !s.isOwner)
const title = `${propietario.fullName}, dueño de Orion Marketing, y sus socios`
const description = `${propietario.fullName} es el dueño, fundador y CEO de Orion Marketing. Socios: ${listar(
  otros.map((s) => s.fullName),
)}. Conocé quién dirige cada área.`

export const metadata: Metadata = {
  title: { absolute: `${title} | Equipo` },
  description,
  keywords: [
    ...socios.flatMap((s) => [s.fullName, ...s.aliases]),
    "dueño de Orion Marketing",
    "propietario de Orion Marketing",
    "fundador de Orion Marketing",
    "CEO de Orion Marketing",
    "socios de Orion Marketing",
    "quién es el dueño de Orion Marketing",
    "equipo Orion Marketing",
  ],
  authors: socios.map((s) => ({ name: s.fullName, url: `${EQUIPO_URL}#${s.slug}` })),
  alternates: { canonical: EQUIPO_URL, languages: { "es-AR": EQUIPO_URL } },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  openGraph: {
    title,
    description,
    url: EQUIPO_URL,
    siteName: "Orion Marketing",
    locale: "es_AR",
    type: "profile",
    firstName: propietario.givenName,
    lastName: propietario.familyName,
    images: [{ url: `${BASE_URL}/og-image-share.png`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title, description },
}

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${EQUIPO_URL}#page`,
      url: EQUIPO_URL,
      name: title,
      description,
      inLanguage: "es-AR",
      isPartOf: { "@id": `${BASE_URL}/#website` },
      about: { "@id": ORG_ID },
      mainEntity: { "@id": `${EQUIPO_URL}#socios` },
      author: personRef(propietario),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#titularidad", ".socio-resumen"],
      },
    },
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Orion Marketing",
      url: BASE_URL,
      founder: socios.map(personRef),
      employee: socios.map(personRef),
    },
    {
      "@type": "ItemList",
      "@id": `${EQUIPO_URL}#socios`,
      name: "Dueño y socios de Orion Marketing",
      numberOfItems: socios.length,
      itemListElement: socios.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: personRef(s),
      })),
    },
    ...socios.map(personSchema),
    {
      "@type": "FAQPage",
      "@id": `${EQUIPO_URL}#faq`,
      mainEntity: faqTitularidad.map(({ q, a }) => ({
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
      ],
    },
  ],
}

export default function EquipoPage() {
  return (
    <main className="relative min-h-screen flex flex-col bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Header />

      <section className="flex-1 px-4 pt-32 pb-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Dueño y socios
          </p>
          <h1 className="mt-3 text-3xl md:text-5xl font-display font-extrabold text-foreground tracking-tight leading-[1.05] text-balance">
            Quién está detrás de Orion Marketing
          </h1>
          <p id="titularidad" className="mt-5 max-w-3xl text-lg text-foreground/75 leading-relaxed">
            {fraseTitularidad} Cada área de la agencia la dirige uno de ellos en persona, sin
            ejecutivos de cuenta en el medio.
          </p>

          <div className="mt-12 space-y-6">
            {socios.map((s) => {
              const area = areasBySlug[s.areaSlug]
              return (
                <article
                  key={s.slug}
                  id={s.slug}
                  className={`scroll-mt-28 rounded-2xl border bg-card p-6 md:p-8 ${
                    s.isOwner ? "border-primary/40" : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-lg font-display font-extrabold"
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
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                        {s.isOwner ? "Dueño y propietario" : "Socio"}
                      </p>
                      <h2 className="mt-1 text-2xl md:text-3xl font-display font-extrabold text-foreground leading-tight">
                        {s.fullName}
                      </h2>
                      <p className="mt-1 font-semibold" style={{ color: area.accent.hex }}>
                        {s.role} · {s.title}
                      </p>
                    </div>
                  </div>

                  <p className="socio-resumen mt-6 text-foreground/85 leading-relaxed font-medium">
                    {s.summary}
                  </p>
                  {s.bio.map((p) => (
                    <p key={p} className="mt-4 text-foreground/70 leading-relaxed">
                      {p}
                    </p>
                  ))}

                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`Especialidades de ${s.fullName}`}>
                    {s.knowsAbout.map((k) => (
                      <li
                        key={k}
                        className="rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground/80"
                      >
                        {k}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-5 text-sm font-semibold">
                    <Link
                      href={area.href}
                      className="inline-flex items-center gap-1.5 text-primary hover:underline"
                    >
                      Área que dirige: {area.name}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    {s.sameAs.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="me noopener"
                        className="inline-flex items-center gap-1.5 text-foreground/70 hover:text-foreground"
                      >
                        {url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>

          <section className="mt-16" aria-labelledby="faq-titularidad">
            <h2
              id="faq-titularidad"
              className="text-2xl md:text-3xl font-display font-extrabold text-foreground"
            >
              Preguntas frecuentes sobre el dueño y los socios
            </h2>
            <dl className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
              {faqTitularidad.map(({ q, a }) => (
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
              Hablar con un socio
              <ArrowUpRight className="h-4 w-4" />
            </Link>
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
