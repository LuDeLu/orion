"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { useLenis } from "lenis/react"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }
    window.addEventListener("scroll", toggleVisibility, { passive: true })
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.1,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (!isVisible) return null

  return (
    // Apilado sobre el botón de WhatsApp: los flotantes viven en una sola
    // columna y dejan libre el resto del borde inferior.
    <button
      onClick={scrollToTop}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      className="fixed bottom-[5.5rem] right-6 z-50 w-12 h-12 bg-primary/90 hover:bg-primary text-white rounded-full shadow-lg flex items-center justify-center transition-colors duration-300"
      aria-label="Volver arriba"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  )
}
