import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "Orion MKT | Agencia de Marketing Digital",
  description:
    "Impulsamos PyMEs y Startups hacia el éxito con estrategias de marketing digital innovadoras. Tu negocio, nuestro universo.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#2c2447",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${_inter.className} ${_spaceGrotesk.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
