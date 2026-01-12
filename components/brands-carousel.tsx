"use client"

import { useEffect, useRef } from "react"

const brands = [
  { name: "RR sintetico", logo: "/logos/Rrsintetico.png" },
  { name: "SoulSecurity", logo: "/logos/Soulsecurity.png" },
  { name: "Ganamos.net", logo: "/logos/Ganamos.png" },
  { name: "Monaco Cortinas", logo: "/logos/Monacocortinas.png" },
]

export function BrandsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollPosition = 0
    const scroll = () => {
      scrollPosition += 0.5
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
    }

    const intervalId = setInterval(scroll, 20)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Clientes
          </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4 mb-6 text-balance">
            Empresas que confían{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            en nuestra experiencia
            </span>
            </h2>            
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg md:text-xl mt-6 leading-relaxed">
            Hemos trabajado con más de 150 marcas en diversos sectores, desde startups en etapa temprana hasta empresas
            establecidas en crecimiento
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />

          <div ref={scrollRef} className="flex gap-16 overflow-hidden py-8" style={{ scrollBehavior: "auto" }}>
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-56 h-32 flex items-center justify-center bg-background/40 backdrop-blur-sm border border-foreground/10 rounded-2xl grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              >
                <img
                  src={brand.logo || "/placeholder.svg"}
                  alt={brand.name}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {[
            {
              quote: "Orion Marketing triplicó nuestras conversiones en 6 meses. Su enfoque basado en datos es excepcional.",
              author: "María González",
              role: "CEO, TechStartup",
              rating: 5,
            },
            {
              quote: "El equipo más profesional con el que hemos trabajado. Resultados reales desde el primer mes.",
              author: "Carlos Martínez",
              role: "Director Marketing, InnoLabs",
              rating: 5,
            },
            {
              quote:
                "Transformaron completamente nuestra presencia digital. Altamente recomendados para empresas en crecimiento.",
              author: "Laura Fernández",
              role: "Founder, CloudBase",
              rating: 5,
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-background/40 backdrop-blur-sm border border-foreground/10 rounded-2xl p-8 hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              <div>
                <div className="font-bold text-foreground">{testimonial.author}</div>
                <div className="text-sm text-foreground/60">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
