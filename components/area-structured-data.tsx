import { areasBySlug, type AreaSlug } from "@/lib/areas"
import { personRef, personSchema, propietario, sociosPorArea } from "@/lib/socios"

const BASE = "https://www.orionmkt.com.ar"

export function AreaStructuredData({ slug }: { slug: AreaSlug }) {
  const area = areasBySlug[slug]
  const url = `${BASE}${area.href}`
  // Director del área: se declara como Person completa en cada landing para
  // que la página quede asociada a quien la dirige, no solo a la organización.
  const director = sociosPorArea[slug]

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: area.seo.title,
    serviceType: area.name,
    description: area.seo.description,
    url,
    provider: {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      name: "Orion Marketing",
      founder: personRef(propietario),
    },
    // Quien dirige y responde por el servicio.
    broker: personRef(director),
    areaServed: [
      { "@type": "Country", name: "Argentina" },
      { "@type": "City", name: "Buenos Aires" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: url,
      servicePhone: "+54-9-11-5656-6083",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Servicios de ${area.name} — Orion`,
      itemListElement: area.families.map((family) => ({
        "@type": "OfferCatalog",
        name: family.title,
        description: family.summary,
        itemListElement: family.items.map((item) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: item },
        })),
      })),
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE },
      { "@type": "ListItem", position: 2, name: area.name, item: url },
    ],
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: area.seo.title,
    description: area.seo.description,
    isPartOf: { "@id": `${BASE}/#website` },
    about: { "@id": `${url}#service` },
    accountablePerson: personRef(director),
    author: personRef(director),
    mentions: [personRef(director)],
    inLanguage: "es-AR",
  }

  const directorSchema = { "@context": "https://schema.org", ...personSchema(director) }

  return (
    <>
      <script
        id={`area-service-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        id={`area-webpage-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        id={`area-director-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(directorSchema) }}
      />
      <script
        id={`area-breadcrumb-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
