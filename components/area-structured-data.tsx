import { areasBySlug, type AreaSlug } from "@/lib/areas"

const BASE = "https://orionmkt.com.ar"

export function AreaStructuredData({ slug }: { slug: AreaSlug }) {
  const area = areasBySlug[slug]
  const url = `${BASE}${area.href}`

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
    },
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
    inLanguage: "es-AR",
  }

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
        id={`area-breadcrumb-schema-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}
