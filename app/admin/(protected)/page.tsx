import Link from "next/link"
import { readFromSheets } from "@/lib/scan-log"
import { computeStats, fmtDate, timeAgo, type ScanRow, type LeadRow } from "@/lib/admin-stats"
import { countryFlag, countryName, parseUA } from "@/lib/ua-parser"
import { StatCard } from "@/components/admin/stat-card"
import { ScansChart } from "@/components/admin/scans-chart"
import { DistributionList } from "@/components/admin/distribution-list"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"
export const revalidate = 0

export default async function DashboardPage() {
  const [scansRaw, leadsRaw] = await Promise.all([
    readFromSheets("scans"),
    readFromSheets("leads"),
  ])
  const scans = scansRaw as unknown as ScanRow[]
  const leads = leadsRaw as unknown as LeadRow[]
  const stats = computeStats(scans, leads)

  const recent = [
    ...scans.map((s) => ({ kind: "scan" as const, ts: s.timestamp, data: s })),
    ...leads.map((l) => ({ kind: "lead" as const, ts: l.timestamp, data: l })),
  ]
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
    .slice(0, 8)

  return (
    <div className="space-y-6 sm:space-y-7">

      {/* ── Page header ─────────────────────────────────── */}
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.35em] mb-1" style={{ color: "rgba(219,172,52,0.70)" }}>
            Panel de Control
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(244,242,238,0.45)" }}>
            Resumen del comportamiento de tu QR en tiempo real.
          </p>
        </div>
        <div
          className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(244,242,238,0.40)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          Actualizado {new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────── */}
      <section aria-label="Métricas principales" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <StatCard
          label="Scans totales"
          value={stats.totalScans}
          hint={`${stats.last24h} últimas 24h`}
          accent="orange"
          icon={<Icon path="M3 5a2 2 0 0 1 2-2h3v2H5v3H3V5Zm13-2h3a2 2 0 0 1 2 2v3h-2V5h-3V3ZM3 16h2v3h3v2H5a2 2 0 0 1-2-2v-3Zm16 0h2v3a2 2 0 0 1-2 2h-3v-2h3v-3ZM7 7h4v4H7V7Zm6 0h4v4h-4V7Zm-6 6h4v4H7v-4Zm6 0h4v4h-4v-4Z" />}
        />
        <StatCard
          label="Visitantes únicos"
          value={stats.uniqueVisitors}
          hint={`${stats.last7d} en 7 días`}
          accent="gold"
          icon={<Icon path="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z" />}
        />
        <StatCard
          label="Leads capturados"
          value={stats.totalLeads}
          hint="formulario opcional"
          accent="emerald"
          icon={<Icon path="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />}
        />
        <StatCard
          label="Conversión"
          value={`${stats.conversion}%`}
          hint="leads / visitantes"
          accent="sky"
          icon={<Icon path="M3 17l6-6 4 4 8-8-1.41-1.41L13 12.17l-4-4-7 7L3 17Z" />}
        />
        <StatCard
          label="Top país"
          value={stats.topCountry ? `${countryFlag(stats.topCountry.code)} ${stats.topCountry.code || "—"}` : "—"}
          hint={stats.topCountry ? countryName(stats.topCountry.code) : "Sin datos"}
          accent="rose"
        />
        <StatCard
          label="Top dispositivo"
          value={stats.topDevice ? capitalize(stats.topDevice.name) : "—"}
          hint={stats.topBrowser ? `via ${stats.topBrowser.name}` : "Sin datos"}
          accent="orange"
        />
      </section>

      {/* ── Chart + Countries ───────────────────────────── */}
      <section aria-label="Actividad y distribución" className="grid lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="lg:col-span-2">
          <ScansChart data={stats.perDay} />
        </div>
        <DistributionList
          title="Distribución por países"
          items={stats.byCountry.map((c) => ({
            label: `${countryFlag(c.code)} ${countryName(c.code) || c.code || "Desconocido"}`,
            count: c.count,
          }))}
        />
      </section>

      {/* ── Devices, Browsers, Recent Activity ─────────── */}
      <section aria-label="Dispositivos, navegadores y actividad" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <DistributionList
          title="Dispositivos"
          items={stats.byDevice.map((d) => ({ label: capitalize(d.name), count: d.count }))}
        />
        <DistributionList
          title="Navegadores"
          items={stats.byBrowser.map((b) => ({ label: b.name, count: b.count }))}
        />

        {/* Recent activity */}
        <div
          className="rounded-xl p-5"
          style={{ background: "rgba(14,12,34,0.60)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Actividad reciente</h3>
            <div className="flex gap-3 text-xs">
              <Link href="/admin/scans" className="transition-colors hover:text-white" style={{ color: "rgba(224,100,47,0.70)" }}>
                Scans →
              </Link>
              <Link href="/admin/leads" className="transition-colors hover:text-white" style={{ color: "rgba(219,172,52,0.70)" }}>
                Leads →
              </Link>
            </div>
          </div>

          {recent.length === 0 ? (
            <p className="text-xs" style={{ color: "rgba(244,242,238,0.35)" }}>Sin actividad todavía.</p>
          ) : (
            <ul className="space-y-2.5">
              {recent.map((r, i) => {
                if (r.kind === "scan") {
                  const ua = parseUA(r.data.userAgent)
                  return (
                    <li key={i} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#e0642f" }} />
                        <span className="truncate" style={{ color: "rgba(244,242,238,0.75)" }}>
                          Scan · {countryFlag(r.data.country)} {ua.os} · {ua.browser}
                        </span>
                      </div>
                      <span className="shrink-0" style={{ color: "rgba(244,242,238,0.35)" }}>{timeAgo(r.ts)}</span>
                    </li>
                  )
                }
                return (
                  <li key={i} className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="truncate" style={{ color: "rgba(244,242,238,0.75)" }}>
                        Lead · {r.data.name || "(sin nombre)"}{r.data.email ? ` · ${r.data.email}` : ""}
                      </span>
                    </div>
                    <span className="shrink-0" style={{ color: "rgba(244,242,238,0.35)" }}>{timeAgo(r.ts)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ── Recent scans table ──────────────────────────── */}
      <section
        aria-label="Últimos scans"
        className="rounded-xl overflow-hidden"
        style={{ background: "rgba(14,12,34,0.60)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
      >
        <div className="flex items-center justify-between p-5 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Últimos 5 scans</h3>
            <p className="text-xs mt-0.5" style={{ color: "rgba(244,242,238,0.40)" }}>Registros más recientes del QR</p>
          </div>
          <Link
            href="/admin/scans"
            className="text-xs font-medium transition-colors"
            style={{ color: "rgba(224,100,47,0.75)" }}
          >
            Ver todos →
          </Link>
        </div>

        {/* Accent divider */}
        <div className="mx-5 h-px mb-3" style={{ background: "linear-gradient(90deg, rgba(224,100,47,0.30), transparent)" }} />

        {scans.length === 0 ? (
          <p className="px-5 pb-5 text-xs" style={{ color: "rgba(244,242,238,0.35)" }}>
            Sin scans todavía. Probá escanear el QR.
          </p>
        ) : (
          <div className="overflow-x-auto pb-1 px-1">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  {["Fecha", "Ubicación", "Dispositivo", "IP"].map((h) => (
                    <th key={h} className="text-left px-4 py-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(244,242,238,0.30)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scans
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((s, i) => {
                    const ua = parseUA(s.userAgent)
                    return (
                      <tr
                        key={i}
                        className="group transition-colors"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(244,242,238,0.70)" }}>
                          {fmtDate(s.timestamp)}
                        </td>
                        <td className="px-4 py-3" style={{ color: "rgba(244,242,238,0.70)" }}>
                          {countryFlag(s.country)} {[s.city, s.country].filter(Boolean).join(", ") || "—"}
                        </td>
                        <td className="px-4 py-3" style={{ color: "rgba(244,242,238,0.70)" }}>
                          {capitalize(ua.device)} · {ua.os}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px]" style={{ color: "rgba(244,242,238,0.35)" }}>
                          {s.ip || "—"}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

function capitalize(s: string) {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
      <path d={path} />
    </svg>
  )
}
