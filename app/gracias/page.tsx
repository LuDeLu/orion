"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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

  // Al terminar la cuenta volvemos al inicio, no al formulario: quien acaba de
  // escribir no tiene nada que hacer de nuevo ahí.
  useEffect(() => {
    if (countdown === 0) {
      router.push("/")
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
          <CheckCircle className="w-20 h-20 text-primary" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-4">
          ¡Gracias por{" "}
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            escribirnos!
          </span>
        </h1>

        <p className="text-foreground/70 text-lg mb-10 leading-relaxed">
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
                stroke="var(--hairline-strong)"
                strokeWidth="4"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 28 }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-foreground">
              {countdown}
            </span>
          </div>
          <p className="text-foreground/65 text-sm">
            Volvés al inicio en {countdown} segundo{countdown !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Salidas explícitas: nadie tiene que esperar a que corra el reloj. */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full sm:w-auto h-11 px-5 rounded-xl border border-foreground/20 text-foreground text-sm font-semibold hover:bg-foreground/[0.06] transition-colors"
          >
            Ir al inicio ahora
          </Link>
          <a
            href="https://wa.me/5491156566083?text=Hola!%20Acabo%20de%20escribirles%20por%20la%20web"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full sm:w-auto h-11 px-5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
          >
            Escribirnos por WhatsApp
          </a>
        </div>
      </motion.div>
    </main>
  )
}
