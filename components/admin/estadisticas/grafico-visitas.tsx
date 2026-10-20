"use client"

import { useState } from "react"

export type PuntoVisitas = { etiqueta: string; visitantes: number; vistas: number }

const W = 760
const H = 240
const PX = 36
const PY = 24

function curva(pts: { x: number; y: number }[]) {
  return pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
      const a = pts[i - 1]
      const cx = (a.x + p.x) / 2
      return `C ${cx.toFixed(1)} ${a.y.toFixed(1)}, ${cx.toFixed(1)} ${p.y.toFixed(1)}, ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    })
    .join(" ")
}

/** Visitantes (línea naranja con área) y páginas vistas (línea dorada) con tooltip al pasar el mouse. */
export function GraficoVisitas({ datos, titulo, soloVistas }: { datos: PuntoVisitas[]; titulo: string; soloVistas?: boolean }) {
  const [activo, setActivo] = useState<number | null>(null)
  const max = Math.max(1, ...datos.map((d) => Math.max(d.vistas, d.visitantes)))
  const paso = datos.length > 1 ? (W - PX * 2) / (datos.length - 1) : 0
  const y = (v: number) => PY + (H - PY * 2) * (1 - v / max)
  const ptsV = datos.map((d, i) => ({ x: PX + i * paso, y: y(d.visitantes) }))
  const ptsP = datos.map((d, i) => ({ x: PX + i * paso, y: y(d.vistas) }))
  const area = ptsV.length > 1 ? `${curva(ptsV)} L ${ptsV.at(-1)!.x} ${H - PY} L ${ptsV[0].x} ${H - PY} Z` : ""
  const marcas = [0, 0.5, 1].map((f) => Math.round(max * f))
  const cadaN = Math.max(1, Math.ceil(datos.length / 8))
  const sel = activo != null ? datos[activo] : null

  return (
    <div className="rounded-xl p-5" style={{ background: "rgba(14,12,34,0.60)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: "rgba(219,172,52,0.65)" }}>Tráfico</p>
          <h3 className="text-sm font-semibold text-white">{titulo}</h3>
        </div>
        <div className="flex gap-4 text-xs" style={{ color: "rgba(244,242,238,0.55)" }}>
          <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#e0642f" }} /> {soloVistas ? "Páginas vistas" : "Visitantes"}</span>
          {!soloVistas && <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-0.5 rounded" style={{ background: "#dbac34" }} /> Páginas vistas</span>}
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" onMouseLeave={() => setActivo(null)} role="img" aria-label={titulo}>
          <defs>
            <linearGradient id="gv-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#e0642f" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#e0642f" stopOpacity="0" />
            </linearGradient>
          </defs>
          {marcas.map((m) => (
            <g key={m}>
              <line x1={PX} x2={W - PX} y1={y(m)} y2={y(m)} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4" />
              <text x={PX - 8} y={y(m) + 3} textAnchor="end" fontSize="10" fill="rgba(244,242,238,0.35)">{m}</text>
            </g>
          ))}
          {area && <path d={area} fill="url(#gv-area)" />}
          {!soloVistas && ptsP.length > 1 && <path d={curva(ptsP)} fill="none" stroke="#dbac34" strokeWidth="1.5" strokeOpacity="0.8" />}
          {ptsV.length > 1 && <path d={curva(ptsV)} fill="none" stroke="#e0642f" strokeWidth="2.5" />}
          {datos.map((d, i) =>
            i === datos.length - 1 || (i % cadaN === 0 && datos.length - 1 - i >= cadaN * 0.6) ? (
              <text key={i} x={PX + i * paso} y={H - 6} textAnchor="middle" fontSize="10" fill="rgba(244,242,238,0.35)">{d.etiqueta}</text>
            ) : null,
          )}
          {activo != null && (
            <g>
              <line x1={ptsV[activo].x} x2={ptsV[activo].x} y1={PY} y2={H - PY} stroke="rgba(255,255,255,0.15)" />
              <circle cx={ptsP[activo].x} cy={ptsP[activo].y} r="3.5" fill="#dbac34" />
              <circle cx={ptsV[activo].x} cy={ptsV[activo].y} r="4.5" fill="#e0642f" stroke="#0e0c22" strokeWidth="2" />
            </g>
          )}
          {/* Zonas de hover */}
          {datos.map((_, i) => (
            <rect key={i} x={PX + i * paso - Math.max(paso, 8) / 2} y={0} width={Math.max(paso, 8)} height={H} fill="transparent" onMouseEnter={() => setActivo(i)} onTouchStart={() => setActivo(i)} />
          ))}
        </svg>
        {sel && activo != null && (
          <div
            className="absolute top-1 pointer-events-none rounded-lg px-3 py-2 text-xs shadow-xl"
            style={{
              left: `${(ptsV[activo].x / W) * 100}%`,
              transform: `translateX(${ptsV[activo].x > W * 0.7 ? "-105%" : "8px"})`,
              background: "#16132f",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p className="font-semibold text-white mb-1">{sel.etiqueta}</p>
            <p style={{ color: "#f4aa82" }}>{soloVistas ? `${sel.vistas} páginas vistas` : `${sel.visitantes} visitantes`}</p>
            {!soloVistas && <p style={{ color: "#e9c96b" }}>{sel.vistas} páginas vistas</p>}
          </div>
        )}
      </div>
    </div>
  )
}
