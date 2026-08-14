"use client"

import Link from "next/link"
import { Instagram, Linkedin, MapPin, Phone, Mail } from "lucide-react"
import { useAreas } from "@/hooks/use-areas"
import { useT } from "@/components/i18n-provider"
import { fill } from "@/lib/i18n"

const companyLinks = [
  { key: "casos", href: "/#casos" },
  { key: "nosotros", href: "/#nosotros" },
  { key: "equipo", href: "/#equipo" },
  { key: "contacto", href: "/#contacto" },
] as const

// Solo redes que existen: un ícono que no lleva a ningún lado resta confianza.
const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/orionmkt.ar", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/orionmkt-ar", label: "LinkedIn" },
]


export function Footer() {
  const t = useT()
  const areas = useAreas()

  return (
    <footer className="relative border-t border-border py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2 mb-6">
            <p className="text-muted-foreground max-w-sm mb-6">{t.footer.description}</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm">{t.footer.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="https://wa.me/5491156566083" className="text-sm hover:text-foreground transition-colors duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]">
                  +54 9 11 5656-6083
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:hola@orionmkt.com.ar" className="text-sm hover:text-foreground transition-colors duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]">
                  hola@orionmkt.com.ar
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:-translate-y-0.5 hover:bg-primary/5 transition-[color,border-color,transform,background-color] duration-[350ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.footer.areasHeading}</h4>
            <ul className="space-y-3">
              {areas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={area.href}
                    className="group inline-flex items-center gap-2 text-muted-foreground hover:text-foreground hover:translate-x-1 transition-[color,transform] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: area.accent.hex }}
                    />
                    {area.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.footer.companyHeading}</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-[color,transform] duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] inline-block">
                    {t.nav[link.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {fill(t.footer.copyright, { year: new Date().getFullYear() })}
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacidad" className="hover:text-foreground transition-colors duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]">
              {t.footer.privacy}
            </Link>
            <Link href="/terminos" className="hover:text-foreground transition-colors duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
