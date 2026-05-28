import { readFromSheets } from "@/lib/scan-log"
import { fmtDate, type ScanRow } from "@/lib/admin-stats"
import { countryFlag, countryName, parseUA } from "@/lib/ua-parser"
import { applyScanFilters, parseFilters, toQueryString } from "@/lib/filters"
import { TableToolbar } from "@/components/admin/table-toolbar"
import { DeviceBadge, OsBadge } from "@/components/admin/badges"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function ScansPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const filters = parseFilters(sp)
  const raw = (await readFromSheets("scans")) as unknown as ScanRow[]
  const rows = applyScanFilters(raw, filters, (ua) => parseUA(ua).device).slice().reverse()
  const uniqueCountries = [...new Set(raw.map((r) => r.country).filter(Boolean))].sort()

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] mb-1" style={{ color: "rgba(219,172,52,0.70)" }}>
          Registro
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Scans</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(244,242,238,0.45)" }}>
          Cada visita registrada desde el QR code.
        </p>
      </div>

      <TableToolbar
        totalLabel={`${rows.length} de ${raw.length} registros`}
        exportHref={`/api/admin/export?type=scans&${toQueryString(filters)}`}
        filters={[
          {
            name: "country",
            label: "País",
            options: uniqueCountries.map((c) => ({
              value: c,
              label: `${countryFlag(c)} ${countryName(c) || c}`,
            })),
          },
          {
            name: "device",
            label: "Dispositivo",
            options: [
              { value: "mobile", label: "Mobile" },
              { value: "tablet", label: "Tablet" },
              { value: "desktop", label: "Desktop" },
              { value: "bot", label: "Bot" },
            ],
          },
        ]}
      />

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "rgba(14,12,34,0.60)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[680px]">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Fecha", "Ubicación", "Dispositivo", "OS · Browser", "IP", "Referer", "Visit ID"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest whitespace-nowrap"
                    style={{ color: "rgba(244,242,238,0.30)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-14 text-sm"
                    style={{ color: "rgba(244,242,238,0.35)" }}
                  >
                    Sin resultados con esos filtros.
                  </td>
                </tr>
              ) : (
                rows.map((s, i) => {
                  const ua = parseUA(s.userAgent)
                  return (
                    <tr
                      key={i}
                      className="row-hover-orange"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "rgba(244,242,238,0.70)" }}>
                        {fmtDate(s.timestamp)}
                      </td>
                      <td className="px-4 py-3" style={{ color: "rgba(244,242,238,0.75)" }}>
                        <div className="flex items-center gap-1.5">
                          <span className="text-base leading-none">{countryFlag(s.country)}</span>
                          <span>{[s.city, s.region, countryName(s.country) || s.country].filter(Boolean).join(", ") || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <DeviceBadge device={ua.device} />
                      </td>
                      <td className="px-4 py-3">
                        <OsBadge os={ua.osIcon} label={`${ua.os} · ${ua.browser}`} />
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px]" style={{ color: "rgba(244,242,238,0.35)" }}>
                        {s.ip || "—"}
                      </td>
                      <td className="px-4 py-3 max-w-[140px] truncate" style={{ color: "rgba(244,242,238,0.40)" }}>
                        {s.referer || "—"}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px]" style={{ color: "rgba(244,242,238,0.25)" }}>
                        {s.visitId || "—"}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
