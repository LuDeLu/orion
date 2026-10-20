"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Aviso, Boton, BotonLink, Icono, ICONOS } from "./ui"

interface Props {
  id: string
  clase: "factura" | "presupuesto"
  estado: string
  pdf: string
  puedeAjustar: boolean
}

export function AccionesDocumento({ id, clase, estado, pdf, puedeAjustar }: Props) {
  const router = useRouter()
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState("")
  const q = encodeURIComponent(id)

  async function llamar(metodo: "PATCH" | "DELETE", cuerpo?: unknown) {
    setOcupado(true)
    setError("")
    try {
      const r = await fetch(`/api/admin/facturacion/documentos/${q}`, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: cuerpo ? JSON.stringify(cuerpo) : undefined,
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j.error ?? "No se pudo completar la acción")
      if (metodo === "DELETE") router.push("/admin/facturacion")
      router.refresh()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setOcupado(false)
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <a href={`${pdf}?descargar=1`} className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:brightness-110" style={{ background: "linear-gradient(135deg,#e0642f,#c9521f)" }}>
          <Icono d={ICONOS.descargar} /> PDF
        </a>
        <a
          href={clase === "factura" ? `${pdf}?copias=2` : pdf}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:brightness-110"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(244,242,238,0.75)" }}
          title={clase === "factura" ? "Abre original y duplicado para imprimir" : "Abrir en otra pestaña"}
        >
          <Icono d={ICONOS.pdf} /> {clase === "factura" ? "Imprimir" : "Abrir"}
        </a>
      </div>

      {clase === "factura" && estado === "pendiente" && (
        <Boton variante="secundario" className="w-full" disabled={ocupado} onClick={() => llamar("PATCH", { accion: "verificar" })}>
          {ocupado ? "Consultando…" : "Verificar en ARCA"}
        </Boton>
      )}

      {puedeAjustar && (
        <div className="grid grid-cols-2 gap-2">
          <BotonLink href={`/admin/facturacion/nuevo?nc=${q}`} variante="peligro">
            <Icono d={ICONOS.deshacer} className="w-3.5 h-3.5" /> Nota de crédito
          </BotonLink>
          <BotonLink href={`/admin/facturacion/nuevo?nd=${q}`}>Nota de débito</BotonLink>
        </div>
      )}

      {clase === "presupuesto" && estado !== "facturado" && (
        <>
          <BotonLink href={`/admin/facturacion/nuevo?presupuesto=${q}`} variante="secundario" className="w-full">
            <Icono d={ICONOS.rayo} /> Facturar este presupuesto
          </BotonLink>
          <div className="grid grid-cols-2 gap-2">
            {estado !== "aceptado" ? (
              <Boton disabled={ocupado} onClick={() => llamar("PATCH", { accion: "estado", estado: "aceptado" })}>
                <Icono d={ICONOS.check} className="w-3.5 h-3.5" /> Aceptado
              </Boton>
            ) : (
              <Boton disabled={ocupado} onClick={() => llamar("PATCH", { accion: "estado", estado: "vigente" })}>
                Volver a vigente
              </Boton>
            )}
            {estado !== "rechazado" ? (
              <Boton disabled={ocupado} onClick={() => llamar("PATCH", { accion: "estado", estado: "rechazado" })}>
                <Icono d={ICONOS.cruz} className="w-3.5 h-3.5" /> Rechazado
              </Boton>
            ) : (
              <Boton disabled={ocupado} onClick={() => llamar("PATCH", { accion: "estado", estado: "vigente" })}>
                Volver a vigente
              </Boton>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <BotonLink href={`/admin/facturacion/nuevo?editar=${q}`}>Editar</BotonLink>
            <Boton
              variante="peligro"
              disabled={ocupado}
              onClick={() => confirm("¿Eliminar este presupuesto? No se puede deshacer.") && llamar("DELETE")}
            >
              <Icono d={ICONOS.basura} className="w-3.5 h-3.5" /> Eliminar
            </Boton>
          </div>
        </>
      )}

      <BotonLink href={`/admin/facturacion/nuevo?desde=${q}`} className="w-full">
        <Icono d={ICONOS.copiar} className="w-3.5 h-3.5" /> Duplicar
      </BotonLink>

      {error && <Aviso tono="error">{error}</Aviso>}
    </div>
  )
}
