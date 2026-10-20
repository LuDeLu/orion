import type { MetadataRoute } from "next"
import { areas } from "@/lib/areas"
import { notas } from "@/lib/prensa"

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
    // Índice de prensa + una entrada por nota.
    {
      url: `${baseUrl}/prensa`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...notas.map((nota) => ({
      url: `${baseUrl}/prensa/${nota.slug}`,
      lastModified: new Date(nota.dateModified),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...["/privacidad", "/terminos"].map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ]
}
