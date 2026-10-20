import type { Metadata } from "next"
import { headers } from "next/headers"
import { getPanelCliente, MintakaError } from "@/lib/mintaka"
import { PortalError } from "@/components/it/portal-ui"
import { PanelVista } from "@/components/it/panel-vista"

/**
 * Panel del cliente. Se entra con el link mágico que manda el sistema por mail;
 * el token vence (24 h por defecto) y el backend lo marca como usado.
 */

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Tu portal",
  description: "Tus reparaciones, tickets, equipos y comprobantes.",
  robots: { index: false, follow: false, nocache: true },
}

export default async function PanelPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const ip = (await headers()).get("x-forwarded-for")

  try {
    const datos = await getPanelCliente(token, ip)
    return <PanelVista datos={datos} token={token} />
  } catch (err) {
    if (err instanceof MintakaError && err.esTokenInvalido) {
      return (
        <PortalError
          titulo="Tu link ya no sirve"
          mensaje="Los links de acceso vencen por seguridad. Pedí uno nuevo y te llega al toque."
          detalle="Entrá a orionmkt.com.ar/it/entrar y poné tu mail."
        />
      )
    }

    return (
      <PortalError
        titulo="No pudimos abrir tu portal"
        mensaje={
          err instanceof MintakaError ? err.message : "Tuvimos un problema para consultar el sistema."
        }
        detalle="Probá de nuevo en unos minutos."
      />
    )
  }
}
