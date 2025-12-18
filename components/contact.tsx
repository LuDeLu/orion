"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Clock, Send, Sparkles } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    label: "Teléfono",
    value: "+54 11 5656-6083",
    href: "tel:+5491156566083",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@orionmkt.com.ar",
    href: "mailto:info@orionmkt.com.ar",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun - Vie: 10:00 - 18:00",
  },
]

export function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    tipoProyecto: "",
    mensaje: "",
  })

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const tipoProyectoTexto: Record<string, string> = {
      branding: "Branding",
      estrategia: "Estrategia Digital",
      ads: "Performance Ads",
      social: "Social Media",
      diseno: "Diseño Creativo",
      web: "Desarrollo Web",
    }

    const mensaje = `¡Hola! Me contacto desde la web.

*Datos de contacto:*
• Nombre: ${formData.nombre}
• Teléfono: ${formData.telefono}
• Email: ${formData.email}

*Tipo de proyecto:* ${tipoProyectoTexto[formData.tipoProyecto] || "No especificado"}

*Mensaje:*
${formData.mensaje || "Sin mensaje adicional"}`

    const whatsappUrl = `https://wa.me/5491156566083?text=${encodeURIComponent(mensaje)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <section ref={ref} id="contacto" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 from-[#2c2447]/30 via-background to-[#2c2447]/20 -z-10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e0642f]/10 to-[#f7d785]/10 border border-[#e0642f]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-sm font-bold text-[#e0642f]">Contacto</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F0F0EB] mb-4 text-balance">
              Transformá tu{" "}
              <span className="bg-gradient-to-r from-[#e0642f] to-[#f7d785] bg-clip-text text-transparent">
                marca digital
              </span>
            </h2>
            <p className="text-[#F0F0EB]/70 text-lg mb-8 leading-relaxed">
              Completá el formulario y te contactamos en menos de 24 horas con una propuesta personalizada para impulsar
              tu negocio.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre completo"
                    required
                    className="h-12 rounded-xl border-[#2c2447]/30 bg-[#2c2447]/20 backdrop-blur-sm text-[#F0F0EB] placeholder:text-[#F0F0EB]/40 focus:border-[#e0642f] focus:ring-[#e0642f]/20"
                  />
                </div>
                <div>
                  <Input
                    name="telefono"
                    type="tel"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Teléfono / WhatsApp"
                    required
                    className="h-12 rounded-xl border-[#2c2447]/30 bg-[#2c2447]/20 backdrop-blur-sm text-[#F0F0EB] placeholder:text-[#F0F0EB]/40 focus:border-[#e0642f] focus:ring-[#e0642f]/20"
                  />
                </div>
              </div>
              <div>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="h-12 rounded-xl border-[#2c2447]/30 bg-[#2c2447]/20 backdrop-blur-sm text-[#F0F0EB] placeholder:text-[#F0F0EB]/40 focus:border-[#e0642f] focus:ring-[#e0642f]/20"
                />
              </div>
              <div>
                <select
                  name="tipoProyecto"
                  value={formData.tipoProyecto}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-[#2c2447]/30 bg-[#2c2447]/20 backdrop-blur-sm text-[#F0F0EB] placeholder:text-[#F0F0EB]/40 focus:border-[#e0642f] focus:outline-none focus:ring-2 focus:ring-[#e0642f]/20"
                >
                  <option value="" className="bg-[#2c2447] text-[#F0F0EB]">
                    ¿Qué tipo de proyecto necesitás?
                  </option>
                  <option value="branding" className="bg-[#2c2447] text-[#F0F0EB]">
                    Branding
                  </option>
                  <option value="estrategia" className="bg-[#2c2447] text-[#F0F0EB]">
                    Estrategia Digital
                  </option>
                  <option value="ads" className="bg-[#2c2447] text-[#F0F0EB]">
                    Performance Ads
                  </option>
                  <option value="social" className="bg-[#2c2447] text-[#F0F0EB]">
                    Social Media
                  </option>
                  <option value="diseno" className="bg-[#2c2447] text-[#F0F0EB]">
                    Diseño Creativo
                  </option>
                  <option value="web" className="bg-[#2c2447] text-[#F0F0EB]">
                    Desarrollo Web
                  </option>
                </select>
              </div>
              <div>
                <Textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Contanos sobre tu proyecto..."
                  className="min-h-[120px] rounded-xl border-[#2c2447]/30 bg-[#2c2447]/20 backdrop-blur-sm text-[#F0F0EB] placeholder:text-[#F0F0EB]/40 focus:border-[#e0642f] focus:ring-[#e0642f]/20 resize-none"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-[#e0642f] to-[#f7d785] hover:opacity-90 text-[#2c2447] font-bold rounded-xl h-12 transition-all duration-300 hover:shadow-lg hover:shadow-[#e0642f]/20"
              >
                Enviar Consulta por WhatsApp
                <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </motion.div>

          {/* Right - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:pl-8"
          >
            <div className="relative rounded-2xl overflow-hidden glass-card p-8 lg:p-10 hover-lift">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#F0F0EB] mb-8">Información de Contacto</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-4 group hover:translate-x-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e0642f]/20 to-[#f7d785]/10 border border-[#e0642f]/20 flex items-center justify-center flex-shrink-0 group-hover:from-[#e0642f]/30 group-hover:to-[#f7d785]/20 group-hover:border-[#e0642f]/40 transition-all duration-300">
                      <item.icon className="w-5 h-5 text-[#e0642f]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#F0F0EB]/60 mb-1">{item.label}</p>
                      <p className="font-bold text-[#F0F0EB] text-lg">{item.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* CTA adicional */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-10 pt-8 border-t border-[#F0F0EB]/10"
              >
                <p className="text-[#F0F0EB]/70 mb-4 leading-relaxed">
                  ¿Preferís contactarnos directamente por WhatsApp?
                </p>
                <Button
                  className="w-full bg-gradient-to-r from-[#e0642f] to-[#f7d785] hover:opacity-90 text-[#2c2447] font-bold rounded-xl h-12 transition-all duration-300 hover:shadow-lg hover:shadow-[#e0642f]/20"
                  asChild
                >
                  <a
                    href="https://wa.me/5491156566083?text=Hola! Quiero consultar sobre sus servicios"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-black"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z" />
                  </svg>
                    Escribinos por WhatsApp
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
