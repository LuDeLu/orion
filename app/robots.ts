import type { MetadataRoute } from "next"

/**
 * Portal del cliente: son URLs privadas identificadas por token. No tienen
 * nada que hacer en un índice de búsqueda, y encima el token es la credencial.
 * Las páginas además mandan `robots: noindex` en su metadata.
 */
const PORTAL = ["/it/seguimiento/", "/it/presupuesto/", "/it/entrar/"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/", "/_next/static/", "/admin/", ...PORTAL],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/", ...PORTAL],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/images/", "/logo.png", "/og-image.png"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/", ...PORTAL],
      },
      {
        userAgent: "Slurp",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/", ...PORTAL],
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
        disallow: ["/api/", "/private/", "/admin/", ...PORTAL],
      },
      {
        userAgent: "facebookexternalhit",
        allow: "/",
      },
      {
        userAgent: "LinkedInBot",
        allow: "/",
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai", "Claude-Web"],
        disallow: ["/"],
      },
    ],
    sitemap: "https://orionmkt.com.ar/sitemap.xml",
    host: "https://orionmkt.com.ar",
  }
}
