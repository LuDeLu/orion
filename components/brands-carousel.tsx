"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { X, ExternalLink, ArrowUpRight } from "lucide-react"

type Brand = {
  name: string
  logo: string
  url: string
  industry: string
  tagline: string
  description: string
  services: string[]
  result?: string
}

const brands: Brand[] = [
  {
    name: "RR Sintético",
    logo: "/logos/Rrsintetico.png",
    url: "https://rrsintetico.com/",
    industry: "Industria",
    tagline: "Presencia digital para líder en pisos sintéticos",
    description:
      "Desarrollamos la estrategia digital completa de RR Sintético, empresa referente en fabricación e instalación de pisos sintéticos. Desde el branding hasta la gestión de redes sociales, consolidamos su presencia online y generamos nuevas oportunidades de negocio.",
    services: ["Branding", "Redes Sociales", "Performance Ads", "Estrategia Digital"],
    result: "Incremento en consultas orgánicas y posicionamiento como referente del sector",
  },
  {
    name: "Soul Security",
    logo: "/logos/Soulsecurity.png",
    url: "https://soulsecurity.com.ar/",
    industry: "Seguridad",
    tagline: "Visibilidad y confianza para empresa de seguridad",
    description:
      "Trabajamos con Soul Security en la construcción de su identidad digital, generando contenido de valor que transmite confianza y profesionalismo. Gestionamos sus campañas publicitarias para captar nuevos clientes en un mercado altamente competitivo.",
    services: ["Branding", "Gestión de Redes", "Performance Ads"],
    result: "Aumento sostenido de leads calificados mes a mes",
  },
  {
    name: "Monaco Cortinas",
    logo: "/logos/Monacocortinas.png",
    url: "https://www.monacocortinas.com.ar/",
    industry: "Decoración & Hogar",
    tagline: "Elegancia digital para una marca de cortinas premium",
    description:
      "Potenciamos la presencia online de Monaco Cortinas con una estrategia visual coherente con su producto de alta gama. Diseñamos contenido aspiracional y campañas segmentadas para llegar a su público objetivo de manera efectiva.",
    services: ["Estrategia Digital", "Contenido Visual", "Performance Ads"],
    result: "Crecimiento en ventas online y mayor reconocimiento de marca",
  },
  {
    name: "Schepens",
    logo: "/logos/scheppens.png",
    url: "https://www.schepens.com.ar/",
    industry: "Retail",
    tagline: "Transformación digital para empresa de retail",
    description:
      "Acompañamos a Schepens en su transformación digital, desarrollando una estrategia integral de marketing que abarca desde la presencia en redes hasta la publicidad paga. Logramos conectar la marca con nuevas audiencias y aumentar sus ventas digitales.",
    services: ["Estrategia Digital", "Redes Sociales", "Performance Ads", "Branding"],
    result: "Expansión de audiencia digital y aumento en conversiones",
  },
  {
    name: "Vittal",
    logo: "/logos/vittal.png",
    url: "https://www.vittal.com.ar/",
    industry: "Salud",
    tagline: "Comunicación digital para empresa de emergencias médicas",
    description:
      "Colaboramos con Vittal en la gestión de su comunicación digital, creando contenido que refuerza la confianza en sus servicios de emergencias médicas. Desarrollamos campañas orientadas a captar nuevos socios con mensajes claros y empáticos.",
    services: ["Gestión de Redes", "Contenido Digital", "Performance Ads"],
    result: "Mejora en el engagement y captación de nuevos socios",
  },
  {
    name: "PlotChain",
    logo: "/logos/Plotchain.png",
    url: "http://plotchain.io/",
    industry: "Tecnología & Blockchain",
    tagline: "Posicionamiento de marca en el ecosistema Web3",
    description:
      "Trabajamos con PlotChain en su estrategia de comunicación y posicionamiento dentro del ecosistema blockchain. Desarrollamos contenido técnico accesible y campañas de awareness para atraer inversores y usuarios a su plataforma.",
    services: ["Branding", "Estrategia Digital", "Contenido Técnico"],
    result: "Crecimiento en comunidad y visibilidad en el sector Web3",
  },
  {
    name: "ADN",
    logo: "/logos/Adn.png",
    url: "#",
    industry: "Empresa",
    tagline: "Estrategia y presencia digital",
    description:
      "Desarrollamos junto a ADN una estrategia de marketing digital orientada a resultados, fortaleciendo su presencia online y generando nuevas oportunidades de crecimiento.",
    services: ["Estrategia Digital", "Redes Sociales", "Performance Ads"],
    result: "Mayor visibilidad y captación de nuevos clientes",
  },
  {
    name: "CMVet",
    logo: "/logos/Cmvet.jpg",
    url: "#",
    industry: "Veterinaria",
    tagline: "Presencia digital para clínica veterinaria",
    description:
      "Acompañamos a CMVet en la construcción de su identidad digital, desarrollando contenido que conecta con dueños de mascotas y genera confianza en sus servicios veterinarios.",
    services: ["Branding", "Redes Sociales", "Contenido Digital"],
    result: "Aumento en consultas y fidelización de clientes",
  },
  {
    name: "I51",
    logo: "/logos/I51.jpg",
    url: "#",
    industry: "Empresa",
    tagline: "Crecimiento digital estratégico",
    description:
      "Trabajamos con I51 en su expansión digital, diseñando una estrategia personalizada para alcanzar nuevas audiencias y potenciar su negocio en el entorno online.",
    services: ["Estrategia Digital", "Performance Ads", "Branding"],
    result: "Incremento en leads y posicionamiento de marca",
  },
]

function BrandModal({ brand, onClose }: { brand: Brand; onClose: () => void }) {
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
        className="relative z-10 w-full max-w-lg bg-background border border-foreground/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header con logo */}
        <div className="relative bg-gradient-to-br from-foreground/5 to-primary/5 border-b border-foreground/10 px-6 pt-6 pb-5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-foreground/40 hover:text-foreground hover:bg-foreground/10 transition-all duration-200"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-background/60 rounded-xl border border-foreground/10 flex items-center justify-center p-2 flex-shrink-0">
              <img
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                className="max-h-10 max-w-full object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-primary/70">
                {brand.industry}
              </span>
              <h3 className="text-lg font-bold text-foreground leading-tight mt-0.5">
                {brand.name}
              </h3>
              <p className="text-sm text-foreground/50 mt-0.5">{brand.tagline}</p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-6 py-5 space-y-5">
          <p className="text-sm text-foreground/70 leading-relaxed">{brand.description}</p>

          {/* Servicios */}
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-foreground/35 mb-2.5">
              Servicios aplicados
            </p>
            <div className="flex flex-wrap gap-2">
              {brand.services.map((service) => (
                <span
                  key={service}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
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
          <div className="px-6 pb-5">
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
                className="group relative aspect-[5/3] flex flex-col items-center justify-center bg-background/30 backdrop-blur-sm border border-foreground/10 rounded-2xl px-5 py-5 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 hover:border-primary/40 hover:bg-background/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/8 transition-all duration-300 cursor-pointer text-left"
                aria-label={`Ver proyecto de ${brand.name}`}
                title={`Ver trabajo con ${brand.name}`}
              >
                <img
                  src={brand.logo || "/placeholder.svg"}
                  alt={brand.name}
                  loading="lazy"
                  className="max-h-12 md:max-h-14 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay hint */}
                <span className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                    Ver proyecto
                  </span>
                </span>
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
