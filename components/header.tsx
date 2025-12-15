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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-primary rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity animate-pulse" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-secondary to-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-foreground">
                  <path d="M12 2L15 9L22 10L17 15L19 22L12 18L5 22L7 15L2 10L9 9L12 2Z" fill="currentColor" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-display font-bold text-foreground">
              Orion <span className="text-primary">MKT</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/70 hover:text-foreground transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-6">
              Empezar Proyecto
            </Button>
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40">
          <nav className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/70 hover:text-foreground transition-colors py-2 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full mt-2 rounded-full font-semibold">
              Empezar Proyecto
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
