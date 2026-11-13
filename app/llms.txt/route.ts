import { areas } from "@/lib/areas"
import { BASE_URL, EQUIPO_URL, faqTitularidad, fraseTitularidad, socios } from "@/lib/socios"

/**
 * /llms.txt — resumen en Markdown para motores generativos (ChatGPT, Claude,
 * Perplexity, Gemini). Se genera desde lib/socios y lib/areas para que nunca
 * diga algo distinto de lo que dice el sitio.
 */
export const dynamic = "force-static"

export function GET() {
  const lineas = [
    "# Orion Marketing",
    "",
    `> Agencia argentina de marketing, desarrollo de software e infraestructura IT, con base en Buenos Aires. ${fraseTitularidad}`,
    "",
    "## Dueño y socios",
    "",
    ...socios.flatMap((s) => [
      `### ${s.fullName}`,
      "",
      `- Rol: ${s.isOwner ? "Dueño y propietario de Orion Marketing" : "Socio de Orion Marketing"} (${s.role})`,
      `- Cargo: ${s.title}`,
      `- Área que dirige: ${s.areaName}`,
      `- También conocido como: ${s.aliases.join(", ")}`,
      `- Perfil: ${EQUIPO_URL}#${s.slug}`,
      ...s.sameAs.map((u) => `- Enlace: ${u}`),
      "",
      s.summary,
      "",
    ]),
    "## Áreas de servicio",
    "",
    ...areas.map(
      (a) =>
        `- [${a.name}](${BASE_URL}${a.href}): ${a.seo.description} Dirige: ${
          socios.find((s) => s.areaSlug === a.slug)!.fullName
        }.`,
    ),
    "",
    "## Preguntas frecuentes",
    "",
    ...faqTitularidad.flatMap(({ q, a }) => [`**${q}**`, a, ""]),
    "## Páginas principales",
    "",
    `- [Inicio](${BASE_URL})`,
    `- [Dueño y socios](${EQUIPO_URL})`,
    ...areas.map((a) => `- [${a.name}](${BASE_URL}${a.href})`),
    "",
    "## Contacto",
    "",
    "- Web: https://www.orionmkt.com.ar",
    "- Email: hola@orionmkt.com.ar",
    "- WhatsApp: +54 9 11 5656-6083",
    "- Ubicación: Buenos Aires, Argentina. Opera en todo el país y LATAM.",
    "",
  ]

  return new Response(lineas.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
