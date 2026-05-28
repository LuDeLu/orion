"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"

function hasQrCookie() {
  if (typeof document === "undefined") return false
  return document.cookie.split(";").some((c) => c.trim().startsWith("qr_visit="))
}

export function QrContactButton() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const fromQr = new URLSearchParams(window.location.search).get("qr") === "1"
    const dismissed = sessionStorage.getItem("qr_button_dismissed") === "1"
    setVisible((fromQr || hasQrCookie()) && !dismissed)
  }, [])

  if (!visible) return null

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setStatus("sending")
    setErrorMsg("")
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (res.ok && json.ok) {
        setStatus("ok")
        form.reset()
        setTimeout(() => {
          setOpen(false)
          setStatus("idle")
        }, 1800)
      } else {
        setStatus("error")
        setErrorMsg(json?.error || "No se pudo enviar")
      }
    } catch {
      setStatus("error")
      setErrorMsg("Error de red")
    }
  }

  function dismiss() {
    sessionStorage.setItem("qr_button_dismissed", "1")
    setVisible(false)
  }

  return (
    <>
      <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2">
        <motion.button
          onClick={dismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white text-xs w-6 h-6 flex items-center justify-center border border-white/10"
          aria-label="Ocultar"
        >
          ×
        </motion.button>
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-full bg-gradient-to-r from-[#2c2447] to-[#4a3d7a] text-white px-4 py-3 shadow-2xl shadow-[#2c2447]/40 border border-white/10 flex items-center gap-2 text-sm font-medium"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.89 4 3 4.9 3 6v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
          </svg>
          Guardar contacto
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl bg-[#15102a] border border-white/10 shadow-2xl p-6"
            >
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-white text-xl font-semibold">Dejanos tus datos</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/50 hover:text-white text-2xl leading-none"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
              <p className="text-white/60 text-sm mb-5">Te contactamos en menos de 24hs.</p>

              <form onSubmit={onSubmit} className="space-y-3">
                <input
                  name="name"
                  placeholder="Nombre y apellido"
                  required
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-3 py-2 text-sm outline-none focus:border-white/30"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-3 py-2 text-sm outline-none focus:border-white/30"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Teléfono / WhatsApp"
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-3 py-2 text-sm outline-none focus:border-white/30"
                />
                <input
                  name="company"
                  placeholder="Empresa (opcional)"
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-3 py-2 text-sm outline-none focus:border-white/30"
                />
                <textarea
                  name="message"
                  placeholder="¿En qué te podemos ayudar? (opcional)"
                  rows={3}
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-3 py-2 text-sm outline-none focus:border-white/30 resize-none"
                />

                {status === "error" && (
                  <p className="text-red-400 text-xs">{errorMsg}</p>
                )}
                {status === "ok" && (
                  <p className="text-green-400 text-xs">¡Gracias! Te contactamos pronto.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending" || status === "ok"}
                  className="w-full rounded-md bg-gradient-to-r from-[#4a3d7a] to-[#7a5fb3] text-white font-medium py-2.5 text-sm disabled:opacity-60 transition-opacity"
                >
                  {status === "sending" ? "Enviando..." : status === "ok" ? "Enviado ✓" : "Enviar"}
                </button>
                <p className="text-white/40 text-[10px] text-center">
                  Al enviar aceptás que te contactemos por los medios provistos.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
