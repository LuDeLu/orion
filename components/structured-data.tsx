import Script from "next/script"

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://orionmkt.com/#organization",
    name: "Orion MKT",
    legalName: "Orion MKT - Agencia de Marketing Digital",
    url: "https://orionmkt.com",
    logo: {
      "@type": "ImageObject",
      url: "https://orionmkt.com/logo.png",
      width: 250,
      height: 60,
    },
    description:
      "Agencia de marketing digital líder en Argentina especializada en PyMEs y Startups. Branding, redes sociales, publicidad digital, diseño web y estrategias con ROI medible. Modalidad flexible y presencia en toda Argentina.",
    foundingDate: "2020",
    slogan: "Tu negocio, nuestro universo",
    keywords:
      "marketing digital, agencia marketing argentina, branding, social media, performance ads, diseño web, pymes, startups",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
      addressRegion: "Buenos Aires",
      addressLocality: "Buenos Aires",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+54-9-11-5656-6083",
      contactType: "customer service",
      email: "info@orionmkt.com",
      areaServed: ["AR", "LATAM"],
      availableLanguage: ["Spanish", "English"],
      contactOption: "TollFree",
    },
    sameAs: [
      "https://instagram.com/orionmkt",
      "https://linkedin.com/company/orionmkt",
      "https://twitter.com/orionmkt",
      "https://facebook.com/orionmkt",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    knowsAbout: [
      "Marketing Digital",
      "Social Media Marketing",
      "Branding",
      "Publicidad Digital",
      "Performance Marketing",
      "SEO",
      "SEM",
      "Diseño Web",
      "Community Management",
      "Content Marketing",
      "Facebook Ads",
      "Instagram Ads",
      "Google Ads",
      "Growth Marketing",
      "E-commerce",
    ],
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://orionmkt.com/#service",
    serviceType: "Marketing Digital",
    name: "Servicios de Marketing Digital",
    provider: {
      "@type": "Organization",
      "@id": "https://orionmkt.com/#organization",
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
            name: "Branding y Diseño de Identidad",
            description:
              "Identidad visual que captura la esencia de tu negocio. Logo, paleta de colores, tipografía y guía de marca completa para PyMEs y Startups.",
            serviceType: "Branding",
            provider: {
              "@type": "Organization",
              name: "Orion MKT",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Social Media Marketing",
            description:
              "Contenido que construye comunidades auténticas. Estrategia, creación de contenido, community management y análisis en Instagram, Facebook y LinkedIn.",
            serviceType: "Social Media",
            provider: {
              "@type": "Organization",
              name: "Orion MKT",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Performance Ads y Publicidad Digital",
            description:
              "Campañas publicitarias con ROI medible y optimizado. Facebook Ads, Instagram Ads, Google Ads, TikTok Ads y remarketing estratégico.",
            serviceType: "Performance Ads",
            provider: {
              "@type": "Organization",
              name: "Orion MKT",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Desarrollo Web y E-commerce",
            description:
              "Sitios web y tiendas online que convierten visitantes en clientes. Diseño responsivo, SEO optimizado y alta conversión para negocios digitales.",
            serviceType: "Desarrollo Web",
            provider: {
              "@type": "Organization",
              name: "Orion MKT",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Estrategia Digital",
            description:
              "Planes estratégicos basados en datos para alcanzar tus objetivos de negocio. Análisis de mercado, definición de KPIs y optimización continua.",
            serviceType: "Estrategia Digital",
            provider: {
              "@type": "Organization",
              name: "Orion MKT",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Diseño Creativo",
            description:
              "Visuales impactantes para destacar en el mundo digital. Diseño de posts, stories, piezas publicitarias y material para campañas.",
            serviceType: "Diseño Creativo",
            provider: {
              "@type": "Organization",
              name: "Orion MKT",
            },
          },
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Emprendedor Satisfecho",
        },
        datePublished: "2024-01-15",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Excelente agencia de marketing digital. Nos ayudaron a multiplicar nuestras ventas online con estrategias efectivas.",
      },
    ],
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://orionmkt.com/#localbusiness",
    name: "Orion MKT - Agencia de Marketing Digital",
    alternateName: "Orion Marketing Digital",
    image: "https://orionmkt.com/logo.png",
    url: "https://orionmkt.com",
    telephone: "+54-9-11-5656-6083",
    email: "info@orionmkt.com",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
      addressRegion: "Buenos Aires",
      addressLocality: "Buenos Aires",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -34.6037,
      longitude: -58.3816,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://instagram.com/orionmkt",
      "https://linkedin.com/company/orionmkt",
      "https://twitter.com/orionmkt",
      "https://facebook.com/orionmkt",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
    },
    paymentAccepted: "Cash, Credit Card, Debit Card, Bank Transfer",
    currenciesAccepted: "ARS, USD",
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://orionmkt.com/#website",
    url: "https://orionmkt.com",
    name: "Orion MKT",
    description: "Agencia de Marketing Digital en Argentina",
    publisher: {
      "@id": "https://orionmkt.com/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://orionmkt.com/?s={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "es-AR",
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://orionmkt.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Servicios",
        item: "https://orionmkt.com#servicios",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Nosotros",
        item: "https://orionmkt.com#nosotros",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Casos de Éxito",
        item: "https://orionmkt.com#casos",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Contacto",
        item: "https://orionmkt.com#contacto",
      },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué servicios de marketing digital ofrece Orion MKT?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ofrecemos branding y diseño de identidad, social media marketing (Instagram, Facebook, LinkedIn), performance ads (Facebook Ads, Instagram Ads, Google Ads, TikTok Ads), diseño web responsivo, e-commerce, estrategia digital y diseño creativo. Todos nuestros servicios están optimizados para PyMEs y Startups en Argentina.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto cuesta contratar una agencia de marketing digital en Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Los costos varían según las necesidades de cada negocio y los servicios requeridos. Ofrecemos paquetes flexibles desde pequeñas PyMEs hasta startups en crecimiento. Contáctanos para una consultoría gratuita y presupuesto personalizado adaptado a tu presupuesto.",
        },
      },
      {
        "@type": "Question",
        name: "¿En cuánto tiempo veo resultados con marketing digital?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Los primeros resultados en campañas de performance ads pueden verse en 2-4 semanas. El SEO, branding y estrategias de contenido son de mediano plazo (3-6 meses). El social media marketing muestra resultados progresivos desde el primer mes. Trabajamos con KPIs medibles desde el día uno para que puedas ver el ROI de tu inversión.",
        },
      },
      {
        "@type": "Question",
        name: "¿Trabajan con empresas de toda Argentina o solo Buenos Aires?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Trabajamos con clientes de todo Argentina (Buenos Aires, Córdoba, Rosario, Mendoza, La Plata y todo el país) y Latinoamérica de forma remota con modalidad flexible. También tenemos presencia en Buenos Aires para reuniones presenciales cuando sea necesario.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué es performance marketing y cómo funciona?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Performance marketing es publicidad digital enfocada en resultados medibles como ventas, leads o conversiones. Gestionamos campañas en Facebook Ads, Instagram Ads, Google Ads y TikTok Ads con optimización constante para maximizar tu ROI. Solo pagas por resultados reales.",
        },
      },
      {
        "@type": "Question",
        name: "¿Por qué elegir Orion MKT como agencia de marketing digital?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Somos especialistas en PyMEs y Startups argentinas. Ofrecemos equipo multidisciplinario de expertos, metodologías ágiles, atención personalizada 24/7, precios accesibles, reportes transparentes y más de 5 proyectos exitosos con ROI promedio de 3x. Tu negocio, nuestro universo.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué incluye el servicio de social media marketing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Incluye gestión de Instagram, Facebook y LinkedIn, creación de contenido visual y copywriting, calendario editorial estratégico, community management (respuestas y engagement), análisis de métricas mensuales y reportes de rendimiento. Todo personalizado para tu marca.",
        },
      },
      {
        "@type": "Question",
        name: "¿Hacen diseño web y tiendas online (e-commerce)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, desarrollamos sitios web modernos y responsivos, landing pages optimizadas para conversión, tiendas online (e-commerce) completas con pasarelas de pago, integración con herramientas de marketing y mantenimiento continuo. Todos optimizados para SEO y experiencia de usuario.",
        },
      },
    ],
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Agencia de Marketing Digital para PyMEs y Startups en Argentina",
    description:
      "Descubrí cómo Orion MKT transforma negocios con estrategias de marketing digital innovadoras, medibles y efectivas. Branding, redes sociales, publicidad digital y más.",
    image: "https://orionmkt.com/og-image.jpg",
    author: {
      "@type": "Organization",
      name: "Orion MKT",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://orionmkt.com/#organization",
      name: "Orion MKT",
      logo: {
        "@type": "ImageObject",
        url: "https://orionmkt.com/logo.png",
      },
    },
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Servicios de Marketing Digital Orion MKT",
    description: "Lista completa de servicios de marketing digital para PyMEs y Startups",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Branding y Diseño de Identidad",
        url: "https://orionmkt.com#servicios",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Social Media Marketing",
        url: "https://orionmkt.com#servicios",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Performance Ads",
        url: "https://orionmkt.com#servicios",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Desarrollo Web y E-commerce",
        url: "https://orionmkt.com#servicios",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Estrategia Digital",
        url: "https://orionmkt.com#servicios",
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "Diseño Creativo",
        url: "https://orionmkt.com#servicios",
      },
    ],
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        strategy="afterInteractive"
      />
    </>
  )
}
