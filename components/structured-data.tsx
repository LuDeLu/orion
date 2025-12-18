import Script from "next/script"

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Orion MKT",
    url: "https://orionmkt.com",
    logo: "https://orionmkt.com/logo.png",
    description:
      "Agencia de marketing digital en Argentina especializada en PyMEs y Startups. Branding, redes sociales, publicidad digital y diseño web.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
      addressRegion: "Argentina",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+54-9-11-5656-6083",
      contactType: "customer service",
      areaServed: ["AR", "LATAM"],
      availableLanguage: "Spanish",
    },
    sameAs: ["https://instagram.com/orionmkt", "https://linkedin.com/company/orionmkt", "https://twitter.com/orionmkt"],
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Marketing Digital",
    provider: {
      "@type": "Organization",
      name: "Orion MKT",
    },
    areaServed: {
      "@type": "Country",
      name: "Argentina",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Marketing Digital",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Branding",
            description: "Identidad visual que captura la esencia de tu negocio",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Social Media",
            description: "Contenido que construye comunidades auténticas",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Performance Ads",
            description: "Campañas publicitarias con ROI medible y optimizado",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Desarrollo Web",
            description: "Sitios que convierten visitantes en clientes",
          },
        },
      ],
    },
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Orion MKT - Agencia de Marketing Digital",
    image: "https://orionmkt.com/logo.png",
    "@id": "https://orionmkt.com",
    url: "https://orionmkt.com",
    telephone: "+54-9-11-5656-6083",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -34.6037,
      longitude: -58.3816,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: ["https://instagram.com/orionmkt", "https://linkedin.com/company/orionmkt"],
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  )
}
