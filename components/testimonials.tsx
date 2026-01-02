"use client"

import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "María González",
    role: "CEO, TechStart",
    content:
      "Orion Marketing transformó nuestra presencia digital. En 6 meses triplicamos nuestros leads y el equipo siempre estuvo disponible para resolver cualquier duda.",
    rating: 5,
  },
  {
    name: "Carlos Mendoza",
    role: "Fundador, EcoShop",
    content:
      "Como startup, necesitábamos una agencia que entendiera nuestro presupuesto y nuestros sueños. Orion fue ese partner perfecto.",
    rating: 5,
  },
  {
    name: "Ana Rodríguez",
    role: "Directora Marketing, Innova Corp",
    content:
      "El equipo de Orion combina creatividad con datos de manera excepcional. Nuestras campañas nunca habían tenido tan buen rendimiento.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="casos" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">Testimonios</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            Lo que dicen de nosotros
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Nuestros clientes son nuestra mejor carta de presentación.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border relative">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-secondary fill-secondary" />
                ))}
              </div>

              <p className="text-foreground mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>

              <div>
                <div className="font-semibold text-foreground">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
