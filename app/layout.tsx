import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" })

export const metadata: Metadata = {
  title: "Orion MKT | Agencia de Marketing Digital en Argentina | PyMEs & Startups",
  description:
    "Agencia de marketing digital en Argentina especializada en PyMEs y Startups. Branding, redes sociales, publicidad digital, diseño web y estrategias con ROI medible. Transformamos negocios digitalmente.",
  generator: "v0.app",
  keywords: [
    "agencia marketing digital argentina",
    "marketing para pymes",
    "publicidad digital",
    "social media argentina",
    "branding startups",
    "diseño web argentina",
    "estrategia digital",
    "performance marketing",
    "ROI marketing digital",
    "agencia publicidad digital",
  ],
  authors: [{ name: "Orion MKT" }],
  creator: "Orion MKT",
  publisher: "Orion MKT",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Orion MKT | Agencia de Marketing Digital para PyMEs & Startups",
    description:
      "Impulsamos PyMEs y Startups hacia el éxito con estrategias de marketing digital innovadoras. Tu negocio, nuestro universo.",
    url: "https://orionmkt.com",
    siteName: "Orion MKT",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orion MKT | Agencia de Marketing Digital",
    description: "Impulsamos PyMEs y Startups hacia el éxito con estrategias de marketing digital innovadoras.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: "#2c2447",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NSW2R433');`}
        </Script>
      </head>
      <body className={`${_inter.className} ${_spaceGrotesk.variable} font-sans antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NSW2R433"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
