import type { MetadataRoute } from "next"
import { areas } from "@/lib/areas"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://orionmkt.com.ar"
  const currentDate = new Date()

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // Una entrada por área. Son páginas reales e indexables, a diferencia de
    // los anclajes (#servicios) que Google ignora.
    ...areas.map((area) => ({
      url: `${baseUrl}${area.href}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...["/privacidad", "/terminos"].map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ]
}
