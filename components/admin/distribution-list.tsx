type Item = { label: string; count: number; prefix?: React.ReactNode }

export function DistributionList({
  title,
  items,
  emptyLabel = "Sin datos todavía.",
}: {
  title: string
  items: Item[]
  emptyLabel?: string
}) {
  const total = items.reduce((acc, i) => acc + i.count, 0)
  const topCount = items[0]?.count ?? 0

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "rgba(14,12,34,0.60)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {total > 0 && (
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{ background: "rgba(224,100,47,0.10)", color: "rgba(224,100,47,0.80)", border: "1px solid rgba(224,100,47,0.20)" }}
          >
            {total} total
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-xs" style={{ color: "rgba(244,242,238,0.35)" }}>{emptyLabel}</p>
      ) : (
        <ul className="space-y-3">
          {items.map((it, i) => {
            const pct = total ? (it.count / total) * 100 : 0
            const isTop = i === 0
            return (
              <li key={i}>
                <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                  <span className="flex items-center gap-2 min-w-0 truncate" style={{ color: "rgba(244,242,238,0.80)" }}>
                    {it.prefix}
                    {it.label}
                  </span>
                  <span className="tabular shrink-0" style={{ color: "rgba(244,242,238,0.45)" }}>
                    {it.count}
                    <span className="ml-1 text-[10px]" style={{ color: "rgba(244,242,238,0.25)" }}>
                      {pct.toFixed(0)}%
                    </span>
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: isTop
                        ? "linear-gradient(90deg, #e0642f, #dbac34)"
                        : "rgba(224,100,47,0.40)",
                    }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
