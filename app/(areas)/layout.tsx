import type React from "react"
import dynamic from "next/dynamic"
import { Header } from "@/components/header"
import { GridOverlay } from "@/components/grid-overlay"

const ConstellationBackground = dynamic(() =>
  import("@/components/constellation-background").then((m) => m.ConstellationBackground)
)
const StarField = dynamic(() => import("@/components/star-field").then((m) => m.StarField))
const Footer = dynamic(() => import("@/components/footer").then((m) => m.Footer))
const WhatsAppButton = dynamic(() =>
  import("@/components/whatsapp-button").then((m) => m.WhatsAppButton)
)
const ScrollToTop = dynamic(() =>
  import("@/components/scroll-to-top").then((m) => m.ScrollToTop)
)

export default function AreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <ConstellationBackground />
      <StarField />
      <GridOverlay />
      <Header />
      {children}
      <WhatsAppButton />
      <ScrollToTop />
      <Footer />
    </main>
  )
}
