type Accent = "orange" | "gold" | "emerald" | "sky" | "rose"

type Props = {
  label: string
  value: string | number
  hint?: string
  accent?: Accent
  icon?: React.ReactNode
}

const accentStyles: Record<Accent, { bg: string; border: string; icon: string; bar: string }> = {
  orange: {
    bg: "rgba(224,100,47,0.08)",
    border: "rgba(224,100,47,0.18)",
    icon: "rgba(224,100,47,0.70)",
    bar: "#e0642f",
  },
  gold: {
    bg: "rgba(219,172,52,0.08)",
    border: "rgba(219,172,52,0.18)",
    icon: "rgba(219,172,52,0.70)",
    bar: "#dbac34",
  },
  emerald: {
    bg: "rgba(52,211,153,0.07)",
    border: "rgba(52,211,153,0.16)",
    icon: "rgba(52,211,153,0.65)",
    bar: "#34d399",
  },
  sky: {
    bg: "rgba(56,189,248,0.07)",
    border: "rgba(56,189,248,0.16)",
    icon: "rgba(56,189,248,0.65)",
    bar: "#38bdf8",
  },
  rose: {
    bg: "rgba(251,113,133,0.07)",
    border: "rgba(251,113,133,0.16)",
    icon: "rgba(251,113,133,0.65)",
    bar: "#fb7185",
  },
}

export function StatCard({ label, value, hint, accent = "orange", icon }: Props) {
  const a = accentStyles[accent]
  return (
    <div
      className="relative overflow-hidden rounded-xl p-3.5 sm:p-4 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: `rgba(14,12,34,0.70)`,
        border: `1px solid ${a.border}`,
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Subtle top accent glow */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, ${a.bar}60, transparent)` }}
      />

      <div className="flex items-start justify-between gap-2">
        <div
          className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest leading-tight"
          style={{ color: "rgba(244,242,238,0.45)" }}
        >
          {label}
        </div>
        {icon && (
          <div className="shrink-0" style={{ color: a.icon }}>
            {icon}
          </div>
        )}
      </div>

      <div
        className="mt-2 sm:mt-2.5 text-2xl sm:text-3xl font-bold tracking-tight text-white tabular truncate"
      >
        {value}
      </div>

      {hint && (
        <div className="mt-1 text-[10px] sm:text-xs truncate" style={{ color: "rgba(244,242,238,0.38)" }}>
          {hint}
        </div>
      )}

      {/* Bottom accent bar */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] w-1/3 rounded-full"
        style={{ background: a.bar, opacity: 0.45 }}
      />
    </div>
  )
}
