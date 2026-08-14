"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useT } from "@/components/i18n-provider"

function hasQrCookie() {
  if (typeof document === "undefined") return false
  return document.cookie.split(";").some((c) => c.trim().startsWith("qr_visit="))
}

export function QrContactButton() {
  const t = useT().qrContact
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const fromQr = new URLSearchParams(window.location.search).get("qr") === "1"
    const dismissed = sessionStorage.getItem("qr_button_dismissed") === "1"
    setVisible((fromQr || hasQrCookie()) && !dismissed)
  }, [])

  // Escape cierra el modal, como en cualquier diálogo del sistema.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

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
        setErrorMsg(json?.error || t.genericError)
      }
    } catch {
      setStatus("error")
      setErrorMsg(t.networkError)
    }
  }

  function dismiss() {
    sessionStorage.setItem("qr_button_dismissed", "1")
    setVisible(false)
  }

  return (
    <>
      {/* Anclado a la izquierda: el borde derecho queda para WhatsApp y el
          botón de volver arriba, que van apilados en esa esquina. */}
      <div
        className="fixed bottom-6 left-4 sm:left-6 z-50 flex items-center gap-2 max-w-[calc(100vw-7rem)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <motion.button
          onClick={dismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="rounded-full bg-black/45 backdrop-blur-sm text-white/80 hover:text-white text-base w-11 h-11 shrink-0 flex items-center justify-center border border-white/15"
          aria-label={t.dismissLabel}
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
          className="rounded-md bg-gradient-to-r from-[#2c2447] to-[#4a3d7a] text-white px-4 py-3 shadow-2xl shadow-[#2c2447]/40 border border-white/10 flex items-center gap-2 text-sm font-medium"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5C3.89 4 3 4.9 3 6v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
          </svg>
          {t.saveContact}
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
              role="dialog"
              aria-modal="true"
              aria-labelledby="qr-modal-title"
              className="w-full max-w-md rounded-xl bg-[#15102a] border border-white/10 shadow-2xl p-6"
            >
              <div className="flex items-start justify-between mb-1 gap-3">
                <h2 id="qr-modal-title" className="text-white text-xl font-semibold">
                  {t.modalTitle}
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="-mr-2 -mt-2 w-11 h-11 shrink-0 rounded-full text-white/60 hover:text-white hover:bg-white/10 text-2xl leading-none flex items-center justify-center transition-colors"
                  aria-label={t.closeLabel}
                >
                  ×
                </button>
              </div>
              <p className="text-white/60 text-sm mb-5">{t.modalSubtitle}</p>

              <form onSubmit={onSubmit} className="space-y-3">
                <input
                  name="name"
                  placeholder={t.namePlaceholder}
                  required
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-3 py-2 text-sm outline-none focus:border-white/30"
                />
                <input
                  name="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-3 py-2 text-sm outline-none focus:border-white/30"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder={t.phonePlaceholder}
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-3 py-2 text-sm outline-none focus:border-white/30"
                />
                <input
                  name="company"
                  placeholder={t.companyPlaceholder}
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-3 py-2 text-sm outline-none focus:border-white/30"
                />
                <textarea
                  name="message"
                  placeholder={t.messagePlaceholder}
                  rows={3}
                  className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-white/40 px-3 py-2 text-sm outline-none focus:border-white/30 resize-none"
                />

                {status === "error" && (
                  <p className="text-red-400 text-xs">{errorMsg}</p>
                )}
                {status === "ok" && (
                  <p className="text-green-400 text-xs">{t.successMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending" || status === "ok"}
                  className="w-full rounded-md bg-gradient-to-r from-[#4a3d7a] to-[#7a5fb3] text-white font-medium py-2.5 text-sm disabled:opacity-60 transition-opacity"
                >
                  {status === "sending" ? t.sendingLabel : status === "ok" ? t.sentLabel : t.sendLabel}
                </button>
                <p className="text-white/55 text-xs text-center">
                  {t.consentText}
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
