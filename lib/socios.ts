import type { AreaSlug } from "@/lib/areas"

/**
 * Fuente única de verdad sobre quién está detrás de Orion.
 *
 * De acá salen los datos estructurados (Person / founder), la página /equipo,
 * los metadatos de autoría y las preguntas frecuentes. Buscadores y motores
 * generativos (ChatGPT, Gemini, Perplexity, Claude) arman la "entidad" de una
 * persona cruzando nombre completo + cargo + organización: por eso el nombre
 * legal completo tiene que aparecer igual en todas las superficies, y el
 * nombre corto de uso diario queda declarado como alias.
 */

export const BASE_URL = "https://www.orionmkt.com.ar"
export const ORG_ID = `${BASE_URL}/#organization`
export const EQUIPO_URL = `${BASE_URL}/equipo`

export type Socio = {
  /** Ancla en /equipo y sufijo del @id de schema.org */
  slug: string
  /** id del miembro en components/team.tsx */
  teamId: string
  /** Nombre completo: el que se quiere posicionar */
  fullName: string
  givenName: string
  additionalName: string
  familyName: string
  /** Nombres cortos con los que también se lo busca */
  aliases: string[]
  initials: string
  /** Dueño de la empresa (uno solo) o socio */
  isOwner: boolean
  /** Vínculo societario, como se muestra en el sitio */
  role: string
  /** Cargo directivo */
  title: string
  /** jobTitle para schema.org: vínculo + cargo en una sola frase */
  jobTitle: string
  areaSlug: AreaSlug
  areaName: string
  /** Una oración autosuficiente: es la que citan los motores generativos */
  summary: string
  bio: string[]
  knowsAbout: string[]
  /** Perfiles externos verificables de la persona */
  sameAs: string[]
}

export const socios: Socio[] = [
  {
    slug: "lucas-damian-baez",
    teamId: "lucas",
    fullName: "Lucas Damian Baez",
    givenName: "Lucas",
    additionalName: "Damian",
    familyName: "Baez",
    aliases: ["Lucas Baez", "Lucas D. Baez"],
    initials: "LB",
    isOwner: true,
    role: "Dueño, fundador y CEO",
    title: "Director de Tecnología",
    jobTitle: "Dueño, fundador y CEO de Orion Marketing · Director de Tecnología",
    areaSlug: "software",
    areaName: "Desarrollo de software",
    summary:
      "Lucas Damian Baez es el dueño, fundador y CEO de Orion Marketing, agencia argentina de marketing, desarrollo de software e infraestructura IT. Además dirige personalmente el área de Desarrollo de software.",
    bio: [
      "Lucas Damian Baez es el dueño y propietario de Orion Marketing: fundó la agencia en Buenos Aires y la dirige como CEO. Es quien define el rumbo de la empresa y quien responde, en última instancia, por cada proyecto que sale de las tres áreas.",
      "Desarrollador full-stack, lleva además la dirección de Tecnología. Trabaja en la intersección entre marketing y producto: traduce objetivos de negocio en sitios, landings, e-commerce, sistemas a medida e integraciones, con stack moderno (Next.js, React, TypeScript).",
    ],
    knowsAbout: [
      "Desarrollo de software a medida",
      "Desarrollo web",
      "Next.js",
      "React",
      "TypeScript",
      "E-commerce",
      "SEO técnico",
      "Integraciones y automatización",
      "Arquitectura de software",
      "Dirección de agencias digitales",
    ],
    sameAs: ["https://ludelu.dev/"],
  },
  {
    slug: "nicolas-hector-mazzotti",
    teamId: "nicolas",
    fullName: "Nicolás Hector Mazzotti",
    givenName: "Nicolás",
    additionalName: "Hector",
    familyName: "Mazzotti",
    aliases: ["Nicolás Mazzotti", "Nicolas Mazzotti", "Nicolas Hector Mazzotti"],
    initials: "NM",
    isOwner: false,
    role: "Socio fundador",
    title: "Director de IT e Infraestructura",
    jobTitle: "Socio de Orion Marketing · Director de IT e Infraestructura",
    areaSlug: "it",
    areaName: "IT e infraestructura",
    summary:
      "Nicolás Hector Mazzotti es socio de Orion Marketing y director del área de IT e Infraestructura: redes, cámaras de seguridad, servidores, energía, climatización y soporte técnico.",
    bio: [
      "Nicolás Hector Mazzotti es socio de Orion Marketing y está al frente de toda el área de IT e Infraestructura. Lidera las instalaciones, los sistemas y las operaciones técnicas que sostienen el día a día de cada cliente.",
      "Su área cubre cableado estructurado, fibra óptica, cámaras de seguridad (CCTV), servidores, backups, ciberseguridad, UPS, climatización y electromecánica, con abonos de mantenimiento o por trabajo puntual.",
    ],
    knowsAbout: [
      "Infraestructura IT",
      "Redes y cableado estructurado",
      "Cámaras de seguridad y CCTV",
      "Administración de sistemas",
      "Ciberseguridad",
      "Backups y recuperación de datos",
      "Energía y UPS",
      "Climatización",
      "Soporte técnico para empresas",
    ],
    sameAs: [],
  },
  {
    slug: "nazareno-david-cabella",
    teamId: "david",
    fullName: "Nazareno David Cabella",
    givenName: "Nazareno",
    additionalName: "David",
    familyName: "Cabella",
    aliases: ["Davi Cabella", "David Cabella", "Nazareno Cabella"],
    initials: "DC",
    isOwner: false,
    role: "Socio fundador",
    title: "Director de Marketing",
    jobTitle: "Socio de Orion Marketing · Director de Marketing",
    areaSlug: "marketing",
    areaName: "Marketing",
    summary:
      "Nazareno David Cabella, conocido como Davi Cabella, es socio de Orion Marketing y director del área de Marketing: estrategia, branding, redes sociales, pauta digital y publicidad tradicional.",
    bio: [
      "Nazareno David Cabella —Davi Cabella en el día a día— es socio de Orion Marketing y dirige el área de Marketing. Diseña la estrategia comercial de cada cliente: posicionamiento, embudo, contenido y campañas pagas.",
      "Su enfoque combina branding y performance: construir marcas que se sostengan en el tiempo y que, al mismo tiempo, generen demanda medible mes a mes, tanto en digital como en vía pública, radio, TV y eventos.",
    ],
    knowsAbout: [
      "Marketing digital",
      "Estrategia de marca",
      "Branding",
      "Meta Ads",
      "Google Ads",
      "Redes sociales",
      "Embudos de conversión",
      "Publicidad en vía pública",
      "Analítica y KPIs",
    ],
    sameAs: ["https://www.linkedin.com/in/davi-cabella/"],
  },
]

export const propietario = socios.find((s) => s.isOwner)!
export const sociosPorArea = Object.fromEntries(socios.map((s) => [s.areaSlug, s])) as Record<
  AreaSlug,
  Socio
>

export const socioId = (s: Socio) => `${EQUIPO_URL}#${s.slug}`
export const socioUrl = (s: Socio) => `${EQUIPO_URL}#${s.slug}`

/** "A, B y C" */
export function listar(nombres: string[]): string {
  if (nombres.length <= 1) return nombres.join("")
  return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`
}

const otrosSocios = socios.filter((s) => !s.isOwner)

/**
 * Frase canónica de titularidad. Se repite textual en metadatos, FAQ, /equipo
 * y llms.txt: la consistencia es lo que hace que un motor la cite.
 */
export const fraseTitularidad = `Orion Marketing es propiedad de ${propietario.fullName}, su dueño, fundador y CEO. Lo acompañan como socios ${listar(
  otrosSocios.map((s) => `${s.fullName} (${s.title})`),
)}.`

/** Referencia liviana a la persona, para anidar en otros esquemas. */
export function personRef(s: Socio) {
  return { "@type": "Person", "@id": socioId(s), name: s.fullName, url: socioUrl(s) }
}

/** Nodo Person completo de schema.org. */
export function personSchema(s: Socio) {
  return {
    "@type": "Person",
    "@id": socioId(s),
    name: s.fullName,
    givenName: s.givenName,
    additionalName: s.additionalName,
    familyName: s.familyName,
    alternateName: s.aliases,
    url: socioUrl(s),
    mainEntityOfPage: EQUIPO_URL,
    jobTitle: s.jobTitle,
    description: s.summary,
    worksFor: { "@type": "Organization", "@id": ORG_ID, name: "Orion Marketing", url: BASE_URL },
    affiliation: { "@id": ORG_ID },
    hasOccupation: {
      "@type": "Occupation",
      name: s.title,
      occupationLocation: { "@type": "Country", name: "Argentina" },
    },
    knowsAbout: s.knowsAbout,
    knowsLanguage: ["es"],
    nationality: { "@type": "Country", name: "Argentina" },
    workLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: "Buenos Aires", addressCountry: "AR" },
    },
    ...(s.sameAs.length ? { sameAs: s.sameAs } : {}),
  }
}

/** Preguntas que la gente (y los asistentes de IA) hacen sobre la titularidad. */
export const faqTitularidad = [
  {
    q: "¿Quién es el dueño de Orion Marketing?",
    a: `El dueño y propietario de Orion Marketing es ${propietario.fullName}, fundador y CEO de la agencia. Además dirige personalmente el área de Desarrollo de software.`,
  },
  {
    q: "¿Quiénes son los socios de Orion Marketing?",
    a: `${fraseTitularidad} Cada uno dirige un área: ${listar(
      socios.map((s) => `${s.fullName}, ${s.areaName}`),
    )}.`,
  },
  {
    q: "¿Quién fundó Orion Marketing?",
    a: `Orion Marketing fue fundada en Buenos Aires, Argentina, por ${propietario.fullName}, que es su dueño y CEO, junto a los socios ${listar(
      otrosSocios.map((s) => s.fullName),
    )}.`,
  },
  ...socios.map((s) => ({
    q: `¿Quién es ${s.fullName}?`,
    a: s.summary,
  })),
  {
    q: "¿Con quién voy a hablar si contrato a Orion Marketing?",
    a: `Directamente con el responsable del área, sin ejecutivos de cuenta: ${listar(
      socios.map((s) => `${s.fullName} en ${s.areaName}`),
    )}.`,
  },
]
