import Image from "next/image"
import { LoginForm } from "./login-form"

export const metadata = {
  title: "Acceso · Orion Admin",
  robots: { index: false, follow: false },
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>
}) {
  const { from } = await searchParams

  return (
    <main className="relative min-h-[100dvh] overflow-hidden flex items-center justify-center px-4 py-10 sm:px-6">
      {/* Background */}
      <div aria-hidden className="absolute inset-0 bg-[#07051a]" />

      {/* Orange radial glow — top left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 45% at 15% 10%, rgba(224,100,47,0.14) 0%, transparent 65%), radial-gradient(ellipse 40% 35% at 88% 85%, rgba(219,172,52,0.10) 0%, transparent 60%)",
        }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(55% 50% at 50% 45%, black 0%, transparent 80%)",
        }}
      />

      {/* Card container */}
      <div className="relative w-full max-w-[400px] z-10">

        {/* Logo block */}
        <div className="flex flex-col items-center gap-5 mb-8">
          <div className="relative">
            {/* Glow halo behind logo */}
            <div
              aria-hidden
              className="absolute -inset-8 rounded-full blur-2xl opacity-60"
              style={{ background: "radial-gradient(circle, rgba(224,100,47,0.28) 0%, transparent 70%)" }}
            />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-2xl shadow-black/50">
              <Image
                src="/logo.png"
                alt="Orion Marketing"
                width={96}
                height={96}
                priority
                unoptimized
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
              />
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[11px] tracking-[0.45em] text-white/35 uppercase font-medium">
              Panel Administrativo
            </p>
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-2xl glass-card-strong shadow-2xl shadow-black/60 p-7 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Acceso seguro
            </h1>
            <p className="text-sm text-white/45 mt-1.5 leading-relaxed">
              Ingresá tus credenciales para acceder al registro.
            </p>
          </div>

          {/* Orange divider accent */}
          <div className="h-px w-full mb-6" style={{ background: "linear-gradient(90deg, rgba(224,100,47,0.5), rgba(219,172,52,0.3), transparent)" }} />

          <LoginForm from={from || "/admin"} />
        </div>

        {/* Footer note */}
        <p className="text-center text-white/25 text-[11px] mt-5 tracking-wide">
          Sesión cifrada HMAC · cookie httpOnly · expira en 8h
        </p>
      </div>
    </main>
  )
}
