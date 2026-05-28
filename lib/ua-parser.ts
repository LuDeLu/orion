export type ParsedUA = {
  os: string
  osIcon: "apple" | "android" | "windows" | "linux" | "unknown"
  browser: string
  device: "mobile" | "tablet" | "desktop" | "bot"
  raw: string
}

export function parseUA(ua: string | null | undefined): ParsedUA {
  const raw = ua || ""
  const u = raw.toLowerCase()

  let device: ParsedUA["device"] = "desktop"
  if (/bot|crawler|spider|crawling/.test(u)) device = "bot"
  else if (/ipad|tablet|playbook|silk/.test(u) || (/android/.test(u) && !/mobile/.test(u))) device = "tablet"
  else if (/mobi|iphone|ipod|android.*mobile|windows phone|blackberry|bb10/.test(u)) device = "mobile"

  let os = "Desconocido"
  let osIcon: ParsedUA["osIcon"] = "unknown"
  if (/iphone|ipad|ipod/.test(u)) {
    const m = u.match(/os (\d+[._]\d+)/)
    os = `iOS ${m ? m[1].replace("_", ".") : ""}`.trim()
    osIcon = "apple"
  } else if (/mac os x/.test(u)) {
    const m = u.match(/mac os x (\d+[._]\d+)/)
    os = `macOS ${m ? m[1].replace("_", ".") : ""}`.trim()
    osIcon = "apple"
  } else if (/android/.test(u)) {
    const m = u.match(/android (\d+(\.\d+)?)/)
    os = `Android ${m ? m[1] : ""}`.trim()
    osIcon = "android"
  } else if (/windows nt/.test(u)) {
    const m = u.match(/windows nt (\d+\.\d+)/)
    const ver = m ? m[1] : ""
    const map: Record<string, string> = {
      "10.0": "10/11",
      "6.3": "8.1",
      "6.2": "8",
      "6.1": "7",
    }
    os = `Windows ${map[ver] || ver}`.trim()
    osIcon = "windows"
  } else if (/linux/.test(u)) {
    os = "Linux"
    osIcon = "linux"
  } else if (/cros/.test(u)) {
    os = "ChromeOS"
    osIcon = "linux"
  }

  let browser = "Desconocido"
  if (/edg\//.test(u)) browser = "Edge"
  else if (/opr\/|opera/.test(u)) browser = "Opera"
  else if (/samsungbrowser/.test(u)) browser = "Samsung"
  else if (/firefox|fxios/.test(u)) browser = "Firefox"
  else if (/chrome|crios/.test(u) && !/edg\//.test(u)) browser = "Chrome"
  else if (/safari/.test(u) && !/chrome/.test(u)) browser = "Safari"
  else if (/instagram/.test(u)) browser = "Instagram"
  else if (/fban|fbav/.test(u)) browser = "Facebook"
  else if (/tiktok/.test(u)) browser = "TikTok"
  else if (/linkedinapp/.test(u)) browser = "LinkedIn"

  return { os, osIcon, browser, device, raw }
}

export function countryFlag(code: string | null | undefined): string {
  if (!code || code.length !== 2) return ""
  const cc = code.toUpperCase()
  const base = 0x1f1e6 - 65
  return String.fromCodePoint(base + cc.charCodeAt(0), base + cc.charCodeAt(1))
}

export function countryName(code: string | null | undefined): string {
  if (!code) return ""
  try {
    const dn = new Intl.DisplayNames(["es"], { type: "region" })
    return dn.of(code.toUpperCase()) || code
  } catch {
    return code
  }
}
