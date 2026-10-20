/**
 * Prensa / notas destacadas.
 *
 * Cada entrada es una página real e indexable bajo /prensa/<slug>. El contenido
 * está basado en notas de prensa publicadas sobre los desarrollos de ADN
 * Developers y su director, Elbio Stoler, con atribución a la fuente original.
 * La estructura (encabezados, ficha, galería, datos estructurados) está pensada
 * para posicionar la entidad "Elbio Stoler" con contenido útil y verificable.
 */

export type PrensaImage = {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
}

export type PrensaBlock = {
  heading?: string
  paragraphs: string[]
}

export type PrensaQuote = {
  text: string
  author: string
  role: string
}

export type Nota = {
  slug: string
  /** H1 de la página (incluye la palabra clave) */
  title: string
  /** <title> del documento */
  metaTitle: string
  metaDescription: string
  keywords: string[]
  eyebrow: string
  /** Bajada / lead */
  excerpt: string
  datePublished: string
  dateModified: string
  author: string
  readingMinutes: number
  source: { name: string; url: string }
  hero: PrensaImage
  blocks: PrensaBlock[]
  quote?: PrensaQuote
  /** Ficha técnica del desarrollo, si aplica */
  ficha?: { label: string; value: string }[]
  gallery: PrensaImage[]
  tags: string[]
  relatedSlug: string
}

const TODAY = new Date().toISOString().split("T")[0]

export const notas: Nota[] = [
  {
    slug: "elbio-stoler-dome-green-soho",
    title: "Elbio Stoler presenta Dome Green Soho: la torre premium de ADN Developers en Palermo",
    metaTitle:
      "Elbio Stoler y Dome Green Soho | El proyecto premium de ADN Developers en Av. Córdoba",
    metaDescription:
      "Elbio Stoler, director de ADN Developers, presenta Dome Green Soho: dos torres premium en Av. Córdoba 4340, entre Palermo y Villa Crespo, con 116 unidades de 1 a 4 dormitorios y amenities de alta gama.",
    keywords: [
      "Elbio Stoler",
      "Elbio Stoler ADN Developers",
      "Elbio Stoler Dome Green Soho",
      "ADN Developers",
      "Dome Green Soho",
      "Av. Córdoba 4340",
      "desarrollos inmobiliarios Palermo",
      "inversión inmobiliaria Buenos Aires",
      "torre premium Palermo Soho",
      "Elbio Stoler desarrollador",
    ],
    eyebrow: "Desarrollos · Palermo Soho",
    excerpt:
      "El director de ADN Developers, Elbio Stoler, lanza Dome Green Soho: dos torres de diseño moderno en Av. Córdoba 4340, un punto donde convergen la diversidad de Villa Crespo y la intensidad de Palermo. 116 unidades de 1 a 4 dormitorios, amenities premium y una ubicación con conectividad total.",
    datePublished: "2021-05-18",
    dateModified: TODAY,
    author: "Elbio Stoler — ADN Developers",
    readingMinutes: 4,
    source: {
      name: "Arquimaster",
      url: "https://www.arquimaster.com.ar/web/adn-developers-presenta-dome-green-soho/",
    },
    hero: {
      src: "/prensa/dome-green-soho.jpg",
      alt: "Elbio Stoler, director de ADN Developers, presenta el proyecto Dome Green Soho en Av. Córdoba, Palermo",
      caption:
        "Dome Green Soho, el desarrollo de ADN Developers dirigido por Elbio Stoler, en Av. Córdoba 4340.",
      width: 698,
      height: 364,
    },
    blocks: [
      {
        paragraphs: [
          "Dentro de los procesos de cambio que atraviesa la ciudad de Buenos Aires se destaca la gran transformación que están experimentando algunas de sus principales avenidas. La Av. Córdoba, por ejemplo, abandonó el perfil netamente comercial y la concentración de outlets que la caracterizaban, y hoy muestra una renovada identidad residencial de la mano de los nuevos proyectos inmobiliarios que desembarcaron en ella.",
          "En ese contexto, Elbio Stoler, director de ADN Developers, presenta Dome Green Soho, un emprendimiento que reafirma la apuesta de la desarrolladora por las zonas de mayor crecimiento residencial de la ciudad.",
        ],
      },
      {
        heading: "Una ubicación donde convergen dos barrios",
        paragraphs: [
          "Ubicada en Av. Córdoba 4340, la obra se emplaza en un punto donde confluyen la diversidad de Villa Crespo y la seductora intensidad de Palermo. La zona posibilita construir en altura, por lo que el emprendimiento asegura ambientes luminosos y con buenas vistas.",
          "Suma valor, además, por su excelente conectividad —cuenta con subte y gran variedad de transporte público— y por los accesos directos que permiten su conexión a todos los puntos de la ciudad. Está a pasos de Palermo Soho, cercano a la Plaza Serrano y la Plaza Armenia, y próximo a las avenidas Scalabrini Ortiz y Estado de Israel.",
        ],
      },
      {
        heading: "El proyecto: dos torres, 116 unidades y amenities de alta gama",
        paragraphs: [
          "Dome Green Soho se desarrolla en dos torres de moderno diseño, servicios premium y flexibilidad de opciones. Ofrece 15 niveles, 116 unidades de 1 a 4 dormitorios —con superficies que oscilan entre los 32 m² y los 200 m²— y 2 subsuelos de cocheras.",
          "Entre sus amenities se destacan SUM y expansión en planta baja, parrilla, gimnasio, kids club y playground, laundry, sauna y ducha finlandesa, además de la posibilidad de disfrutar de una piscina interior/exterior.",
        ],
      },
      {
        heading: "El concepto DOME",
        paragraphs: [
          "La línea DOME de ADN Developers condensa una idea de producto: unidades amplias y luminosas, con profusión de amenities, en las que el diseño, las vistas y el confort juegan un rol preponderante. Dome Green Soho está orientado mayormente a un público joven en la búsqueda de una mejor calidad de vida, y resulta atractivo tanto para invertir como para vivir.",
        ],
      },
    ],
    quote: {
      text: "Un excelente proyecto en una de las zonas de mayor crecimiento residencial de la ciudad. Desarrollamos el concepto DOME con el significado «Dinámico, Original, Moderno y Elegante», y se ajusta perfectamente a lo que esta torre premium ofrece: unidades amplias y luminosas en las que el diseño, las vistas y el confort juegan un rol preponderante.",
      author: "Elbio Stoler",
      role: "Director de ADN Developers",
    },
    ficha: [
      { label: "Desarrollador", value: "ADN Developers — Elbio Stoler" },
      { label: "Ubicación", value: "Av. Córdoba 4340, CABA" },
      { label: "Barrios", value: "Palermo / Villa Crespo" },
      { label: "Torres", value: "2 torres · 15 niveles" },
      { label: "Unidades", value: "116 · de 1 a 4 dormitorios" },
      { label: "Superficies", value: "32 m² a 200 m²" },
      { label: "Cocheras", value: "2 subsuelos" },
      { label: "Amenities", value: "SUM, gimnasio, piscina, sauna, kids club y más" },
    ],
    gallery: [
      {
        src: "/prensa/adn-palermo-residence.jpg",
        alt: "Desarrollo residencial DOME de ADN Developers dirigido por Elbio Stoler en Palermo",
        caption: "Línea DOME Residence de ADN Developers en Palermo.",
        width: 804,
        height: 756,
      },
      {
        src: "/prensa/adn-palermo-boulevard.jpg",
        alt: "Proyecto DOME Boulevard de ADN Developers, la desarrolladora de Elbio Stoler",
        caption: "DOME Boulevard, otro de los desarrollos premium de ADN Developers.",
        width: 804,
        height: 756,
      },
    ],
    tags: ["Elbio Stoler", "ADN Developers", "Dome Green Soho", "Palermo", "Av. Córdoba"],
    relatedSlug: "elbio-stoler-de-lo-comercial-a-lo-residencial",
  },
  {
    slug: "elbio-stoler-de-lo-comercial-a-lo-residencial",
    title:
      "Elbio Stoler: «De lo comercial a lo residencial», la columna del director de ADN Developers",
    metaTitle:
      "Elbio Stoler (ADN Developers): de lo comercial a lo residencial | Columna de opinión",
    metaDescription:
      "Columna de Elbio Stoler, director y fundador de ADN Developers, sobre la transformación urbana de Buenos Aires: cómo la Av. Córdoba pasó de eje comercial a identidad residencial y la Av. del Libertador se consolida como polo corporativo.",
    keywords: [
      "Elbio Stoler",
      "Elbio Stoler opinión",
      "Elbio Stoler ADN Developers",
      "Elbio Stoler columna",
      "ADN Developers",
      "transformación urbana Buenos Aires",
      "Av. Córdoba residencial",
      "Av. del Libertador oficinas",
      "mercado inmobiliario Palermo",
      "Elbio Stoler desarrollador inmobiliario",
    ],
    eyebrow: "Opinión · Mercado inmobiliario",
    excerpt:
      "En esta columna, Elbio Stoler —director y fundador de ADN Developers— analiza cómo las avenidas porteñas reescriben su identidad: la Av. Córdoba se vuelve residencial y la Av. del Libertador se consolida como la vedette del mercado corporativo.",
    datePublished: "2021-03-30",
    dateModified: TODAY,
    author: "Elbio Stoler — Director de ADN Developers",
    readingMinutes: 5,
    source: {
      name: "Arquimaster",
      url: "https://www.arquimaster.com.ar/web/de-lo-comercial-a-lo-residencial/",
    },
    hero: {
      src: "/prensa/av-cordoba-libertador.jpg",
      alt: "Elbio Stoler, director de ADN Developers, analiza la transformación de las avenidas de Buenos Aires",
      caption:
        "La transformación urbana de Buenos Aires, analizada por Elbio Stoler (ADN Developers).",
      width: 698,
      height: 364,
    },
    blocks: [
      {
        paragraphs: [
          "A través del tiempo, la ciudad va experimentando diversos procesos de transformación. Muchas de sus áreas urbanas se modifican, sea como resultado de las inversiones realizadas en obras públicas o privadas, de los cambios en el estilo de vida o de los gustos que exhiben las nuevas generaciones.",
          "En Palermo Soho, por ejemplo, estas renovaciones provienen de algunas de sus principales avenidas, en las que se levantan modernas torres que conviven armoniosamente con las edificaciones bajas de sus arboladas calles internas: una mixtura que reafirma su encantadora identidad barrial.",
        ],
      },
      {
        heading: "La Av. Córdoba: de eje comercial a identidad residencial",
        paragraphs: [
          "A partir de la llegada de nuevos proyectos inmobiliarios de gran valor al barrio, tanto la Av. Córdoba —un eje comercial que concentraba gran número de outlets— como la desdibujada Scalabrini Ortiz se reconvirtieron, aportando una nueva identidad residencial a la zona.",
          "El área abandonó su bohemia para surgir como un bastión cosmopolita, no solo turístico sino también para los propios porteños, en el que se disfruta de una variada oferta cultural y gastronómica, así como de su vital movida nocturna. El incremento de las bicisendas y la eliminación del cordón cuneta en muchas de sus calles contribuyeron, además, al auge de la movilidad sustentable.",
          "Hoy ambas avenidas se han vuelto claves en el crecimiento de la zona y surgen nuevos proyectos residenciales: torres premium que ofrecen unidades de 1 a 4 dormitorios, de entre 40 y 150 m², con profusión de amenities, orientadas a un público joven que las demanda en la búsqueda de una mejor calidad de vida.",
        ],
      },
      {
        heading: "La Av. del Libertador: la vedette del mercado corporativo",
        paragraphs: [
          "Una situación inversa se aprecia en el eje de la Av. del Libertador —desde Monroe hasta La Pampa—, un elegante y consolidado sector residencial que cuenta con una completa infraestructura comercial y gastronómica, cómodos accesos y edificios de oficinas de categoría que crecen de modo exponencial. Por eso el área se está convirtiendo en la vedette del mercado corporativo.",
          "Esta transformación está vinculada a la tendencia de las empresas por ofrecer alternativas más confortables de trabajo y establecerse en las cercanías de sus empleados, de modo de facilitarles el traslado y la movilidad. Este acceso al lugar de trabajo a escala peatonal es un diferencial muy valorado.",
          "En definitiva, entendemos fundamental destacar el rol clave que las avenidas de la ciudad representan en su evolución y crecimiento.",
        ],
      },
      {
        heading: "Sobre el autor",
        paragraphs: [
          "ADN Developers, la desarrolladora fundada por Elbio Stoler, ha experimentado un gran crecimiento en los últimos años. Con una extensa trayectoria en el mercado inmobiliario, sus proyectos en la ciudad se destacan por sus diferenciales de calidad y confort, su nivel de construcción y sus terminaciones de alta gama.",
        ],
      },
    ],
    quote: {
      text: "Entendemos fundamental destacar el rol clave que las avenidas de la ciudad representan en su evolución y crecimiento.",
      author: "Elbio Stoler",
      role: "Director y fundador de ADN Developers",
    },
    gallery: [
      {
        src: "/prensa/adn-torre-arcos.jpg",
        alt: "Torre residencial de ADN Developers, la desarrolladora dirigida por Elbio Stoler, en Palermo",
        caption: "Desarrollo en altura de ADN Developers, en línea con la nueva identidad residencial de la zona.",
        width: 800,
        height: 1535,
      },
      {
        src: "/prensa/adn-palermo-boulevard.jpg",
        alt: "Proyecto DOME de ADN Developers dirigido por Elbio Stoler en un eje en transformación de Buenos Aires",
        caption: "Línea DOME de ADN Developers sobre un eje residencial en crecimiento.",
        width: 804,
        height: 756,
      },
    ],
    tags: ["Elbio Stoler", "ADN Developers", "Opinión", "Av. Córdoba", "Av. del Libertador"],
    relatedSlug: "elbio-stoler-dome-green-soho",
  },
]

export const notasSlugs = notas.map((n) => n.slug)

export function getNota(slug: string): Nota | undefined {
  return notas.find((n) => n.slug === slug)
}
