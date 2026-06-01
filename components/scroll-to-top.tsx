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
        duration: 1.6,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
      })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 left-6 z-50  w-12 h-12 bg-primary hover:bg-primary text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50"
      aria-label="Volver arriba"
    >
      <ChevronUp className="h-6 w-6" />
    </button>
  )
}
