"use client"

import { useState } from "react"
import { AREAS, COLORES, ESTADOS_CLIENTE, RESPONSABLES, type Cliente } from "@/lib/crm/modelo"
import { useCrm } from "./use-crm"
import { BotonCerrar, Chip, Modal, t } from "./piezas"

const VACIO: Partial<Cliente> = { nombre: "", contacto: "", cuit: "", email: "", telefono: "", web: "", rubro: "", estado: "activo", areas: [], responsable: "", notas: "" }

function Campo({ etiqueta, children, className = "" }: { etiqueta: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: t.suave }}>{etiqueta}</span>
      {children}
    </label>
  )
}

const input = "input-orion w-full rounded-lg px-3 py-2 text-sm"

/** Alta y edición de clientes. Con CUIT completo trae razón social y domicilio de ARCA (si está configurado). */
export function ModalCliente({ cliente, onCerrar, onCreado }: { cliente?: Cliente | null; onCerrar: () => void; onCreado?: (c: Cliente) => void }) {
  const { crearCliente, actualizarCliente } = useCrm()
  const [f, setF] = useState<Partial<Cliente>>(cliente ?? { ...VACIO, color: COLORES[Math.floor(Math.random() * COLORES.length)] })
  const [buscando, setBuscando] = useState(false)
  const [aviso, setAviso] = useState("")
  const [guardando, setGuardando] = useState(false)
  const set = <K extends keyof Cliente>(k: K, v: Cliente[K]) => setF((x) => ({ ...x, [k]: v }))

  async function buscarCuit(valor: string) {
    const d = valor.replace(/\D/g, "")
    if (d.length !== 11) return
    setBuscando(true)
    setAviso("")
    try {
      const r = await fetch(`/api/admin/facturacion/padron?doc=${d}`)
      const j = await r.json()
      if (!r.ok) throw new Error(j.error)
      setF((x) => ({ ...x, nombre: x.nombre || j.cliente.nombre, email: x.email || j.cliente.email }))
      setAviso(`ARCA: ${j.cliente.nombre}${j.cliente.domicilio ? ` · ${j.cliente.domicilio}` : ""}`)
    } catch (e) {
      setAviso(`No se pudo consultar ARCA (${(e as Error).message}). Completá a mano.`)
    } finally {
      setBuscando(false)
    }
  }

  async function guardar() {
    if (!f.nombre?.trim()) return setAviso("Poné al menos el nombre del cliente.")
    setGuardando(true)
    const r = cliente ? await actualizarCliente(cliente.id, f) : await crearCliente(f)
    setGuardando(false)
    if (r) {
      if (!cliente) onCreado?.(r as Cliente)
      onCerrar()
    }
  }

  return (
    <Modal abierto onCerrar={onCerrar} etiqueta={cliente ? "Editar cliente" : "Nuevo cliente"} ancho="max-w-2xl">
      <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b" style={{ borderColor: t.borde }}>
        <h2 className="text-lg font-bold text-white">{cliente ? "Editar cliente" : "Nuevo cliente"}</h2>
        <BotonCerrar onClick={onCerrar} />
      </div>
      <div className="p-4 sm:p-5 grid sm:grid-cols-2 gap-3">
        <Campo etiqueta="Nombre o empresa" className="sm:col-span-2">
          <input autoFocus value={f.nombre ?? ""} onChange={(e) => set("nombre", e.target.value)} className={input} placeholder="Ej.: Pinturerías del Sur" />
        </Campo>
        <Campo etiqueta={buscando ? "CUIT — buscando en ARCA…" : "CUIT (opcional, autocompleta)"}>
          <input value={f.cuit ?? ""} onChange={(e) => set("cuit", e.target.value)} onBlur={(e) => buscarCuit(e.target.value)} inputMode="numeric" className={input} placeholder="30-12345678-9" />
        </Campo>
        <Campo etiqueta="Persona de contacto">
          <input value={f.contacto ?? ""} onChange={(e) => set("contacto", e.target.value)} className={input} />
        </Campo>
        <Campo etiqueta="Email">
          <input type="email" value={f.email ?? ""} onChange={(e) => set("email", e.target.value)} className={input} />
        </Campo>
        <Campo etiqueta="Teléfono / WhatsApp">
          <input value={f.telefono ?? ""} onChange={(e) => set("telefono", e.target.value)} className={input} placeholder="+54 9 11 …" />
        </Campo>
        <Campo etiqueta="Web o red social">
          <input value={f.web ?? ""} onChange={(e) => set("web", e.target.value)} className={input} />
        </Campo>
        <Campo etiqueta="Rubro">
          <input value={f.rubro ?? ""} onChange={(e) => set("rubro", e.target.value)} className={input} placeholder="Gastronomía, salud, retail…" />
        </Campo>
        {aviso && <p className="sm:col-span-2 text-xs" style={{ color: "rgba(253,230,138,0.9)" }}>{aviso}</p>}

        <div className="sm:col-span-2">
          <span className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: t.suave }}>Estado</span>
          <div className="flex flex-wrap gap-1">
            {ESTADOS_CLIENTE.map((e) => (
              <Chip key={e.id} activo={f.estado === e.id} onClick={() => set("estado", e.id)} color={e.color}>{e.nombre}</Chip>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <span className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: t.suave }}>Áreas contratadas</span>
          <div className="flex flex-wrap gap-1">
            {AREAS.filter((a) => a.id !== "general").map((a) => (
              <Chip
                key={a.id}
                activo={!!f.areas?.includes(a.id)}
                onClick={() => set("areas", f.areas?.includes(a.id) ? f.areas.filter((x) => x !== a.id) : [...(f.areas ?? []), a.id])}
                color={a.color}
              >
                {a.nombre}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: t.suave }}>Socio a cargo</span>
          <div className="flex flex-wrap gap-1">
            {RESPONSABLES.map((r) => (
              <Chip key={r.id} activo={f.responsable === r.id} onClick={() => set("responsable", f.responsable === r.id ? "" : r.id)} color={r.color}>
                {r.nombre.split(" ")[0]}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <span className="block text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: t.suave }}>Color</span>
          <div className="flex flex-wrap gap-1.5">
            {COLORES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set("color", c)}
                className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                style={{ background: c, boxShadow: f.color === c ? `0 0 0 2px #0f0d24, 0 0 0 4px ${c}` : undefined }}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>
        <Campo etiqueta="Notas" className="sm:col-span-2">
          <textarea value={f.notas ?? ""} onChange={(e) => set("notas", e.target.value)} rows={4} className={`${input} resize-y`} placeholder="Acuerdos, accesos, preferencias, fee mensual…" />
        </Campo>
      </div>
      <div className="flex justify-end gap-2 p-4 sm:p-5 border-t" style={{ borderColor: t.borde }}>
        <button type="button" onClick={onCerrar} className="logout-btn rounded-lg px-4 py-2 text-sm">Cancelar</button>
        <button type="button" onClick={guardar} disabled={guardando} className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50" style={{ background: "linear-gradient(135deg,#e0642f,#c9521f)" }}>
          {guardando ? "Guardando…" : cliente ? "Guardar cambios" : "Crear cliente"}
        </button>
      </div>
    </Modal>
  )
}
