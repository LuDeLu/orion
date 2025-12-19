"use client"

import { Rocket, Target, BarChart3, Megaphone, Palette, Globe, X } from "lucide-react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"

const services = [
  {
    icon: Rocket,
    title: "Branding",
    description: "Identidad visual que captura la esencia de tu negocio.",
    image: "/modern-branding-design-workspace.jpg",
    fullDescription:
      "Creamos identidades de marca completas que comunican los valores de tu negocio. Desde el logo hasta la guía de estilo, desarrollamos una imagen coherente y memorable que conecta con tu audiencia.",
    features: [
      "Diseño de logo y variantes",
      "Paleta de colores corporativa",
      "Tipografía y guía de estilo",
      "Aplicaciones de marca",
      "Manual de identidad visual",
    ],
  },
  {
    icon: Target,
    title: "Estrategia Digital",
    description: "Planes basados en datos para alcanzar tus objetivos.",
    image: "/digital-strategy-analytics-dashboard.jpg",
    fullDescription:
      "Desarrollamos estrategias digitales personalizadas basadas en análisis de mercado y comportamiento del usuario. Planificamos cada acción para maximizar el ROI y alcanzar tus metas de negocio.",
    features: [
      "Análisis de mercado y competencia",
      "Definición de objetivos y KPIs",
      "Plan de contenido estratégico",
      "Optimización de conversión",
      "Reporting y análisis continuo",
    ],
  },
  {
    icon: BarChart3,
    title: "Performance Ads",
    description: "Campañas publicitarias con ROI medible y optimizado.",
    image: "/performance-marketing-graphs.jpg",
    fullDescription:
      "Gestionamos campañas publicitarias en Meta Ads, Google Ads y otras plataformas con enfoque en resultados medibles. Optimizamos constantemente para maximizar tu inversión publicitaria.",
    features: [
      "Campañas en Meta Ads y Google Ads",
      "Segmentación precisa de audiencias",
      "A/B testing y optimización",
      "Remarketing estratégico",
      "Reportes detallados de performance",
    ],
  },
  {
    icon: Megaphone,
    title: "Social Media",
    description: "Contenido que construye comunidades auténticas.",
    image: "/social-media-content.png",
    fullDescription:
      "Gestionamos tus redes sociales con contenido relevante y atractivo que genera engagement real. Construimos comunidades activas alrededor de tu marca y aumentamos tu presencia digital.",
    features: [
      "Gestión de Instagram, Facebook, LinkedIn",
      "Creación de contenido visual y copy",
      "Calendario editorial estratégico",
      "Community management",
      "Análisis de métricas y engagement",
    ],
  },
  {
    icon: Palette,
    title: "Diseño Creativo",
    description: "Visuales impactantes para destacar en el mundo digital.",
    image: "/creative-design-studio.png",
    fullDescription:
      "Creamos piezas gráficas que captan la atención y comunican tu mensaje de forma efectiva. Desde posts para redes hasta material publicitario, cada diseño está pensado para tu audiencia.",
    features: [
      "Diseño de posts y stories",
      "Piezas publicitarias digitales",
      "Infografías y presentaciones",
      "Material para campañas",
      "Adaptación a diferentes formatos",
    ],
  },
  {
    icon: Globe,
    title: "Desarrollo Web",
    description: "Sitios que convierten visitantes en clientes.",
    image: "/modern-web-development.png",
    fullDescription:
      "Desarrollamos sitios web modernos, rápidos y optimizados para conversión. Desde landing pages hasta e-commerce, creamos experiencias digitales que impulsan tu negocio.",
    features: [
      "Sitios web responsive y modernos",
      "Landing pages optimizadas",
      "E-commerce y tiendas online",
      "Integración con herramientas de marketing",
      "Mantenimiento y soporte técnico",
    ],
  },
]

export function Services() {
  const [selectedService, setSelectedService] = useState<(typeof services)[0] | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = useRef(null)
  // This ensures the animation triggers as soon as the component enters the viewport
  const isInView = useInView(ref, { once: true, amount: 0.05 })

  useEffect(() => {
    const serviceParam = searchParams.get("servicio")
    if (serviceParam) {
      const service = services.find((s) => s.title.toLowerCase().replace(/\s+/g, "-") === serviceParam)
      if (service) {
        setSelectedService(service)
      }
    } else {
      setSelectedService(null)
    }
  }, [searchParams])

  const openModal = (service: (typeof services)[0]) => {
    const serviceSlug = service.title.toLowerCase().replace(/\s+/g, "-")
    router.push(`?servicio=${serviceSlug}`, { scroll: false })
  }

  const closeModal = () => {
    router.back()
  }

  return (
    <section ref={ref} id="servicios" className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 max-w-4xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Servicios
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4 mb-6 text-balance">
            Servicios de Marketing Digital{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              para tu negocio
            </span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-xl text-pretty">
            Soluciones integrales de branding, redes sociales, publicidad digital y diseño web que generan resultados
            medibles para tu PyME o Startup
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => openModal(service)}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-card/50 to-card/30 border border-border/50 hover:border-primary/50 transition-all duration-500 cursor-pointer hover-lift"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={`${service.title} - Orion MKT`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              </div>
              <div className="p-8 relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{service.description}</p>
                <div className="mt-4 text-primary text-sm font-medium group-hover:underline">Ver más detalles →</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedService && (
        <div
          className="fixed inset-0 bg-background/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="bg-card border border-border rounded-2xl max-w-4xl w-full my-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
              <Image
                src={selectedService.image || "/placeholder.svg"}
                alt={selectedService.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                  <selectedService.icon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    {selectedService.title}
                  </h3>
                  <p className="text-foreground/60 mt-1">{selectedService.description}</p>
                </div>
              </div>

              <p className="text-foreground/80 text-base md:text-lg leading-relaxed mb-8">
                {selectedService.fullDescription}
              </p>

              <h4 className="text-xl font-display font-bold text-foreground mb-4">¿Qué incluye?</h4>
              <ul className="grid gap-3 mb-8">
                {selectedService.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-foreground/80">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-foreground py-6 text-lg font-semibold rounded-xl"
                asChild
              >
                <a
                  href={`https://wa.me/5491156566083?text=Hola! Me interesa consultar sobre ${selectedService.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar sobre este servicio
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
