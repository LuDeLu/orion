"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { X, ExternalLink, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"

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
}

const brands: Brand[] = [
  {
    name: "Vittal",
    logo: "/logos/vittal.png",
    url: "https://www.vittal.com.ar/",
    industry: "Salud",
    tagline: "Comunicación digital para servicio de emergencias médicas",
    description:
      "Gestionamos la comunicación digital de Vittal con contenido que refuerza la confianza en sus servicios de emergencias médicas. Desarrollamos campañas orientadas a la captación de nuevos socios con mensajes claros, empáticos y de alto impacto.",
    services: ["Gestión de Redes", "Performance Ads", "Contenido Digital"],
    result: "Mejora en engagement y captación de nuevos socios",
  },
  {
    name: "ADN",
    logo: "/logos/Adn.png",
    url: "https://adndevelopers.com.ar/",
    industry: "Aplicación Web",
    tagline: "Plataforma inmobiliaria con CRM a medida",
    description:
      "Desarrollamos para ADN Developers una plataforma inmobiliaria con gestión de propiedades y clientes, más un CRM personalizado para seguimiento interno de proyectos, obras, calendarios y post-venta. Todo centralizado en un único panel administrativo.",
    services: ["Desarrollo Full Stack", "Next.js", "Node.js", "PostgreSQL"],
    result: "CRM en producción gestionando múltiples proyectos DOME activos",
    previews: ["/previews/adn.png", "/previews/paneladn.png"],
  },
  {
    name: "Schepens",
    logo: "/logos/scheppens.png",
    url: "https://www.schepens.com.ar/",
    industry: "Retail",
    tagline: "Estrategia digital para empresa de retail",
    description:
      "Acompañamos a Schepens en su presencia digital con gestión de redes sociales, contenido orientado a conversión y campañas de publicidad paga. Conectamos la marca con nuevas audiencias y potenciamos sus ventas online.",
    services: ["Redes Sociales", "Performance Ads", "Estrategia Digital"],
    result: "Mayor alcance digital y crecimiento sostenido en ventas online",
  },
  {
    name: "CMVet",
    logo: "/logos/Cmvet.jpg",
    url: "#",
    industry: "Aplicación Web · Veterinaria",
    tagline: "Sistema a medida para análisis clínicos veterinarios",
    description:
      "Desarrollamos un sistema completo para CMVet Centenario que se conecta directamente con las máquinas de análisis de sangre del laboratorio. La plataforma importa los datos automáticamente, organiza los resultados por paciente y panel (Bioquímica, Cinética Enzimática, etc.), y genera informes PDF profesionales con un solo clic, listos para entregar al veterinario.",
    services: ["Desarrollo Full Stack", "Next.js", "Node.js", "Sistema a medida"],
    result: "Miles de análisis procesados con generación automática de informes PDF",
    previews: ["/previews/cmvet1.png", "/previews/cmvet2.png"],
  },
  {
    name: "PlotChain",
    logo: "/logos/Plotchain.png",
    url: "http://plotchain.io/",
    industry: "Tecnología & Blockchain",
    tagline: "Posicionamiento de marca en el ecosistema Web3",
    description:
      "Trabajamos con PlotChain en su estrategia de comunicación y posicionamiento dentro del ecosistema blockchain. Desarrollamos contenido técnico accesible y campañas de awareness para atraer inversores y usuarios a su plataforma.",
    services: ["Estrategia Digital", "Branding", "Contenido Técnico"],
    result: "Mayor visibilidad y crecimiento de comunidad en el sector Web3",
  },
  {
    name: "RR Sintético",
    logo: "/logos/Rrsintetico.png",
    url: "https://rrsintetico.com/",
    industry: "Aplicación Web",
    tagline: "App web con sistema de cotizaciones y gestión de proyectos",
    description:
      "Desarrollamos el sitio web y la plataforma de gestión completa para RR Sintético: diseño dinámico con React y Node.js, APIs para cálculos exactos en cotizaciones, integración de pagos y gestión de inventario. También incluye un sistema de seguimiento logístico en tiempo real para sus entregas.",
    services: ["Desarrollo Full Stack", "Next.js", "Node.js", "MongoDB"],
    result: "Plataforma productiva en uso real con cotizador, inventario y tracking de pedidos",
    previews: ["/previews/rrsintetico.png", "/previews/rrseguimientos.png"],
  },
  {
    name: "Soul Security",
    logo: "/logos/Soulsecurity.png",
    url: "https://soulsecurity.com.ar/",
    industry: "Sitio Web",
    tagline: "Sitio corporativo para empresa de seguridad privada",
    description:
      "Diseñamos y desarrollamos el sitio web corporativo de Soul Security, empresa especializada en instalación de cámaras, control de acceso y sistemas de seguridad para edificios. Sitio moderno, responsive y optimizado para generar consultas.",
    services: ["Diseño Web", "Next.js", "Tailwind"],
    result: "Sitio corporativo profesional que transmite confianza y genera consultas",
    previews: ["/previews/soulsecurity.png"],
  },
  {
    name: "Monaco Cortinas",
    logo: "/logos/Monacocortinas.png",
    url: "https://www.monacocortinas.com.ar/",
    industry: "Sitio Web",
    tagline: "Sitio comercial con catálogo de productos y plan de repuesto",
    description:
      "Desarrollamos el sitio web de Monaco Cortinas con catálogo completo de productos y formulario de contacto, más una segunda plataforma para Monaco Seguros con cotizador online. Ambos proyectos en Next.js y Tailwind, con diseño profesional y enfocados en conversión.",
    services: ["Diseño Web", "Next.js", "Tailwind"],
    result: "Dos sitios en producción: cortinas metálicas y correduría de seguros",
    previews: ["/previews/monacocor.png", "/previews/monacoseg.png"],
  },
  {
    name: "Imperio 51",
    logo: "/logos/I51.jpg",
    url: "#",
    industry: "Sitio Web",
    tagline: "Sitio web moderno con identidad digital de alto impacto",
    description:
      "Diseñamos y desarrollamos el sitio web de Imperio 51, una marca digital construida con personalidad fuerte y estética futurista. Interfaz oscura con detalles en cyan, animaciones de entrada y una presentación visual que captura la identidad de la marca desde el primer scroll.",
    services: ["Diseño Web", "Next.js", "Tailwind", "Animaciones"],
    result: "Identidad digital única y presencia online que refleja el poder de la marca",
    previews: ["/previews/I51.png"],
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
        {/* Vista previa con galería */}
        {hasPreviews && (
          <div className="relative w-full aspect-video bg-foreground/5 overflow-hidden flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={previewIndex}
                src={previews[previewIndex]}
                alt={`Vista previa ${previewIndex + 1}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full object-cover object-top"
              />
            </AnimatePresence>

            {/* Overlay gradiente bottom */}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background/60 to-transparent" />

            {/* Controles navegación */}
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
                {/* Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {previews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                        i === previewIndex ? "bg-primary w-4" : "bg-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Botón cerrar sobre la imagen */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-background/70 hover:bg-background/90 border border-foreground/10 text-foreground/60 hover:text-foreground transition-all duration-200 backdrop-blur-sm"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header con logo (sin imagen o con imagen ya arriba) */}
        <div className={`relative flex-shrink-0 ${hasPreviews ? "border-b border-foreground/10 px-5 pt-4 pb-4" : "bg-gradient-to-br from-foreground/5 to-primary/5 border-b border-foreground/10 px-6 pt-6 pb-5"}`}>
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
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                className="max-h-8 max-w-full object-contain"
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

        {/* Contenido scrolleable */}
        <div className="px-5 py-4 space-y-4 overflow-y-auto">
          <p className="text-sm text-foreground/70 leading-relaxed">{brand.description}</p>

          {/* Servicios */}
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

          {/* Resultado */}
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

        {/* Footer */}
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

export function BrandsCarousel() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

  return (
    <>
      <section ref={ref} className="relative pt-2 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Título sección */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.3em] text-primary/60 mb-3">
              Nuestro trabajo
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Empresas que confían en nosotros
            </h2>
            <p className="text-sm text-foreground/45 max-w-md mx-auto">
              Hacé click en cada empresa para conocer el trabajo que realizamos juntos
            </p>
          </motion.div>

          {/* Grid de proyectos */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {brands.map((brand, index) => (
              <motion.button
                key={brand.name}
                onClick={() => setSelectedBrand(brand)}
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative flex flex-col items-center justify-between h-[100px] md:h-[112px] bg-foreground/[0.04] hover:bg-foreground/[0.07] backdrop-blur-sm border border-foreground/8 hover:border-primary/35 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
                aria-label={`Ver proyecto de ${brand.name}`}
              >
                {/* Línea accent top */}
                <span className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Área logo */}
                <div className="w-full flex items-center justify-center px-6 pt-6 pb-4 flex-1">
                  <img
                    src={brand.logo || "/placeholder.svg"}
                    alt={brand.name}
                    loading="lazy"
                    className="max-h-11 md:max-h-14 max-w-[82%] object-contain grayscale opacity-45 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Footer de la card */}
                <div className="w-full px-3 pb-3 flex items-center justify-between gap-1">
                  <span className="text-[10px] font-medium text-foreground/30 group-hover:text-foreground/65 transition-colors duration-300 truncate leading-tight">
                    {brand.name}
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-primary/0 group-hover:text-primary/70 transition-all duration-300 whitespace-nowrap flex-shrink-0">
                    Ver →
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedBrand && (
        <BrandModal brand={selectedBrand} onClose={() => setSelectedBrand(null)} />
      )}
    </>
  )
}
