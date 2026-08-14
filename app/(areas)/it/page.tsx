import type { Metadata } from "next"
import { AreaLanding } from "@/components/area-landing"
import { AreaStructuredData } from "@/components/area-structured-data"
import { areasBySlug } from "@/lib/areas"

const area = areasBySlug.it

export const metadata: Metadata = {
  title: area.seo.title,
  description: area.seo.description,
  keywords: area.seo.keywords,
  alternates: { canonical: `https://orionmkt.com.ar${area.href}` },
  openGraph: {
    title: `${area.seo.title} | Orion Marketing`,
    description: area.seo.description,
    url: `https://orionmkt.com.ar${area.href}`,
    siteName: "Orion Marketing",
    locale: "es_AR",
    type: "website",
    images: [{ url: "https://orionmkt.com.ar/og-image-share.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${area.seo.title} | Orion Marketing`,
    description: area.seo.description,
  },
}

export default function ItPage() {
  return (
    <>
      <AreaStructuredData slug="it" />
      <AreaLanding slug="it" />
    </>
  )
}
