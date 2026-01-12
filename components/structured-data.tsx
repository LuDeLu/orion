import Script from "next/script"

export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://orionmkt.com.ar/#organization",
    name: "Orion Marketing",
    alternateName: ["Orion MKT", "OrionMKT", "Orion Marketing Digital", "Orion Marketing Argentina"],
    legalName: "Orion Marketing - Agencia de Marketing Digital",
    url: "https://orionmkt.com.ar",
    logo: {
      "@type": "ImageObject",
      "@id": "https://orionmkt.com.ar/#logo",
      url: "https://orionmkt.com.ar/logo.png",
      contentUrl: "https://orionmkt.com.ar/logo.png",
      width: 512,
      height: 512,
      caption: "Orion Marketing Logo",
    },
    image: {
      "@type": "ImageObject",
      url: "https://orionmkt.com.ar/og-image.png",
      width: 1200,
      height: 630,
    },
    description:
      "Orion Marketing es la agencia de marketing digital líder en Argentina especializada en PyMEs y Startups. Ofrecemos branding, redes sociales, publicidad digital (Google Ads, Facebook Ads, Instagram Ads), diseño web y estrategias con ROI medible. Modalidad flexible y presencia en toda Argentina.",
    foundingDate: "2020",
    slogan: "Tu negocio, nuestro universo",
    brand: {
      "@type": "Brand",
      name: "Orion Marketing",
      alternateName: "Orion MKT",
      logo: "https://orionmkt.com.ar/logo.png",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
      addressRegion: "Buenos Aires",
      addressLocality: "Buenos Aires",
      postalCode: "1000",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -34.6037,
      longitude: -58.3816,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+54-9-11-5656-6083",
        contactType: "customer service",
        email: "orionmkt.ar@gmail.com",
        areaServed: ["AR", "UY", "CL", "MX", "CO", "PE"],
        availableLanguage: ["Spanish", "English"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      },
      {
        "@type": "ContactPoint",
        telephone: "+54-9-11-5656-6083",
        contactType: "sales",
        email: "orionmkt.ar@gmail.com",
        areaServed: "AR",
      },
    ],
    sameAs: [
      "https://www.instagram.com/orionmkt.ar",
      "https://www.linkedin.com/company/orionmkt-ar/",
      "https://twitter.com/orionmkt",
      "https://facebook.com/orionmkt",
      "https://wa.me/5491156566083",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 5,
      maxValue: 20,
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
      "TikTok Ads",
      "Growth Marketing",
      "E-commerce",
      "Estrategia Digital",
      "Diseño Gráfico",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Marketing Digital para PyMEs",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Marketing Digital para Startups",
        },
      },
    ],
  }

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://orionmkt.com.ar/#service",
    serviceType: "Marketing Digital",
    name: "Servicios de Marketing Digital - Orion Marketing",
    description: "Servicios profesionales de marketing digital de Orion Marketing para empresas en Argentina",
    provider: {
      "@type": "Organization",
      "@id": "https://orionmkt.com.ar/#organization",
      name: "Orion Marketing",
    },
    brand: {
      "@type": "Brand",
      name: "Orion Marketing",
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Argentina",
      },
      {
        "@type": "City",
        name: "Buenos Aires",
      },
      {
        "@type": "City",
        name: "Córdoba",
      },
      {
        "@type": "City",
        name: "Rosario",
      },
      {
        "@type": "City",
        name: "Mendoza",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de Marketing Digital Orion Marketing",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Branding y Diseño de Identidad",
            description:
              "Identidad visual profesional que captura la esencia de tu negocio. Logo, paleta de colores, tipografía y guía de marca completa para PyMEs y Startups por Orion Marketing.",
            serviceType: "Branding",
            provider: {
              "@type": "Organization",
              name: "Orion Marketing",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Social Media Marketing",
            description:
              "Gestión profesional de redes sociales por Orion Marketing. Estrategia, creación de contenido, community management y análisis en Instagram, Facebook, LinkedIn y TikTok.",
            serviceType: "Social Media",
            provider: {
              "@type": "Organization",
              name: "Orion Marketing",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Performance Ads y Publicidad Digital",
            description:
              "Campañas publicitarias con ROI medible de Orion Marketing. Facebook Ads, Instagram Ads, Google Ads, TikTok Ads y remarketing estratégico optimizado.",
            serviceType: "Performance Ads",
            provider: {
              "@type": "Organization",
              name: "Orion Marketing",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Desarrollo Web y E-commerce",
            description:
              "Sitios web y tiendas online que convierten. Diseño responsivo, SEO optimizado y alta conversión por el equipo de desarrollo de Orion Marketing.",
            serviceType: "Desarrollo Web",
            provider: {
              "@type": "Organization",
              name: "Orion Marketing",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Estrategia Digital",
            description:
              "Planes estratégicos basados en datos por Orion Marketing. Análisis de mercado, definición de KPIs y optimización continua para tu negocio.",
            serviceType: "Estrategia Digital",
            provider: {
              "@type": "Organization",
              name: "Orion Marketing",
            },
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Diseño Creativo",
            description:
              "Diseño gráfico profesional de Orion Marketing. Posts, stories, piezas publicitarias y material visual para todas tus campañas digitales.",
            serviceType: "Diseño Creativo",
            provider: {
              "@type": "Organization",
              name: "Orion Marketing",
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
          name: "María González",
        },
        datePublished: "2024-11-15",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Excelente experiencia con Orion Marketing. Nos ayudaron a triplicar nuestras ventas online en solo 3 meses. Muy profesionales y atentos.",
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Carlos Rodríguez",
        },
        datePublished: "2024-10-20",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Orion Marketing transformó nuestra presencia digital. El equipo es muy profesional y los resultados superaron nuestras expectativas.",
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Laura Fernández",
        },
        datePublished: "2024-09-10",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody:
          "Increíble trabajo en branding y redes sociales. Orion Marketing realmente entiende las necesidades de las PyMEs argentinas.",
      },
    ],
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://orionmkt.com.ar/#localbusiness",
    name: "Orion Marketing",
    alternateName: ["Orion MKT", "Orion Marketing Digital", "Orion Marketing Argentina"],
    description: "Agencia de marketing digital líder en Argentina para PyMEs y Startups",
    image: "https://orionmkt.com.ar/logo.png",
    url: "https://orionmkt.com.ar",
    telephone: "+54-9-11-5656-6083",
    email: "orionmkt.ar@gmail.com",
    priceRange: "$$",
    currenciesAccepted: "ARS, USD",
    paymentAccepted: "Cash, Credit Card, Debit Card, Bank Transfer, MercadoPago",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Buenos Aires",
      addressLocality: "Buenos Aires",
      addressRegion: "Buenos Aires",
      postalCode: "1000",
      addressCountry: "AR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -34.6037,
      longitude: -58.3816,
    },
    areaServed: [
      {
        "@type": "Country",
        name: "Argentina",
      },
      {
        "@type": "GeoCircle",
        geoMidpoint: {
          "@type": "GeoCoordinates",
          latitude: -34.6037,
          longitude: -58.3816,
        },
        geoRadius: "500000",
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/orionmkt.ar",
      "https://www.linkedin.com/company/orionmkt-ar/",
      "https://twitter.com/orionmkt",
      "https://facebook.com/orionmkt",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
    },
    hasMap: "https://maps.google.com/?q=Buenos+Aires+Argentina",
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://orionmkt.com.ar/#website",
    url: "https://orionmkt.com.ar",
    name: "Orion Marketing",
    alternateName: ["Orion MKT", "OrionMKT"],
    description: "Orion Marketing - Agencia de Marketing Digital líder en Argentina para PyMEs y Startups",
    publisher: {
      "@id": "https://orionmkt.com.ar/#organization",
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://orionmkt.com.ar/?s={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
      {
        "@type": "ContactAction",
        target: "https://orionmkt.com.ar/#contacto",
      },
    ],
    inLanguage: "es-AR",
    copyrightYear: 2024,
    copyrightHolder: {
      "@id": "https://orionmkt.com.ar/#organization",
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Orion Marketing - Inicio",
        item: "https://orionmkt.com.ar",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Servicios de Marketing Digital",
        item: "https://orionmkt.com.ar/#servicios",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Sobre Orion Marketing",
        item: "https://orionmkt.com.ar/#nosotros",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Casos de Éxito",
        item: "https://orionmkt.com.ar/#casos",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Contacto",
        item: "https://orionmkt.com.ar/#contacto",
      },
    ],
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué es Orion Marketing y qué servicios ofrece?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Orion Marketing (también conocida como Orion MKT) es una agencia de marketing digital líder en Argentina especializada en PyMEs y Startups. Ofrecemos branding y diseño de identidad, social media marketing (Instagram, Facebook, LinkedIn, TikTok), performance ads (Facebook Ads, Instagram Ads, Google Ads, TikTok Ads), diseño web responsivo, e-commerce, estrategia digital y diseño creativo.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto cuesta contratar a Orion Marketing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Los costos de los servicios de Orion Marketing varían según las necesidades de cada negocio y los servicios requeridos. Ofrecemos paquetes flexibles adaptados desde pequeñas PyMEs hasta startups en crecimiento. Contactanos para una consultoría gratuita y presupuesto personalizado.",
        },
      },
      {
        "@type": "Question",
        name: "¿En cuánto tiempo veo resultados con Orion Marketing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Con Orion Marketing, los primeros resultados en campañas de performance ads pueden verse en 2-4 semanas. El SEO, branding y estrategias de contenido son de mediano plazo (3-6 meses). El social media marketing muestra resultados progresivos desde el primer mes. Trabajamos con KPIs medibles desde el día uno.",
        },
      },
      {
        "@type": "Question",
        name: "¿Orion Marketing trabaja con empresas de toda Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, Orion Marketing trabaja con clientes de toda Argentina (Buenos Aires, Córdoba, Rosario, Mendoza, La Plata y todo el país) y Latinoamérica de forma remota. Tenemos presencia en Buenos Aires para reuniones presenciales cuando sea necesario.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo contacto a Orion Marketing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Podés contactar a Orion Marketing a través de WhatsApp al +54 9 11 5656-6083, por email a orionmkt.ar@gmail.com, o completando el formulario de contacto en nuestra web orionmkt.com.ar. Ofrecemos consultoría gratuita inicial.",
        },
      },
      {
        "@type": "Question",
        name: "¿Por qué elegir Orion Marketing como agencia de marketing digital?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Orion Marketing se destaca por: especialización en PyMEs y Startups argentinas, equipo multidisciplinario de expertos, metodologías ágiles, atención personalizada, precios accesibles, reportes transparentes y más de 50 proyectos exitosos con ROI promedio de 3x. Tu negocio, nuestro universo.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué incluye el servicio de social media de Orion Marketing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El servicio de social media de Orion Marketing incluye: gestión de Instagram, Facebook, LinkedIn y TikTok, creación de contenido visual y copywriting, calendario editorial estratégico, community management, análisis de métricas mensuales y reportes de rendimiento personalizados.",
        },
      },
      {
        "@type": "Question",
        name: "¿Orion Marketing hace diseño web y tiendas online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, Orion Marketing desarrolla sitios web modernos y responsivos, landing pages optimizadas para conversión, tiendas online (e-commerce) completas con pasarelas de pago, integración con herramientas de marketing y mantenimiento continuo. Todos optimizados para SEO.",
        },
      },
    ],
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://orionmkt.com.ar/#webpage",
    url: "https://orionmkt.com.ar",
    name: "Orion Marketing | Agencia de Marketing Digital Argentina",
    description:
      "Orion Marketing es la agencia de marketing digital líder en Argentina para PyMEs y Startups. Branding, Social Media, Ads, Web.",
    isPartOf: {
      "@id": "https://orionmkt.com.ar/#website",
    },
    about: {
      "@id": "https://orionmkt.com.ar/#organization",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://orionmkt.com.ar/og-image.png",
    },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    inLanguage: "es-AR",
    potentialAction: [
      {
        "@type": "ReadAction",
        target: ["https://orionmkt.com.ar"],
      },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".hero-description"],
    },
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": "https://orionmkt.com.ar/#article",
    headline: "Orion Marketing - Agencia de Marketing Digital para PyMEs y Startups en Argentina",
    alternativeHeadline: "Orion MKT - Tu negocio, nuestro universo",
    description:
      "Descubrí cómo Orion Marketing transforma negocios con estrategias de marketing digital innovadoras, medibles y efectivas. Branding, redes sociales, publicidad digital y más.",
    image: "https://orionmkt.com.ar/og-image.png",
    author: {
      "@type": "Organization",
      name: "Orion Marketing",
      url: "https://orionmkt.com.ar",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://orionmkt.com.ar/#organization",
      name: "Orion Marketing",
      logo: {
        "@type": "ImageObject",
        url: "https://orionmkt.com.ar/logo.png",
      },
    },
    datePublished: "2020-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://orionmkt.com.ar",
    },
    keywords: "orion marketing, orion mkt, marketing digital argentina, agencia marketing, pymes, startups",
  }

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Servicios de Marketing Digital de Orion Marketing",
    description: "Lista completa de servicios de marketing digital que ofrece Orion Marketing para PyMEs y Startups",
    numberOfItems: 6,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Branding y Diseño de Identidad por Orion Marketing",
        url: "https://orionmkt.com.ar/#servicios",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Social Media Marketing por Orion Marketing",
        url: "https://orionmkt.com.ar/#servicios",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Performance Ads por Orion Marketing",
        url: "https://orionmkt.com.ar/#servicios",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Desarrollo Web y E-commerce por Orion Marketing",
        url: "https://orionmkt.com.ar/#servicios",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Estrategia Digital por Orion Marketing",
        url: "https://orionmkt.com.ar/#servicios",
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "Diseño Creativo por Orion Marketing",
        url: "https://orionmkt.com.ar/#servicios",
      },
    ],
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Servicios de Marketing Digital Orion Marketing",
    description: "Paquetes de marketing digital profesional para PyMEs y Startups por Orion Marketing Argentina",
    brand: {
      "@type": "Brand",
      name: "Orion Marketing",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "ARS",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Orion Marketing",
      },
    },
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        strategy="beforeInteractive"
      />
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        strategy="beforeInteractive"
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
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        strategy="afterInteractive"
      />
    </>
  )
}
