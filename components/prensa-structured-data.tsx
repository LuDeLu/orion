import type { Nota } from "@/lib/prensa"

const BASE = "https://orionmkt.com.ar"

/**
 * Datos estructurados por nota. Declaramos la entidad Person "Elbio Stoler"
 * y la vinculamos como autor/sujeto del artículo para reforzar la entidad en
 * los resultados de búsqueda. Todo es verificable contra la fuente citada; no
 * se inventan valoraciones ni métricas.
 */
export function PrensaStructuredData({ nota }: { nota: Nota }) {
  const url = `${BASE}/prensa/${nota.slug}`
  const imageUrl = `${BASE}${nota.hero.src}`

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE}/#elbio-stoler`,
    name: "Elbio Stoler",
    jobTitle: "Director y fundador de ADN Developers",
    worksFor: {
      "@type": "Organization",
      name: "ADN Developers",
      url: "https://adndevelopers.com.ar",
    },
    nationality: "Argentina",
    description:
      "Elbio Stoler es director y fundador de ADN Developers, desarrolladora inmobiliaria de Buenos Aires con trayectoria en proyectos residenciales y corporativos premium.",
    knowsAbout: [
      "Desarrollo inmobiliario",
      "Real estate",
      "Inversión inmobiliaria",
      "Arquitectura residencial",
      "Mercado inmobiliario de Buenos Aires",
    ],
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    headline: nota.title,
    description: nota.metaDescription,
    image: [imageUrl],
    datePublished: nota.datePublished,
    dateModified: nota.dateModified,
    inLanguage: "es-AR",
    author: {
      "@type": "Person",
      "@id": `${BASE}/#elbio-stoler`,
      name: "Elbio Stoler",
    },
    about: { "@id": `${BASE}/#elbio-stoler` },
    mentions: [
      { "@id": `${BASE}/#elbio-stoler` },
      { "@type": "Organization", name: "ADN Developers", url: "https://adndevelopers.com.ar" },
    ],
    publisher: {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      name: "Orion Marketing",
      logo: { "@type": "ImageObject", url: `${BASE}/logo.png` },
    },
    isBasedOn: nota.source.url,
    citation: nota.source.url,
    keywords: nota.keywords.join(", "),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE },
      { "@type": "ListItem", position: 2, name: "Prensa", item: `${BASE}/prensa` },
      { "@type": "ListItem", position: 3, name: nota.title, item: url },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
