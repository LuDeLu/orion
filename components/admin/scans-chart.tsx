type Point = { date: string; count: number }

export function ScansChart({ data }: { data: Point[] }) {
  const w = 720
  const h = 200
  const padX = 28
  const padY = 28
  const maxY = Math.max(1, ...data.map((d) => d.count))
  const stepX = data.length > 1 ? (w - padX * 2) / (data.length - 1) : 0

  const pts = data.map((d, i) => {
    const x = padX + i * stepX
    const y = padY + (h - padY * 2) * (1 - d.count / maxY)
    return { x, y, ...d }
  })

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
  const area =
    pts.length > 1
      ? `${line} L ${pts[pts.length - 1].x.toFixed(1)} ${h - padY} L ${pts[0].x.toFixed(1)} ${h - padY} Z`
      : ""

  const total = data.reduce((acc, d) => acc + d.count, 0)
  const avg = data.length ? total / data.length : 0

  // Smooth bezier version for nicer curve
  const smooth =
    pts.length > 1
      ? pts
          .map((p, i) => {
            if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
            const prev = pts[i - 1]
            const cpX = (prev.x + p.x) / 2
            return `C ${cpX.toFixed(1)} ${prev.y.toFixed(1)}, ${cpX.toFixed(1)} ${p.y.toFixed(1)}, ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
          })
          .join(" ")
      : line

  const smoothArea =
    pts.length > 1
      ? `${smooth} L ${pts[pts.length - 1].x.toFixed(1)} ${h - padY} L ${pts[0].x.toFixed(1)} ${h - padY} Z`
      : ""

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "rgba(14,12,34,0.60)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "rgba(219,172,52,0.65)" }}>
            Actividad
          </p>
          <h3 className="text-sm font-semibold text-white">
            Últimos {data.length} días
          </h3>
        </div>
        <div className="flex gap-5 text-right">
          <div>
            <div className="text-lg font-bold text-white tabular">{total}</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,242,238,0.35)" }}>Total</div>
          </div>
          <div>
            <div className="text-lg font-bold text-white tabular">{avg.toFixed(1)}</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: "rgba(244,242,238,0.35)" }}>Prom/día</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-auto"
          preserveAspectRatio="none"
          role="img"
          aria-label={`Gráfico de scans: ${total} en ${data.length} días`}
        >
          <defs>
            <linearGradient id="orionGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#e0642f" stopOpacity="0.40" />
              <stop offset="60%" stopColor="#e0642f" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#e0642f" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((p, i) => (
            <line
              key={i}
              x1={padX}
              x2={w - padX}
              y1={padY + (h - padY * 2) * p}
              y2={padY + (h - padY * 2) * p}
              stroke="white"
              strokeOpacity="0.05"
              strokeDasharray="3 5"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          {smoothArea && <path d={smoothArea} fill="url(#orionGrad)" />}

          {/* Line */}
          <path
            d={smooth}
            fill="none"
            stroke="#e0642f"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Dots */}
          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="4" fill="#07051a" stroke="#e0642f" strokeWidth="2" />
              <circle cx={p.x} cy={p.y} r="2" fill="#e0642f" />
              <title>{`${p.date}: ${p.count} scan${p.count !== 1 ? "s" : ""}`}</title>
            </g>
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 px-7 text-[10px]" style={{ color: "rgba(244,242,238,0.30)" }}>
          {data
            .filter((_, i) => i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1)
            .map((d) => (
              <span key={d.date}>
                {new Date(d.date).toLocaleDateString("es-AR", { day: "2-digit", month: "short" })}
              </span>
            ))}
        </div>
      </div>
    </div>
  )
}
