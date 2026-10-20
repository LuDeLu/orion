import type { Metadata } from "next"
import { PedirAcceso } from "@/components/it/pedir-acceso"

/** Puerta del portal: el cliente pide su link mágico por mail. */

export const metadata: Metadata = {
  title: "Entrá a tu portal",
  description: "Accedé a tus reparaciones, tickets, equipos y comprobantes de Orion IT.",
  robots: { index: false, follow: false },
}

export default function EntrarPage() {
  return <PedirAcceso />
}
