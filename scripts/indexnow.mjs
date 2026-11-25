/**
 * Avisa a IndexNow (Bing, Yandex, Seznam, Naver…) que cambiaron páginas del
 * sitio. Bing alimenta a ChatGPT y Copilot, así que esto también acelera que
 * los motores de IA vean los cambios.
 *
 * Correrlo DESPUÉS del deploy (si no, leen la versión vieja):
 *   npm run indexnow                      → todas las URLs del sitemap en producción
 *   npm run indexnow -- /equipo /equipo/lucas-damian-baez   → solo esas rutas
 */

const HOST = "www.orionmkt.com.ar"
const BASE = `https://${HOST}`
const KEY = "da2383e1b4c19eadaed427469d313acd" // = public/<KEY>.txt

const rutas = process.argv.slice(2)

async function urlsDelSitemap() {
  const res = await fetch(`${BASE}/sitemap.xml`)
  if (!res.ok) throw new Error(`No se pudo leer el sitemap: HTTP ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
}

const urlList = rutas.length
  ? rutas.map((r) => (r.startsWith("http") ? r : `${BASE}${r.startsWith("/") ? r : `/${r}`}`))
  : await urlsDelSitemap()

if (!urlList.length) {
  console.error("No hay URLs para enviar.")
  process.exit(1)
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${BASE}/${KEY}.txt`, urlList }),
})

// 200 = recibido, 202 = recibido (la clave se valida después)
console.log(`IndexNow respondió HTTP ${res.status} para ${urlList.length} URL(s):`)
for (const u of urlList) console.log(`  ${u}`)
if (res.status >= 300) {
  console.error(await res.text())
  process.exit(1)
}
