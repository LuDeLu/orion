import type { ParsedUA } from "@/lib/ua-parser"

export function DeviceBadge({ device }: { device: ParsedUA["device"] }) {
  const map: Record<ParsedUA["device"], { label: string; bg: string; border: string; color: string; icon: string }> = {
    mobile: {
      label: "Mobile",
      bg: "rgba(52,211,153,0.08)",
      border: "rgba(52,211,153,0.20)",
      color: "rgba(110,231,183,0.90)",
      icon: "M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2Zm-5 22a1.5 1.5 0 0 1 0-3 1.5 1.5 0 0 1 0 3Zm5-5H7V4h10v14Z",
    },
    tablet: {
      label: "Tablet",
      bg: "rgba(56,189,248,0.08)",
      border: "rgba(56,189,248,0.20)",
      color: "rgba(125,211,252,0.90)",
      icon: "M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm-3 14H6V6h12v12Z",
    },
    desktop: {
      label: "Desktop",
      bg: "rgba(219,172,52,0.08)",
      border: "rgba(219,172,52,0.20)",
      color: "rgba(253,224,71,0.85)",
      icon: "M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4ZM4 6h16v10H4V6Z",
    },
    bot: {
      label: "Bot",
      bg: "rgba(224,100,47,0.08)",
      border: "rgba(224,100,47,0.20)",
      color: "rgba(253,186,116,0.90)",
      icon: "M20 9V7c0-1.1-.9-2-2-2h-3V3h-2v2h-2V3H9v2H6c-1.1 0-2 .9-2 2v2H2v6h2v2c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-2h2V9h-2Zm-9 4H9v-2h2v2Zm4 0h-2v-2h2v2Z",
    },
  }

  const it = map[device]
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
      style={{ background: it.bg, border: `1px solid ${it.border}`, color: it.color }}
    >
      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
        <path d={it.icon} />
      </svg>
      {it.label}
    </span>
  )
}

export function OsBadge({ os, label }: { os: ParsedUA["osIcon"]; label: string }) {
  const paths: Record<ParsedUA["osIcon"], string> = {
    apple:
      "M17.05 12.04c.03 3.16 2.76 4.22 2.79 4.23-.02.07-.43 1.46-1.41 2.89-.85 1.24-1.73 2.47-3.12 2.5-1.36.03-1.8-.81-3.36-.81-1.55 0-2.04.78-3.32.83-1.34.05-2.36-1.34-3.22-2.57-1.75-2.54-3.08-7.18-1.29-10.31.89-1.55 2.48-2.53 4.2-2.56 1.31-.03 2.55.88 3.36.88.8 0 2.31-1.09 3.9-.93.66.03 2.52.27 3.71 2.01-.1.06-2.22 1.3-2.2 3.88M14.43 3.74c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.67.77-1.25 2-1.1 3.18 1.15.09 2.32-.59 3.05-1.45",
    android:
      "M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10Zm-3.5-10C1.67 8 1 8.67 1 9.5v7c0 .83.67 1.5 1.5 1.5S4 17.33 4 16.5v-7c0-.83-.67-1.5-1.5-1.5Zm19 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5Zm-4.97-5.84 1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C14.85 1.23 13.46 1 12 1c-1.46 0-2.85.23-4.14.63L6.38.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3C5.46 3.39 4 5.49 4 8h16c0-2.51-1.46-4.61-3.47-5.84ZM10 6H9V5h1v1Zm5 0h-1V5h1v1Z",
    windows: "M3 5.1 10 4v8H3V5.1Zm0 13.8L10 20v-8H3v6.9Zm8 1.2L21 22V12h-10v8.1Zm0-18.2v8H21V2L11 2.1Z",
    linux:
      "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0Zm0 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10Z",
    unknown: "M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 17h-2v-2h2Zm0-4h-2V7h2Z",
  }

  return (
    <span className="inline-flex items-center gap-1.5" style={{ color: "rgba(244,242,238,0.75)" }}>
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" style={{ color: "rgba(244,242,238,0.50)" }}>
        <path d={paths[os]} />
      </svg>
      {label}
    </span>
  )
}
