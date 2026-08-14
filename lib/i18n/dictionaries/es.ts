import type { Dict } from "../types"

export const es: Dict = {
  locale: "es-AR",
  langName: "Español",
  langShort: "ES",

  nav: {
    areas: "Áreas",
    casos: "Casos",
    nosotros: "Nosotros",
    equipo: "Equipo",
    contacto: "Contacto",
    cta: "Pedir propuesta",
    ctaLong: "Pedir mi propuesta",
    available: "Disponible para nuevos proyectos",
  },

  a11y: {
    home: "Orion Marketing — Inicio",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    changeLanguage: "Cambiar idioma",
    toLight: "Activar tema claro",
    toDark: "Activar tema oscuro",
    backToAreas: "Volver a las tres áreas",
  },

  notFound: {
    kicker: "Error 404",
    title: "Esta página no existe",
    lead: "Puede que el enlace esté viejo o que hayamos movido la página. Desde acá volvés a cualquier parte del sitio.",
    home: "Ir al inicio",
    contact: "Contactarnos",
    areasLabel: "O entrá directo a un área",
  },

  legal: {
    updated: "Última actualización: agosto de 2026",
    backHome: "Volver al inicio",
    privacyTitle: "Política de privacidad",
    privacyLead:
      "Qué datos te pedimos, para qué los usamos y cómo podés pedirnos que los borremos.",
    privacySections: [
      {
        title: "Quién es responsable de tus datos",
        body: [
          "Orion Marketing, con domicilio en Buenos Aires, Argentina, es responsable del tratamiento de los datos que se cargan en este sitio. Para cualquier consulta sobre tus datos podés escribirnos a hola@orionmkt.com.ar.",
        ],
      },
      {
        title: "Qué datos recolectamos",
        body: [
          "Los que completás voluntariamente en el formulario de contacto: nombre, teléfono, email, tipo de servicio que te interesa y el mensaje que nos dejes.",
          "Además recolectamos datos de navegación anónimos y agregados (páginas vistas, origen de la visita, tipo de dispositivo) a través de herramientas de analítica. Esos datos no te identifican de forma individual.",
        ],
      },
      {
        title: "Para qué los usamos",
        body: [
          "Únicamente para responder tu consulta, preparar una propuesta y mantener el contacto comercial derivado de ella.",
          "No vendemos ni cedemos tus datos. Solo los comparten con nosotros los proveedores que hacen posible el servicio: la plataforma que procesa el envío del formulario y la herramienta de analítica del sitio.",
        ],
      },
      {
        title: "Cuánto tiempo los guardamos",
        body: [
          "Mientras dure la relación comercial y por el tiempo necesario para cumplir obligaciones legales o contractuales. Si nos pedís la baja, los eliminamos.",
        ],
      },
      {
        title: "Tus derechos",
        body: [
          "Podés pedirnos en cualquier momento acceder a tus datos, rectificarlos, actualizarlos o suprimirlos, escribiendo a hola@orionmkt.com.ar. Respondemos dentro de los plazos que fija la Ley 25.326 de Protección de los Datos Personales.",
          "La Agencia de Acceso a la Información Pública, en su carácter de órgano de control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos.",
        ],
      },
      {
        title: "Cookies",
        body: [
          "Usamos cookies propias y de terceros con fines de analítica y medición de campañas. Podés bloquearlas o eliminarlas desde la configuración de tu navegador; el sitio sigue funcionando sin ellas.",
        ],
      },
    ],
    termsTitle: "Términos y condiciones",
    termsLead: "Las reglas de uso de este sitio y el alcance de lo que publicamos en él.",
    termsSections: [
      {
        title: "Alcance",
        body: [
          "Este sitio es informativo. La descripción de los servicios, los catálogos y los casos publicados son de referencia y no constituyen una oferta contractual.",
          "Enviar el formulario de contacto no implica contratar ningún servicio ni genera obligación alguna para vos ni para nosotros: es el inicio de una conversación.",
        ],
      },
      {
        title: "Presupuestos y propuestas",
        body: [
          "Toda propuesta se entrega por escrito, con alcance, plazos y precio detallados. Los precios informados en una propuesta tienen la vigencia que se indique en ella.",
          "El trabajo se considera contratado únicamente cuando la propuesta es aceptada de forma expresa por ambas partes.",
        ],
      },
      {
        title: "Propiedad intelectual",
        body: [
          "La marca Orion, el diseño del sitio, sus textos e imágenes son de titularidad de Orion Marketing, salvo indicación en contrario.",
          "Los logos y nombres comerciales de los clientes que aparecen en el sitio pertenecen a sus respectivos titulares y se muestran únicamente como referencia de trabajos realizados.",
        ],
      },
      {
        title: "Responsabilidad",
        body: [
          "Procuramos que la información publicada esté actualizada y sea correcta, pero el sitio se ofrece tal como está. No respondemos por interrupciones del servicio ni por el contenido de sitios de terceros enlazados desde acá.",
        ],
      },
      {
        title: "Ley aplicable",
        body: [
          "Estos términos se rigen por las leyes de la República Argentina. Ante cualquier controversia serán competentes los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.",
        ],
      },
    ],
  },

  hero: {
    intro:
      "Somos Orion: agencia de marketing, desarrollo de software e infraestructura IT, en Buenos Aires.",
    titleStart: "Marketing, software e infraestructura,",
    titleHighlight: "bajo una misma dirección",
    lead: "Tres disciplinas que hoy gestionás con cinco proveedores distintos, resueltas por un solo equipo responsable del resultado.",
    pick: "Elegí por dónde empezar",
    viewArea: "Ver el área",
    notSure: "¿No sabés cuál necesitás? Contanos el problema y lo derivamos",
    badges: ["Diagnóstico sin costo", "Trato directo con fundadores", "Buenos Aires, Argentina"],
  },

  owner: {
    label: "Dueño y director del área",
    meetTitle: "Con quién vas a hablar",
    direct:
      "Tu proyecto lo lleva {name}, {role} de Orion. Habla con vos desde la primera reunión hasta la entrega.",
    noAccountManager: "Sin ejecutivos de cuenta ni intermediarios en el medio.",
    ctaLine: "Del otro lado te contesta {name}, dueño del área.",
  },

  areasSection: {
    kicker: "Qué hacemos",
    titleStart: "Tres áreas que cubren",
    titleHighlight: "todo el negocio",
    lead: "{families} familias de servicios y más de {items} trabajos distintos. Podés contratar una sola área o las tres, sin sumar proveedores ni repetir explicaciones.",
    servicesLabel: "servicios",
    noFitTitle: "¿Tu proyecto no entra en ninguna de las tres?",
    noFitBody:
      "Trabajamos con una red de especialistas, productoras y proveedores en todos los rubros. Si hace falta una disciplina que no tenemos puertas adentro, la conseguimos, la coordinamos y respondemos por el resultado.",
    noFitCta: "Contanos tu proyecto",
  },

  about: {
    kicker: "Nosotros",
    titleStart: "Una agencia que empieza",
    titleHighlight: "por entenderte",
    p1: "Somos un equipo de Buenos Aires que trabaja con PyMEs y startups de toda la región. Cada cliente es un mundo, y lo tratamos como tal. Por eso arrancamos siempre con un diagnóstico real antes de tirar cualquier idea arriba de la mesa.",
    p2: "Cubrimos tres áreas bajo el mismo techo: marketing, desarrollo de software e infraestructura IT. Eso significa que podés resolver la campaña, el sistema y el cableado con un solo interlocutor.",
    features: [
      "Diagnóstico previo antes de proponer",
      "Plan único, no plantillas reutilizadas",
      "Marketing, software e IT en un solo equipo",
      "Reportes claros y transparentes",
    ],
    sheetTitle: "Ficha de la agencia",
    sheet: [
      { label: "Equipo", value: "3 socios · trato directo" },
      { label: "Áreas", value: "Marketing · Software · IT" },
      { label: "Clientes activos", value: "8 marcas" },
      { label: "Base", value: "Buenos Aires, Argentina" },
      { label: "Alcance", value: "Todo el país y LATAM" },
      { label: "Modalidad", value: "Remoto y presencial" },
    ],
  },

  areaPage: {
    problemsKicker: "El punto de partida",
    problemsTitle: "Los problemas con los que suelen llegarnos",
    catalogKicker: "Catálogo completo",
    catalogTitle: "Todo lo que hacemos en {area}",
    catalogLead:
      "{families} familias de servicios y {items} trabajos distintos. Podés tomar uno solo, un combo, o dejarnos armar el plan completo.",
    whatsappCta: "Hablar directo por WhatsApp",
    quoteCta: "Pedir presupuesto",
    seeAllCta: "Ver todo lo que hacemos",
    starLabel: "Estrella",
    consultPrefix: "Consultar sobre",
    processKicker: "Cómo trabajamos",
    processTitle: "Del primer llamado a la entrega",
    crossKicker: "Las otras dos estrellas",
    crossTitle: "Esto se combina bien con",
    crossLead:
      "Somos el mismo equipo. Si tu proyecto toca dos o tres áreas, no hay que coordinar proveedores distintos ni explicar el negocio dos veces.",
    ctaTitlePrefix: "Contanos qué necesitás en",
    ctaLead:
      "Diagnóstico sin costo y propuesta en menos de 24 horas. Si el proyecto no es para nosotros, te lo decimos y te derivamos con alguien que sí.",
    ctaForm: "Completar el formulario",
    ctaWhatsapp: "Escribir por WhatsApp",
    ctaMail: "O escribinos a",
  },

  capability: {
    eyebrow: "Sin límite de alcance",
    title: "¿No está en la lista?",
    highlight: "Igual lo resolvemos",
    description:
      "Este catálogo es lo que hacemos habitualmente, no el techo de lo que podemos hacer. Trabajamos con una red de especialistas, proveedores y productoras en todos los rubros: si un proyecto necesita una disciplina que no está acá, la conseguimos, la coordinamos y respondemos por el resultado como si fuera nuestra.",
    cta: "Contanos tu proyecto",
    points: [
      {
        title: "Un solo interlocutor",
        description:
          "Vos hablás con nosotros. La coordinación entre proveedores, tiempos y responsabilidades corre por nuestra cuenta.",
      },
      {
        title: "Red en todos los sectores",
        description:
          "Productoras, imprentas, instaladores, medios, desarrolladores y especialistas técnicos con los que ya trabajamos.",
      },
      {
        title: "Proyectos de cualquier escala",
        description:
          "Desde un trabajo puntual de un día hasta implementaciones que combinan las tres áreas durante meses.",
      },
      {
        title: "Presupuesto claro desde el inicio",
        description:
          "Te decimos qué se puede hacer con el presupuesto que tenés, y qué haría falta para el escenario ideal.",
      },
    ],
  },

  brands: {
    kicker: "Casos de éxito",
    titleStart: "Marcas que",
    titleHighlight: "confiaron en nosotros",
    lead: "Desde startups hasta empresas consolidadas, en marketing, software e IT.",
    activeBrands: "marcas activas",
    industries: "industrias",
    inProduction: "Proyectos en producción",
    realCase: "Caso real",
    viewCase: "Ver caso",
    dragHint: "Arrastrá para controlarlo · Hover para pausar · Click para ver el caso completo",
    industryByBrand: {},
    taglineByBrand: {},
  },

  cases: {
    kicker: "Casos de éxito",
    titleStart: "Soluciones reales para",
    titleHighlight: "problemas concretos",
    lead: "Cada proyecto parte de un desafío distinto. Estos son dos ejemplos de cómo lo resolvimos.",
    caseLabel: "Caso",
    clientLabel: "Cliente",
    challengeLabel: "El desafío",
    solutionLabel: "Nuestra solución",
    resultsLabel: "Resultados",
    ctaQuestion: "¿Querés mejores resultados para tu negocio?",
    ctaButton: "Sí, quiero mi propuesta",
    items: [
      {
        industry: "SEO & Marketing Digital",
        title: "De un sitio sin alcance a referente digital del rubro",
        challenge:
          "Schepens tenía un sitio web sin conversiones, sin alcance orgánico y con un diseño que no transmitía la calidad real de su producto. Cada visita se perdía sin generar contacto y la marca era prácticamente invisible en buscadores.",
        solution:
          "Rediseñamos el sitio completo con foco en conversión, implementamos una estrategia de SEO técnico y de contenidos, y reforzamos la presencia digital con una propuesta visual mucho más atractiva y alineada a la marca.",
        results: [
          { metric: "SEO+", label: "Posicionamiento orgánico" },
          { metric: "Visitas", label: "Crecimiento sostenido" },
          { metric: "Conversiones", label: "Mejora real en leads" },
        ],
      },
      {
        industry: "Desarrollo a medida",
        title: "De información dispersa a un CRM que cierra ventas",
        challenge:
          "ADN era una constructora con la información de proyectos y unidades dispersa entre planillas, mails y carpetas. Difundir datos actualizados a clientes era lento y confuso, y eso frenaba el cierre de operaciones y el crecimiento del negocio.",
        solution:
          "Diseñamos y desarrollamos un CRM interno a medida que centraliza absolutamente todo: proyectos, departamentos uno a uno, estados, clientes y seguimiento de ventas. Una sola fuente de verdad para todo el equipo.",
        results: [
          { metric: "100%", label: "Información centralizada" },
          { metric: "Unidad x unidad", label: "Trazabilidad total" },
          { metric: "Más ventas", label: "Cierre más ágil" },
        ],
      },
    ],
  },

  testimonials: {
    kicker: "Testimonios",
    titleStart: "Lo que dicen quienes ya",
    titleHighlight: "trabajaron con nosotros",
    lead: "Cada cliente recibe una solución pensada para su realidad. Esto es lo que cuentan.",
    items: [
      {
        quote:
          "Excelente y rápido trabajo de los chicos, bastante cómodo todo. No hay nada de lo cual quejarse.",
        role: "Dueño · Soul Security",
      },
      {
        quote:
          "Súper conforme con todo el servicio. La verdad me potenció mucho el crecimiento. Recomendados.",
        role: "Dueño · RR Sintético",
      },
      {
        quote:
          "Orion nos ayudó a ordenar nuestro mensaje y a enfocarnos en los clientes correctos. Desde entonces, la calidad de nuestros leads mejoró notablemente.",
        role: "Brand Manager · Schepens",
      },
    ],
  },

  team: {
    kicker: "Nuestro equipo",
    titleStart: "Un socio al frente de",
    titleHighlight: "cada área",
    lead: "Tres áreas, tres responsables, un mismo equipo. Trabajás directo con quien hace, no con un intermediario ni con una cuenta que te rebota consultas.",
    viewProfile: "Ver perfil",
    details: "Detalles",
    leadsPrefix: "Lidera",
    areaLed: "Área que lidera",
    specialties: "Especialidades",
    portfolio: "Portafolio",
    members: {
      lucas: {
        role: "Socio fundador y CEO",
        area: "Desarrollo de software & web",
        short:
          "Traduce los objetivos comerciales en producto: sitios, landings y aplicaciones que convierten.",
        bio: [
          "Desarrollador full-stack y fundador de Orion. Trabaja en la intersección entre marketing y producto, traduciendo objetivos de negocio en sitios, landings y aplicaciones web que realmente convierten.",
          "Se especializa en stacks modernos (Next.js, React, TypeScript) y en armar soluciones técnicas hechas a medida para cada cliente: desde landings enfocadas en performance hasta integraciones, paneles internos y e-commerces.",
        ],
      },
      david: {
        role: "Socio fundador",
        area: "Marketing & estrategia",
        short:
          "Diseña la estrategia comercial de cada cliente: posicionamiento, embudo, contenido y campañas.",
        bio: [
          "Especialista en marketing digital y co-fundador de Orion. Diseña la estrategia comercial de cada cliente: posicionamiento, embudo, contenido y campañas pagas.",
          "Su enfoque combina branding y performance: construir marcas que se sostengan en el tiempo y que, al mismo tiempo, generen demanda medible mes a mes.",
        ],
      },
      nicolas: {
        role: "Socio fundador",
        area: "IT & infraestructura",
        short: "Encargado general del área IT: infraestructura, sistemas y operaciones técnicas.",
        bio: [
          "Co-fundador de Orion y responsable de toda el área de IT. Lidera la infraestructura, los sistemas internos y las operaciones técnicas que sostienen el día a día de la agencia y de cada proyecto.",
          "Su rol asegura que todo lo que diseñamos y desarrollamos se entregue sobre una base estable, segura y escalable: hosting, dominios, integraciones, automatizaciones y soporte continuo.",
        ],
      },
    },
  },

  contact: {
    kicker: "Contacto",
    titleStart: "Transformá tu",
    titleHighlight: "marca digital",
    lead: "Completá el formulario y te contactamos en menos de 24 horas con una propuesta personalizada para impulsar tu negocio.",
    name: "Nombre completo",
    phone: "Teléfono / WhatsApp",
    email: "Email",
    projectType: "¿Qué tipo de servicio necesitás?",
    projectOptions: [
      "Marketing",
      "Desarrollo de software",
      "IT e infraestructura",
      "Varias áreas",
      "Todavía no lo sé",
    ],
    message: "Contanos sobre tu proyecto...",
    submit: "Enviar consulta",
    submitting: "Enviando...",
    optional: "opcional",
    requiredHint: "Los campos con * son obligatorios.",
    errorTitle: "No pudimos enviar tu consulta",
    errorBody:
      "Puede ser un problema de conexión o un bloqueador de anuncios. Probá de nuevo o escribinos directo: tus datos siguen cargados acá.",
    errorRetry: "Reintentar",
    errorWhatsapp: "Enviar por WhatsApp",
    errorMail: "Enviar por email",
    infoTitle: "Información de contacto",
    labels: { phone: "Teléfono", email: "Email", hours: "Horario" },
    hoursValue: "Lun - Vie: 10:00 - 18:00",
    whatsappLead: "¿Preferís contactarnos directamente por WhatsApp?",
    whatsappCta: "Escribinos por WhatsApp",
  },

  qrContact: {
    dismissLabel: "Ocultar",
    saveContact: "Guardar contacto",
    closeLabel: "Cerrar",
    modalTitle: "Dejanos tus datos",
    modalSubtitle: "Te contactamos en menos de 24hs.",
    namePlaceholder: "Nombre y apellido",
    emailPlaceholder: "Email",
    phonePlaceholder: "Teléfono / WhatsApp",
    companyPlaceholder: "Empresa (opcional)",
    messagePlaceholder: "¿En qué te podemos ayudar? (opcional)",
    successMsg: "¡Gracias! Te contactamos pronto.",
    sendingLabel: "Enviando...",
    sentLabel: "Enviado ✓",
    sendLabel: "Enviar",
    consentText: "Al enviar aceptás que te contactemos por los medios provistos.",
    genericError: "No se pudo enviar",
    networkError: "Error de red",
  },

  footer: {
    description:
      "Agencia de marketing, desarrollo de software e infraestructura IT. Tres áreas, un solo equipo, para PyMEs y startups.",
    areasHeading: "Áreas",
    companyHeading: "Empresa",
    location: "Argentina — Operamos en todo el país y LATAM",
    copyright: "© {year} Orion Marketing. Todos los derechos reservados.",
    privacy: "Privacidad",
    terms: "Términos",
  },
}
