import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { About } from "@/components/about"
import { Workflow } from "@/components/workflow"
import { BrandsCarousel } from "@/components/brands-carousel"
import { ContactSection } from "@/components/contact"
import { Footer } from "@/components/footer"
import { ConstellationBackground } from "@/components/constellation-background"
import { GridOverlay } from "@/components/grid-overlay"
import { FloatingParticles } from "@/components/floating-particles"
import { StarField } from "@/components/star-field"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { ScrollToTop } from "@/components/scroll-to-top"
import { CaseStudies } from "@/components/case-studies"
import { StructuredData } from "@/components/structured-data"
import { Suspense } from "react"

export default function Home() {
  return (
    <>
      <StructuredData />
      <main className="relative min-h-screen overflow-hidden">
        <FloatingParticles />
        <ConstellationBackground />
        <StarField />
        <GridOverlay />
        <div className="grain-overlay" />
        <Header />
        <Hero />
        <Suspense fallback={<div className="py-32" />}>
          <Services />
        </Suspense>
        <About />
        <CaseStudies />
        <Workflow />
        <BrandsCarousel />
        <ContactSection />
        <WhatsAppButton></WhatsAppButton>
        <ScrollToTop></ScrollToTop>
        <Footer />
      </main>
    </>
  )
}
