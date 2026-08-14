import {
  Antenna,
  AppWindow,
  BarChart3,
  Boxes,
  BrainCircuit,
  Briefcase,
  Building2,
  Camera,
  Code2,
  Compass,
  CreditCard,
  Database,
  Fan,
  Gauge,
  Globe,
  HardDrive,
  Headphones,
  Layers,
  LayoutDashboard,
  Lightbulb,
  Mail,
  Megaphone,
  MonitorSmartphone,
  Network,
  Palette,
  PartyPopper,
  Plug,
  Radio,
  Router,
  Search,
  ServerCog,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Signpost,
  Smartphone,
  Sparkles,
  Target,
  Thermometer,
  Video,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react"

export type AreaSlug = "marketing" | "software" | "it"

export type ServiceFamily = {
  id: string
  title: string
  icon: LucideIcon
  summary: string
  items: string[]
}

export type Area = {
  slug: AreaSlug
  href: string
  /** Estrella del cinturón de Orión que representa al área */
  star: string
  name: string
  navLabel: string
  /** Bajada de una línea para el panel del tríptico */
  teaser: string
  /** Chips visibles al expandir el panel */
  chips: string[]
  icon: LucideIcon
  /**
   * Cada área la maneja un dueño de la agencia, no un empleado: `role` es el
   * vínculo societario y `title` el cargo directivo. Los dos se muestran
   * juntos para que quede claro con quién habla el cliente.
   */
  owner: { name: string; role: string; title: string; initials: string; area: string }
  accent: {
    /** Color del área como referencia CSS, para que siga al tema */
    hex: string
    /** Canal RGB como referencia CSS: permite rgba(var(--x-rgb), .14) */
    rgb: string
  }
  hero: {
    eyebrow: string
    titleStart: string
    titleHighlight: string
    subtitle: string
    bullets: string[]
  }
  problems: { title: string; description: string }[]
  families: ServiceFamily[]
  process: { number: string; title: string; description: string }[]
  metrics: { value: string; label: string }[]
  crossSell: { slug: AreaSlug; reason: string }[]
  seo: { title: string; description: string; keywords: string[] }
}

/* ────────────────────────────────────────────────────────────────
   MARKETING · Alnitak — Davi Cabella
   ──────────────────────────────────────────────────────────────── */

const marketing: Area = {
  slug: "marketing",
  href: "/marketing",
  star: "Alnitak",
  name: "Marketing",
  navLabel: "Marketing",
  teaser: "Que te encuentren, te elijan y te recuerden. Online y en la calle.",
  chips: ["Redes", "Paid Media", "Vía pública", "Branding", "Eventos", "Prensa"],
  icon: Megaphone,
  owner: {
    name: "Davi Cabella",
    role: "Socio fundador",
    title: "Director de Marketing",
    initials: "DC",
    area: "Marketing & estrategia",
  },
  accent: { hex: "var(--area-marketing)", rgb: "var(--area-marketing-rgb)" },
  hero: {
    eyebrow: "Área de Marketing",
    titleStart: "Marketing completo,",
    titleHighlight: "del feed a la vía pública",
    subtitle:
      "Estrategia, marca, contenido, pauta digital y publicidad tradicional bajo un mismo plan. No importa si tu cliente te descubre en Instagram, en un cartel de la ruta o por recomendación: trabajamos todos esos puntos de contacto como un solo sistema.",
    bullets: [
      "Diagnóstico sin costo antes de proponer",
      "Digital y tradicional en un mismo plan",
      "Reportes claros con métricas reales",
    ],
  },
  problems: [
    {
      title: "Invertís en publicidad y no sabés qué funciona",
      description:
        "Ponés plata en redes, en Google o en un cartel y no tenés forma de saber cuál de los tres te trajo el cliente. Medimos cada canal por separado y te mostramos el costo real por consulta.",
    },
    {
      title: "Tu marca no se parece a lo que vendés",
      description:
        "El producto es bueno pero la comunicación no lo transmite. Ordenamos identidad, mensaje y presencia para que la percepción esté a la altura de lo que hacés.",
    },
    {
      title: "Te llegan consultas, pero no son las que buscás",
      description:
        "Volumen sin calidad es ruido. Ajustamos segmentación, mensaje y filtros para que te escriba el cliente que realmente puede comprarte.",
    },
  ],
  families: [
    {
      id: "estrategia",
      title: "Estrategia y consultoría",
      icon: Compass,
      summary: "El plan antes que la ejecución. Dónde estás parado y hacia dónde conviene ir.",
      items: [
        "Diagnóstico inicial de marca y negocio",
        "Plan de marketing anual",
        "Posicionamiento y propuesta de valor",
        "Definición de buyer personas",
        "Investigación de mercado",
        "Análisis de competencia y benchmarking",
        "Arquitectura de marca y submarcas",
        "Definición de objetivos y KPIs",
        "Consultoría estratégica por horas",
        "Plan de lanzamiento de producto",
        "Estrategia de precios y promociones",
        "Auditoría de comunicación existente",
      ],
    },
    {
      id: "branding",
      title: "Branding e identidad",
      icon: Palette,
      summary: "Cómo se ve, cómo suena y cómo se aplica tu marca en cada soporte.",
      items: [
        "Naming y construcción del concepto",
        "Diseño de logo e isotipo",
        "Manual de marca y lineamientos de uso",
        "Rebranding y actualización de identidad",
        "Sistema visual completo (paleta, tipografías, grillas)",
        "Papelería institucional",
        "Diseño de packaging y etiquetas",
        "Señalética y wayfinding",
        "Uniformes y vestimenta de marca",
        "Identidad sonora y jingles",
        "Brand book digital para equipos",
        "Aplicaciones sobre flota y locales",
      ],
    },
    {
      id: "redes",
      title: "Redes sociales y contenido",
      icon: Share2,
      summary: "El día a día de tus canales, con contenido pensado para vender y no solo para llenar.",
      items: [
        "Community management diario",
        "Calendario editorial estratégico",
        "Creación de posts, reels y stories",
        "Copywriting y guiones",
        "Gestión de Instagram, Facebook y TikTok",
        "Gestión de LinkedIn corporativo",
        "Gestión de YouTube y Pinterest",
        "Atención de mensajes y comentarios",
        "Producción de contenido UGC",
        "Campañas con influencers y micro-influencers",
        "Concursos y sorteos",
        "Reportes de alcance y engagement",
      ],
    },
    {
      id: "paid",
      title: "Publicidad digital (paid media)",
      icon: Target,
      summary: "Pauta gestionada con foco en costo por consulta, no en likes.",
      items: [
        "Meta Ads (Facebook e Instagram)",
        "Google Ads: Search, Display y Performance Max",
        "Google Shopping y campañas de catálogo",
        "YouTube Ads",
        "TikTok Ads",
        "LinkedIn Ads para B2B",
        "Spotify y publicidad en podcasts",
        "Remarketing y audiencias similares",
        "Landing pages específicas de campaña",
        "Testeo A/B de creativos y copies",
        "Administración de presupuesto publicitario",
        "Optimización semanal y control de gasto",
      ],
    },
    {
      id: "seo",
      title: "SEO y presencia en buscadores",
      icon: Search,
      summary: "Que te encuentren cuando alguien busca lo que vendés, sin pagar por cada clic.",
      items: [
        "Auditoría SEO técnica",
        "Optimización on-page y estructura de contenidos",
        "SEO local y Google Business Profile",
        "Estrategia de contenidos y blog",
        "Link building y prensa digital",
        "Gestión de reseñas y reputación online",
        "Optimización para búsqueda con IA",
        "SEO para e-commerce y fichas de producto",
        "Monitoreo de posiciones y tráfico orgánico",
      ],
    },
    {
      id: "tradicional",
      title: "Marketing tradicional y vía pública",
      icon: Signpost,
      summary:
        "Publicidad fuera de la pantalla: calle, ruta, radio, TV y gráfica. Gestionamos espacio, producción y montaje.",
      items: [
        "Carteles y billboards en vía pública",
        "Pantallas LED y digital out-of-home",
        "Publicidad en colectivos, subte y trenes",
        "Marquesinas, refugios y mobiliario urbano",
        "Cartelería de local, frentes y toldos",
        "Gigantografías, banners y lonas",
        "Brandeo vehicular y de flota",
        "Volanteo, folletería y buzoneo",
        "Publicidad en radio y producción de spots",
        "Spots de TV abierta y cable",
        "Avisos en diarios y revistas de nicho",
        "Publicidad en rutas y accesos",
        "Pasacalles, banderas y globos",
        "Publicidad en cines y espacios deportivos",
        "Negociación y compra de espacios",
      ],
    },
    {
      id: "btl",
      title: "BTL, eventos y experiencial",
      icon: PartyPopper,
      summary: "Cuando la marca tiene que estar presente en persona.",
      items: [
        "Activaciones de marca",
        "Producción integral de eventos y lanzamientos",
        "Stands de feria y exposiciones",
        "Promotoras y equipos de calle",
        "Sampling y degustaciones",
        "Acciones en punto de venta",
        "Merchandising y regalería empresarial",
        "Ambientación e institucional de local",
        "Catering, sonido e iluminación de evento",
        "Cobertura audiovisual del evento",
      ],
    },
    {
      id: "prensa",
      title: "Prensa y relaciones públicas",
      icon: Radio,
      summary: "Que hablen de vos en los lugares donde te conviene aparecer.",
      items: [
        "Redacción y envío de gacetillas",
        "Vínculo con medios y periodistas",
        "Gestión de entrevistas y vocería",
        "Notas patrocinadas y publinotas",
        "Manejo de crisis de reputación",
        "Prensa en medios locales y regionales",
        "Presencia en medios especializados del rubro",
      ],
    },
    {
      id: "crm",
      title: "CRM, fidelización y automatización",
      icon: Mail,
      summary: "Lo que pasa después del primer contacto, que es donde se pierde la mayoría de las ventas.",
      items: [
        "Email marketing y newsletters",
        "WhatsApp Business y difusión masiva",
        "Automatizaciones de nutrición de leads",
        "Programas de fidelización y puntos",
        "Encuestas de satisfacción y NPS",
        "Segmentación y limpieza de base de datos",
        "Campañas de recupero de clientes inactivos",
        "Integración con el CRM que ya usás",
      ],
    },
    {
      id: "audiovisual",
      title: "Producción audiovisual y fotografía",
      icon: Camera,
      summary: "Material propio, sin bancos de imágenes genéricas.",
      items: [
        "Fotografía profesional de producto",
        "Packshot para e-commerce",
        "Fotografía de local, obra y equipo",
        "Video institucional",
        "Reels y contenido vertical",
        "Spots publicitarios",
        "Filmación con drone",
        "Locución y voz en off",
        "Motion graphics y animación",
        "Edición y post-producción",
        "Fotografía de eventos",
      ],
    },
    {
      id: "medicion",
      title: "Medición y analítica",
      icon: BarChart3,
      summary: "Sin esto, todo lo anterior es opinión.",
      items: [
        "Reportes mensuales de performance",
        "Dashboards de marketing en vivo",
        "Google Analytics y Tag Manager",
        "Píxeles y eventos de conversión",
        "Atribución entre canales",
        "Costo por lead y ROAS por campaña",
        "Seguimiento de llamadas y WhatsApp",
        "Auditoría de medición existente",
      ],
    },
  ],
  process: [
    {
      number: "01",
      title: "Diagnóstico",
      description:
        "Escuchamos, miramos tus números y auditamos lo que ya venís haciendo. Sin propuesta antes de entender el negocio.",
    },
    {
      number: "02",
      title: "Plan",
      description:
        "Definimos objetivos, canales, presupuesto y KPIs. Sabés qué se hace, cuánto sale y cómo se mide antes de arrancar.",
    },
    {
      number: "03",
      title: "Ejecución",
      description:
        "Producimos, publicamos, pautamos y montamos. Digital y offline coordinados bajo el mismo mensaje.",
    },
    {
      number: "04",
      title: "Optimización",
      description:
        "Reporte mensual, lectura de resultados y ajuste. Lo que rinde se escala, lo que no rinde se corta.",
    },
  ],
  metrics: [
    { value: "360°", label: "Digital y tradicional integrados" },
    { value: "11", label: "Familias de servicios" },
    { value: "24h", label: "Tiempo de respuesta" },
    { value: "LATAM", label: "Alcance de operación" },
  ],
  crossSell: [
    {
      slug: "software",
      reason:
        "La campaña trae tráfico, pero si la web no convierte se pierde. Desarrollamos la landing o el e-commerce que recibe esa inversión.",
    },
    {
      slug: "it",
      reason:
        "Los eventos, las pantallas LED y la cartelería digital necesitan instalación, conectividad y energía. Ese montaje lo hacemos nosotros.",
    },
  ],
  seo: {
    title: "Agencia de Marketing Digital y Publicidad en Argentina",
    description:
      "Marketing digital y tradicional: redes sociales, Google Ads, Meta Ads, SEO, branding, vía pública, radio, TV, eventos y prensa. Estrategia integral para PyMEs y empresas en Argentina.",
    keywords: [
      "agencia de marketing digital argentina",
      "publicidad en via publica",
      "carteles publicitarios argentina",
      "agencia de publicidad buenos aires",
      "community manager argentina",
      "google ads argentina",
      "meta ads argentina",
      "branding argentina",
      "produccion de eventos",
      "prensa y relaciones publicas",
    ],
  },
}

/* ────────────────────────────────────────────────────────────────
   SOFTWARE · Alnilam — Lucas Baez
   ──────────────────────────────────────────────────────────────── */

const software: Area = {
  slug: "software",
  href: "/software",
  star: "Alnilam",
  name: "Desarrollo de software",
  navLabel: "Software",
  teaser: "Webs, apps y sistemas a medida que resuelven el problema real.",
  chips: ["Web", "E-commerce", "Apps", "Sistemas", "Integraciones", "Dashboards"],
  icon: Code2,
  owner: {
    name: "Lucas Baez",
    role: "Socio fundador y CEO",
    title: "Director de Tecnología",
    initials: "LB",
    area: "Desarrollo de software & web",
  },
  accent: { hex: "var(--area-software)", rgb: "var(--area-software-rgb)" },
  hero: {
    eyebrow: "Área de Desarrollo",
    titleStart: "Software que",
    titleHighlight: "trabaja para tu negocio",
    subtitle:
      "Desde una landing que convierte hasta un sistema interno que reemplaza veinte planillas. Desarrollamos web, e-commerce, aplicaciones móviles, integraciones y paneles a medida, con stack moderno y mantenimiento después de la entrega.",
    bullets: [
      "Código propio, sin plantillas atadas",
      "Entrega por etapas y en producción",
      "Soporte y capacitación incluidos",
    ],
  },
  problems: [
    {
      title: "Tu información vive en planillas y WhatsApp",
      description:
        "Cada persona del equipo tiene su versión de la verdad. Centralizamos todo en un sistema único con permisos, historial y trazabilidad.",
    },
    {
      title: "Tu web no vende, solo existe",
      description:
        "Un sitio lento, sin foco y sin medición es un gasto fijo. Rehacemos la experiencia con eje en conversión y velocidad real.",
    },
    {
      title: "Tu equipo repite tareas que podría hacer una máquina",
      description:
        "Cargar datos dos veces, armar el mismo reporte todos los lunes, copiar información entre sistemas. Todo eso se automatiza.",
    },
  ],
  families: [
    {
      id: "web",
      title: "Sitios web",
      icon: Globe,
      summary: "La base de tu presencia digital, rápida y pensada para convertir.",
      items: [
        "Sitios institucionales",
        "Landing pages de alta conversión",
        "Blogs y sitios de contenido",
        "Headless CMS para que edites vos",
        "Rediseños y migraciones",
        "Optimización de performance y Core Web Vitals",
        "SEO técnico y datos estructurados",
        "Accesibilidad y buenas prácticas",
        "Sitios multi-idioma",
        "Portales de noticias y catálogos",
        "Micrositios de campaña",
      ],
    },
    {
      id: "ecommerce",
      title: "E-commerce y pagos",
      icon: ShoppingCart,
      summary: "Vender online de punta a punta, con la operación resuelta.",
      items: [
        "Tiendas online a medida",
        "Shopify, Tiendanube y WooCommerce",
        "Mercado Pago, Stripe, MODO y Getnet",
        "Pagos recurrentes y suscripciones",
        "Catálogo, variantes y gestión de stock",
        "Integración con logística y envíos",
        "Checkout optimizado y recupero de carrito",
        "Facturación electrónica ARCA/AFIP",
        "Cupones, promociones y listas de precios",
        "Marketplace y multivendedor",
      ],
    },
    {
      id: "apps",
      title: "Aplicaciones",
      icon: Smartphone,
      summary: "Producto propio para tus clientes o para tu equipo.",
      items: [
        "Apps móviles iOS y Android",
        "Aplicaciones web y plataformas SaaS",
        "Progressive Web Apps",
        "Portales de clientes y proveedores",
        "Aplicaciones internas para operaciones",
        "Publicación en App Store y Google Play",
        "Notificaciones push",
        "Modo offline y sincronización",
      ],
    },
    {
      id: "sistemas",
      title: "Sistemas a medida",
      icon: Boxes,
      summary: "Cuando ningún software del mercado hace exactamente lo que necesitás.",
      items: [
        "CRM propio adaptado a tu proceso",
        "ERP liviano y gestión administrativa",
        "Gestión de proyectos y obras",
        "Sistemas de turnos y reservas",
        "Tracking y trazabilidad logística",
        "Control de stock e inventario",
        "Intranets y portales internos",
        "Sistemas de laboratorio y clínicos",
        "Facturación, cobranzas y conciliación",
        "Firma digital y gestión documental",
        "Gestión de flotas y mantenimiento",
        "Control de asistencia y RRHH",
      ],
    },
    {
      id: "integraciones",
      title: "Integraciones y automatización",
      icon: Plug,
      summary: "Que tus sistemas se hablen entre ellos y dejen de pedirte trabajo manual.",
      items: [
        "Desarrollo y consumo de APIs",
        "Integración con HubSpot, Salesforce, Zoho y Pipedrive",
        "Conexión con ERPs (Tango, Bejerman, SAP)",
        "Automatizaciones con n8n, Make y Zapier",
        "RPA y scripts que conectan sistemas",
        "Bots de WhatsApp Business API",
        "Chatbots y asistentes con IA",
        "Sincronización entre plataformas y sucursales",
        "Webhooks y procesamiento de eventos",
        "Migración de datos entre sistemas",
      ],
    },
    {
      id: "datos",
      title: "Datos e inteligencia",
      icon: LayoutDashboard,
      summary: "Ver el negocio en un tablero en lugar de reconstruirlo cada mes a mano.",
      items: [
        "Dashboards y paneles de BI",
        "Reportes automáticos por mail o WhatsApp",
        "Data warehouse y consolidación de fuentes",
        "Web scraping y captura de datos",
        "Modelos predictivos e IA aplicada",
        "Búsqueda semántica y asistentes internos",
        "Análisis de datos históricos",
        "Alertas por umbrales de negocio",
      ],
    },
    {
      id: "infra",
      title: "Infraestructura de producto",
      icon: ServerCog,
      summary: "Que lo que construimos esté online, rápido y monitoreado.",
      items: [
        "Hosting y administración de dominios",
        "Deploy en Vercel, AWS y Cloudflare",
        "Pipelines de CI/CD",
        "Certificados SSL y seguridad de transporte",
        "Monitoreo, logs y alertas",
        "Backups de aplicación y base de datos",
        "Escalado y optimización de costos cloud",
        "Entornos de staging y testing",
      ],
    },
    {
      id: "seguridad-apps",
      title: "Calidad y seguridad de aplicaciones",
      icon: ShieldCheck,
      summary: "Antes de que lo encuentre otro.",
      items: [
        "Testing automatizado",
        "Auditoría de código heredado",
        "Hardening de aplicaciones",
        "Pentesting de aplicaciones web",
        "Cumplimiento de protección de datos personales",
        "Auditoría de performance",
        "Revisión de dependencias y vulnerabilidades",
      ],
    },
    {
      id: "post",
      title: "Mantenimiento y soporte",
      icon: Wrench,
      summary: "El proyecto no termina cuando se entrega.",
      items: [
        "Mantenimiento evolutivo",
        "Abonos de soporte con tiempos de respuesta acordados",
        "Capacitación al personal del cliente",
        "Manuales y documentación técnica",
        "Mesa de ayuda del sistema",
        "Nuevos módulos y funcionalidades",
        "Toma de proyectos desarrollados por terceros",
      ],
    },
  ],
  process: [
    {
      number: "01",
      title: "Relevamiento",
      description:
        "Entendemos el proceso real, no el que está escrito. Hablamos con quien va a usar el sistema todos los días.",
    },
    {
      number: "02",
      title: "Propuesta y prototipo",
      description:
        "Alcance, plazos y costo cerrado por etapa. Ves el diseño funcionando antes de que se escriba el código definitivo.",
    },
    {
      number: "03",
      title: "Desarrollo por entregas",
      description:
        "Trabajamos en ciclos cortos con demos periódicas. Nunca esperás tres meses para ver algo.",
    },
    {
      number: "04",
      title: "Producción y soporte",
      description:
        "Salida a producción, capacitación al equipo y acompañamiento posterior con mantenimiento.",
    },
  ],
  metrics: [
    { value: "Next.js", label: "Stack moderno en producción" },
    { value: "9", label: "Familias de servicios" },
    { value: "100%", label: "Código propio y auditable" },
    { value: "Post", label: "Soporte después de la entrega" },
  ],
  crossSell: [
    {
      slug: "marketing",
      reason:
        "Un sistema o una tienda sin tráfico no factura. Armamos la estrategia y la pauta que le lleva clientes.",
    },
    {
      slug: "it",
      reason:
        "Si el software necesita servidores propios, red interna, terminales o lectoras, la infraestructura la montamos nosotros.",
    },
  ],
  seo: {
    title: "Desarrollo de Software y Aplicaciones a Medida en Argentina",
    description:
      "Desarrollo web, e-commerce, apps móviles, CRM y sistemas a medida. Integraciones, automatización, dashboards y mantenimiento. Next.js, React y TypeScript para empresas en Argentina.",
    keywords: [
      "desarrollo de software a medida argentina",
      "desarrollo web argentina",
      "crm a medida",
      "desarrollo de aplicaciones moviles",
      "tienda online argentina",
      "integracion mercado pago",
      "automatizacion de procesos",
      "dashboard bi empresas",
      "sistema de gestion a medida",
    ],
  },
}

/* ────────────────────────────────────────────────────────────────
   IT · Mintaka — Nicolás Mazzotti
   ──────────────────────────────────────────────────────────────── */

const it: Area = {
  slug: "it",
  href: "/it",
  star: "Mintaka",
  name: "IT e infraestructura",
  navLabel: "IT",
  teaser: "Redes, cámaras, energía, clima y soporte. Todo lo que sostiene la operación.",
  chips: ["Redes", "CCTV", "Soporte", "Energía", "Climatización", "Ciberseguridad"],
  icon: Router,
  owner: {
    name: "Nicolás Mazzotti",
    role: "Socio fundador",
    title: "Director de IT e Infraestructura",
    initials: "NM",
    area: "IT & infraestructura",
  },
  accent: { hex: "var(--area-it)", rgb: "var(--area-it-rgb)" },
  hero: {
    eyebrow: "Área de IT",
    titleStart: "La infraestructura que",
    titleHighlight: "no se ve hasta que falla",
    subtitle:
      "Cableado, redes, cámaras de seguridad, servidores, UPS, climatización y electromecánica. Instalamos, mantenemos y reparamos todo lo que hace que una empresa funcione todos los días, con abonos mensuales o por trabajo puntual.",
    bullets: [
      "Relevamiento y presupuesto en sitio",
      "Abonos mensuales de mantenimiento",
      "Instalación, service y guardia",
    ],
  },
  problems: [
    {
      title: "Cada problema técnico es un proveedor distinto",
      description:
        "Uno para la red, otro para las cámaras, otro para el aire. Cuando algo falla, nadie se hace cargo. Con nosotros es un solo interlocutor.",
    },
    {
      title: "No tenés backup real de nada",
      description:
        "Si mañana se rompe un disco o entra un ransomware, perdés años de trabajo. Armamos respaldo automático y plan de recuperación.",
    },
    {
      title: "Arreglás siempre después de que se rompe",
      description:
        "El mantenimiento correctivo sale más caro y te para la operación. Pasamos a un esquema preventivo con visitas programadas.",
    },
  ],
  families: [
    {
      id: "redes",
      title: "Redes y conectividad",
      icon: Network,
      summary: "La base de todo: que los datos lleguen rápido y sin cortes.",
      items: [
        "Cableado estructurado UTP categoría 5e, 6 y 6A",
        "Tendido y fusionado de fibra óptica",
        "Armado de racks, patcheras y organización",
        "Switches, routers y firewalls",
        "WiFi empresarial y sistemas mesh",
        "Segmentación por VLAN",
        "VPN y acceso remoto seguro",
        "Enlaces punto a punto entre sucursales",
        "Certificación y medición de red",
        "Planos y documentación de red",
        "Ampliación de red existente",
        "Redes industriales y de planta",
      ],
    },
    {
      id: "seguridad-electronica",
      title: "Seguridad electrónica",
      icon: Camera,
      summary: "Cámaras, accesos y alarmas, con monitoreo desde el celular.",
      items: [
        "Instalación de cámaras de seguridad y CCTV",
        "Cámaras IP, analógicas y con visión nocturna",
        "Grabadores DVR y NVR",
        "Monitoreo remoto desde celular y PC",
        "Control de acceso por tarjeta y biometría",
        "Molinetes y barreras peatonales",
        "Cerraduras electrónicas y videoporteros",
        "Alarmas, sensores y sirenas",
        "Portones y barreras automáticas",
        "Detección de humo e incendio",
        "Mantenimiento de sistemas ya instalados",
        "Ampliación y migración a IP",
      ],
    },
    {
      id: "soporte",
      title: "Soporte técnico y equipamiento",
      icon: Headphones,
      summary: "El día a día de los equipos y de la gente que los usa.",
      items: [
        "Soporte técnico on-site y remoto",
        "Mesa de ayuda para el personal",
        "Armado, upgrade y reparación de PCs",
        "Service de notebooks",
        "Servidores, NAS y almacenamiento",
        "Impresoras, multifunción y etiquetadoras",
        "Instalación de sistemas operativos y software",
        "Gestión de licencias y suscripciones",
        "Migraciones de equipos y de datos",
        "Puesta a punto de puestos de trabajo",
        "Abonos mensuales de mantenimiento",
        "Provisión y compra de equipamiento",
      ],
    },
    {
      id: "ciberseguridad",
      title: "Ciberseguridad",
      icon: ShieldCheck,
      summary: "Protección real, no solo un antivirus instalado y olvidado.",
      items: [
        "Firewall perimetral y configuración de reglas",
        "Antivirus y EDR corporativo",
        "Políticas de acceso y permisos por usuario",
        "Doble factor de autenticación",
        "Filtrado de contenido y navegación",
        "Capacitación anti-phishing al personal",
        "Auditoría de seguridad de red",
        "Respuesta ante incidentes",
        "Gestión centralizada de contraseñas",
      ],
    },
    {
      id: "backups",
      title: "Backups y recuperación de datos",
      icon: HardDrive,
      summary: "El seguro que nadie valora hasta el día que lo necesita.",
      items: [
        "Backup local y en la nube",
        "Automatización y verificación de respaldos",
        "Recuperación de datos de discos dañados",
        "Recuperación ante ransomware",
        "Plan de continuidad del negocio",
        "Réplica de servidores",
        "Archivado histórico y retención",
        "Pruebas periódicas de restauración",
      ],
    },
    {
      id: "energia",
      title: "Energía y respaldo eléctrico",
      icon: Zap,
      summary: "Que un corte de luz no te cueste el día de trabajo.",
      items: [
        "Instalación y mantenimiento de UPS",
        "Recambio de baterías",
        "Grupos electrógenos",
        "Estabilizadores de tensión",
        "Tableros eléctricos y protecciones",
        "Puesta a tierra y descarga atmosférica",
        "Instalación eléctrica de oficinas y locales",
        "Iluminación LED y eficiencia energética",
        "Medición de consumo y calidad de energía",
      ],
    },
    {
      id: "clima",
      title: "Climatización y refrigeración",
      icon: Thermometer,
      summary: "Aires, cámaras frigoríficas y salas de servidores.",
      items: [
        "Instalación de aires acondicionados",
        "Service y reparación de equipos de frío",
        "Mantenimiento preventivo y carga de gas",
        "Climatización de salas de servidores",
        "Cámaras frigoríficas y heladeras comerciales",
        "Cortinas de aire",
        "Sistemas de extracción y ventilación",
        "Calefacción y equipos frío-calor",
        "Abonos de mantenimiento estacional",
      ],
    },
    {
      id: "electromecanica",
      title: "Electromecánica y electrodomésticos",
      icon: Fan,
      summary: "Reparación de equipos, con diagnóstico y presupuesto antes de tocar nada.",
      items: [
        "Reparación de TV y microondas",
        "Heladeras, freezers y exhibidoras",
        "Lavarropas y secarropas",
        "Hornos, anafes y cocinas",
        "Termotanques y calefones",
        "Motores eléctricos y bombas",
        "Mantenimiento industrial liviano",
        "Reparación de equipamiento gastronómico",
        "Diagnóstico y presupuesto sin cargo",
      ],
    },
    {
      id: "av",
      title: "Audio, video y cartelería digital",
      icon: Antenna,
      summary: "Pantallas, sonido y salas de reunión que funcionan a la primera.",
      items: [
        "Pantallas LED y digital signage",
        "TVs de cartelería para locales y vidrieras",
        "Proyectores y pantallas de proyección",
        "Sistemas de sonido ambiental",
        "Salas de reunión y videoconferencia",
        "Streaming de eventos",
        "Instalación, soporte y calibración",
        "Contenido rotativo para pantallas",
      ],
    },
    {
      id: "consultoria-it",
      title: "Consultoría e implementación",
      icon: Briefcase,
      summary: "Antes de comprar equipamiento, conviene saber qué hace falta.",
      items: [
        "Relevamiento técnico en sitio",
        "Proyecto y presupuesto de obra",
        "Planos de red y eléctricos",
        "Asesoramiento en compra de equipamiento",
        "Mudanzas de oficina y montaje completo",
        "Puesta en marcha de sucursales nuevas",
        "Dirección técnica de obra",
        "Inventario y documentación de activos",
      ],
    },
  ],
  process: [
    {
      number: "01",
      title: "Visita y relevamiento",
      description:
        "Vamos al lugar, medimos y documentamos lo que hay. Sin diagnóstico a distancia ni presupuestos al voleo.",
    },
    {
      number: "02",
      title: "Proyecto y presupuesto",
      description:
        "Te presentamos qué se instala, con qué materiales, en cuánto tiempo y a qué costo. Todo por escrito.",
    },
    {
      number: "03",
      title: "Instalación",
      description:
        "Ejecutamos con la menor interrupción posible de tu operación, en horarios coordinados con tu equipo.",
    },
    {
      number: "04",
      title: "Mantenimiento",
      description:
        "Abono mensual con visitas preventivas, guardia ante fallas y documentación siempre actualizada.",
    },
  ],
  metrics: [
    { value: "On-site", label: "Presencia física, no solo remoto" },
    { value: "10", label: "Familias de servicios" },
    { value: "24/7", label: "Guardia para clientes con abono" },
    { value: "1", label: "Un solo proveedor para todo" },
  ],
  crossSell: [
    {
      slug: "software",
      reason:
        "Si además del equipamiento necesitás un sistema que lo controle (stock, accesos, turnos), lo desarrollamos a medida.",
    },
    {
      slug: "marketing",
      reason:
        "Instalamos las pantallas y la cartelería digital, y también producimos el contenido que se muestra en ellas.",
    },
  ],
  seo: {
    title: "Servicios de IT, Redes, Cámaras y Mantenimiento en Argentina",
    description:
      "Cableado estructurado, fibra óptica, cámaras de seguridad CCTV, soporte técnico, servidores, UPS, climatización y electromecánica. Instalación y abonos de mantenimiento para empresas.",
    keywords: [
      "instalacion de camaras de seguridad",
      "cableado estructurado argentina",
      "soporte tecnico empresas",
      "servicio tecnico informatico",
      "instalacion de redes empresas",
      "mantenimiento de aires acondicionados",
      "instalacion de ups",
      "ciberseguridad pymes",
      "recuperacion de datos",
      "fibra optica empresas",
    ],
  },
}

export const areas: Area[] = [marketing, software, it]

export const areasBySlug: Record<AreaSlug, Area> = {
  marketing,
  software,
  it,
}

export function getArea(slug: AreaSlug): Area {
  return areasBySlug[slug]
}

/**
 * Bloque que se repite en las tres landings: si el trabajo no está listado,
 * igual lo conseguimos a través de la red de especialistas y proveedores.
 */
export const capabilityPitch = {
  eyebrow: "Sin límite de alcance",
  title: "¿No está en la lista?",
  highlight: "Igual lo resolvemos",
  description:
    "Este catálogo es lo que hacemos habitualmente, no el techo de lo que podemos hacer. Trabajamos con una red de especialistas, proveedores y productoras en todos los rubros: si un proyecto necesita una disciplina que no está acá, la conseguimos, la coordinamos y respondemos por el resultado como si fuera nuestra.",
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
}
