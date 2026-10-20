import type { Metadata } from "next"
import { headers } from "next/headers"
import { getSeguimiento, MintakaError } from "@/lib/mintaka"
import { PortalError } from "@/components/it/portal-ui"
import { SeguimientoVista } from "@/components/it/seguimiento-vista"

/**
 * Seguimiento de una reparación. Es la pantalla que abre el QR pegado en el
 * equipo, así que entra gente desde el celular, sin sesión y sin saber qué es
 * un token. Todo lo que muestra sale de `GET /api/portal/seguimiento/:token`,
 * que ya viene filtrado: nada de costos, notas internas ni datos del taller.
 */

export const dynamic = "force-dynamic"

// Es una URL privada por token: no queremos que la indexe nadie.
export const metadata: Metadata = {
  title: "Seguimiento de tu reparación",
  description: "Mirá en qué anda tu equipo en el taller de Orion IT.",
  robots: { index: false, follow: false, nocache: true },
}

export default async function SeguimientoPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const ip = (await headers()).get("x-forwarded-for")

  try {
    const datos = await getSeguimiento(token, ip)
    return <SeguimientoVista datos={datos} />
  } catch (err) {
    if (err instanceof MintakaError && err.esTokenInvalido) {
      return (
        <PortalError
          titulo="No encontramos ese seguimiento"
          mensaje="El código del QR no corresponde a ninguna orden activa. Puede que la orden se haya dado de baja o que el link esté incompleto."
          detalle="Si escaneaste el QR de tu comprobante, escribinos y te pasamos el estado a mano."
        />
      )
    }

    return (
      <PortalError
        titulo="No pudimos traer el estado"
        mensaje={
          err instanceof MintakaError
            ? err.message
            : "Tuvimos un problema para consultar el sistema."
        }
        detalle="Probá de nuevo en unos minutos."
      />
    )
  }
}
