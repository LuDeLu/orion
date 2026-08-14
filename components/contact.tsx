"use client"

import type React from "react"

import { useState, useRef, useEffect, useId } from "react"
import { useRouter } from "next/navigation"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Clock, Send, AlertTriangle, RotateCcw } from "lucide-react"
import { useT } from "@/components/i18n-provider"
import { useAreas } from "@/hooks/use-areas"
import { OwnerIdentity } from "@/components/owner-signal"

const contactIcons = [Phone, Mail, Clock]

const PROJECT_VALUES = ["marketing", "software", "it", "varias", "no-se"] as const

const FIELD_CLASS =
  "h-12 rounded-xl border-[var(--hairline-strong)] bg-[var(--tint-1)] backdrop-blur-sm text-foreground placeholder:text-foreground/65 focus:border-primary focus:ring-primary/20"

export function ContactSection() {
  const t = useT().contact
  const owner = useT().owner
  const areas = useAreas()
  const fieldId = useId()
  const contactInfo = [
    { icon: contactIcons[0], label: t.labels.phone, value: "+54 11 5656-6083", href: "tel:+5491156566083" },
    { icon: contactIcons[1], label: t.labels.email, value: "hola@orionmkt.com.ar", href: "mailto:hola@orionmkt.com.ar" },
    { icon: contactIcons[2], label: t.labels.hours, value: t.hoursValue, href: undefined as string | undefined },
  ]
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    tipoProyecto: "",
    mensaje: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [failed, setFailed] = useState(false)
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  // Si llegan desde una landing de área (/?area=software#contacto) el select
  // arranca resuelto: ya nos dijeron qué necesitan, no se lo preguntamos otra vez.
  // Se lee de window y no con useSearchParams para no arrastrar un límite de
  // Suspense a toda la home.
  useEffect(() => {
    const area = new URLSearchParams(window.location.search).get("area")
    if (area && (PROJECT_VALUES as readonly string[]).includes(area)) {
      setFormData((prev) => (prev.tipoProyecto ? prev : { ...prev, tipoProyecto: area }))
    }
  }, [])

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  /** Resumen de la consulta para las vías de escape (WhatsApp / mail). */
  const fallbackText = [
    formData.nombre && `Nombre: ${formData.nombre}`,
    formData.telefono && `Teléfono: ${formData.telefono}`,
    formData.email && `Email: ${formData.email}`,
    formData.tipoProyecto && `Área: ${formData.tipoProyecto}`,
    formData.mensaje && `Consulta: ${formData.mensaje}`,
  ]
    .filter(Boolean)
    .join("\n")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFailed(false)

    const data = new FormData(e.currentTarget)
    data.append("access_key", "8f25bc46-71cb-429f-9142-d74a22a02308")
    data.append("subject", `Nueva consulta de ${formData.nombre || "la web"} — Orion`)

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      })
      const result = await response.json().catch(() => null)
      if (response.ok && result?.success) {
        router.push("/gracias")
        return
      }
      // Respuesta del servidor sin éxito: mismo tratamiento que un fallo de red.
      setFailed(true)
    } catch {
      // Sin conexión, CORS o un bloqueador cortando api.web3forms.com.
      setFailed(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Al fallar llevamos el foco al cartel: en móvil el error queda arriba del botón
  // y sin esto puede pasar desapercibido.
  useEffect(() => {
    if (failed) errorRef.current?.focus()
  }, [failed])

  return (
    <section ref={ref} id="contacto" className="relative py-20 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.06] via-background to-primary/[0.04] -z-10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 rounded-md bg-primary/10 text-primary font-semibold text-sm uppercase tracking-wider mb-6">
              {t.kicker}
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground mt-4 mb-6 text-balance leading-[1.08] tracking-tight">
              {t.titleStart}{" "}
              <span className="text-primary">{t.titleHighlight}</span>
            </h2>
            <p className="text-foreground/70 text-lg mb-8 leading-relaxed">
              {t.lead}
            </p>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
              {/* Trampa antispam: invisible para personas, tentadora para bots. */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor={`${fieldId}-nombre`} className="block text-sm font-medium text-foreground/80">
                    {t.name} <span className="text-primary">*</span>
                  </label>
                  <Input
                    id={`${fieldId}-nombre`}
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder={t.name}
                    required
                    autoComplete="name"
                    className={FIELD_CLASS}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor={`${fieldId}-telefono`} className="block text-sm font-medium text-foreground/80">
                    {t.phone} <span className="text-primary">*</span>
                  </label>
                  <Input
                    id={`${fieldId}-telefono`}
                    name="telefono"
                    type="tel"
                    inputMode="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder={t.phone}
                    required
                    autoComplete="tel"
                    className={FIELD_CLASS}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label htmlFor={`${fieldId}-email`} className="block text-sm font-medium text-foreground/80">
                  {t.email}{" "}
                  <span className="text-foreground/65 font-normal">({t.optional})</span>
                </label>
                <Input
                  id={`${fieldId}-email`}
                  name="email"
                  type="email"
                  inputMode="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.email}
                  autoComplete="email"
                  className={FIELD_CLASS}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor={`${fieldId}-tipo`} className="block text-sm font-medium text-foreground/80">
                  {t.projectType}{" "}
                  <span className="text-foreground/65 font-normal">({t.optional})</span>
                </label>
                <select
                  id={`${fieldId}-tipo`}
                  name="tipoProyecto"
                  value={formData.tipoProyecto}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-[var(--hairline-strong)] bg-[var(--tint-1)] backdrop-blur-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="" className="bg-popover text-popover-foreground">
                    {t.projectType}
                  </option>
                  {/* El value queda en español: es lo que llega al mail y al panel */}
                  {PROJECT_VALUES.map((value, i) => (
                    <option key={value} value={value} className="bg-popover text-popover-foreground">
                      {t.projectOptions[i]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor={`${fieldId}-mensaje`} className="block text-sm font-medium text-foreground/80">
                  {t.message.replace(/\.\.\.$/, "")}{" "}
                  <span className="text-foreground/65 font-normal">({t.optional})</span>
                </label>
                <Textarea
                  id={`${fieldId}-mensaje`}
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder={t.message}
                  className="min-h-[120px] rounded-xl border-[var(--hairline-strong)] bg-[var(--tint-1)] backdrop-blur-sm text-foreground placeholder:text-foreground/65 focus:border-primary focus:ring-primary/20 resize-none"
                />
              </div>

              {/* Falla de envío: nunca dejamos al usuario sin respuesta ni sin salida. */}
              {failed && (
                <div
                  ref={errorRef}
                  tabIndex={-1}
                  role="alert"
                  className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 outline-none"
                >
                  <p className="flex items-center gap-2 font-semibold text-foreground">
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                    {t.errorTitle}
                  </p>
                  <p className="mt-1.5 text-sm text-foreground/75 leading-relaxed">{t.errorBody}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--hairline-strong)] bg-[var(--tint-2)] px-3 py-2 text-sm font-medium text-foreground hover:bg-foreground/10 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      {t.errorRetry}
                    </button>
                    <a
                      href={`https://wa.me/5491156566083?text=${encodeURIComponent(fallbackText || "Hola! Quiero hacer una consulta.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-lg border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                    >
                      {t.errorWhatsapp}
                    </a>
                    <a
                      href={`mailto:hola@orionmkt.com.ar?subject=${encodeURIComponent("Consulta desde la web")}&body=${encodeURIComponent(fallbackText)}`}
                      className="inline-flex items-center rounded-lg border border-[var(--hairline-strong)] px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-[var(--tint-2)] transition-colors"
                    >
                      {t.errorMail}
                    </a>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold rounded-xl h-12 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-60"
              >
                {isSubmitting ? t.submitting : t.submit}
                {!isSubmitting && <Send className="ml-2 w-4 h-4" />}
              </Button>
              <p className="text-xs text-foreground/65 text-center">{t.requiredHint}</p>
            </form>
          </motion.div>

          {/* Right - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:pl-8"
          >
            <div className="relative rounded-xl overflow-hidden glass-card p-8 lg:p-10 hover-lift">
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-8">{t.infoTitle}</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-4 group hover:translate-x-1.5 transition-transform duration-[400ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:from-primary/35 group-hover:to-accent/25 group-hover:border-primary/50 group-hover:scale-110 transition-[background-color,border-color,transform] duration-[400ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground/65 mb-1">{item.label}</p>
                      <p className="font-bold text-foreground text-lg">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Con quién vas a hablar.
                 El formulario no cae en un buzón genérico: cada área la
                 atiende su dueño, y acá se ven los tres con nombre y cargo. */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-10 pt-8 border-t border-[var(--hairline)]"
              >
                <h4 className="font-display font-extrabold text-foreground mb-1.5">
                  {owner.meetTitle}
                </h4>
                <p className="text-sm text-foreground/65 leading-relaxed mb-5">
                  {owner.noAccountManager}
                </p>
                <ul className="space-y-3">
                  {areas.map((area) => (
                    <li key={area.slug}>
                      <OwnerIdentity area={area} />
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* CTA adicional */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-10 pt-8 border-t border-[var(--hairline)]"
              >
                <p className="text-foreground/70 mb-4 leading-relaxed">
                  {t.whatsappLead}
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold rounded-xl h-12 btn-shine"
                  asChild
                >
                  <a
                    href="https://wa.me/5491156566083?text=Hola! Quiero consultar sobre sus servicios"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-current"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z" />
                    </svg>
                    {t.whatsappCta}
                  </a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
