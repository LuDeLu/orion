"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

declare function gtag(...args: unknown[]): void

export default function GraciasPage() {
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()

  useEffect(() => {
    // Disparar conversión de Google Ads
    if (typeof gtag !== "undefined") {
      gtag("event", "conversion", {
        send_to: "AW-18044639379/dF9RCLzRi5wcEJOxrZxD",
      })
    }
  }, [])

  useEffect(() => {
    if (countdown === 0) {
      router.push("/#contacto")
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown, router])

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle className="w-20 h-20 text-[#e0642f]" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
          ¡Gracias por{" "}
          <span className="bg-gradient-to-r from-[#e0642f] via-[#f7d785] to-[#e0642f] bg-clip-text text-transparent">
            escribirnos!
          </span>
        </h1>

        <p className="text-[#F0F0EB]/70 text-lg mb-10 leading-relaxed">
          Recibimos tu mensaje. Nuestro equipo te va a contactar en menos de 24 horas con una propuesta personalizada.
        </p>

        <div className="inline-flex flex-col items-center gap-2">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#2c2447"
                strokeWidth="4"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#e0642f"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 28 }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#F0F0EB]">
              {countdown}
            </span>
          </div>
          <p className="text-[#F0F0EB]/50 text-sm">
            Volvés al formulario en {countdown} segundo{countdown !== 1 ? "s" : ""}
          </p>
        </div>
      </motion.div>
    </main>
  )
}
