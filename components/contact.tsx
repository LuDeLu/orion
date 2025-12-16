"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, Clock, Send, Sparkles } from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    label: "Teléfono",
    value: "+54 11 6366-5344",
    href: "tel:+5491163665344",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@tuagencia.com",
    href: "mailto:info@tuagencia.com",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun - Vie: 9:00 - 19:00",
    href: "#",
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

    const whatsappUrl = `https://wa.me/5491163665344?text=${encodeURIComponent(mensaje)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <section id="contacto" className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0  from-[#2c2447]/30 via-background to-[#2c2447]/20 -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#e0642f]/10 to-[#f7d785]/10 border border-[#e0642f]/20 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-[#e0642f]" />
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
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:pl-8"
          >
            <div className="relative rounded-2xl p-8 lg:p-10 overflow-hidden">
              {/* Fondo degradado */}
              <div className="absolute inset-0  from-[#2c2447] via-[#2c2447]/95 to-[#e0642f]/20 -z-10" />
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 -z-10" />

              <h3 className="text-2xl lg:text-3xl font-bold text-[#F0F0EB] mb-8">Información de Contacto</h3>
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-start gap-4 group hover:translate-x-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-xl  from-[#e0642f]/20 to-[#f7d785]/10 border border-[#e0642f]/20 flex items-center justify-center flex-shrink-0 group-hover:border-[#e0642f]/40 transition-colors">
                      <item.icon className="w-5 h-5 text-[#e0642f]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#F0F0EB]/60 mb-1">{item.label}</p>
                      <p className="font-bold text-[#F0F0EB] text-lg">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* CTA adicional */}
              <div className="mt-10 pt-8 border-t border-[#F0F0EB]/10">
                <p className="text-[#F0F0EB]/70 mb-4 leading-relaxed">
                  ¿Preferís contactarnos directamente por WhatsApp?
                </p>
                <Button
                  className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-xl h-12 font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/20"
                  asChild
                >
                  <a
                    href="https://wa.me/5491163665344?text=Hola! Quiero consultar sobre sus servicios"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="mr-2 w-4 h-4" />
                    Escribinos por WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
