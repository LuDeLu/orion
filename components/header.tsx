"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#servicios", label: "Servicios" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Orion MKT
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/70 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="outline"
              className="border-primary/30 text-foreground hover:bg-primary/10 font-semibold rounded-full px-6 bg-transparent"
              asChild
            >
              <Link href="#nosotros">Ver Portafolio</Link>
            </Button>
            <Button
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold rounded-full px-6"
              asChild
            >
              <Link href="#contacto">Iniciar Proyecto</Link>
            </Button>
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col p-6 gap-4">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/70 hover:text-primary transition-all py-2 font-medium transform translate-x-0 hover:translate-x-2"
              onClick={handleLinkClick}
              style={{
                animation: isOpen ? `slideInFromLeft 0.3s ease-out ${index * 0.1}s forwards` : "none",
                opacity: isOpen ? 1 : 0,
              }}
            >
              {link.label}
            </Link>
          ))}
          <Button
            variant="outline"
            className="border-primary/30 text-foreground hover:bg-primary/10 w-full mt-2 rounded-full font-semibold bg-transparent"
            asChild
            onClick={handleLinkClick}
          >
            <Link href="#nosotros">Ver Portafolio</Link>
          </Button>
          <Button
            className="bg-gradient-to-r from-primary to-secondary text-white w-full rounded-full font-semibold"
            asChild
            onClick={handleLinkClick}
          >
            <Link href="#contacto">Iniciar Proyecto</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
