"use client"

import { useEffect, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef } from "react"
import {
  X,
  ExternalLink,
  Linkedin,
  Code2,
  Palette,
  Megaphone,
  Globe,
  Mail,
  ArrowUpRight,
  Server,
} from "lucide-react"

type Member = {
  id: string
  name: string
  role: string
  area: string
  initials: string
  icon: typeof Code2
  accent: {
    avatarFrom: string
    avatarTo: string
    ring: string
    glow: string
    iconColor: string
    chipBg: string
    chipBorder: string
  }
  short: string
  bio: string[]
  skills: string[]
  contact?: { label: string; href: string }
  showcase: {
    type: "portfolio" | "linkedin" | "external"
    url: string
    title: string
    subtitle: string
  }
}

const team: Member[] = [
  {
    id: "lucas",
    name: "Lucas Baez",
    role: "Fundador",
    area: "Desarrollo de software & web",
    initials: "LB",
    icon: Code2,
   accent: {
      avatarFrom: "from-primary/40",
      avatarTo: "to-accent/20",
      ring: "ring-primary/30",
      glow: "bg-primary/20",
      iconColor: "text-primary",
      chipBg: "bg-primary/10",
      chipBorder: "border-primary/25",
    }, 
    short:
      "Traduce los objetivos comerciales en producto: sitios, landings y aplicaciones que convierten.",
    bio: [
      "Desarrollador full-stack y co-fundador de Orion. Trabaja en la intersección entre marketing y producto, traduciendo objetivos de negocio en sitios, landings y aplicaciones web que realmente convierten.",
      "Se especializa en stacks modernos (Next.js, React, TypeScript) y en armar soluciones técnicas hechas a medida para cada cliente: desde landings enfocadas en performance hasta integraciones, paneles internos y e-commerces.",
    ],
    skills: [
      "Next.js & React",
      "TypeScript",
      "Diseño de producto",
      "SEO técnico",
      "Integraciones & automatizaciones",
      "Performance web",
    ],
    showcase: {
      type: "portfolio",
      url: "https://ludelu.dev/",
      title: "ludelu.dev",
      subtitle: "Proyectos, casos y stack técnico",
    },
  },
  {
    id: "david",
    name: "David Cabella",
    role: "Fundador",
    area: "Marketing & estrategia",
    initials: "DC",
    icon: Megaphone,
    accent: {
      avatarFrom: "from-accent/40",
      avatarTo: "to-primary/20",
      ring: "ring-accent/40",
      glow: "bg-accent/20",
      iconColor: "text-accent",
      chipBg: "bg-accent/10",
      chipBorder: "border-accent/30",
    },
    short:
      "Diseña la estrategia comercial de cada cliente: posicionamiento, embudo, contenido y campañas.",
    bio: [
      "Especialista en marketing digital y co-fundador de Orion. Diseña la estrategia comercial de cada cliente: posicionamiento, embudo, contenido y campañas pagas.",
      "Su enfoque combina branding y performance: construir marcas que se sostengan en el tiempo y, al mismo tiempo, generen demanda medible mes a mes.",
    ],
    skills: [
      "Estrategia digital",
      "Meta Ads & Google Ads",
      "Branding",
      "Embudos de conversión",
      "Analítica & KPIs",
      "Contenido",
    ],
    showcase: {
      type: "linkedin",
      url: "https://www.linkedin.com/in/davi-cabella/",
      title: "linkedin.com/in/davi-cabella",
      subtitle: "Trayectoria profesional completa",
    },
  },
  {
    id: "annie",
    name: "Annie Ojeda",
    role: "Fundadora",
    area: "Diseño gráfico & dirección creativa",
    initials: "AO",
    icon: Palette,
    accent: {
      avatarFrom: "from-primary/40",
      avatarTo: "to-accent/20",
      ring: "ring-primary/30",
      glow: "bg-primary/20",
      iconColor: "text-primary",
      chipBg: "bg-primary/10",
      chipBorder: "border-primary/25",
    },    
    short:
      "Define la identidad visual de cada cliente: branding, sistemas de marca y dirección creativa.",
    bio: [
      "Diseñadora gráfica y co-fundadora de Orion. Está detrás de la identidad visual de cada cliente: branding, sistemas de marca, piezas para redes y dirección creativa.",
      "Cree que el diseño no es decoración: es una herramienta para que el mensaje del cliente llegue claro, coherente y memorable a su audiencia.",
    ],
    skills: [
      "Branding & identidad",
      "Diseño editorial",
      "Sistemas de marca",
      "Dirección creativa",
      "Piezas para redes",
      "Ilustración",
    ],
    showcase: {
      type: "external",
      url: "https://www.artstation.com/annieth",
      title: "artstation.com/annieth",
      subtitle: "Portafolio de diseño & arte",
    },
  },
  {
    id: "nicolas",
    name: "Nicolas Mazzotti",
    role: "Co-fundador",
    area: "IT & infraestructura",
    initials: "NM",
    icon: Server,
    accent: {
      avatarFrom: "from-accent/40",
      avatarTo: "to-primary/20",
      ring: "ring-accent/40",
      glow: "bg-accent/20",
      iconColor: "text-accent",
      chipBg: "bg-accent/10",
      chipBorder: "border-accent/30",
    },
    short:
      "Encargado general del área IT: infraestructura, sistemas y operaciones técnicas.",
    bio: [
      "Co-fundador de Orion y responsable de toda el área de IT. Lidera la infraestructura, los sistemas internos y las operaciones técnicas que sostienen el día a día de la agencia y de cada proyecto.",
      "Su rol asegura que todo lo que diseñamos y desarrollamos se entregue sobre una base estable, segura y escalable: hosting, dominios, integraciones, automatizaciones y soporte continuo.",
    ],
    skills: [
      "Infraestructura & hosting",
      "Administración de sistemas",
      "DevOps & automatización",
      "Seguridad & backups",
      "Soporte técnico",
      "Operaciones IT",
    ],
    showcase: {
      type: "linkedin",
      url: "#",
      title: "Perfil profesional",
      subtitle: "Próximamente",
    },
  },
]

function Avatar({ member, size = "md" }: { member: Member; size?: "md" | "lg" }) {
  const Icon = member.icon
  const dim = size === "lg" ? "w-20 h-20" : "w-16 h-16"
  const text = size === "lg" ? "text-2xl" : "text-lg"
  const badge = size === "lg" ? "w-7 h-7" : "w-6 h-6"
  const badgeIcon = size === "lg" ? "w-3.5 h-3.5" : "w-3 h-3"

  return (
    <div className="relative flex-shrink-0">
      <div className={`absolute inset-0 ${member.accent.glow} blur-xl rounded-2xl`} />
      <div
        className={`relative ${dim} rounded-2xl bg-gradient-to-br ${member.accent.avatarFrom} ${member.accent.avatarTo} border border-foreground/15 ring-1 ${member.accent.ring} flex items-center justify-center shadow-lg`}
      >
        <span className={`${text} font-display font-bold text-foreground tracking-tight`}>
          {member.initials}
        </span>
      </div>
      <div
        className={`absolute -bottom-1.5 -right-1.5 ${badge} rounded-xl bg-background border border-foreground/15 flex items-center justify-center shadow-md`}
      >
        <Icon className={`${badgeIcon} ${member.accent.iconColor}`} />
      </div>
    </div>
  )
}

function ShowcasePreview({ member }: { member: Member }) {
  const { showcase, accent } = member
  const isExternalLink = showcase.url && showcase.url !== "#"

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    isExternalLink ? (
      <a
        href={showcase.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
        aria-label={`Abrir ${showcase.title} en una pestaña nueva`}
      >
        {children}
      </a>
    ) : (
      <div className="block opacity-90" aria-disabled="true">
        {children}
      </div>
    )

  const Icon = showcase.type === "linkedin" ? Linkedin : Globe

  return (
    <Wrapper>
      <div className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-background/40 backdrop-blur-sm group-hover:border-primary/40 group-hover:shadow-xl group-hover:shadow-primary/5 transition-all duration-300">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/10 bg-foreground/[0.03]">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
          </div>
          <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-foreground/[0.04] border border-foreground/10 text-xs text-foreground/55 truncate font-mono">
            {isExternalLink ? showcase.url.replace(/^https?:\/\//, "").replace(/\/$/, "") : "próximamente"}
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-foreground/40 group-hover:text-primary transition-colors" />
        </div>

        {/* Preview body */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${accent.avatarFrom} ${accent.avatarTo} opacity-30`} />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(156,114,224,0.7) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(247,215,133,0.6) 0, transparent 40%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${accent.avatarFrom} ${accent.avatarTo} border border-foreground/15 ring-1 ${accent.ring} mb-4 group-hover:scale-105 transition-transform duration-300`}
            >
              <Icon className={`w-6 h-6 ${accent.iconColor}`} />
            </div>
            <p className="text-base font-display font-bold text-foreground mb-1">
              {showcase.title}
            </p>
            <p className="text-xs text-foreground/55">{showcase.subtitle}</p>
            {isExternalLink && (
              <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                Abrir sitio
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </p>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

function MemberCard({
  member,
  onOpen,
  index,
  isInView,
}: {
  member: Member
  onOpen: () => void
  index: number
  isInView: boolean
}) {
  return (
    <motion.button
      onClick={onOpen}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group text-left relative overflow-hidden rounded-3xl border border-foreground/10 bg-background/40 backdrop-blur-sm p-8 hover:border-primary/40 hover:bg-background/60 transition-all duration-300 hover-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      aria-label={`Ver perfil de ${member.name}`}
    >
      <div
        className={`pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full ${member.accent.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative flex items-start gap-5 mb-6">
        <Avatar member={member} />
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-display font-bold text-foreground leading-tight">
            {member.name}
          </h3>
          <p className={`text-sm font-semibold mt-1 ${member.accent.iconColor}`}>{member.role}</p>
          <p className="text-sm text-foreground/55 mt-0.5">{member.area}</p>
        </div>
      </div>

      <p className="relative text-foreground/70 leading-relaxed text-sm mb-6">{member.short}</p>

      <div className="relative flex items-center justify-between pt-5 border-t border-foreground/10">
        <span className="text-xs text-foreground/45 uppercase tracking-[0.15em] font-semibold">
          Ver perfil
        </span>
        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${member.accent.iconColor}`}>
          Detalles
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </motion.button>
  )
}

function MemberModal({ member, onClose }: { member: Member; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-background/85 backdrop-blur-xl z-[60] flex items-start md:items-center justify-center p-4 md:p-6 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Perfil de ${member.name}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl my-auto bg-card/95 border border-foreground/15 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-foreground/10 flex items-center justify-center hover:bg-background hover:border-foreground/25 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className={`relative px-6 md:px-10 pt-10 pb-8 border-b border-foreground/10 bg-gradient-to-br ${member.accent.avatarFrom} ${member.accent.avatarTo}`}
        >
          <div className="absolute inset-0 bg-card/60 backdrop-blur-md" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar member={member} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground leading-tight">
                {member.name}
              </h3>
              <p className={`font-semibold mt-1 ${member.accent.iconColor}`}>{member.role}</p>
              <p className="text-foreground/65 text-sm mt-0.5">{member.area}</p>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-10 py-8 space-y-8">
          <div className="space-y-4">
            {member.bio.map((p, i) => (
              <p key={i} className="text-foreground/75 leading-relaxed">
                {p}
              </p>
            ))}
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-3">
              Especialidades
            </h4>
            <div className="flex flex-wrap gap-2">
              {member.skills.map((s) => (
                <span
                  key={s}
                  className={`px-3 py-1.5 rounded-full ${member.accent.chipBg} border ${member.accent.chipBorder} text-xs font-medium text-foreground/85`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40 mb-3">
              {member.showcase.type === "linkedin" ? "LinkedIn" : "Portafolio"}
            </h4>
            <ShowcasePreview member={member} />
          </div>

          {member.contact && (
            <a
              href={member.contact.href}
              className="inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              {member.contact.label}
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Team() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.15 })
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = team.find((m) => m.id === activeId) || null

  return (
    <section ref={ref} id="equipo" className="relative py-20 px-4" aria-labelledby="team-heading">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-4">
            Nuestro equipo
          </span>
          <h2
            id="team-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mt-4 mb-6 text-balance"
          >
            Las personas detrás de{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              cada solución
            </span>
          </h2>
          <p className="text-foreground/60 text-lg md:text-xl text-pretty">
            Cuatro disciplinas, un mismo equipo. Trabajás directo con quien hace, no con un intermediario.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <MemberCard
              key={member.id}
              member={member}
              index={i}
              isInView={isInView}
              onOpen={() => setActiveId(member.id)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && <MemberModal member={active} onClose={() => setActiveId(null)} />}
      </AnimatePresence>
    </section>
  )
}
