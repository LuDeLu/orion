"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { useT } from "@/components/i18n-provider"

type Brand = {
  name: string
  /** Logo normalizado: lienzo 600x200 transparente, arte centrado y con
   *  peso óptico parejo (ver public/logos/clean). */
  logo: string
  url?: string
}

const brands: Brand[] = [
  { name: "Vittal", logo: "/logos/clean/vittal.webp", url: "https://www.vittal.com.ar/" },
  { name: "ADN Developers", logo: "/logos/clean/adn.webp", url: "https://adndevelopers.com.ar/" },
  { name: "Schepens", logo: "/logos/clean/scheppens.webp", url: "https://www.schepens.com.ar/" },
  // CMVet no tiene sitio público: el proyecto fue un sistema interno de laboratorio.
  { name: "CMVet Centenario", logo: "/logos/clean/cmvet.webp" },
  { name: "PlotChain", logo: "/logos/clean/plotchain.webp", url: "https://plotchain.io/" },
  { name: "RR Sintético", logo: "/logos/clean/rrsintetico.webp", url: "https://rrsintetico.com/" },
  { name: "Soul Security", logo: "/logos/clean/soulsecurity.webp", url: "https://soulsecurity.com.ar/" },
  { name: "Imperio 51", logo: "/logos/clean/i51.webp", url: "https://www.imperio51.com.ar/" },
]

function BrandLogo({ brand, duplicate }: { brand: Brand; duplicate?: boolean }) {
  const logo = (
    <Image
      src={brand.logo}
      alt={duplicate ? "" : brand.name}
      width={600}
      height={200}
      sizes="(max-width: 768px) 132px, 180px"
      quality={95}
      className="logo-mono w-[132px] md:w-[180px] h-auto opacity-55 group-hover/logo:opacity-100"
    />
  )

  const shell = "group/logo flex items-center justify-center px-6 md:px-10 shrink-0"

  if (duplicate || !brand.url) {
    return (
      <div className={shell} aria-hidden={duplicate} title={duplicate ? undefined : brand.name}>
        {logo}
      </div>
    )
  }

  return (
    <a
      href={brand.url}
      target="_blank"
      rel="noopener noreferrer"
      title={brand.name}
      className={`${shell} rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`}
    >
      {logo}
    </a>
  )
}

/**
 * Muro de marcas: sólo los logos, en marquee continuo.
 * Siluetas monocromas para que las ocho identidades convivan sin ruido;
 * el color vuelve al pasar el mouse.
 */
export function BrandsCarousel() {
  const t = useT().brands
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  // El marquee sólo corre mientras está a la vista: fuera de pantalla no
  // aporta nada y mantiene una capa animándose durante todo el scroll.
  // Necesita su propio ref: framer-motion registra un único callback de
  // intersección por elemento, así que dos useInView sobre el mismo nodo
  // se pisan entre sí.
  const marqueeRef = useRef(null)
  const isOnScreen = useInView(marqueeRef, { amount: 0 })

  return (
    <section ref={ref} className="relative pt-6 pb-20 md:pb-24 overflow-hidden isolate-paint">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-48 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary mb-4 px-3 py-1 rounded-md bg-primary/10 border border-primary/20">
            {t.kicker}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-foreground mb-4 tracking-tight leading-[1.08]">
            {t.titleStart} <span className="text-primary">{t.titleHighlight}</span>
          </h2>
          <p className="text-sm md:text-base text-foreground/65 max-w-xl mx-auto leading-relaxed">
            {t.lead}
          </p>
        </motion.div>
      </div>

      <motion.div
        ref={marqueeRef}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="marquee-viewport relative"
      >
        <div
          className="marquee-track flex w-max items-center py-6 gpu-layer"
          style={{ ["--marquee-duration" as string]: "44s" }}
          data-running={isOnScreen}
        >
          <ul className="marquee-group list-none m-0 p-0" aria-label={t.kicker}>
            {brands.map((brand) => (
              <li key={brand.name} className="flex shrink-0">
                <BrandLogo brand={brand} />
              </li>
            ))}
          </ul>
          <div className="marquee-group" data-duplicate="true" aria-hidden="true">
            {brands.map((brand) => (
              <BrandLogo key={`dup-${brand.name}`} brand={brand} duplicate />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
