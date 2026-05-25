"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import Image from "next/image"
import {
  X,
  ExternalLink,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react"

type Brand = {
  name: string
  logo: string
  url: string
  industry: string
  tagline: string
  description: string
  services: string[]
  result?: string
  previews?: string[]
  accent?: string
}

const brands: Brand[] = [
  {
    name: "Vittal",
    logo: "/logos/vittal.webp",
    url: "https://www.vittal.com.ar/",
    industry: "Salud",
    tagline: "Comunicación digital para servicio de emergencias médicas",
    description:
      "Gestionamos la comunicación digital de Vittal con contenido que refuerza la confianza en sus servicios de emergencias médicas. Desarrollamos campañas orientadas a la captación de nuevos socios con mensajes claros, empáticos y de alto impacto.",
    services: ["Gestión de Redes", "Paid Media", "Contenido Digital"],
    result: "Mejora en engagement y captación de nuevos socios",
    accent: "from-rose-500/25 via-rose-500/10 to-transparent",
  },
  {
    name: "ADN",
    logo: "/logos/Adn.webp",
    url: "https://adndevelopers.com.ar/",
    industry: "Aplicación Web",
    tagline: "Plataforma constructora con CRM a medida",
    description:
      "Desarrollamos para ADN Developers una plataforma constructora con gestión de proyectos y clientes, más un CRM personalizado para seguimiento interno de proyectos, obras, calendarios y post-venta. Todo centralizado en un único panel administrativo.",
    services: ["Desarrollo Full Stack", "Next.js", "Node.js", "PostgreSQL"],
    result: "CRM en producción gestionando múltiples proyectos DOME activos",
    previews: ["/previews/adn.webp", "/previews/paneladn.webp"],
    accent: "from-sky-500/25 via-sky-500/10 to-transparent",
  },
  {
    name: "Schepens",
    logo: "/logos/scheppens.webp",
    url: "https://www.schepens.com.ar/",
    industry: "Retail",
    tagline: "Estrategia digital para empresa de retail",
    description:
      "Acompañamos a Schepens en su presencia digital con gestión de redes sociales, contenido orientado a conversión y campañas de publicidad paga. Conectamos la marca con nuevas audiencias y potenciamos sus ventas online.",
    services: ["Redes Sociales", "Paid Media", "Estrategia Digital"],
    result: "Mayor alcance digital y crecimiento sostenido en ventas online",
    previews: ["/previews/schepens.webp"],
    accent: "from-amber-500/25 via-amber-500/10 to-transparent",
  },
  {
    name: "CMVet",
    logo: "/logos/Cmvet.webp",
    url: "#",
    industry: "Aplicación Web · Veterinaria",
    tagline: "Sistema a medida para análisis clínicos veterinarios",
    description:
      "Desarrollamos un sistema completo para CMVet Centenario que se conecta directamente con las máquinas de análisis de sangre del laboratorio. La plataforma importa los datos automáticamente, organiza los resultados por paciente y panel (Bioquímica, Cinética Enzimática, etc.), y genera informes PDF profesionales con un solo clic, listos para entregar al veterinario.",
    services: ["Desarrollo Full Stack", "Next.js", "Node.js", "Sistema a medida"],
    result: "Miles de análisis procesados con generación automática de informes PDF",
    previews: ["/previews/cmvet1.webp", "/previews/cmvet2.webp"],
    accent: "from-emerald-500/25 via-emerald-500/10 to-transparent",
  },
  {
    name: "PlotChain",
    logo: "/logos/Plotchain.webp",
    url: "http://plotchain.io/",
    industry: "Tecnología & Blockchain",
    tagline: "Posicionamiento de marca en el ecosistema Web3",
    description:
      "Trabajamos con PlotChain en su estrategia de comunicación y posicionamiento dentro del ecosistema blockchain. Desarrollamos contenido técnico accesible y campañas de awareness para atraer inversores y usuarios a su plataforma.",
    services: ["Estrategia Digital", "Branding", "Contenido Técnico"],
    result: "Mayor visibilidad y crecimiento de comunidad en el sector Web3",
    accent: "from-violet-500/30 via-violet-500/10 to-transparent",
  },
  {
    name: "RR Sintético",
    logo: "/logos/Rrsintetico.webp",
    url: "https://rrsintetico.com/",
    industry: "Aplicación Web",
    tagline: "App web con sistema de cotizaciones y gestión de proyectos",
    description:
      "Desarrollamos el sitio web y la plataforma de gestión completa para RR Sintético: diseño dinámico con React y Node.js, APIs para cálculos exactos en cotizaciones, integración de pagos y gestión de inventario. También incluye un sistema de seguimiento logístico en tiempo real para sus entregas.",
    services: ["Desarrollo Full Stack", "Next.js", "Node.js", "MongoDB"],
    result: "Plataforma productiva en uso real con cotizador, inventario y tracking de pedidos",
    previews: ["/previews/rrsintetico.webp", "/previews/rrseguimientos.webp"],
    accent: "from-lime-500/25 via-lime-500/10 to-transparent",
  },
  {
    name: "Soul Security",
    logo: "/logos/Soulsecurity.webp",
    url: "https://soulsecurity.com.ar/",
    industry: "Sitio Web",
    tagline: "Sitio corporativo para empresa de seguridad privada",
    description:
      "Diseñamos y desarrollamos el sitio web corporativo de Soul Security, empresa especializada en instalación de cámaras, control de acceso y sistemas de seguridad para edificios. Sitio moderno, responsive y optimizado para generar consultas.",
    services: ["Diseño Web", "Next.js", "Tailwind"],
    result: "Sitio corporativo profesional que transmite confianza y genera consultas",
    previews: ["/previews/soulsecurity.webp"],
    accent: "from-slate-400/25 via-slate-400/10 to-transparent",
  },
  {
    name: "Monaco Cortinas",
    logo: "/logos/Monacocortinas.webp",
    url: "https://www.monacocortinas.com.ar/",
    industry: "Sitio Web",
    tagline: "Sitio comercial con catálogo de productos y plan de repuesto",
    description:
      "Desarrollamos el sitio web de Monaco Cortinas con catálogo completo de productos y formulario de contacto, más una segunda plataforma para Monaco Seguros con cotizador online. Ambos proyectos en Next.js y Tailwind, con diseño profesional y enfocados en conversión.",
    services: ["Diseño Web", "Next.js", "Tailwind"],
    result: "Dos sitios en producción: cortinas metálicas y correduría de seguros",
    previews: ["/previews/monacocor.webp", "/previews/monacoseg.webp"],
    accent: "from-orange-500/25 via-orange-500/10 to-transparent",
  },
  {
    name: "Imperio 51",
    logo: "/logos/I51.webp",
    url: "#",
    industry: "Sitio Web",
    tagline: "Sitio web moderno con identidad digital de alto impacto",
    description:
      "Diseñamos y desarrollamos el sitio web de Imperio 51, una marca digital construida con personalidad fuerte y estética futurista. Interfaz oscura con detalles en cyan, animaciones de entrada y una presentación visual que captura la identidad de la marca desde el primer scroll.",
    services: ["Diseño Web", "Next.js", "Tailwind", "Animaciones"],
    result: "Identidad digital única y presencia online que refleja el poder de la marca",
    previews: ["/previews/I51.webp"],
    accent: "from-cyan-500/30 via-cyan-500/10 to-transparent",
  },
]

function BrandModal({ brand, onClose }: { brand: Brand; onClose: () => void }) {
  const [previewIndex, setPreviewIndex] = useState(0)
  const previews = brand.previews ?? []
  const hasPreviews = previews.length > 0

  const prev = () => setPreviewIndex((i) => (i - 1 + previews.length) % previews.length)
  const next = () => setPreviewIndex((i) => (i + 1) % previews.length)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg bg-background border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {hasPreviews && (
          <div className="relative w-full aspect-video bg-foreground/5 overflow-hidden flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={previewIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0"
              >
                <Image
                  src={previews[previewIndex]}
                  alt={`Vista previa ${previewIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 512px"
                  className="object-cover object-top"
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/60 to-transparent" />

            {previews.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/70 hover:bg-background/90 border border-foreground/10 text-foreground/70 hover:text-foreground transition-all duration-200 backdrop-blur-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-background/70 hover:bg-background/90 border border-foreground/10 text-foreground/70 hover:text-foreground transition-all duration-200 backdrop-blur-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {previews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-200 ${
                        i === previewIndex ? "bg-primary w-4" : "bg-foreground/30 w-1.5"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-background/70 hover:bg-background/90 border border-foreground/10 text-foreground/60 hover:text-foreground transition-all duration-200 backdrop-blur-sm"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div
          className={`relative flex-shrink-0 ${
            hasPreviews
              ? "border-b border-foreground/10 px-5 pt-4 pb-4"
              : "bg-gradient-to-br from-foreground/5 to-primary/5 border-b border-foreground/10 px-6 pt-6 pb-5"
          }`}
        >
          {!hasPreviews && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/10 transition-all duration-200"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-background/60 rounded-xl border border-foreground/10 flex items-center justify-center p-2 flex-shrink-0">
              <Image
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                width={48}
                height={32}
                className="max-h-8 max-w-full object-contain w-auto h-auto"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-primary/70">
                {brand.industry}
              </span>
              <h3 className="text-base font-bold text-foreground leading-tight mt-0.5">
                {brand.name}
              </h3>
              <p className="text-xs text-foreground/50 mt-0.5">{brand.tagline}</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4 overflow-y-auto">
          <p className="text-sm text-foreground/70 leading-relaxed">{brand.description}</p>

          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-foreground/35 mb-2">
              Servicios aplicados
            </p>
            <div className="flex flex-wrap gap-1.5">
              {brand.services.map((service) => (
                <span
                  key={service}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {brand.result && (
            <div className="flex gap-3 bg-foreground/[0.03] border border-foreground/8 rounded-xl px-4 py-3">
              <ArrowUpRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground/60 leading-snug">
                <span className="text-foreground/80 font-medium">Resultado: </span>
                {brand.result}
              </p>
            </div>
          )}
        </div>

        {brand.url !== "#" && (
          <div className="px-5 pb-4 flex-shrink-0">
            <a
              href={brand.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 text-primary text-sm font-medium transition-all duration-200"
            >
              Visitar sitio web
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </motion.div>
    </div>
  )
}

function BrandCard({
  brand,
  onClick,
}: {
  brand: Brand
  onClick: () => void
}) {
  const preview = brand.previews?.[0]
  const hasPreview = !!preview
  const accent = brand.accent ?? "from-primary/25 via-primary/10 to-transparent"

  return (
    <button
      onClick={onClick}
      aria-label={`Ver caso de ${brand.name}`}
      className="group relative flex-shrink-0 w-[280px] md:w-[340px] h-[360px] md:h-[400px] rounded-2xl overflow-hidden bg-card/40 border border-foreground/10 hover:border-primary/40 shadow-lg shadow-black/20 hover:shadow-2xl hover:shadow-primary/15 hover:-translate-y-1.5 transition-all duration-500 ease-out text-left"
    >
      <div className="absolute inset-0">
        {hasPreview ? (
          <Image
            src={preview}
            alt={`${brand.name} - preview`}
            fill
            sizes="(max-width: 768px) 280px, 340px"
            loading="lazy"
            className="object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${accent} bg-card`}>
            <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,#ffffff_0%,transparent_50%)]" />
            <div className="absolute inset-0 flex items-center justify-center p-10">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={240}
                height={120}
                className="max-h-24 md:max-h-28 max-w-[75%] object-contain drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)] w-auto h-auto group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 via-40% to-background/0" />
        <div
          className={`absolute inset-0 bg-gradient-to-tr ${accent} opacity-50 mix-blend-screen pointer-events-none`}
        />
      </div>

      <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-foreground/90 bg-background/60 backdrop-blur-md border border-foreground/15 rounded-full px-2.5 py-1">
        <Sparkles className="w-3 h-3 text-primary" />
        {brand.industry}
      </span>

      {brand.result && (
        <span className="absolute top-3 right-3 z-10 text-[9px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-500/15 backdrop-blur-md border border-emerald-400/30 rounded-full px-2 py-1">
          Caso real
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-background/70 backdrop-blur-md rounded-lg border border-foreground/15 flex items-center justify-center p-1.5 flex-shrink-0">
            <Image
              src={brand.logo}
              alt={brand.name}
              width={36}
              height={24}
              className="max-h-6 max-w-full object-contain w-auto h-auto"
            />
          </div>
          <h3 className="font-display text-lg md:text-xl font-bold text-foreground leading-tight">
            {brand.name}
          </h3>
        </div>

        <p className="text-xs md:text-[13px] text-foreground/70 leading-snug line-clamp-2 min-h-[2.5rem]">
          {brand.tagline}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all duration-300">
            Ver caso
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-300" />
          </span>
          <div className="flex gap-1">
            {brand.services.slice(0, 2).map((s) => (
              <span
                key={s}
                className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-foreground/10 text-foreground/55 border border-foreground/10"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <span className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </button>
  )
}

export function BrandsCarousel() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [paused, setPaused] = useState(false)

  const loop = [...brands, ...brands]

  return (
    <>
      <section ref={ref} className="relative pt-6 pb-24 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-64 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-14"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80 mb-4 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              Casos de éxito
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">
              Marcas que confiaron{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                en nosotros
              </span>
            </h2>
            <p className="text-sm md:text-base text-foreground/55 max-w-xl mx-auto leading-relaxed">
              Desde startups hasta empresas consolidadas: descubrí cómo
              transformamos cada proyecto en una historia con resultados reales.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-xs text-foreground/45">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {brands.length}+ marcas activas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                +5 industrias
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Proyectos en producción
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative group/marquee"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-background to-transparent" />

          <div
            className={`marquee-track flex gap-4 md:gap-5 py-4 w-max ${
              paused ? "marquee-paused" : ""
            }`}
          >
            {loop.map((brand, i) => (
              <BrandCard
                key={`${brand.name}-${i}`}
                brand={brand}
                onClick={() => setSelectedBrand(brand)}
              />
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-xs text-foreground/40 mt-8 px-4"
        >
          Pasá el cursor para pausar · Hacé click en cualquier marca para ver el caso completo
        </motion.p>
      </section>

      <AnimatePresence>
        {selectedBrand && (
          <BrandModal brand={selectedBrand} onClose={() => setSelectedBrand(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
