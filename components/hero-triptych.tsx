"use client"

import Link from "next/link"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, MapPin, Check } from "lucide-react"
import { useAreas } from "@/hooks/use-areas"
import { useT } from "@/components/i18n-provider"
import { OwnerIdentity } from "@/components/owner-signal"

/**
 * Cinturón de Orión: tres estrellas alineadas, una por área.
 * `active` enciende la estrella correspondiente al panel.
 */
function OrionBelt({ active, color }: { active: number; color: string }) {
  const stars = [
    { cx: 22, cy: 46, r: 3.4 },
    { cx: 50, cy: 34, r: 3.0 },
    { cx: 78, cy: 22, r: 3.4 },
  ]
  return (
    <svg viewBox="0 0 100 68" className="w-24 h-16" aria-hidden="true">
      <line
        x1={stars[0].cx}
        y1={stars[0].cy}
        x2={stars[2].cx}
        y2={stars[2].cy}
        stroke={color}
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.35"
      />
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={i === active ? s.r : s.r * 0.55}
          fill={color}
          opacity={i === active ? 1 : 0.28}
          className="transition-all duration-500"
        />
      ))}
      {/* Halo de la estrella activa */}
      <circle
        cx={stars[active].cx}
        cy={stars[active].cy}
        r={stars[active].r * 2.6}
        fill={color}
        opacity="0.12"
        className="transition-all duration-500"
      />
    </svg>
  )
}

export function HeroTriptych() {
  const t = useT()
  const areas = useAreas()
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section
      className="relative min-h-[100svh] flex flex-col justify-center pt-28 pb-14 px-4 md:px-6 isolate"
      aria-labelledby="hero-heading"
    >
      {/* Glow ambiental */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-visible">
        <div className="absolute top-1/4 left-[12%] w-[38rem] h-[38rem] bg-primary/[0.07] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-[12%] w-[40rem] h-[40rem] bg-accent/[0.05] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* ── Contexto antes de la decisión ──────────────────
           Quien llega por primera vez tiene que saber qué es esto antes de
           que le pidamos elegir un área. Es el h1 real de la página. */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-base md:text-lg font-medium text-foreground/75 max-w-2xl mx-auto text-balance leading-snug"
        >
          {t.hero.intro}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mt-6 mb-6 md:mb-8 text-xs md:text-sm font-semibold uppercase tracking-[0.28em] text-foreground/65"
        >
          {t.hero.pick}
        </motion.p>

        {/* ── Tríptico ────────────────────────────────────── */}
        <div
          className="flex flex-col lg:flex-row gap-3 lg:gap-4 lg:h-[19rem]"
          onMouseLeave={() => setHovered(null)}
        >
          {areas.map((area, i) => {
            const isHovered = hovered === i
            const isDimmed = hovered !== null && !isHovered
            const Icon = area.icon
            const rgb = area.accent.rgb

            return (
              <motion.div
                key={area.slug}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="lg:flex-1 lg:min-w-0"
                style={{
                  flexGrow: isHovered ? 1.75 : 1,
                  transition: "flex-grow 520ms cubic-bezier(0.22,1,0.36,1)",
                }}
                onMouseEnter={() => setHovered(i)}
              >
                <Link
                  href={area.href}
                  onFocus={() => setHovered(i)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-xl p-6 md:p-7 outline-none"
                  style={{
                    background: isHovered
                      ? `linear-gradient(160deg, rgba(${rgb},0.14) 0%, rgba(${rgb},0.04) 55%, var(--tint-1) 100%)`
                      : "var(--tint-1)",
                    border: `1px solid rgba(${rgb},${isHovered ? 0.45 : 0.14})`,
                    opacity: isDimmed ? 0.55 : 1,
                    boxShadow: isHovered ? `0 24px 60px -24px rgba(${rgb},0.45)` : "none",
                    transition:
                      "background 520ms cubic-bezier(0.22,1,0.36,1), border-color 320ms, opacity 320ms, box-shadow 420ms",
                  }}
                >
                  {/* Constelación de fondo */}
                  <div
                    className="absolute -top-2 -right-2 pointer-events-none transition-opacity duration-500"
                    style={{ opacity: isHovered ? 0.9 : 0.35 }}
                  >
                    <OrionBelt active={i} color={area.accent.hex} />
                  </div>

                  {/* Línea superior de acento */}
                  <div
                    aria-hidden
                    className="absolute top-0 left-0 h-px transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      width: isHovered ? "100%" : "28%",
                      background: `linear-gradient(90deg, ${area.accent.hex}, transparent)`,
                    }}
                  />

                  {/* Ícono + estrella */}
                  <div className="relative flex items-center gap-3 mb-5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-[420ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110"
                      style={{
                        background: `rgba(${rgb},0.14)`,
                        border: `1px solid rgba(${rgb},0.28)`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: area.accent.hex }} />
                    </div>
                    <span
                      className="text-xs font-semibold uppercase tracking-[0.22em] px-2.5 py-1 rounded-md"
                      style={{
                        background: `rgba(${rgb},0.12)`,
                        color: `rgba(${rgb},1)`,
                        border: `1px solid rgba(${rgb},0.28)`,
                      }}
                    >
                      {area.star}
                    </span>
                  </div>

                  {/* Título */}
                  <h2 className="relative text-2xl md:text-[1.75rem] font-display font-extrabold text-foreground mb-2.5 leading-tight">
                    {area.name}
                  </h2>

                  {/* Zona media: bajada y chips comparten el mismo espacio.
                     En desktop los chips están fuera del flujo y se cruzan con
                     la bajada al hover; ocultarlos dejándolos en el flujo no
                     acortaba la tarjeta —seguían reservando su alto— y era el
                     hueco muerto que la estiraba. En mobile van los dos, uno
                     debajo del otro, porque no hay hover. */}
                  <div className="relative lg:flex-1 lg:min-h-[4.25rem]">
                    {/* El cruce se resuelve con group-hover y no con el estado
                       de React: así queda acotado a lg y un tap en mobile,
                       que también dispara mouseenter, no apaga la bajada. */}
                    <p className="relative text-sm md:text-base text-foreground/65 leading-relaxed max-w-sm lg:transition-opacity lg:duration-[400ms] lg:group-hover:opacity-0">
                      {area.teaser}
                    </p>

                    <div className="relative flex flex-wrap gap-1.5 mt-5 mb-7 lg:absolute lg:inset-0 lg:mt-0 lg:mb-0 lg:content-start lg:pointer-events-none lg:opacity-0 lg:transition-opacity lg:duration-[400ms] lg:group-hover:opacity-100">
                      {area.chips.map((chip) => (
                        <span
                          key={chip}
                          className="h-fit text-xs px-2.5 py-1 rounded-md text-foreground/70"
                          style={{
                            background: "var(--tint-2)",
                            border: "1px solid var(--tint-3)",
                          }}
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pie: quién la dirige y el CTA, en una sola línea.
                     Apilados el CTA quedaba pegado al borde de la tarjeta;
                     en la misma fila comparten la línea de base y el pie
                     vuelve a leerse como un bloque. */}
                  <div
                    className="relative mt-auto pt-5 flex items-center justify-between gap-4"
                    style={{ borderTop: `1px solid rgba(${rgb},0.15)` }}
                  >
                    <OwnerIdentity area={area} />
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-semibold shrink-0 transition-all duration-300 group-hover:gap-2.5"
                      style={{ color: area.accent.hex }}
                    >
                      {t.hero.viewArea}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* ── Titular + bajada, debajo del tríptico ─────────── */}
        <div className="text-center mt-10 md:mt-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-foreground mb-5 leading-[1.05] tracking-tight text-balance"
          >
            {t.hero.titleStart}{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-base md:text-lg lg:text-xl text-foreground/65 max-w-3xl mx-auto leading-relaxed text-pretty"
          >
            {t.hero.lead}
          </motion.p>
        </div>

        {/* ── Cuarta puerta + señales de confianza ────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.95 }}
          className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-5 pt-6 border-t border-[var(--hairline)]"
        >
          <Link
            href="#contacto"
            className="group text-sm text-foreground/65 hover:text-foreground transition-colors duration-300 text-center lg:text-left"
          >
            {t.hero.notSure}{" "}
            <span className="inline-block text-primary transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-foreground/65">
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary" />
              {t.hero.badges[0]}
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-foreground/20" />
            <span className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary" />
              {t.hero.badges[1]}
            </span>
            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-foreground/20" />
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              {t.hero.badges[2]}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
