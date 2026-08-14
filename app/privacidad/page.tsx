import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Qué datos personales recolecta Orion Marketing, para qué los usa y cómo ejercer tus derechos de acceso, rectificación y supresión.",
  alternates: { canonical: "/privacidad" },
}

export default function PrivacidadPage() {
  return <LegalPage doc="privacy" />
}
