"use client"

import { useState } from "react"
import { COLORES, nuevoId, type Tablero } from "@/lib/crm/modelo"
import { useCrm } from "./use-crm"
import { BotonCerrar, Modal, Seccion, t } from "./piezas"

function SelectorColor({ valor, onCambio }: { valor: string; onCambio: (c: string) => void }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <div className="relative">
      <button type="button" onClick={() => setAbierto((v) => !v)} className="w-6 h-6 rounded-full shrink-0" style={{ background: valor }} aria-label="Cambiar color" />
      {abierto && (
        <div className="absolute z-10 top-8 left-0 flex flex-wrap gap-1.5 p-2 rounded-lg w-[150px]" style={{ background: "#1b1838", border: `1px solid ${t.borde}` }}>
          {COLORES.map((c) => (
            <button key={c} type="button" onClick={() => (onCambio(c), setAbierto(false))} className="w-6 h-6 rounded-full" style={{ background: c }} aria-label={c} />
          ))}
        </div>
      )}
    </div>
  )
}

/** Editor de columnas y etiquetas del tablero. Los cambios se aplican al tocar Guardar. */
export function AjustesTablero({ onCerrar }: { onCerrar: () => void }) {
  const { datos, guardarTablero } = useCrm()
  const [tb, setTb] = useState<Tablero>(structuredClone(datos.tablero))
  const conteo = (id: string) => datos.tareas.filter((x) => x.columnaId === id).length

  const setCol = (i: number, c: Partial<Tablero["columnas"][number]>) => setTb((x) => ({ ...x, columnas: x.columnas.map((col, j) => (j === i ? { ...col, ...c } : col)) }))
  const mover = (i: number, d: number) =>
    setTb((x) => {
      const cols = [...x.columnas]
      const j = i + d
      if (j < 0 || j >= cols.length) return x
      ;[cols[i], cols[j]] = [cols[j], cols[i]]
      return { ...x, columnas: cols }
    })

  return (
    <Modal abierto onCerrar={onCerrar} etiqueta="Ajustes del tablero" ancho="max-w-2xl">
      <div className="flex items-center justify-between p-4 sm:p-5 border-b" style={{ borderColor: t.borde }}>
        <h2 className="text-lg font-bold text-white">Ajustes del tablero</h2>
        <BotonCerrar onClick={onCerrar} />
      </div>
      <div className="p-4 sm:p-5 space-y-6">
        <Seccion titulo="Columnas">
          <ul className="space-y-1.5">
            {tb.columnas.map((c, i) => (
              <li key={c.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <SelectorColor valor={c.color} onCambio={(color) => setCol(i, { color })} />
                <input value={c.nombre} onChange={(e) => setCol(i, { nombre: e.target.value })} className="input-orion flex-1 min-w-0 rounded-md px-2 py-1 text-sm" />
                <label className="flex items-center gap-1 text-xs shrink-0 cursor-pointer" style={{ color: t.suave }} title="Las tareas acá cuentan como terminadas">
                  <input type="checkbox" checked={c.hecho} onChange={(e) => setCol(i, { hecho: e.target.checked })} className="accent-[#34d399]" />
                  Terminadas
                </label>
                <span className="text-[11px] tabular w-6 text-right" style={{ color: t.tenue }}>{conteo(c.id)}</span>
                <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} className="text-xs px-1 disabled:opacity-20" style={{ color: t.suave }} aria-label="Mover a la izquierda">←</button>
                <button type="button" onClick={() => mover(i, 1)} disabled={i === tb.columnas.length - 1} className="text-xs px-1 disabled:opacity-20" style={{ color: t.suave }} aria-label="Mover a la derecha">→</button>
                <button
                  type="button"
                  disabled={tb.columnas.length === 1}
                  onClick={() => {
                    const n = conteo(c.id)
                    if (n && !confirm(`"${c.nombre}" tiene ${n} tareas. Van a pasar a la primera columna. ¿Seguro?`)) return
                    setTb((x) => ({ ...x, columnas: x.columnas.filter((_, j) => j !== i) }))
                  }}
                  className="text-xs px-1 hover:text-rose-300 disabled:opacity-20"
                  style={{ color: t.tenue }}
                  aria-label="Eliminar columna"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setTb((x) => ({ ...x, columnas: [...x.columnas, { id: nuevoId(), nombre: "Nueva columna", color: COLORES[x.columnas.length % COLORES.length], hecho: false }] }))} className="mt-2 text-sm" style={{ color: "#e0642f" }}>
            + Agregar columna
          </button>
        </Seccion>

        <Seccion titulo="Etiquetas">
          <ul className="grid sm:grid-cols-2 gap-1.5">
            {tb.etiquetas.map((e, i) => (
              <li key={e.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5" style={{ background: "rgba(255,255,255,0.03)" }}>
                <SelectorColor valor={e.color} onCambio={(color) => setTb((x) => ({ ...x, etiquetas: x.etiquetas.map((y, j) => (j === i ? { ...y, color } : y)) }))} />
                <input value={e.nombre} onChange={(ev) => setTb((x) => ({ ...x, etiquetas: x.etiquetas.map((y, j) => (j === i ? { ...y, nombre: ev.target.value } : y)) }))} className="input-orion flex-1 min-w-0 rounded-md px-2 py-1 text-sm" />
                <button type="button" onClick={() => setTb((x) => ({ ...x, etiquetas: x.etiquetas.filter((_, j) => j !== i) }))} className="text-xs px-1 hover:text-rose-300" style={{ color: t.tenue }} aria-label="Eliminar etiqueta">✕</button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => setTb((x) => ({ ...x, etiquetas: [...x.etiquetas, { id: nuevoId(), nombre: "Nueva etiqueta", color: COLORES[x.etiquetas.length % COLORES.length] }] }))} className="mt-2 text-sm" style={{ color: "#e0642f" }}>
            + Agregar etiqueta
          </button>
        </Seccion>
      </div>
      <div className="flex justify-end gap-2 p-4 sm:p-5 border-t" style={{ borderColor: t.borde }}>
        <button type="button" onClick={onCerrar} className="logout-btn rounded-lg px-4 py-2 text-sm">Cancelar</button>
        <button
          type="button"
          onClick={() => {
            guardarTablero(tb)
            onCerrar()
          }}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          style={{ background: "linear-gradient(135deg,#e0642f,#c9521f)" }}
        >
          Guardar
        </button>
      </div>
    </Modal>
  )
}
