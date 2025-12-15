"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4">
      <div className="scan-effect" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-8 futuristic-glow">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm text-foreground/80 font-medium">Marketing Digital para PyMEs & Startups</span>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-8 leading-[1.1] tracking-tight">
          Hacemos que tu marca
          <br />
          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent relative">
            brille
            <span className="absolute inset-0 blur-2xl opacity-50 bg-primary" />
          </span>{" "}
          tan fuerte como una
          <br />

          constelacion en las          <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent relative">
            redes
            <span className="absolute inset-0 blur-3xl opacity-40 bg-gradient-to-r from-secondary to-primary" />
          </span>{" "} 
        </h1>

        <p className="text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto mb-12 leading-relaxed">
          Estrategias que conectan, diseños que impactan, resultados que hablan por sí solos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 text-lg font-semibold group rounded-full relative overflow-hidden futuristic-glow"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center">
              Iniciar Proyecto
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-foreground/20 text-foreground hover:bg-foreground/5 px-10 py-7 text-lg font-semibold rounded-full bg-transparent backdrop-blur-sm"
          >
            Ver Portafolio
          </Button>
        </div>

        <div className="relative w-full max-w-5xl mx-auto h-64 opacity-50">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-secondary rounded-full blur-sm animate-pulse shadow-lg shadow-secondary/50" />
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary rounded-full blur-sm animate-pulse delay-300 shadow-lg shadow-primary/50" />
          <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-secondary rounded-full blur-sm animate-pulse delay-700 shadow-lg shadow-secondary/50" />
          <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-foreground/60 rounded-full blur-[1px] animate-pulse delay-500" />
          <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-foreground/60 rounded-full blur-[1px] animate-pulse delay-1000" />

<svg viewBox="0 0 200 280" className="w-full h-full">
          <defs>
            {/* Gradiente para las líneas principales */}
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f7d785" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#e0642f" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f7d785" stopOpacity="0.6" />
            </linearGradient>
            
            {/* Gradiente para el cinturón (más brillante) */}
            <linearGradient id="beltGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e0642f" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#f7d785" stopOpacity="1" />
              <stop offset="100%" stopColor="#e0642f" stopOpacity="0.85" />
            </linearGradient>
            
            {/* Filtro de brillo para estrellas */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Filtro de brillo intenso para estrellas principales */}
            <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Patrón de nebulosa */}
            <radialGradient id="nebula" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#e0642f" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#f7d785" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#e0642f" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Nebulosa de fondo en la región del cinturón */}
          <ellipse cx="100" cy="130" rx="50" ry="25" fill="url(#nebula)" />
          
          {/* =========== CONEXIONES =========== */}
          
          {/* BRAZO IZQUIERDO LEVANTADO */}
          {/* Hombro izquierdo hacia arriba */}
          <line x1="60" y1="70" x2="45" y2="40" stroke="url(#lineGrad)" strokeWidth="1.5" opacity="0.9" />
          <line x1="45" y1="40" x2="35" y2="25" stroke="url(#lineGrad)" strokeWidth="1.5" opacity="0.9" />
          
          {/* BRAZO DERECHO CON ARCO */}
          {/* Hombro derecho hacia arriba y derecha */}
          <line x1="140" y1="70" x2="155" y2="50" stroke="url(#lineGrad)" strokeWidth="1.5" opacity="0.9" />
          <line x1="155" y1="50" x2="165" y2="35" stroke="url(#lineGrad)" strokeWidth="1.5" opacity="0.9" />
          <line x1="165" y1="35" x2="175" y2="45" stroke="url(#lineGrad)" strokeWidth="1.5" opacity="0.9" />
          
          {/* HOMBROS conectados */}
          <line x1="60" y1="70" x2="100" y2="80" stroke="url(#lineGrad)" strokeWidth="1.5" opacity="0.9" />
          <line x1="100" y1="80" x2="140" y2="70" stroke="url(#lineGrad)" strokeWidth="1.5" opacity="0.9" />
          
          {/* Hombros al CINTURÓN */}
          <line x1="60" y1="70" x2="85" y2="130" stroke="url(#lineGrad)" strokeWidth="1.6" opacity="0.9" />
          <line x1="140" y1="70" x2="115" y2="130" stroke="url(#lineGrad)" strokeWidth="1.6" opacity="0.9" />

          {/* CINTURÓN DE ORIÓN (3 estrellas) - MÁS PROMINENTE */}
          <line x1="85" y1="130" x2="100" y2="130" stroke="url(#beltGrad)" strokeWidth="2.5" opacity="1" />
          <line x1="100" y1="130" x2="115" y2="130" stroke="url(#beltGrad)" strokeWidth="2.5" opacity="1" />

          {/* ESPADA (línea vertical desde el cinturón) */}
          <line x1="100" y1="130" x2="100" y2="155" stroke="url(#lineGrad)" strokeWidth="1.3" opacity="0.85" />
          <line x1="100" y1="155" x2="105" y2="175" stroke="url(#lineGrad)" strokeWidth="1.3" opacity="0.85" />

          {/* PIERNAS */}
          {/* Cinturón a pies */}
          <line x1="85" y1="130" x2="70" y2="230" stroke="url(#lineGrad)" strokeWidth="1.6" opacity="0.9" />
          <line x1="115" y1="130" x2="130" y2="230" stroke="url(#lineGrad)" strokeWidth="1.6" opacity="0.9" />

          {/* =========== ESTRELLAS =========== */}
          
          {/* BRAZO IZQUIERDO LEVANTADO */}
          <circle cx="45" cy="40" r="2.5" fill="#f7d785" filter="url(#glow)" />
          <circle cx="35" cy="25" r="3" fill="#e0642f" filter="url(#glow)" />
          
          {/* BRAZO DERECHO CON ARCO */}
          <circle cx="155" cy="50" r="2.5" fill="#f7d785" filter="url(#glow)" />
          <circle cx="165" cy="35" r="2.8" fill="#e0642f" filter="url(#glow)" />
          <circle cx="175" cy="45" r="2.5" fill="#f7d785" filter="url(#glow)" />
          
          {/* Centro del torso */}
          <circle cx="100" cy="80" r="2.5" fill="#f7d785" filter="url(#glow)" />
          
          {/* Hombro izquierdo - BETELGEUSE (naranja brillante) */}
          <circle cx="60" cy="70" r="5" fill="#e0642f" filter="url(#strongGlow)" opacity="0.95" />
          <circle cx="60" cy="70" r="3" fill="#f7d785" opacity="0.8" />
          
          {/* Hombro derecho - Bellatrix */}
          <circle cx="140" cy="70" r="3.8" fill="#f7d785" filter="url(#glow)" />
          
          {/* CINTURÓN DE ORIÓN - LAS 3 ESTRELLAS MÁS ICÓNICAS */}
          {/* Alnitak (izquierda) */}
          <circle cx="85" cy="130" r="3.5" fill="#f7d785" filter="url(#strongGlow)" />
          <circle cx="85" cy="130" r="2" fill="#e0642f" opacity="0.7" />
          
          {/* Alnilam (centro - la más brillante) */}
          <circle cx="100" cy="130" r="4.5" fill="#f7d785" filter="url(#strongGlow)" />
          <circle cx="100" cy="130" r="2.5" fill="#e0642f" opacity="0.8" />
          
          {/* Mintaka (derecha) */}
          <circle cx="115" cy="130" r="3.5" fill="#f7d785" filter="url(#strongGlow)" />
          <circle cx="115" cy="130" r="2" fill="#e0642f" opacity="0.7" />
          
          {/* ESPADA */}
          {/* Nebulosa de Orión (M42) - más difusa */}
          <circle cx="100" cy="155" r="5" fill="#e0642f" opacity="0.5" filter="url(#strongGlow)" />
          <circle cx="100" cy="155" r="2.5" fill="#f7d785" opacity="0.7" />
          {/* Punta de la espada */}
          <circle cx="105" cy="175" r="2.2" fill="#f7d785" filter="url(#glow)" />
          
          {/* Pie izquierdo - Saiph */}
          <circle cx="70" cy="230" r="3.8" fill="#f7d785" filter="url(#glow)" />
          
          {/* Pie derecho - RIGEL (dorado brillante) */}
          <circle cx="130" cy="230" r="5" fill="#f7d785" filter="url(#strongGlow)" opacity="0.95" />
          <circle cx="130" cy="230" r="3" fill="#e0642f" opacity="0.8" />

          {/* Estrellas decorativas de fondo */}
          <circle cx="30" cy="50" r="1" fill="#f7d785" opacity="0.4" />
          <circle cx="170" cy="90" r="1.2" fill="#f7d785" opacity="0.5" />
          <circle cx="160" cy="180" r="1" fill="#f7d785" opacity="0.4" />
          <circle cx="50" cy="200" r="0.8" fill="#f7d785" opacity="0.3" />
          <circle cx="150" cy="50" r="1" fill="#f7d785" opacity="0.4" />
          <circle cx="180" cy="140" r="0.9" fill="#f7d785" opacity="0.4" />
          <circle cx="20" cy="120" r="1.1" fill="#f7d785" opacity="0.5" />
          <circle cx="185" cy="200" r="0.9" fill="#f7d785" opacity="0.3" />
        </svg>
        </div>
      </div>
    </section>
  )
}
