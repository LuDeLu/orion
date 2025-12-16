"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }
    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
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
