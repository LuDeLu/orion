import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { BrandsCarousel } from "@/components/brands-carousel"
import { About } from "@/components/about"
import { StructuredData } from "@/components/structured-data"
import { GridOverlay } from "@/components/grid-overlay"
import dynamic from "next/dynamic"
import { Suspense } from "react"

// Background canvas effects (client-only animations, hydrate after main)
const ConstellationBackground = dynamic(() =>
  import("@/components/constellation-background").then((m) => m.ConstellationBackground)
)
const StarField = dynamic(() =>
  import("@/components/star-field").then((m) => m.StarField)
)

// Below-the-fold sections: split out to keep the initial JS bundle small
const Team = dynamic(() => import("@/components/team").then((m) => m.Team))
const Services = dynamic(() => import("@/components/services").then((m) => m.Services))
const CaseStudies = dynamic(() => import("@/components/case-studies").then((m) => m.CaseStudies))
const Workflow = dynamic(() => import("@/components/workflow").then((m) => m.Workflow))
const Testimonials = dynamic(() => import("@/components/testimonials").then((m) => m.Testimonials))
const ContactSection = dynamic(() =>
  import("@/components/contact").then((m) => m.ContactSection)
)
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer))
const WhatsAppButton = dynamic(() =>
  import("@/components/whatsapp-button").then((m) => m.WhatsAppButton)
)
const ScrollToTop = dynamic(() =>
  import("@/components/scroll-to-top").then((m) => m.ScrollToTop)
)

export default function Home() {
  return (
    <>
      <StructuredData />
      <main className="relative min-h-screen overflow-hidden">
        <ConstellationBackground />
        <StarField />
        <GridOverlay />
        <Header />
        <Hero />
        <BrandsCarousel />
        <div className="cv-auto"><About /></div>
        <div className="cv-auto"><Team /></div>
        <Suspense fallback={<div className="py-32" />}>
          <div className="cv-auto"><Services /></div>
        </Suspense>
        <div className="cv-auto"><CaseStudies /></div>
        <div className="cv-auto"><Workflow /></div>
        <div className="cv-auto"><Testimonials /></div>
        <div className="cv-auto"><ContactSection /></div>
        <WhatsAppButton />
        <ScrollToTop />
        <Footer />
      </main>
    </>
  )
}
