import { Header } from "@/components/header"
import { HeroTriptych } from "@/components/hero-triptych"
import { BrandsCarousel } from "@/components/brands-carousel"
import { StructuredData } from "@/components/structured-data"
import { GridOverlay } from "@/components/grid-overlay"
import dynamic from "next/dynamic"

// Fondos animados (client-only, hidratan después del contenido principal)
const ConstellationBackground = dynamic(() =>
  import("@/components/constellation-background").then((m) => m.ConstellationBackground)
)
const StarField = dynamic(() => import("@/components/star-field").then((m) => m.StarField))

// Secciones below-the-fold: se separan para no engordar el bundle inicial
const AreasOverview = dynamic(() =>
  import("@/components/areas-overview").then((m) => m.AreasOverview)
)
const CaseStudies = dynamic(() => import("@/components/case-studies").then((m) => m.CaseStudies))
const Testimonials = dynamic(() => import("@/components/testimonials").then((m) => m.Testimonials))
const About = dynamic(() => import("@/components/about").then((m) => m.About))
const Team = dynamic(() => import("@/components/team").then((m) => m.Team))
const ContactSection = dynamic(() =>
  import("@/components/contact").then((m) => m.ContactSection)
)
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer))
const WhatsAppButton = dynamic(() =>
  import("@/components/whatsapp-button").then((m) => m.WhatsAppButton)
)
const QrContactButton = dynamic(() =>
  import("@/components/qr-contact-button").then((m) => m.QrContactButton)
)
const ScrollToTop = dynamic(() =>
  import("@/components/scroll-to-top").then((m) => m.ScrollToTop)
)

/**
 * La home funciona como hub: deriva a las tres landings de área y sostiene
 * la prueba social común (clientes, casos, testimonios, equipo).
 *
 * Orden narrativo:
 *   decisión → prueba → qué hacemos → resultados → quiénes somos → contacto
 */
export default function Home() {
  return (
    <>
      <StructuredData />
      <main className="relative min-h-screen overflow-hidden">
        <ConstellationBackground />
        <StarField />
        <GridOverlay />
        <Header />

        {/* 1 · Decisión: elegí tu área */}
        <HeroTriptych />

        {/* 2 · Prueba social inmediata */}
        <BrandsCarousel />

        {/* 3 · Qué hacemos: las tres áreas en detalle */}
        <div className="cv-auto">
          <AreasOverview />
        </div>

        {/* 4 · Resultados concretos */}
        <div className="cv-auto">
          <CaseStudies />
        </div>
        <div className="cv-auto">
          <Testimonials />
        </div>

        {/* 5 · Quiénes somos y quién lo hace */}
        <div className="cv-auto">
          <About />
        </div>
        <div className="cv-auto">
          <Team />
        </div>

        {/* 6 · Contacto */}
        <div className="cv-auto">
          <ContactSection />
        </div>

        <WhatsAppButton />
        <QrContactButton />
        <ScrollToTop />
        <Footer />
      </main>
    </>
  )
}
