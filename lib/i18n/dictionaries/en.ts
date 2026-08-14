import type { Dict } from "../types"

export const en: Dict = {
  locale: "en",
  langName: "English",
  langShort: "EN",

  nav: {
    areas: "Areas",
    casos: "Case studies",
    nosotros: "About",
    equipo: "Team",
    contacto: "Contact",
    cta: "Get a proposal",
    ctaLong: "Get my proposal",
    available: "Available for new projects",
  },

  a11y: {
    home: "Orion Marketing — Home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    changeLanguage: "Change language",
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    backToAreas: "Back to the three areas",
  },

  notFound: {
    kicker: "Error 404",
    title: "This page doesn't exist",
    lead: "The link may be outdated or the page may have moved. From here you can get back to any part of the site.",
    home: "Go to homepage",
    contact: "Contact us",
    areasLabel: "Or go straight to an area",
  },

  legal: {
    updated: "Last updated: August 2026",
    backHome: "Back to homepage",
    privacyTitle: "Privacy policy",
    privacyLead: "What data we ask for, what we use it for, and how to ask us to delete it.",
    privacySections: [
      {
        title: "Who is responsible for your data",
        body: [
          "Orion Marketing, based in Buenos Aires, Argentina, is the controller of the data submitted through this site. For any question about your data, write to hola@orionmkt.com.ar.",
        ],
      },
      {
        title: "What data we collect",
        body: [
          "Whatever you voluntarily enter in the contact form: name, phone, email, the type of service you're interested in and the message you leave us.",
          "We also collect anonymous, aggregated browsing data (page views, traffic source, device type) through analytics tools. That data does not identify you individually.",
        ],
      },
      {
        title: "What we use it for",
        body: [
          "Only to answer your enquiry, prepare a proposal and maintain the commercial contact arising from it.",
          "We do not sell or transfer your data. It is only shared with the providers that make the service possible: the platform that processes the form submission and the site's analytics tool.",
        ],
      },
      {
        title: "How long we keep it",
        body: [
          "For as long as the commercial relationship lasts and for the time needed to meet legal or contractual obligations. If you ask us to delete it, we delete it.",
        ],
      },
      {
        title: "Your rights",
        body: [
          "You may ask us at any time to access, rectify, update or delete your data by writing to hola@orionmkt.com.ar. We respond within the terms set by Argentina's Personal Data Protection Act (Law 25.326).",
          "The Agencia de Acceso a la Información Pública, as the supervisory authority for Law 25.326, handles complaints and claims from people whose rights are affected.",
        ],
      },
      {
        title: "Cookies",
        body: [
          "We use first- and third-party cookies for analytics and campaign measurement. You can block or delete them from your browser settings; the site still works without them.",
        ],
      },
    ],
    termsTitle: "Terms and conditions",
    termsLead: "The rules for using this site and the scope of what we publish on it.",
    termsSections: [
      {
        title: "Scope",
        body: [
          "This site is informational. Service descriptions, catalogues and published case studies are for reference and do not constitute a contractual offer.",
          "Submitting the contact form does not mean hiring any service and creates no obligation for you or for us: it is the start of a conversation.",
        ],
      },
      {
        title: "Quotes and proposals",
        body: [
          "Every proposal is delivered in writing, with scope, timelines and price detailed. Prices stated in a proposal are valid for the period indicated in it.",
          "Work is considered contracted only when the proposal is expressly accepted by both parties.",
        ],
      },
      {
        title: "Intellectual property",
        body: [
          "The Orion brand, the site design, its copy and images belong to Orion Marketing unless stated otherwise.",
          "Client logos and trade names shown on the site belong to their respective owners and appear solely as a reference to work carried out.",
        ],
      },
      {
        title: "Liability",
        body: [
          "We aim to keep the published information current and accurate, but the site is provided as is. We are not liable for service interruptions or for the content of third-party sites linked from here.",
        ],
      },
      {
        title: "Governing law",
        body: [
          "These terms are governed by the laws of the Argentine Republic. Any dispute shall be submitted to the ordinary courts of the City of Buenos Aires.",
        ],
      },
    ],
  },

  hero: {
    intro:
      "We're Orion: a marketing, software development and IT infrastructure agency, based in Buenos Aires.",
    titleStart: "Marketing, software and infrastructure,",
    titleHighlight: "under one direction",
    lead: "Three disciplines you're currently managing through five different vendors, handled by a single team accountable for the outcome.",
    pick: "Choose where to start",
    viewArea: "Explore area",
    notSure: "Not sure which one you need? Tell us the problem and we'll route it",
    badges: ["Free assessment", "Work directly with the founders", "Buenos Aires, Argentina"],
  },

  owner: {
    label: "Owner and head of the area",
    meetTitle: "Who you'll be talking to",
    direct:
      "Your project is handled by {name}, {role} at Orion — from the first call through to delivery.",
    noAccountManager: "No account managers, no middlemen.",
    ctaLine: "On the other end you get {name}, the owner of this area.",
  },

  areasSection: {
    kicker: "What we do",
    titleStart: "Three areas covering",
    titleHighlight: "the whole business",
    lead: "{families} service families and more than {items} distinct offerings. Hire one area or all three, without adding vendors or repeating yourself.",
    servicesLabel: "services",
    noFitTitle: "Your project doesn't fit any of the three?",
    noFitBody:
      "We work with a network of specialists, production companies and suppliers across every industry. If a project needs a discipline we don't have in-house, we source it, coordinate it and stand behind the result.",
    noFitCta: "Tell us about your project",
  },

  about: {
    kicker: "About us",
    titleStart: "An agency that starts by",
    titleHighlight: "understanding you",
    p1: "We're a Buenos Aires team working with SMBs and startups across the region. Every client is a world of their own, and we treat them that way. That's why we always start with a real assessment before putting any idea on the table.",
    p2: "We cover three areas under one roof: marketing, software development and IT infrastructure. That means you can solve the campaign, the system and the cabling with a single point of contact.",
    features: [
      "Assessment before any proposal",
      "A tailored plan, never a recycled template",
      "Marketing, software and IT in one team",
      "Clear, transparent reporting",
    ],
    sheetTitle: "Agency profile",
    sheet: [
      { label: "Team", value: "3 partners · direct contact" },
      { label: "Areas", value: "Marketing · Software · IT" },
      { label: "Active clients", value: "8 brands" },
      { label: "Based in", value: "Buenos Aires, Argentina" },
      { label: "Coverage", value: "Nationwide and LATAM" },
      { label: "Format", value: "Remote and on-site" },
    ],
  },

  areaPage: {
    problemsKicker: "The starting point",
    problemsTitle: "The problems clients usually come to us with",
    catalogKicker: "Full catalogue",
    catalogTitle: "Everything we do in {area}",
    catalogLead:
      "{families} service families and {items} distinct offerings. Take one, take a bundle, or let us build the full plan.",
    whatsappCta: "Message us on WhatsApp",
    quoteCta: "Request a quote",
    seeAllCta: "See everything we do",
    starLabel: "Star",
    consultPrefix: "Ask about",
    processKicker: "How we work",
    processTitle: "From the first call to delivery",
    crossKicker: "The other two stars",
    crossTitle: "This pairs well with",
    crossLead:
      "We're the same team. If your project touches two or three areas, there are no separate vendors to coordinate and no need to explain your business twice.",
    ctaTitlePrefix: "Tell us what you need in",
    ctaLead:
      "Free assessment and a proposal within 24 hours. If the project isn't a fit for us, we'll say so and point you to someone who is.",
    ctaForm: "Fill in the form",
    ctaWhatsapp: "Message on WhatsApp",
    ctaMail: "Or email us at",
  },

  capability: {
    eyebrow: "No ceiling on scope",
    title: "Not on the list?",
    highlight: "We'll still solve it",
    description:
      "This catalogue is what we do routinely, not the limit of what we can do. We work with a network of specialists, suppliers and production companies across every industry: if a project needs a discipline that isn't here, we source it, coordinate it and stand behind the result as if it were our own.",
    cta: "Tell us about your project",
    points: [
      {
        title: "A single point of contact",
        description:
          "You talk to us. Coordinating vendors, timelines and accountability is on our side.",
      },
      {
        title: "A network across every sector",
        description:
          "Production companies, printers, installers, media, developers and technical specialists we already work with.",
      },
      {
        title: "Projects at any scale",
        description:
          "From a one-day job to implementations that combine all three areas over months.",
      },
      {
        title: "Clear budget from the start",
        description:
          "We tell you what's achievable with the budget you have, and what the ideal scenario would take.",
      },
    ],
  },

  brands: {
    kicker: "Case studies",
    titleStart: "Brands that",
    titleHighlight: "trusted us",
    lead: "From startups to established companies, across marketing, software and IT.",
    activeBrands: "active brands",
    industries: "industries",
    inProduction: "Projects in production",
    realCase: "Real case",
    viewCase: "View case",
    dragHint: "Drag to control it · Hover to pause · Click to see the full case",
    industryByBrand: {
      Vittal: "Healthcare",
      ADN: "Web application",
      Schepens: "Retail",
      CMVet: "Web application · Veterinary",
      PlotChain: "Technology & blockchain",
      "RR Sintético": "Web application",
      "Soul Security": "Website",
      "Imperio 51": "Website",
    },
    taglineByBrand: {
      Vittal: "Digital communications for an emergency medical service",
      ADN: "Property developer platform with a custom CRM",
      Schepens: "Digital strategy for a retail company",
      CMVet: "Custom system for veterinary clinical analysis",
      PlotChain: "Brand positioning in the Web3 ecosystem",
      "RR Sintético": "Web app with quoting and project management",
      "Soul Security": "Corporate site for a private security company",
      "Imperio 51": "Modern site with a high-impact digital identity",
    },
  },

  cases: {
    kicker: "Case studies",
    titleStart: "Real solutions for",
    titleHighlight: "concrete problems",
    lead: "Every project starts from a different challenge. Here are two examples of how we solved them.",
    caseLabel: "Case",
    clientLabel: "Client",
    challengeLabel: "The challenge",
    solutionLabel: "Our solution",
    resultsLabel: "Results",
    ctaQuestion: "Want better results for your business?",
    ctaButton: "Yes, I want my proposal",
    items: [
      {
        industry: "SEO & Digital Marketing",
        title: "From an invisible site to a digital reference in its sector",
        challenge:
          "Schepens had a website with no conversions, no organic reach and a design that didn't convey the real quality of their product. Every visit was lost without generating contact, and the brand was practically invisible in search engines.",
        solution:
          "We redesigned the whole site around conversion, implemented a technical and content SEO strategy, and strengthened their digital presence with a far more compelling visual approach aligned to the brand.",
        results: [
          { metric: "SEO+", label: "Organic ranking" },
          { metric: "Traffic", label: "Sustained growth" },
          { metric: "Conversions", label: "Real improvement in leads" },
        ],
      },
      {
        industry: "Custom development",
        title: "From scattered data to a CRM that closes deals",
        challenge:
          "ADN was a property developer with project and unit data scattered across spreadsheets, emails and folders. Getting up-to-date information to clients was slow and confusing, which held back deal closing and business growth.",
        solution:
          "We designed and built a custom internal CRM that centralises absolutely everything: projects, individual units, statuses, clients and sales tracking. A single source of truth for the whole team.",
        results: [
          { metric: "100%", label: "Centralised information" },
          { metric: "Unit by unit", label: "Full traceability" },
          { metric: "More sales", label: "Faster closing" },
        ],
      },
    ],
  },

  testimonials: {
    kicker: "Testimonials",
    titleStart: "What people who've already",
    titleHighlight: "worked with us say",
    lead: "Every client gets a solution built for their reality. Here's what they tell us.",
    items: [
      {
        quote:
          "Excellent and fast work from the team, the whole process was easy. Nothing to complain about.",
        role: "Owner · Soul Security",
      },
      {
        quote:
          "Really happy with the whole service. It genuinely boosted our growth. Highly recommended.",
        role: "Owner · RR Sintético",
      },
      {
        quote:
          "Orion helped us sharpen our message and focus on the right customers. Since then, the quality of our leads has improved noticeably.",
        role: "Brand Manager · Schepens",
      },
    ],
  },

  team: {
    kicker: "Our team",
    titleStart: "One partner leading",
    titleHighlight: "each area",
    lead: "Three areas, three leads, one team. You work directly with the person doing the work, not with a middleman or an account that bounces your questions around.",
    viewProfile: "View profile",
    details: "Details",
    leadsPrefix: "Leads",
    areaLed: "Area they lead",
    specialties: "Specialties",
    portfolio: "Portfolio",
    members: {
      lucas: {
        role: "Founding partner & CEO",
        area: "Software & web development",
        short:
          "Turns commercial goals into product: sites, landing pages and applications that convert.",
        bio: [
          "Full-stack developer and founder of Orion. He works at the intersection of marketing and product, translating business goals into websites, landing pages and web applications that actually convert.",
          "He specialises in modern stacks (Next.js, React, TypeScript) and in building technical solutions tailored to each client: from performance-focused landing pages to integrations, internal dashboards and e-commerce.",
        ],
      },
      david: {
        role: "Founding partner",
        area: "Marketing & strategy",
        short:
          "Designs each client's commercial strategy: positioning, funnel, content and campaigns.",
        bio: [
          "Digital marketing specialist and co-founder of Orion. He designs each client's commercial strategy: positioning, funnel, content and paid campaigns.",
          "His approach combines branding and performance: building brands that hold up over time while generating measurable demand month after month.",
        ],
      },
      nicolas: {
        role: "Founding partner",
        area: "IT & infrastructure",
        short: "Runs the IT area end to end: infrastructure, systems and technical operations.",
        bio: [
          "Co-founder of Orion and head of the entire IT area. He leads the infrastructure, internal systems and technical operations that keep the agency and every project running day to day.",
          "His role ensures that everything we design and build is delivered on a stable, secure and scalable foundation: hosting, domains, integrations, automation and ongoing support.",
        ],
      },
    },
  },

  contact: {
    kicker: "Contact",
    titleStart: "Transform your",
    titleHighlight: "digital brand",
    lead: "Fill in the form and we'll get back to you within 24 hours with a proposal tailored to your business.",
    name: "Full name",
    phone: "Phone / WhatsApp",
    email: "Email",
    projectType: "What kind of service do you need?",
    projectOptions: [
      "Marketing",
      "Software development",
      "IT and infrastructure",
      "Several areas",
      "Not sure yet",
    ],
    message: "Tell us about your project...",
    submit: "Send enquiry",
    submitting: "Sending...",
    optional: "optional",
    requiredHint: "Fields marked with * are required.",
    errorTitle: "We couldn't send your enquiry",
    errorBody:
      "It may be a connection problem or an ad blocker. Try again or reach us directly: your details are still here.",
    errorRetry: "Try again",
    errorWhatsapp: "Send via WhatsApp",
    errorMail: "Send via email",
    infoTitle: "Contact information",
    labels: { phone: "Phone", email: "Email", hours: "Hours" },
    hoursValue: "Mon - Fri: 10:00 - 18:00",
    whatsappLead: "Prefer to reach us directly on WhatsApp?",
    whatsappCta: "Message us on WhatsApp",
  },

  qrContact: {
    dismissLabel: "Hide",
    saveContact: "Save contact",
    closeLabel: "Close",
    modalTitle: "Leave us your details",
    modalSubtitle: "We'll reach out within 24 hours.",
    namePlaceholder: "Full name",
    emailPlaceholder: "Email",
    phonePlaceholder: "Phone / WhatsApp",
    companyPlaceholder: "Company (optional)",
    messagePlaceholder: "How can we help? (optional)",
    successMsg: "Thanks! We'll be in touch soon.",
    sendingLabel: "Sending...",
    sentLabel: "Sent ✓",
    sendLabel: "Send",
    consentText: "By submitting you agree we may contact you through the details provided.",
    genericError: "Couldn't send it",
    networkError: "Network error",
  },

  footer: {
    description:
      "Marketing, software development and IT infrastructure agency. Three areas, one team, for SMBs and startups.",
    areasHeading: "Areas",
    companyHeading: "Company",
    location: "Argentina — Operating nationwide and across LATAM",
    copyright: "© {year} Orion Marketing. All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
  },
}
