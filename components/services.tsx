"use client"

import { Rocket, Target, BarChart3, Megaphone, Palette, Globe } from "lucide-react"
import Image from "next/image"

const services = [
  {
    icon: Rocket,
    title: "Branding",
    description: "Identidad visual que captura la esencia de tu negocio.",
    image: "/modern-branding-design-workspace.jpg",
  },
  {
    icon: Target,
    title: "Estrategia Digital",
    description: "Planes basados en datos para alcanzar tus objetivos.",
    image: "/digital-strategy-analytics-dashboard.jpg",
  },
  {
    icon: BarChart3,
    title: "Performance Ads",
    description: "Campañas publicitarias con ROI medible y optimizado.",
    image: "/performance-marketing-graphs.jpg",
  },
  {
    icon: Megaphone,
    title: "Social Media",
    description: "Contenido que construye comunidades auténticas.",
    image: "/social-media-content.png",
  },
  {
    icon: Palette,
    title: "Diseño Creativo",
    description: "Visuales impactantes para destacar en el mundo digital.",
    image: "/creative-design-studio.png",
  },
  {
    icon: Globe,
    title: "Desarrollo Web",
    description: "Sitios que convierten visitantes en clientes.",
    image: "/modern-web-development.png",
  },
]

export function Services() {
  return (
    <section id="servicios" className="relative py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-primary font-semibold text-sm uppercase tracking-widest">Servicios</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4 mb-6">
            Todo lo que necesitas
            <br />
            <span className="text-primary">en un solo lugar</span>
          </h2>
          <p className="text-foreground/60 max-w-2xl mx-auto text-xl">
            Soluciones integrales para impulsar tu presencia digital
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card/30 border border-border/50 hover:border-primary/50 transition-all duration-500"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              </div>
              <div className="p-8 relative">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
