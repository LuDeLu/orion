import { readFromSheets } from "@/lib/scan-log"
import { fmtDate, timeAgo, type LeadRow } from "@/lib/admin-stats"
import { applyLeadFilters, parseFilters, toQueryString } from "@/lib/filters"
import { TableToolbar } from "@/components/admin/table-toolbar"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const filters = parseFilters(sp)
  const raw = (await readFromSheets("leads")) as unknown as LeadRow[]
  const rows = applyLeadFilters(raw, filters).slice().reverse()

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] mb-1" style={{ color: "rgba(219,172,52,0.70)" }}>
          Contactos
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Leads</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(244,242,238,0.45)" }}>
          Personas que dejaron su contacto al escanear el QR.
        </p>
      </div>

      <TableToolbar
        totalLabel={`${rows.length} de ${raw.length} leads`}
        exportHref={`/api/admin/export?type=leads&${toQueryString(filters)}`}
      />

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "rgba(14,12,34,0.60)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm min-w-[760px]">
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["Fecha", "Contacto", "Email", "Teléfono", "Empresa", "Mensaje", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest"
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
                    Sin leads todavía.
                  </td>
                </tr>
              ) : (
                rows.map((l, i) => (
                  <tr
                    key={i}
                    className="row-hover-orange align-top"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    {/* Date */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium" style={{ color: "rgba(244,242,238,0.75)" }}>{fmtDate(l.timestamp)}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "rgba(244,242,238,0.30)" }}>{timeAgo(l.timestamp)}</div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3 font-semibold text-white">
                      {l.name || <span style={{ color: "rgba(244,242,238,0.30)" }}>—</span>}
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3">
                      {l.email ? (
                        <a
                          href={`mailto:${l.email}`}
                          className="transition-colors underline-offset-2 hover:underline"
                          style={{ color: "rgba(224,100,47,0.85)" }}
                        >
                          {l.email}
                        </a>
                      ) : (
                        <span style={{ color: "rgba(244,242,238,0.25)" }}>—</span>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-3">
                      {l.phone ? (
                        <a
                          href={`https://wa.me/${l.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 transition-colors"
                          style={{ color: "rgba(52,211,153,0.85)" }}
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">
                            <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z" />
                          </svg>
                          {l.phone}
                        </a>
                      ) : (
                        <span style={{ color: "rgba(244,242,238,0.25)" }}>—</span>
                      )}
                    </td>

                    {/* Company */}
                    <td className="px-4 py-3" style={{ color: "rgba(244,242,238,0.70)" }}>
                      {l.company || <span style={{ color: "rgba(244,242,238,0.25)" }}>—</span>}
                    </td>

                    {/* Message */}
                    <td className="px-4 py-3 max-w-xs" style={{ color: "rgba(244,242,238,0.60)" }}>
                      {l.message ? (
                        <span className="line-clamp-2" title={l.message}>
                          {l.message}
                        </span>
                      ) : (
                        <span style={{ color: "rgba(244,242,238,0.25)" }}>—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {l.email && (
                          <a href={`mailto:${l.email}`} className="icon-btn" title="Enviar email">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
                            </svg>
                          </a>
                        )}
                        {l.phone && (
                          <a href={`tel:${l.phone}`} className="icon-btn icon-btn--green" title="Llamar">
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99Z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
