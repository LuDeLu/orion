"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Cobro, EstadoCobro } from "@/lib/facturacion/modelo"
import { dinero, fechaAr } from "@/lib/facturacion/modelo"
import { Aviso, Boton, Campo, Entrada, Icono, ICONOS, Insignia, Selector, Tarjeta, TEXTO_COBRO, tinta } from "./ui"

const MEDIOS = ["Transferencia bancaria", "Efectivo", "Mercado Pago", "Tarjeta de débito", "Tarjeta de crédito", "Cheque", "Otro"]

interface Props {
  id: string
  total: number
  saldo: number
  moneda: string
  hoy: string
  medioSugerido: string
  cobro?: Cobro
  estado: EstadoCobro
}

export function PanelCobro({ id, total, saldo, moneda, hoy, medioSugerido, cobro, estado }: Props) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [fecha, setFecha] = useState(hoy)
  const [medio, setMedio] = useState(cobro?.medio ?? (MEDIOS.includes(medioSugerido) ? medioSugerido : MEDIOS[0]))
  // Si ya hubo un pago parcial, se propone el total acumulado
  const [monto, setMonto] = useState(String((cobro?.monto ?? 0) + saldo))
  const [nota, setNota] = useState(cobro?.nota ?? "")
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState("")

  async function llamar(cuerpo: unknown) {
    setOcupado(true)
    setError("")
    try {
      const r = await fetch(`/api/admin/facturacion/documentos/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cuerpo),
      })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j.error ?? "No se pudo guardar")
      setAbierto(false)
      router.refresh()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setOcupado(false)
    }
  }

  const t = TEXTO_COBRO[estado]

  return (
    <Tarjeta titulo="Cobro" accion={<Insignia estado={t.estado} texto={t.texto} />}>
      {cobro && (
        <dl className="space-y-1.5 text-sm mb-3">
          <Fila etiqueta="Cobrado" valor={dinero(cobro.monto, moneda)} />
          <Fila etiqueta="Fecha" valor={fechaAr(cobro.fecha)} />
          <Fila etiqueta="Medio" valor={cobro.medio} />
          {cobro.nota && <Fila etiqueta="Nota" valor={cobro.nota} />}
        </dl>
      )}
      {saldo > 0 && (
        <p className="text-sm mb-3" style={{ color: tinta.media }}>
          Resta cobrar <b className="text-white tabular">{dinero(saldo, moneda)}</b>
          {saldo < total && !cobro ? " (descontadas las notas de crédito)" : ""}
        </p>
      )}

      {abierto ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Campo etiqueta="Fecha">
              <Entrada type="date" value={fecha} max={hoy} onChange={(e) => setFecha(e.target.value)} />
            </Campo>
            <Campo etiqueta="Monto cobrado" ayuda="total acumulado">
              <Entrada type="number" min={0} step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} />
            </Campo>
          </div>
          <Campo etiqueta="Medio de pago">
            <Selector value={medio} onChange={(e) => setMedio(e.target.value)}>
              {MEDIOS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </Selector>
          </Campo>
          <Campo etiqueta="Nota" ayuda="opcional">
            <Entrada placeholder="Ej.: transferencia Banco Galicia" value={nota} onChange={(e) => setNota(e.target.value)} />
          </Campo>
          {error && <Aviso tono="error">{error}</Aviso>}
          <div className="flex gap-2 justify-end">
            <Boton onClick={() => setAbierto(false)}>Cancelar</Boton>
            <Boton variante="primario" disabled={ocupado} onClick={() => llamar({ accion: "cobro", fecha, medio, monto: Number(monto), nota })}>
              <Icono d={ICONOS.check} />
              {ocupado ? "Guardando…" : "Guardar cobro"}
            </Boton>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {estado !== "anulada" && (
            <Boton variante={cobro ? "fantasma" : "primario"} className="flex-1" onClick={() => setAbierto(true)}>
              <Icono d={cobro ? ICONOS.lapiz : ICONOS.check} />
              {cobro ? (saldo > 0 ? "Registrar otro pago" : "Editar cobro") : "Marcar como cobrada"}
            </Boton>
          )}
          {cobro && (
            <Boton
              variante="peligro"
              disabled={ocupado}
              onClick={() => confirm("¿Anular el cobro registrado? La factura vuelve a quedar a cobrar.") && llamar({ accion: "anularCobro" })}
            >
              Anular cobro
            </Boton>
          )}
          {error && <div className="w-full"><Aviso tono="error">{error}</Aviso></div>}
        </div>
      )}
    </Tarjeta>
  )
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt style={{ color: tinta.suave }}>{etiqueta}</dt>
      <dd className="text-right tabular" style={{ color: tinta.media }}>{valor}</dd>
    </div>
  )
}
