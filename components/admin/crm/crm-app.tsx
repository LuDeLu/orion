"use client"

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { Toaster } from "sonner"
import { estadoVencimiento, hoyAr, sumarDias, type DatosCrm, type Tarea } from "@/lib/crm/modelo"
import { aplicarFiltros, filtrosAUrl, filtrosDesdeUrl, type Filtros } from "./filtros"
import { BarraFiltros } from "./barra-filtros"
import { TableroKanban } from "./tablero"
import { VistaLista } from "./vista-lista"
import { VistaClientes } from "./vista-clientes"
import { ModalTarea } from "./modal-tarea"
import { ModalCliente } from "./modal-cliente"
import { AjustesTablero } from "./ajustes-tablero"
import { ProveedorCrm, useCrm } from "./use-crm"
import { t } from "./piezas"

type Vista = "tablero" | "lista" | "clientes"

interface Props {
  inicial: DatosCrm
  /** Query string con la que se abrió la página (filtros, vista, tarea abierta) */
  query: string
  /** Página de un cliente: todo queda acotado a ese cliente */
  clienteFijo?: string
  /** Contenido extra dentro del proveedor (ej. la ficha del cliente) */
  encabezado?: ReactNode
}

export function CrmApp(props: Props) {
  return (
    <ProveedorCrm inicial={props.inicial}>
      <Fragment key="encabezado">{props.encabezado}</Fragment>
      <Interior {...props} />
      <Toaster theme="dark" position="bottom-right" richColors />
    </ProveedorCrm>
  )
}

function Interior({ query, clienteFijo }: Props) {
  const { datos } = useCrm()
  const sp0 = useMemo(() => new URLSearchParams(query), [query])
  const [vista, setVista] = useState<Vista>(() => {
    const v = sp0.get("vista") as Vista
    return v === "lista" || (v === "clientes" && !clienteFijo) ? v : "tablero"
  })
  const [filtros, setFiltros] = useState<Filtros>(() => filtrosDesdeUrl(sp0))
  const [agrupar, setAgrupar] = useState(sp0.get("g") !== "0")
  const [abierta, setAbierta] = useState<string | null>(sp0.get("tarea"))
  const [borrador, setBorrador] = useState<Partial<Tarea> | null>(null)
  const [clienteNuevo, setClienteNuevo] = useState(false)
  const [ajustes, setAjustes] = useState(false)
  const buscador = useRef<HTMLInputElement>(null)

  // Filtros, vista y tarea abierta viven en la URL: se pueden compartir y sobreviven a un F5
  useEffect(() => {
    const p = filtrosAUrl(filtros, new URLSearchParams(window.location.search))
    vista === "tablero" ? p.delete("vista") : p.set("vista", vista)
    abierta ? p.set("tarea", abierta) : p.delete("tarea")
    agrupar ? p.delete("g") : p.set("g", "0")
    const qs = p.toString()
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname)
  }, [filtros, vista, abierta, agrupar])

  const visibles = useMemo(() => aplicarFiltros(datos.tareas, filtros, datos, clienteFijo), [datos, filtros, clienteFijo])
  const total = clienteFijo ? datos.tareas.filter((x) => x.clienteId === clienteFijo).length : datos.tareas.length

  /** Lo que hereda una tarea nueva de los filtros activos. */
  const defaults = useMemo<Partial<Tarea>>(() => {
    const d: Partial<Tarea> = {}
    const cli = clienteFijo ?? (filtros.clientes.length === 1 && filtros.clientes[0] !== "sin" ? filtros.clientes[0] : null)
    if (cli) d.clienteId = cli
    const resp = filtros.responsables.filter((r) => r !== "nadie")
    if (resp.length === 1) d.responsables = resp as Tarea["responsables"]
    if (filtros.areas.length === 1) d.area = filtros.areas[0] as Tarea["area"]
    if (filtros.prioridades.length === 1) d.prioridad = filtros.prioridades[0] as Tarea["prioridad"]
    return d
  }, [filtros, clienteFijo])

  const nuevaTarea = useCallback(() => {
    setAbierta(null)
    setBorrador({ ...defaults })
  }, [defaults])

  // Atajos: "/" busca, "n" nueva tarea
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement
      if (el.closest("input, textarea, select, [contenteditable]") || e.ctrlKey || e.metaKey || e.altKey) return
      if (abierta || borrador) return
      if (e.key === "/") {
        e.preventDefault()
        buscador.current?.focus()
      } else if (e.key.toLowerCase() === "n" && vista !== "clientes") {
        e.preventDefault()
        nuevaTarea()
      }
    }
    document.addEventListener("keydown", tecla)
    return () => document.removeEventListener("keydown", tecla)
  }, [abierta, borrador, vista, nuevaTarea])

  // Resumen rápido (clic = filtrar)
  const base = clienteFijo ? datos.tareas.filter((x) => x.clienteId === clienteFijo) : datos.tareas
  const hoy = hoyAr()
  const abiertas = base.filter((x) => !x.completada)
  const resumen = [
    { id: "abiertas", etiqueta: "Abiertas", valor: abiertas.length, color: "#e0642f", aplicar: () => setFiltros({ ...filtros, ocultarHechas: true, vence: "" }) },
    { id: "vencidas", etiqueta: "Vencidas", valor: abiertas.filter((x) => estadoVencimiento(x) === "vencida").length, color: "#fb7185", aplicar: () => setFiltros({ ...filtros, vence: "vencidas" }) },
    { id: "hoy", etiqueta: "Vencen hoy", valor: abiertas.filter((x) => x.vence === hoy).length, color: "#facc15", aplicar: () => setFiltros({ ...filtros, vence: "hoy" }) },
    { id: "semana", etiqueta: "Próx. 7 días", valor: abiertas.filter((x) => x.vence && x.vence <= sumarDias(hoy, 7)).length, color: "#38bdf8", aplicar: () => setFiltros({ ...filtros, vence: "semana" }) },
    {
      id: "hechas",
      etiqueta: "Terminadas (7 días)",
      valor: base.filter((x) => x.completada && x.completada >= new Date(Date.now() - 7 * 864e5).toISOString()).length,
      color: "#34d399",
      aplicar: () => setVista("lista"),
    },
  ]

  const vistas: { id: Vista; nombre: string }[] = [
    { id: "tablero", nombre: "Tablero" },
    { id: "lista", nombre: "Lista" },
    ...(clienteFijo ? [] : [{ id: "clientes" as const, nombre: `Clientes (${datos.clientes.length})` }]),
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", boxShadow: `inset 0 0 0 1px ${t.borde}` }} role="tablist">
          {vistas.map((v) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={vista === v.id}
              onClick={() => setVista(v.id)}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={vista === v.id ? { background: "rgba(224,100,47,0.18)", color: "#fff", boxShadow: "inset 0 0 0 1px rgba(224,100,47,0.45)" } : { color: t.suave }}
            >
              {v.nombre}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {vista === "lista" && !clienteFijo && (
            <label className="inline-flex items-center gap-2 text-xs cursor-pointer" style={{ color: t.suave }}>
              <input type="checkbox" checked={agrupar} onChange={(e) => setAgrupar(e.target.checked)} className="accent-[#e0642f]" />
              Agrupar por cliente
            </label>
          )}
          {vista === "tablero" && (
            <button type="button" onClick={() => setAjustes(true)} className="logout-btn rounded-lg px-3 py-2 text-sm">
              Columnas y etiquetas
            </button>
          )}
          {vista === "clientes" ? (
            <button type="button" onClick={() => setClienteNuevo(true)} className="rounded-lg px-3.5 py-2 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "linear-gradient(135deg,#e0642f,#c9521f)" }}>
              + Nuevo cliente
            </button>
          ) : (
            <>
              {!clienteFijo && (
                <button type="button" onClick={() => setClienteNuevo(true)} className="logout-btn rounded-lg px-3 py-2 text-sm">
                  + Cliente
                </button>
              )}
              <button type="button" onClick={nuevaTarea} className="rounded-lg px-3.5 py-2 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "linear-gradient(135deg,#e0642f,#c9521f)" }} title="Atajo: N">
                + Nueva tarea
              </button>
            </>
          )}
        </div>
      </div>

      {vista !== "clientes" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {resumen.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={r.aplicar}
              className="text-left rounded-xl px-3.5 py-2.5 transition-all hover:-translate-y-0.5"
              style={{ background: t.panel, boxShadow: `inset 0 0 0 1px ${t.borde}, inset 0 -2px 0 ${r.color}80` }}
            >
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: t.suave }}>{r.etiqueta}</div>
              <div className="text-xl font-bold tabular mt-0.5" style={{ color: r.valor && r.id === "vencidas" ? "#fda4af" : "#fff" }}>{r.valor}</div>
            </button>
          ))}
        </div>
      )}

      {vista === "clientes" ? (
        <>
          <input
            value={filtros.q}
            onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
            placeholder="Buscar cliente por nombre, contacto, rubro o CUIT…"
            className="input-orion w-full max-w-md rounded-lg px-3 py-2 text-sm"
          />
          <VistaClientes busqueda={filtros.q} onNuevo={() => setClienteNuevo(true)} />
        </>
      ) : (
        <>
          <BarraFiltros filtros={filtros} setFiltros={setFiltros} datos={datos} clienteFijo={clienteFijo} total={total} visibles={visibles.length} buscadorRef={buscador} />
          {vista === "tablero" ? (
            <TableroKanban tareas={visibles} onAbrir={setAbierta} defaultsNueva={defaults} mostrarCliente={!clienteFijo} />
          ) : (
            <VistaLista tareas={visibles} onAbrir={setAbierta} onNueva={(d) => (setAbierta(null), setBorrador({ ...defaults, ...d }))} agrupar={agrupar && !clienteFijo} />
          )}
        </>
      )}

      {(abierta || borrador) && (
        <ModalTarea
          key={abierta ?? "nueva"}
          id={abierta}
          borrador={borrador}
          onCerrar={() => {
            setAbierta(null)
            setBorrador(null)
          }}
        />
      )}
      {clienteNuevo && <ModalCliente onCerrar={() => setClienteNuevo(false)} />}
      {ajustes && <AjustesTablero onCerrar={() => setAjustes(false)} />}
    </div>
  )
}
