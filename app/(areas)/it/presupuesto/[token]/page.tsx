import type { Metadata } from "next"
import { headers } from "next/headers"
import { getMotivosRechazo, getPresupuesto, MintakaError } from "@/lib/mintaka"
import { PortalError } from "@/components/it/portal-ui"
import { PresupuestoVista } from "@/components/it/presupuesto-vista"

/**
 * Presupuesto online: el cliente lo mira, elige los opcionales y lo aprueba
 * o lo rechaza sin instalar nada. La aprobación es la que después dispara la
 * orden / el proyecto / el contrato del lado del sistema.
 *
 * Los costos y márgenes nunca llegan hasta acá: el backend ya los filtra.
 */

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Tu presupuesto",
  description: "Mirá el detalle y aprobalo online.",
  robots: { index: false, follow: false, nocache: true },
}

export default async function PresupuestoPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const ip = (await headers()).get("x-forwarded-for")

  try {
    // Los motivos son un catálogo chico: si falla, seguimos sin la lista.
    const [datos, motivos] = await Promise.all([
      getPresupuesto(token, ip),
      getMotivosRechazo(ip).catch(() => []),
    ])

    return <PresupuestoVista datos={datos} motivos={motivos} token={token} />
  } catch (err) {
    if (err instanceof MintakaError && err.esTokenInvalido) {
      return (
        <PortalError
          titulo="No encontramos ese presupuesto"
          mensaje="El link no corresponde a ningún presupuesto vigente. Puede que se haya dado de baja o que esté incompleto."
          detalle="Escribinos y te lo mandamos de nuevo."
        />
      )
    }

    return (
      <PortalError
        titulo="No pudimos abrir el presupuesto"
        mensaje={
          err instanceof MintakaError ? err.message : "Tuvimos un problema para consultar el sistema."
        }
        detalle="Probá de nuevo en unos minutos."
      />
    )
  }
}
