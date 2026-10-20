import Link from "next/link"
import { leerConfig } from "@/lib/facturacion/config"
import { estadoCertificado } from "@/lib/facturacion/arca"
import { usaRedis } from "@/lib/kv"
import { PanelConfiguracion } from "@/components/admin/facturacion/panel-configuracion"
import { EncabezadoPagina, tinta } from "@/components/admin/facturacion/ui"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const metadata = { title: "Configuración de facturación · Orion" }

export default async function ConfiguracionPage() {
  const cfg = await leerConfig()
  const cert = await estadoCertificado(cfg.entorno)
  return (
    <div className="space-y-6">
      <div className="text-xs" style={{ color: tinta.suave }}>
        <Link href="/admin/facturacion" className="hover:text-white transition-colors">← Facturación</Link>
      </div>
      <EncabezadoPagina antetitulo="Facturación" titulo="Configuración de ARCA" bajada="Certificado, datos del emisor y preferencias de los PDF." />
      <PanelConfiguracion
        configInicial={cfg}
        certInicial={cert}
        almacenamiento={usaRedis ? "redis" : "local"}
        cuitFijo={!!process.env.ARCA_CUIT}
        enVercel={!!process.env.VERCEL}
      />
    </div>
  )
}
