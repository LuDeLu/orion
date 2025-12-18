"use client"

import Link from "next/link"
import { Sparkles, Instagram, Linkedin, Twitter, MapPin, Phone, Mail } from "lucide-react"

const footerLinks = {
  servicios: [
    { label: "Branding", href: "#", service: "Branding" },
    { label: "Social Media", href: "#", service: "Social Media" },
    { label: "Publicidad Digital", href: "#", service: "Publicidad Digital" },
    { label: "Desarrollo Web", href: "#", service: "Desarrollo Web" },
  ],
  empresa: [
    { label: "Nosotros", href: "#nosotros" },
    { label: "Casos de éxito", href: "#casos" },
    { label: "Blog", href: "#" },
    { label: "Contacto", href: "#contacto" },
  ],
}

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
]

export function Footer() {
  const handleServiceClick = (serviceName: string) => {
    const message = encodeURIComponent(`Hola! Me interesa consultar sobre ${serviceName}`)
    window.open(`https://wa.me/5491156566083?text=${message}`, "_blank")
  }

  return (
    <footer className="relative border-t border-border py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Orion <span className="text-primary">MKT</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              Agencia de marketing digital especializada en PyMEs y startups. Impulsamos tu negocio con estrategias
              innovadoras y resultados medibles.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm">Argentina - Operamos en todo el país y LATAM</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="https://wa.me/5491156566083" className="text-sm hover:text-foreground transition-colors">
                  +54 9 11 5656-6083
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:hola@orionmkt.com" className="text-sm hover:text-foreground transition-colors">
                  hola@orionmkt.com
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Servicios</h4>
            <ul className="space-y-3">
              {footerLinks.servicios.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleServiceClick(link.service)}
                    className="text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Orion MKT - Agencia de Marketing Digital. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
