"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { tinta } from "./ui"

const SECCIONES = [
  { href: "/admin/facturacion", nombre: "Comprobantes", exacto: true },
  { href: "/admin/facturacion/clientes", nombre: "Clientes" },
  { href: "/admin/facturacion/abonos", nombre: "Abonos" },
  { href: "/admin/facturacion/catalogo", nombre: "Catálogo" },
  { href: "/admin/facturacion/actividad", nombre: "Actividad" },
  { href: "/admin/facturacion/configuracion", nombre: "Configuración" },
]

export function SubnavFacturacion() {
  const ruta = usePathname()
  // En el detalle de un comprobante o en "nuevo" se considera la sección Comprobantes
  const activa = (s: (typeof SECCIONES)[number]) =>
    s.exacto ? !SECCIONES.some((x) => !x.exacto && ruta.startsWith(x.href)) && ruta.startsWith(s.href) : ruta.startsWith(s.href)

  return (
    <nav aria-label="Secciones de facturación" className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
      <div className="inline-flex gap-1 p-1 rounded-xl whitespace-nowrap" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {SECCIONES.map((s) => {
          const on = activa(s)
          return (
            <Link
              key={s.href}
              href={s.href}
              aria-current={on ? "page" : undefined}
              className="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:text-white"
              style={on ? { background: "rgba(224,100,47,0.18)", color: "#fff", boxShadow: "inset 0 0 0 1px rgba(224,100,47,0.45)" } : { color: tinta.suave }}
            >
              {s.nombre}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
