import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description:
    "Condiciones de uso del sitio de Orion Marketing, alcance de las propuestas y presupuestos, propiedad intelectual y ley aplicable.",
  alternates: { canonical: "/terminos" },
}

export default function TerminosPage() {
  return <LegalPage doc="terms" />
}
