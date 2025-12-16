import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { About } from "@/components/about"
import { Stats } from "@/components/stats"
import { BrandsCarousel } from "@/components/brands-carousel"
import { ContactSection } from "@/components/contact"
import { Footer } from "@/components/footer"
import { ConstellationBackground } from "@/components/constellation-background"
import { GridOverlay } from "@/components/grid-overlay"
import { FloatingParticles } from "@/components/floating-particles"
import { StarField } from "@/components/star-field"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <FloatingParticles />
      <ConstellationBackground />
      <StarField />
      <GridOverlay />
      <div className="grain-overlay" />
      <Header />
      <Hero />
      <Services />
      <About />
      <Stats />
      <BrandsCarousel />
      <ContactSection />
      <Footer />
    </main>
  )
}
