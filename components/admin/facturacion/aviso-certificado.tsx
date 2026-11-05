// Aviso de vencimiento del certificado de ARCA. Server component: se usa en el
// dashboard y en Facturación para que no pase desapercibido.
import Link from "next/link"
import { estadoCertificado } from "@/lib/facturacion/arca"
import { leerConfig } from "@/lib/facturacion/config"
import { Aviso } from "./ui"

/** Con cuántos días de anticipación se avisa (renovar lleva unos minutos, pero hay que acordarse). */
export const DIAS_AVISO_CERTIFICADO = 45

export async function AvisoCertificado() {
  let dias: number | undefined
  let entorno = "produccion"
  try {
    const cfg = await leerConfig()
    entorno = cfg.entorno
    dias = (await estadoCertificado(cfg.entorno)).certificado?.diasRestantes
  } catch {
    return null // sin certificado o sin base: el aviso no debe romper la página
  }
  if (dias === undefined || dias >= DIAS_AVISO_CERTIFICADO) return null
  return (
    <Aviso tono={dias < 0 ? "error" : dias < 15 ? "error" : "alerta"}>
      {dias < 0 ? (
        <>
          <b>El certificado de ARCA venció</b> ({entorno === "produccion" ? "producción" : "homologación"}): no se pueden emitir facturas hasta renovarlo.
        </>
      ) : (
        <>
          El certificado de ARCA ({entorno === "produccion" ? "producción" : "homologación"}) vence en <b>{dias} {dias === 1 ? "día" : "días"}</b>.
        </>
      )}{" "}
      Generá un pedido nuevo en{" "}
      <Link href="/admin/facturacion/configuracion" className="underline font-medium">
        Facturación → Configuración
      </Link>
      , subilo a ARCA con el mismo alias y cargá el .crt nuevo.
    </Aviso>
  )
}
