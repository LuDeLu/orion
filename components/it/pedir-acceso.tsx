"use client"

import { useState } from "react"
import { Loader2, MailCheck, Send } from "lucide-react"
import { mensajeDeError, portalPost } from "@/lib/portal-cliente"
import { Carta, Marco } from "./portal-ui"

const ACENTO = "var(--area-it)"

/**
 * Pedido de link mágico. No hay contraseñas en el portal: el cliente pone su
 * mail y le llega un link con vencimiento.
 *
 * La respuesta del backend es siempre la misma exista o no el mail, así que no
 * se puede usar esta pantalla para averiguar quién es cliente nuestro.
 */
export function PedirAcceso() {
  const [email, setEmail] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [listo, setListo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      const r = await portalPost<{ mensaje: string }>("acceso/solicitar", {
        email: email.trim().toLowerCase(),
      })
      setListo(r.mensaje)
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Marco
      titulo="Entrá a tu portal"
      bajada="Mirá tus equipos en reparación, tus tickets de soporte, tus visitas y tus comprobantes. Sin contraseñas: te mandamos un link al mail."
    >
      <div className="max-w-lg">
        <Carta>
          {listo ? (
            <div className="flex flex-col items-center py-6 text-center">
              <MailCheck className="h-12 w-12" style={{ color: ACENTO }} />
              <p className="mt-4 text-foreground/75">{listo}</p>
              <p className="mt-2 text-sm text-foreground/45">
                Si no lo ves, fijate en correo no deseado.
              </p>
            </div>
          ) : (
            <form onSubmit={enviar} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
                  Tu email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@empresa.com.ar"
                  autoComplete="email"
                  className="input-orion h-11 w-full rounded-xl px-3 text-sm"
                />
              </label>

              {error && (
                <p
                  className="rounded-xl p-3 text-sm"
                  style={{
                    background: "rgba(224,82,82,0.12)",
                    border: "1px solid rgba(224,82,82,0.28)",
                    color: "var(--destructive)",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={enviando || !email.trim()}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: ACENTO }}
              >
                {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Mandame el link
              </button>

              <p className="text-xs text-foreground/40">
                Tiene que ser el mail que nos diste cuando abrimos tu ficha. Si no lo recordás,
                escribinos por WhatsApp.
              </p>
            </form>
          )}
        </Carta>
      </div>
    </Marco>
  )
}
