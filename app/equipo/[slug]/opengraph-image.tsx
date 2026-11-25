import { ImageResponse } from "next/og"
import { getSocio, socios } from "@/lib/socios"
import type { AreaSlug } from "@/lib/areas"

/**
 * Imagen para compartir de cada perfil (/equipo/<slug>/opengraph-image).
 * Lleva nombre completo y cargos, igual que el título de la página: es lo que
 * se ve al compartir el link en WhatsApp, LinkedIn o X.
 */

export const alt = "Perfil en Orion Marketing"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return socios.map((s) => ({ slug: s.slug }))
}

// Colores del tema oscuro (app/globals.css): las variables CSS no llegan a la imagen.
const ACCENT: Record<AreaSlug, string> = {
  marketing: "#e0642f",
  software: "#9c72e0",
  it: "#2fb8a0",
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = getSocio(slug)!
  const accent = ACCENT[s.areaSlug]

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `radial-gradient(circle at 85% 15%, ${accent}40, transparent 55%), #07051a`,
          color: "#f4f1ea",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, opacity: 0.85 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: accent }} />
          Orion Marketing · Equipo
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          <div
            style={{
              width: 168,
              height: 168,
              borderRadius: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 68,
              fontWeight: 800,
              color: accent,
              background: `${accent}2e`,
              border: `2px solid ${accent}66`,
            }}
          >
            {s.initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
            <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1 }}>
              {s.fullName}
            </div>
            <div style={{ marginTop: 18, fontSize: 36, fontWeight: 600, color: accent }}>{s.role}</div>
            <div style={{ marginTop: 6, fontSize: 32, opacity: 0.75 }}>{s.title}</div>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 26, opacity: 0.6 }}>
          orionmkt.com.ar/equipo/{s.slug}
        </div>
      </div>
    ),
    size,
  )
}
