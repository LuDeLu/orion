import { cookies } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { getAuthCookieName, getSessionSecret, verifySession } from "@/lib/auth"

export const metadata = {
  title: "Admin · Orion",
  robots: { index: false, follow: false },
}

async function getUser() {
  const jar = await cookies()
  const token = jar.get(getAuthCookieName())?.value
  return verifySession(token, getSessionSecret())
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getUser()

  return (
    <div className="min-h-[100dvh] bg-[#07051a] text-white">
      {/* Ambient background gradients */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 45% 35% at 5% 0%, rgba(224,100,47,0.10) 0%, transparent 65%), radial-gradient(ellipse 35% 25% at 98% 5%, rgba(219,172,52,0.07) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 100% 100%, rgba(224,100,47,0.06) 0%, transparent 60%)",
        }}
      />

      {/* ── Sticky Header ──────────────────────────────── */}
      <header className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{ background: "rgba(7,5,26,0.80)", borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

          {/* Brand */}
          <Link
            href="/admin"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="Orion Admin"
          >
            <div
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 group-hover:scale-105"
              style={{ background: "rgba(224,100,47,0.12)", border: "1px solid rgba(224,100,47,0.25)" }}
            >
              <Image
                src="/logo.png"
                alt="Orion"
                width={36}
                height={36}
                priority
                unoptimized
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              />
            </div>
            <div className="leading-tight">
              <div className="text-xs sm:text-sm font-bold tracking-[0.16em] text-white">
                ORION
              </div>
              <div className="text-[8px] sm:text-[9px] uppercase tracking-[0.28em] mt-0.5" style={{ color: "rgba(219,172,52,0.60)" }}>
                Admin Panel
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Navegación principal">
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/scans">Scans</NavLink>
            <NavLink href="/admin/leads">Leads</NavLink>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live indicator + username */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(244,242,238,0.45)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="truncate max-w-[120px]">{session?.username || "—"}</span>
            </span>

            {/* Logout */}
            <a
              href="/admin/logout"
              className="logout-btn inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-lg transition-all duration-150 whitespace-nowrap"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5ZM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5Z" />
              </svg>
              <span className="hidden sm:inline">Salir</span>
            </a>
          </div>
        </div>

        {/* Mobile bottom nav */}
        <nav className="md:hidden flex items-center gap-0.5 px-3 border-t overflow-x-auto" style={{ borderColor: "rgba(255,255,255,0.05)" }} aria-label="Navegación móvil">
          <NavLink href="/admin">Dashboard</NavLink>
          <NavLink href="/admin/scans">Scans</NavLink>
          <NavLink href="/admin/leads">Leads</NavLink>
        </nav>
      </header>

      {/* Main content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-10">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="relative px-3 py-2.5 text-sm font-medium transition-colors duration-150 whitespace-nowrap rounded-md group"
      style={{ color: "rgba(244,242,238,0.50)" }}
    >
      <span className="relative z-10 group-hover:text-white transition-colors duration-150">
        {children}
      </span>
      {/* Hover bg */}
      <span
        className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ background: "rgba(255,255,255,0.04)" }}
        aria-hidden
      />
    </Link>
  )
}
