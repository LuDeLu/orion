/**
 * Contrato de traducción del sitio de Orion.
 *
 * `lib/areas.ts` sigue siendo la fuente estructural (slugs, íconos, colores,
 * rutas) y además el original en español. Este contrato describe el texto
 * visible del chrome y de las secciones, para que cada idioma lo provea
 * completo y TypeScript avise si falta algo.
 */

export type Locale = "es" | "en" | "pt"

export const LOCALES: Locale[] = ["es", "en", "pt"]

export interface Dict {
  /** Etiqueta BCP-47 para <html lang> */
  locale: string
  /** Nombre del idioma en su propio idioma */
  langName: string
  /** Sigla para el selector */
  langShort: string

  nav: {
    areas: string
    casos: string
    nosotros: string
    equipo: string
    contacto: string
    cta: string
    ctaLong: string
    available: string
  }

  a11y: {
    home: string
    openMenu: string
    closeMenu: string
    changeLanguage: string
    toLight: string
    toDark: string
    backToAreas: string
  }

  /** Página 404 y páginas legales: rutas sin sección propia en el sitio */
  notFound: {
    kicker: string
    title: string
    lead: string
    home: string
    contact: string
    areasLabel: string
  }

  legal: {
    updated: string
    privacyTitle: string
    privacyLead: string
    termsTitle: string
    termsLead: string
    /** Cada bloque es un título con sus párrafos */
    privacySections: { title: string; body: string[] }[]
    termsSections: { title: string; body: string[] }[]
    backHome: string
  }

  hero: {
    /** Frase de contexto sobre el tríptico: qué es Orion, antes de pedir que elijan */
    intro: string
    titleStart: string
    titleHighlight: string
    lead: string
    pick: string
    viewArea: string
    notSure: string
    badges: string[]
  }

  /**
   * Texto que refuerza, en cada superficie donde aparece un área, que quien
   * la maneja es un dueño de la agencia y no un empleado ni un ejecutivo de
   * cuentas. Se repite a propósito: es un argumento de venta, no un dato.
   */
  owner: {
    /** Etiqueta sobre el nombre en la ficha del área */
    label: string
    /** Encabezado del bloque de socios en contacto */
    meetTitle: string
    /** Lleva {name} y {role} */
    direct: string
    /** Refuerzo negativo: con quién NO vas a hablar */
    noAccountManager: string
    /** Lleva {name}. Cierre del CTA de cada área */
    ctaLine: string
  }

  areasSection: {
    kicker: string
    titleStart: string
    titleHighlight: string
    /** Lleva {families} y {items} */
    lead: string
    servicesLabel: string
    noFitTitle: string
    noFitBody: string
    noFitCta: string
  }

  about: {
    kicker: string
    titleStart: string
    titleHighlight: string
    p1: string
    p2: string
    features: string[]
    sheetTitle: string
    sheet: { label: string; value: string }[]
  }

  areaPage: {
    problemsKicker: string
    problemsTitle: string
    catalogKicker: string
    /** Lleva {area} */
    catalogTitle: string
    /** Lleva {families} e {items} */
    catalogLead: string
    whatsappCta: string
    quoteCta: string
    seeAllCta: string
    starLabel: string
    consultPrefix: string
    processKicker: string
    processTitle: string
    crossKicker: string
    crossTitle: string
    crossLead: string
    ctaTitlePrefix: string
    ctaLead: string
    ctaForm: string
    ctaWhatsapp: string
    ctaMail: string
  }

  capability: {
    eyebrow: string
    title: string
    highlight: string
    description: string
    cta: string
    points: { title: string; description: string }[]
  }

  brands: {
    kicker: string
    titleStart: string
    titleHighlight: string
    lead: string
    activeBrands: string
    industries: string
    inProduction: string
    realCase: string
    viewCase: string
    dragHint: string
    /** Clave = nombre de la marca en lib/... */
    industryByBrand: Record<string, string>
    taglineByBrand: Record<string, string>
  }

  cases: {
    kicker: string
    titleStart: string
    titleHighlight: string
    lead: string
    caseLabel: string
    clientLabel: string
    challengeLabel: string
    solutionLabel: string
    resultsLabel: string
    ctaQuestion: string
    ctaButton: string
    items: {
      industry: string
      title: string
      challenge: string
      solution: string
      results: { metric: string; label: string }[]
    }[]
  }

  testimonials: {
    kicker: string
    titleStart: string
    titleHighlight: string
    lead: string
    items: { quote: string; role: string }[]
  }

  team: {
    kicker: string
    titleStart: string
    titleHighlight: string
    lead: string
    viewProfile: string
    details: string
    leadsPrefix: string
    areaLed: string
    specialties: string
    portfolio: string
    /** Clave = id del miembro en components/team.tsx */
    members: Record<string, { role: string; area: string; short: string; bio: string[] }>
  }

  contact: {
    kicker: string
    titleStart: string
    titleHighlight: string
    lead: string
    name: string
    phone: string
    email: string
    projectType: string
    projectOptions: string[]
    message: string
    submit: string
    submitting: string
    /** Sufijo de los campos opcionales, para no dejarlo librado al placeholder */
    optional: string
    requiredHint: string
    /** Título del cartel de error; el cuerpo ofrece las vías alternativas */
    errorTitle: string
    errorBody: string
    errorRetry: string
    errorWhatsapp: string
    errorMail: string
    infoTitle: string
    labels: { phone: string; email: string; hours: string }
    hoursValue: string
    whatsappLead: string
    whatsappCta: string
  }

  qrContact: {
    dismissLabel: string
    saveContact: string
    closeLabel: string
    modalTitle: string
    modalSubtitle: string
    namePlaceholder: string
    emailPlaceholder: string
    phonePlaceholder: string
    companyPlaceholder: string
    messagePlaceholder: string
    successMsg: string
    sendingLabel: string
    sentLabel: string
    sendLabel: string
    consentText: string
    genericError: string
    networkError: string
  }

  footer: {
    description: string
    areasHeading: string
    companyHeading: string
    location: string
    /** Lleva {year} */
    copyright: string
    privacy: string
    terms: string
  }
}
