import { SubnavFacturacion } from "@/components/admin/facturacion/subnav"

export default function FacturacionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <SubnavFacturacion />
      {children}
    </div>
  )
}
