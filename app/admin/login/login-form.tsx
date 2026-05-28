"use client"

import { useActionState, useState } from "react"
import { loginAction, type LoginState } from "./actions"

const initial: LoginState = {}

export function LoginForm({ from }: { from: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initial)
  const [showPass, setShowPass] = useState(false)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="from" value={from} />

      {/* Username */}
      <div className="space-y-1.5">
        <label htmlFor="username" className="block text-[11px] font-medium uppercase tracking-widest text-white/40">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          autoFocus
          className="input-orion w-full rounded-lg px-3.5 py-2.5 text-sm"
          placeholder="nombre de usuario"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-[11px] font-medium uppercase tracking-widest text-white/40">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            required
            className="input-orion w-full rounded-lg px-3.5 py-2.5 pr-11 text-sm"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition p-1 rounded"
            aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPass ? (
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M11.83 9 15 12.16V12a3 3 0 0 0-3-3h-.17ZM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2ZM2 4.27 4.28 6.55l.45.45A11.8 11.8 0 0 0 1 12s4 8 11 8c1.52 0 2.97-.32 4.32-.86l.4.4L19 21.73 20.27 20.46 3.27 3l-1.27 1.27ZM12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93A11.83 11.83 0 0 0 23 12s-4-8-11-8c-1.18 0-2.32.19-3.38.54l2.17 2.17A4.86 4.86 0 0 1 12 7Z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M12 4C5 4 1 12 1 12s4 8 11 8 11-8 11-8-4-8-11-8Zm0 13a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {state?.error && (
        <div className="flex items-center gap-2.5 rounded-lg border border-red-500/25 bg-red-500/8 text-red-300 text-sm px-3.5 py-2.5">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0 text-red-400">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
          </svg>
          <span>{state.error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="glow-orange w-full rounded-lg text-white font-semibold py-2.5 text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
        style={{
          background: pending
            ? "rgba(224,100,47,0.6)"
            : "linear-gradient(135deg, #e0642f 0%, #c8501e 100%)",
        }}
      >
        {pending ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
              <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Verificando...
          </>
        ) : (
          <>
            Ingresar
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M5 12h12l-4-4 1.41-1.41L20.83 12l-6.42 6.41L13 17l4-4H5Z" />
            </svg>
          </>
        )}
      </button>
    </form>
  )
}
