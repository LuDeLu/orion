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
    default: "Orion Marketing | Agencia de Marketing Digital Argentina | Orion MKT",
    template: "%s | Orion Marketing - Agencia de Marketing Digital Argentina",
  },
  description:
    "Orion Marketing es la agencia de marketing digital líder en Argentina. Especialistas en branding, redes sociales, Google Ads, Facebook Ads, diseño web y estrategias digitales para PyMEs y Startups. Orion MKT - Tu negocio, nuestro universo. Consultoría gratuita.",
  metadataBase: new URL("https://orionmkt.com.ar"),
  alternates: {
    canonical: "https://orionmkt.com.ar",
    languages: {
      "es-AR": "https://orionmkt.com.ar",
      "es-UY": "https://orionmkt.com.ar",
      "es-CL": "https://orionmkt.com.ar",
      "es-MX": "https://orionmkt.com.ar",
      es: "https://orionmkt.com.ar",
    },
  },
  generator: "Next.js",
  applicationName: "Orion Marketing",
  referrer: "origin-when-cross-origin",
  keywords: [
    "orion marketing",
    "orion mkt",
    "orionmkt",
    "orion marketing digital",
    "orion marketing argentina",
    "agencia orion",
    "orion agencia marketing",
    "orion marketing buenos aires",
    "orionmkt.com.ar",
    "orion mkt argentina",

    // Core keywords - Argentina
    "agencia marketing digital argentina",
    "agencia marketing digital buenos aires",
    "agencia marketing digital caba",
    "marketing digital argentina",
    "publicidad digital argentina",
    "agencia de marketing argentina",
    "mejor agencia marketing argentina",

    // Business types
    "marketing para pymes argentina",
    "marketing para startups argentina",
    "agencia marketing pymes",
    "consultora marketing digital",
    "marketing emprendedores",

    // Services - Social Media
    "community manager argentina",
    "gestión redes sociales argentina",
    "social media marketing argentina",
    "contenido redes sociales",
    "estrategia instagram argentina",
    "marketing facebook argentina",
    "publicidad instagram",
    "ads redes sociales",
    "manejo de redes sociales",

    // Services - Advertising
    "google ads argentina",
    "facebook ads argentina",
    "instagram ads argentina",
    "tiktok ads argentina",
    "pauta digital argentina",
    "publicidad online argentina",
    "campañas publicitarias digitales",
    "meta ads argentina",
    "publicidad google",

    // Services - Branding
    "branding startups argentina",
    "diseño identidad marca",
    "rebranding empresas",
    "estrategia marca",
    "logo diseño profesional",
    "identidad corporativa",
    "branding digital",

    // Services - Web
    "diseño web argentina",
    "diseño web responsivo",
    "desarrollo web argentina",
    "landing page diseño",
    "sitio web empresas",
    "tienda online argentina",
    "ecommerce argentina",
    "paginas web argentina",

    // SEO & Digital Strategy
    "SEO argentina",
    "posicionamiento web argentina",
    "posicionamiento google argentina",
    "optimización SEO",
    "estrategia digital pymes",
    "consultoria seo argentina",
    "posicionamiento seo",

    // Performance & Analytics
    "performance marketing argentina",
    "ROI marketing digital",
    "analítica web",
    "conversion rate optimization",
    "growth marketing argentina",
    "growth hacking argentina",

    // Marketing Types
    "inbound marketing argentina",
    "marketing de contenidos",
    "content marketing argentina",
    "email marketing argentina",
    "automatización marketing",
    "marketing automation",
    "influencer marketing argentina",
    "marketing 360",

    // Local - Buenos Aires
    "agencia marketing palermo",
    "agencia marketing belgrano",
    "agencia marketing recoleta",
    "marketing digital capital federal",
    "agencia digital buenos aires",

    // Local - Other Argentina
    "agencia marketing digital cordoba",
    "agencia marketing digital rosario",
    "agencia marketing digital mendoza",
    "agencia marketing digital la plata",
    "marketing digital interior argentina",

    // Industry specific
    "marketing digital ecommerce",
    "marketing digital restaurantes",
    "marketing digital inmobiliarias",
    "marketing digital tecnología",
    "marketing digital servicios profesionales",

    // Long-tail conversions
    "mejor agencia marketing digital argentina",
    "agencia marketing digital económica",
    "agencia marketing digital precios",
    "contratar agencia marketing digital",
    "como elegir agencia marketing",
    "cuanto cuesta marketing digital",
    "presupuesto marketing digital pymes",
    "agencia marketing digital confiable",
    "agencia marketing recomendada",
  ],
  authors: [
    { name: "Orion Marketing", url: "https://orionmkt.com.ar" },
    { name: "Orion MKT", url: "https://orionmkt.com.ar" },
  ],
  creator: "Orion Marketing",
  publisher: "Orion Marketing",
  category: "Marketing Digital",
  classification: "Business Services, Marketing Agency, Digital Marketing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Orion Marketing | Agencia de Marketing Digital #1 en Argentina",
    description:
      "Orion Marketing - La agencia de marketing digital líder para PyMEs y Startups en Argentina. Branding, Social Media, Google Ads, Facebook Ads, Diseño Web. ROI garantizado. Consultoría gratuita. Tu negocio, nuestro universo.",
    url: "https://orionmkt.com.ar",
    siteName: "Orion Marketing - Orion MKT",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "https://orionmkt.com.ar/og-image.png",
        width: 1200,
        height: 630,
        alt: "Orion Marketing - Agencia de Marketing Digital Argentina - Orion MKT",
        type: "image/png",
      },
      {
        url: "https://orionmkt.com.ar/logo.png",
        width: 512,
        height: 512,
        alt: "Orion Marketing Logo - Orion MKT Argentina",
        type: "image/png",
      },
    ],
    countryName: "Argentina",
  },
  twitter: {
    card: "summary_large_image",
    site: "@orionmkt",
    creator: "@orionmkt",
    title: "Orion Marketing | Agencia de Marketing Digital Argentina",
    description:
      "Orion Marketing - Agencia líder en marketing digital para PyMEs y Startups. Branding, Social Media, Ads, Web. ROI garantizado. Consultoría gratuita.",
    images: {
      url: "https://orionmkt.com.ar/og-image.png",
      alt: "Orion Marketing - Agencia de Marketing Digital Argentina",
    },
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
  verification: {
    google: "tu-codigo-de-verificacion-google",
    yandex: "tu-codigo-yandex",
  },
  appleWebApp: {
    capable: true,
    title: "Orion Marketing",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  other: {
    "application-name": "Orion Marketing",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Orion Marketing",
    "msapplication-TileColor": "#2c2447",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#2c2447",
    // Geo tags para SEO local
    "geo.region": "AR-C",
    "geo.placename": "Buenos Aires, Argentina",
    "geo.position": "-34.6037;-58.3816",
    ICBM: "-34.6037, -58.3816",
    // Open Graph adicional
    "og:locale:alternate": "es_ES",
    "og:locality": "Buenos Aires",
    "og:region": "Buenos Aires",
    "og:country-name": "Argentina",
    "og:email": "info@orionmkt.com.ar",
    "og:phone_number": "+54 9 11 5656-6083",
    // Business info
    "business:contact_data:street_address": "Buenos Aires",
    "business:contact_data:locality": "Buenos Aires",
    "business:contact_data:region": "Buenos Aires",
    "business:contact_data:postal_code": "1000",
    "business:contact_data:country_name": "Argentina",
    // DC metadata
    "DC.title": "Orion Marketing - Agencia de Marketing Digital Argentina",
    "DC.creator": "Orion Marketing",
    "DC.subject": "Marketing Digital, Publicidad, Branding, Social Media",
    "DC.description": "Agencia de marketing digital líder en Argentina para PyMEs y Startups",
    "DC.publisher": "Orion Marketing",
    "DC.language": "es-AR",
    "DC.coverage": "Argentina, Latinoamérica",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://www.google.com" />

        {/* Canonical URL explícita */}
        <link rel="canonical" href="https://orionmkt.com.ar" />

        {/* Alternate para idiomas */}
        <link rel="alternate" hrefLang="es" href="https://orionmkt.com.ar" />
        <link rel="alternate" hrefLang="es-AR" href="https://orionmkt.com.ar" />
        <link rel="alternate" hrefLang="x-default" href="https://orionmkt.com.ar" />

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
