import Link from "next/link"
import { diasDelRango, enVivo, fechaHoraAr, leerEstadisticas, leerTotales } from "@/lib/analitica"
import { countryFlag, countryName } from "@/lib/ua-parser"
import { usaRedis } from "@/lib/kv"
import { StatCard } from "@/components/admin/stat-card"
import { DistributionList } from "@/components/admin/distribution-list"
import { GraficoVisitas } from "@/components/admin/estadisticas/grafico-visitas"
import { EnVivo } from "@/components/admin/estadisticas/en-vivo"
import { NoMedir } from "@/components/admin/estadisticas/no-medir"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const revalidate = 0

const RANGOS = [
  { id: "hoy", nombre: "Hoy" },
  { id: "7", nombre: "7 días" },
  { id: "30", nombre: "30 días" },
  { id: "mes", nombre: "Este mes" },
  { id: "90", nombre: "90 días" },
] as const

const sumarDias = (iso: string, n: number) => new Date(new Date(`${iso}T12:00:00Z`).getTime() + n * 864e5).toISOString().slice(0, 10)

function calcularRango(id: string, hoy: string) {
  if (id === "hoy") return { desde: hoy, hasta: hoy }
  if (id === "mes") return { desde: `${hoy.slice(0, 8)}01`, hasta: hoy }
  const n = Number(id) || 30
  return { desde: sumarDias(hoy, -(n - 1)), hasta: hoy }
}

const NOMBRES_DISP: Record<string, string> = { mobile: "Celular", desktop: "Computadora", tablet: "Tablet" }
const NOMBRES_EVENTO: Record<string, string> = {
  whatsapp: "Clic en WhatsApp",
  formulario: "Formulario enviado",
  qr: "Escaneo del QR",
  email: "Clic en email",
  telefono: "Clic en teléfono",
  redes: "Clic a redes sociales",
}
const IDIOMAS: Record<string, string> = { es: "Español", en: "Inglés", pt: "Portugués", it: "Italiano", fr: "Francés", de: "Alemán" }

function area(ruta: string) {
  if (ruta.startsWith("/marketing")) return "Marketing"
  if (ruta.startsWith("/software")) return "Software"
  if (ruta.startsWith("/it")) return "IT e infraestructura"
  if (ruta === "/") return "Inicio"
  return "Otras páginas"
}

/** Ordena, deja los primeros N y agrupa el resto en "Otros". */
function top(mapa: Record<string, number>, n = 7, etiqueta: (k: string) => string = (k) => k) {
  const orden = Object.entries(mapa).sort((a, b) => b[1] - a[1])
  const items = orden.slice(0, n).map(([k, c]) => ({ label: etiqueta(k), count: c }))
  const resto = orden.slice(n).reduce((s, [, c]) => s + c, 0)
  if (resto) items.push({ label: "Otros", count: resto })
  return items
}

function variacion(actual: number, previo: number) {
  if (!previo) return actual ? "nuevo vs período anterior" : "sin datos previos"
  const p = Math.round(((actual - previo) / previo) * 100)
  return `${p >= 0 ? "▲" : "▼"} ${Math.abs(p)}% vs período anterior`
}

const duracion = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${String(Math.round(s % 60)).padStart(2, "0")}s` : `${Math.round(s)}s`)
const miles = (n: number) => n.toLocaleString("es-AR")

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ rango?: string }> }) {
  const { rango: rangoParam } = await searchParams
  const rango = RANGOS.some((r) => r.id === rangoParam) ? rangoParam! : "30"
  const { fecha: hoy } = fechaHoraAr()
  const { desde, hasta } = calcularRango(rango, hoy)
  const largo = diasDelRango(desde, hasta).length
  const previo = { desde: sumarDias(desde, -largo), hasta: sumarDias(desde, -1) }

  const [est, ant, vivo] = await Promise.all([leerEstadisticas(desde, hasta), leerTotales(previo.desde, previo.hasta), enVivo()])
  const t = est.totales
  const conversiones = Object.values(est.dims.ev).reduce((s, n) => s + n, 0)
  const promedio = t.nSegundos ? t.segundos / t.nSegundos : 0
  const promedioAnt = ant.nSegundos ? ant.segundos / ant.nSegundos : 0

  const serie =
    rango === "hoy"
      ? Array.from({ length: 24 }, (_, h) => {
          const hh = String(h).padStart(2, "0")
          return { etiqueta: `${hh}h`, visitantes: 0, vistas: est.dims.hora[hh] ?? 0 }
        }).map((p) => ({ ...p, visitantes: p.vistas }))
      : est.dias.map((d) => ({ etiqueta: d.fecha.slice(8, 10) + "/" + d.fecha.slice(5, 7), visitantes: d.visitantes, vistas: d.vistas }))

  const areas: Record<string, number> = {}
  for (const [ruta, n] of Object.entries(est.dims.pag)) areas[area(ruta)] = (areas[area(ruta)] ?? 0) + n

  const horas = Array.from({ length: 24 }, (_, h) => est.dims.hora[String(h).padStart(2, "0")] ?? 0)
  const maxHora = Math.max(1, ...horas)
  const sinDatos = t.vistas === 0

  return (
    <div className="space-y-6 sm:space-y-7">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] mb-1" style={{ color: "rgba(219,172,52,0.70)" }}>Estadísticas del sitio</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(244,242,238,0.45)" }}>Visitas a orionmkt.com.ar, de dónde llegan y qué hacen.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <NoMedir />
          <nav className="inline-flex flex-wrap gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }} aria-label="Período">
            {RANGOS.map((r) => (
              <Link
                key={r.id}
                href={`/admin?rango=${r.id}`}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={r.id === rango ? { background: "rgba(224,100,47,0.18)", color: "#fff", boxShadow: "inset 0 0 0 1px rgba(224,100,47,0.45)" } : { color: "rgba(244,242,238,0.5)" }}
              >
                {r.nombre}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {!usaRedis && (
        <div className="rounded-lg px-3.5 py-2.5 text-sm" style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.20)", color: "rgba(186,230,253,0.9)" }}>
          Modo local: las visitas se guardan en <code>.data/panel.json</code>. En producción se guardan en Upstash Redis.
        </div>
      )}
      {sinDatos && (
        <div className="rounded-lg px-3.5 py-2.5 text-sm" style={{ background: "rgba(219,172,52,0.08)", border: "1px solid rgba(219,172,52,0.25)", color: "rgba(253,230,138,0.92)" }}>
          Todavía no hay visitas registradas en este período. La medición empieza a contar desde que se publica esta versión del sitio.
        </div>
      )}

      <section aria-label="Métricas principales" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <EnVivo inicial={vivo} />
        <StatCard label="Visitantes únicos" value={miles(t.visitantes)} hint={variacion(t.visitantes, ant.visitantes)} accent="orange" />
        <StatCard label="Visitas" value={miles(t.visitas)} hint={variacion(t.visitas, ant.visitas)} accent="gold" />
        <StatCard label="Páginas vistas" value={miles(t.vistas)} hint={t.visitas ? `${(t.vistas / t.visitas).toFixed(1)} por visita` : "—"} accent="sky" />
        <StatCard label="Tiempo promedio" value={promedio ? duracion(promedio) : "—"} hint={promedioAnt ? `antes ${duracion(promedioAnt)}` : "por página"} accent="rose" />
        <StatCard
          label="Conversiones"
          value={miles(conversiones)}
          hint={t.visitas ? `${((conversiones / t.visitas) * 100).toFixed(1)}% de las visitas` : variacion(conversiones, ant.conversiones)}
          accent="emerald"
        />
      </section>

      <section className="grid lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2">
          <GraficoVisitas datos={serie} soloVistas={rango === "hoy"} titulo={rango === "hoy" ? "Hoy, por hora" : `${RANGOS.find((r) => r.id === rango)?.nombre} · ${desde.split("-").reverse().join("/")} al ${hasta.split("-").reverse().join("/")}`} />
        </div>
        <DistributionList title="Canales de llegada" items={top(est.dims.fuente)} />
      </section>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <DistributionList title="Páginas más vistas" items={top(est.dims.pag, 8)} />
        <DistributionList title="Páginas de entrada" items={top(est.dims.ent, 8)} />
        <DistributionList title="Interés por área" items={top(areas)} />
        <DistributionList title="Sitios que te refieren" items={top(est.dims.ref, 8)} />
        <DistributionList title="Campañas (UTM)" items={top(est.dims.camp, 8)} emptyLabel="Sin campañas. Usá ?utm_source=… en tus links." />
        <DistributionList title="Conversiones" items={top(est.dims.ev, 8, (k) => NOMBRES_EVENTO[k] ?? k)} emptyLabel="Sin clics de contacto todavía." />
        <DistributionList title="Países" items={top(est.dims.pais, 7, (c) => (c === "??" ? "Desconocido" : `${countryFlag(c)} ${countryName(c) || c}`))} />
        <DistributionList
          title="Ciudades"
          items={top(est.dims.ciudad, 7, (k) => {
            const [ciudad, pais] = k.split("|")
            return `${countryFlag(pais)} ${ciudad}`
          })}
        />
        <DistributionList title="Dispositivos" items={top(est.dims.disp, 5, (k) => NOMBRES_DISP[k] ?? k)} />
        <DistributionList title="Navegadores" items={top(est.dims.nav)} />
        <DistributionList title="Sistemas operativos" items={top(est.dims.so)} />
        <DistributionList title="Idioma del navegador" items={top(est.dims.idioma, 5, (k) => IDIOMAS[k] ?? k.toUpperCase())} />
      </section>

      <section className="rounded-xl p-5" style={{ background: "rgba(14,12,34,0.60)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-baseline justify-between mb-4 gap-3 flex-wrap">
          <h3 className="text-sm font-semibold text-white">Horarios de mayor tráfico</h3>
          <span className="text-xs" style={{ color: "rgba(244,242,238,0.38)" }}>Páginas vistas por hora (Argentina)</span>
        </div>
        <div className="flex items-end gap-[3px] h-28">
          {horas.map((n, h) => (
            <div key={h} className="flex-1 flex flex-col items-center justify-end h-full group" title={`${String(h).padStart(2, "0")}:00 — ${n} páginas vistas`}>
              <div
                className="w-full rounded-t transition-all group-hover:brightness-125"
                style={{ height: `${Math.max(2, (n / maxHora) * 100)}%`, background: n === maxHora && n > 0 ? "linear-gradient(180deg,#dbac34,#e0642f)" : "rgba(224,100,47,0.35)" }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] tabular" style={{ color: "rgba(244,242,238,0.35)" }}>
          {[0, 6, 12, 18, 23].map((h) => (
            <span key={h}>{String(h).padStart(2, "0")}h</span>
          ))}
        </div>
      </section>
    </div>
  )
}
