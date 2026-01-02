import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import "./globals.css"

const _inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})
const _spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: "Orion MKT | Agencia de Marketing Digital en Argentina | PyMEs & Startups 2025",
    template: "%s | Orion MKT - Agencia de Marketing Digital Líder en Argentina",
  },
  description:
    "🚀 Agencia de marketing digital #1 en Argentina especializada en PyMEs y Startups. Branding profesional, redes sociales, publicidad digital, diseño web responsivo, SEO y estrategias de crecimiento con ROI medible. Transformamos negocios digitalmente con resultados garantizados. Consultoría gratuita.",
  metadataBase: new URL("https://orionmkt.com"),
  alternates: {
    canonical: "/",
    languages: {
      "es-AR": "/",
      "es-UY": "/",
      "es-CL": "/",
      "es-MX": "/",
      es: "/",
    },
  },
  generator: "Next.js",
  applicationName: "Orion MKT",
  referrer: "origin-when-cross-origin",
  keywords: [
    // Core keywords - Argentina
    "agencia marketing digital argentina",
    "agencia marketing digital buenos aires",
    "agencia marketing digital caba",
    "marketing digital argentina",
    "publicidad digital argentina",

    // Business types
    "marketing para pymes argentina",
    "marketing para startups argentina",
    "agencia marketing pymes",
    "consultora marketing digital",

    // Services - Social Media
    "community manager argentina",
    "gestión redes sociales argentina",
    "social media marketing argentina",
    "contenido redes sociales",
    "estrategia instagram argentina",
    "marketing facebook argentina",
    "publicidad instagram",
    "ads redes sociales",

    // Services - Advertising
    "google ads argentina",
    "facebook ads argentina",
    "instagram ads",
    "tiktok ads argentina",
    "pauta digital argentina",
    "publicidad online",
    "campañas publicitarias digitales",

    // Services - Branding
    "branding startups argentina",
    "diseño identidad marca",
    "rebranding empresas",
    "estrategia marca",
    "logo diseño profesional",

    // Services - Web
    "diseño web argentina",
    "diseño web responsivo",
    "desarrollo web argentina",
    "landing page diseño",
    "sitio web empresas",
    "tienda online argentina",
    "ecommerce argentina",

    // SEO & Digital Strategy
    "SEO argentina",
    "posicionamiento web argentina",
    "posicionamiento google",
    "optimización SEO",
    "estrategia digital pymes",
    "consultoria seo",

    // Performance & Analytics
    "performance marketing argentina",
    "ROI marketing digital",
    "analítica web",
    "conversion rate optimization",
    "growth marketing argentina",
    "growth hacking",

    // Marketing Types
    "inbound marketing argentina",
    "marketing de contenidos",
    "content marketing",
    "email marketing argentina",
    "automatización marketing",
    "marketing automation",
    "influencer marketing argentina",

    // Local - Buenos Aires
    "agencia marketing palermo",
    "agencia marketing belgrano",
    "agencia marketing recoleta",
    "marketing digital capital federal",

    // Local - Other Argentina
    "agencia marketing digital cordoba",
    "agencia marketing digital rosario",
    "agencia marketing digital mendoza",
    "agencia marketing digital la plata",

    // Industry specific
    "marketing digital ecommerce",
    "marketing digital restaurantes",
    "marketing digital inmobiliarias",
    "marketing digital tecnología",
    "marketing digital servicios",

    // Long-tail conversions
    "mejor agencia marketing digital argentina",
    "agencia marketing digital económica",
    "agencia marketing digital precios",
    "contratar agencia marketing digital",
    "como elegir agencia marketing",
    "cuanto cuesta marketing digital",
    "presupuesto marketing digital pymes",
  ],
  authors: [{ name: "Orion MKT - Agencia Digital", url: "https://orionmkt.com" }],
  creator: "Orion MKT",
  publisher: "Orion MKT",
  category: "Marketing Digital",
  classification: "Business Services",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Orion MKT | Agencia de Marketing Digital #1 para PyMEs & Startups en Argentina 2025",
    description:
      "🚀 Impulsamos PyMEs y Startups hacia el éxito con estrategias de marketing digital innovadoras, medibles y efectivas. ROI garantizado. Consultoría gratuita. Tu negocio, nuestro universo.",
    url: "https://orionmkt.com",
    siteName: "Orion MKT - Agencia de Marketing Digital",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Orion MKT - Agencia de Marketing Digital para PyMEs y Startups en Argentina",
        type: "image/png",
      },
      {
        url: "/logo.png",
        width: 1080,
        height: 1080,
        alt: "Orion MKT - Marketing Digital Argentina",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@orionmkt",
    creator: "@orionmkt",
    title: "Orion MKT | Agencia de Marketing Digital Argentina",
    description:
      "🚀 Impulsamos PyMEs y Startups hacia el éxito con estrategias de marketing digital innovadoras. ROI garantizado. Consultoría gratuita.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: "Orion MKT",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  other: {
    "application-name": "Orion MKT",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Orion MKT",
    "geo.region": "AR",
    "geo.placename": "Buenos Aires",
    "og:locality": "Buenos Aires",
    "og:region": "AR",
    "og:country-name": "Argentina",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2c2447" },
    { media: "(prefers-color-scheme: dark)", color: "#2c2447" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" prefix="og: https://ogp.me/ns#">
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* DNS Prefetch for better performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NSW2R433');`}
        </Script>
      </head>
      <body className={`${_inter.className} ${_spaceGrotesk.variable} font-sans antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NSW2R433"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
