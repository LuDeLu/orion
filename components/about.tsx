"use client"

import { CheckCircle2, Sparkles } from "lucide-react"

const features = [
  "Equipo multidisciplinario de expertos",
  "Metodologías ágiles y resultados rápidos",
  "Atención personalizada 24/7",
  "Precios accesibles para startups",
  "Reportes claros y transparentes",
  "Más de 5 proyectos exitosos",
]

export function About() {
  return (
    <section id="nosotros" className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Nosotros</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6 text-balance">
              Una agencia pensada para los que <span className="text-secondary">empiezan en grande</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              En Orion MKT entendemos que cada PyME y startup tiene sueños ambiciosos. Somos el puente entre donde estás
              y donde quieres llegar, combinando la frescura de ideas innovadoras con la solidez de estrategias
              probadas.
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Como la constelación de Orión, cada miembro de nuestro equipo brilla con luz propia, pero juntos formamos
              algo extraordinario.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-3xl bg-card border border-border p-8 relative overflow-hidden">
              {/* Abstract constellation pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="50" cy="50" r="3" fill="#f7d785" />
                  <circle cx="150" cy="40" r="2" fill="#f7d785" />
                  <circle cx="100" cy="100" r="4" fill="#e0642f" />
                  <circle cx="40" cy="150" r="2" fill="#f7d785" />
                  <circle cx="160" cy="140" r="3" fill="#f7d785" />
                  <circle cx="80" cy="180" r="2" fill="#e0642f" />
                  <line x1="50" y1="50" x2="100" y2="100" stroke="#f7d785" strokeWidth="0.5" />
                  <line x1="150" y1="40" x2="100" y2="100" stroke="#f7d785" strokeWidth="0.5" />
                  <line x1="100" y1="100" x2="40" y2="150" stroke="#f7d785" strokeWidth="0.5" />
                  <line x1="100" y1="100" x2="160" y2="140" stroke="#f7d785" strokeWidth="0.5" />
                </svg>
              </div>

              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground">Transformando negocios digitalmente (Aca iria el logo)</p>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
              100% Remoto
            </div>
            <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium">
              Toda Argentina
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
