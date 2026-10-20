"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  AREAS,
  estadoVencimiento,
  hoyAr,
  nuevoId,
  PRIORIDADES,
  RESPONSABLES,
  sumarDias,
  type ItemChecklist,
  type Tarea,
} from "@/lib/crm/modelo"
import { useCrm } from "./use-crm"
import { Avatar, BotonCerrar, Chip, Modal, Seccion, t } from "./piezas"

const vacia = (cols: string): Tarea => ({
  id: "",
  titulo: "",
  descripcion: "",
  clienteId: null,
  columnaId: cols,
  orden: Date.now(),
  responsables: [],
  area: "general",
  prioridad: "media",
  vence: null,
  etiquetas: [],
  checklist: [],
  comentarios: [],
  creado: "",
  actualizado: "",
  completada: null,
})

const alternar = <T,>(l: T[], v: T) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v])

function hace(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000
  if (s < 60) return "recién"
  if (s < 3600) return `hace ${Math.floor(s / 60)} min`
  if (s < 86400) return `hace ${Math.floor(s / 3600)} h`
  if (s < 86400 * 7) return `hace ${Math.floor(s / 86400)} d`
  return new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short" })
}

/**
 * Detalle de tarea. Con `id` edita una existente (cada cambio se guarda solo);
 * con `borrador` arma una nueva que se crea al tocar "Crear tarea".
 */
export function ModalTarea({ id, borrador, onCerrar }: { id?: string | null; borrador?: Partial<Tarea> | null; onCerrar: () => void }) {
  const { datos, actualizarTarea, crearTarea, borrarTarea, comentar, borrarComentario } = useCrm()
  const existente = id ? datos.tareas.find((x) => x.id === id) : undefined
  const esNueva = !id && !!borrador
  const [local, setLocal] = useState<Tarea>(() => ({ ...vacia(datos.tablero.columnas[0].id), ...borrador }))
  const tarea = esNueva ? local : existente

  const [titulo, setTitulo] = useState(tarea?.titulo ?? "")
  const [descripcion, setDescripcion] = useState(tarea?.descripcion ?? "")
  const [nuevoItem, setNuevoItem] = useState("")
  const [comentario, setComentario] = useState("")
  const [editandoItem, setEditandoItem] = useState<string | null>(null)
  const tituloRef = useRef<HTMLTextAreaElement>(null)

  // Si otra persona cambia la tarea mientras está abierta, reflejar título y descripción (si no se está editando)
  useEffect(() => {
    if (!existente) return
    if (document.activeElement !== tituloRef.current) setTitulo(existente.titulo)
  }, [existente?.titulo])
  useEffect(() => {
    if (esNueva) tituloRef.current?.focus()
  }, [esNueva])

  if (!tarea) {
    return (
      <Modal abierto onCerrar={onCerrar} etiqueta="Tarea" ancho="max-w-md">
        <div className="p-6 text-sm" style={{ color: t.media }}>
          Esta tarea ya no existe (puede que la haya borrado otra persona).
          <div className="mt-4"><button className="icon-btn px-3" onClick={onCerrar}>Cerrar</button></div>
        </div>
      </Modal>
    )
  }

  const cambiar = (c: Partial<Tarea>) => (esNueva ? setLocal((x) => ({ ...x, ...c })) : actualizarTarea(tarea.id, c))
  const columna = datos.tablero.columnas.find((c) => c.id === tarea.columnaId)
  const cliente = datos.clientes.find((c) => c.id === tarea.clienteId)
  const hechos = tarea.checklist.filter((i) => i.hecho).length
  const ev = estadoVencimiento(tarea)
  const hoy = hoyAr()

  const guardarTitulo = () => {
    const v = titulo.trim()
    if (v && v !== tarea.titulo) cambiar({ titulo: v })
    if (!v) setTitulo(tarea.titulo)
  }
  const guardarDescripcion = () => descripcion !== tarea.descripcion && cambiar({ descripcion })
  const checklist = (l: ItemChecklist[]) => cambiar({ checklist: l })

  function agregarItem() {
    const lineas = nuevoItem.split("\n").map((s) => s.trim()).filter(Boolean)
    if (!lineas.length) return
    checklist([...tarea!.checklist, ...lineas.map((texto) => ({ id: nuevoId(), texto, hecho: false }))])
    setNuevoItem("")
  }

  function crear() {
    const v = titulo.trim()
    if (!v) {
      tituloRef.current?.focus()
      return
    }
    crearTarea({ ...local, titulo: v, descripcion, id: undefined, creado: undefined, actualizado: undefined })
    onCerrar()
  }

  async function enviarComentario() {
    const v = comentario.trim()
    if (!v) return
    setComentario("")
    await comentar(tarea!.id, v)
  }

  return (
    <Modal abierto onCerrar={() => (esNueva ? onCerrar() : (guardarTitulo(), guardarDescripcion(), onCerrar()))} etiqueta={tarea.titulo || "Nueva tarea"}>
      <div className="flex items-start gap-3 p-4 sm:p-5 border-b" style={{ borderColor: t.borde }}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs mb-1.5" style={{ color: t.suave }}>
            {columna && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: columna.color }} />
                {columna.nombre}
              </span>
            )}
            {cliente && (
              <>
                <span>·</span>
                <Link href={`/admin/crm/clientes/${cliente.id}`} className="hover:underline" style={{ color: cliente.color }}>
                  {cliente.nombre}
                </Link>
              </>
            )}
          </div>
          <textarea
            ref={tituloRef}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            onBlur={() => !esNueva && guardarTitulo()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                esNueva ? crear() : (e.currentTarget as HTMLTextAreaElement).blur()
              }
            }}
            rows={1}
            placeholder="¿Qué hay que hacer?"
            className="w-full bg-transparent text-lg sm:text-xl font-bold text-white resize-none outline-none rounded-md px-1 -mx-1 focus:bg-white/5 [field-sizing:content]"
          />
        </div>
        <BotonCerrar onClick={onCerrar} />
      </div>

      <div className="grid md:grid-cols-[minmax(0,1fr)_240px]">
        {/* Columna principal */}
        <div className="p-4 sm:p-5 space-y-6 min-w-0">
          <Seccion titulo="Descripción">
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onBlur={() => !esNueva && guardarDescripcion()}
              rows={Math.min(12, Math.max(3, descripcion.split("\n").length + 1))}
              placeholder="Detalles, links, contexto…"
              className="input-orion w-full rounded-lg px-3 py-2 text-sm leading-relaxed resize-y"
            />
          </Seccion>

          <Seccion
            titulo={`Checklist${tarea.checklist.length ? ` · ${hechos}/${tarea.checklist.length}` : ""}`}
            accion={
              hechos > 0 && (
                <button type="button" className="text-[11px] hover:text-white" style={{ color: t.tenue }} onClick={() => checklist(tarea.checklist.filter((i) => !i.hecho))}>
                  Quitar completados
                </button>
              )
            }
          >
            {tarea.checklist.length > 0 && (
              <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${(hechos / tarea.checklist.length) * 100}%`, background: hechos === tarea.checklist.length ? "#34d399" : "linear-gradient(90deg,#e0642f,#dbac34)" }}
                />
              </div>
            )}
            <ul className="space-y-0.5">
              {tarea.checklist.map((item, i) => (
                <li key={item.id} className="group flex items-start gap-2.5 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]">
                  <input
                    type="checkbox"
                    checked={item.hecho}
                    onChange={() => checklist(tarea.checklist.map((x) => (x.id === item.id ? { ...x, hecho: !x.hecho } : x)))}
                    className="mt-0.5 w-4 h-4 accent-[#34d399] shrink-0 cursor-pointer"
                    aria-label={item.texto}
                  />
                  {editandoItem === item.id ? (
                    <input
                      autoFocus
                      defaultValue={item.texto}
                      onBlur={(e) => {
                        const v = e.target.value.trim()
                        checklist(v ? tarea.checklist.map((x) => (x.id === item.id ? { ...x, texto: v } : x)) : tarea.checklist.filter((x) => x.id !== item.id))
                        setEditandoItem(null)
                      }}
                      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                      className="input-orion flex-1 rounded-md px-2 py-0.5 text-sm"
                    />
                  ) : (
                    <span
                      onClick={() => setEditandoItem(item.id)}
                      className={`flex-1 text-sm cursor-text break-words ${item.hecho ? "line-through" : ""}`}
                      style={{ color: item.hecho ? t.tenue : t.media }}
                    >
                      {item.texto}
                    </span>
                  )}
                  <span className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {i > 0 && (
                      <button type="button" className="text-xs px-1" style={{ color: t.tenue }} title="Subir" onClick={() => checklist(tarea.checklist.map((x, j) => (j === i - 1 ? item : j === i ? tarea.checklist[i - 1] : x)))}>
                        ↑
                      </button>
                    )}
                    <button type="button" className="text-xs px-1 hover:text-rose-300" style={{ color: t.tenue }} title="Quitar" onClick={() => checklist(tarea.checklist.filter((x) => x.id !== item.id))}>
                      ✕
                    </button>
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-2">
              <textarea
                value={nuevoItem}
                onChange={(e) => setNuevoItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    agregarItem()
                  }
                }}
                rows={1}
                placeholder="Agregar ítem… (pegá varias líneas para cargar muchos)"
                className="input-orion flex-1 rounded-lg px-3 py-1.5 text-sm resize-none [field-sizing:content] max-h-40"
              />
              <button type="button" onClick={agregarItem} className="icon-btn px-3 text-xs">Agregar</button>
            </div>
          </Seccion>

          {!esNueva && (
            <Seccion titulo={`Comentarios${tarea.comentarios.length ? ` · ${tarea.comentarios.length}` : ""}`}>
              <div className="flex gap-2">
                <textarea
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) enviarComentario()
                  }}
                  rows={2}
                  placeholder="Escribí una novedad, avance o pedido del cliente… (Ctrl+Enter)"
                  className="input-orion flex-1 rounded-lg px-3 py-2 text-sm resize-y"
                />
                <button type="button" onClick={enviarComentario} disabled={!comentario.trim()} className="icon-btn px-3 text-xs self-end disabled:opacity-40">
                  Enviar
                </button>
              </div>
              <ul className="mt-3 space-y-3">
                {[...tarea.comentarios].reverse().map((c) => (
                  <li key={c.id} className="group text-sm">
                    <div className="flex items-baseline gap-2 text-xs" style={{ color: t.suave }}>
                      <b className="text-white font-semibold">{c.autor}</b>
                      <span>{hace(c.fecha)}</span>
                      <button
                        type="button"
                        className="ml-auto opacity-0 group-hover:opacity-100 hover:text-rose-300"
                        onClick={() => confirm("¿Borrar el comentario?") && borrarComentario(tarea.id, c.id)}
                      >
                        Borrar
                      </button>
                    </div>
                    <p className="mt-1 whitespace-pre-wrap break-words rounded-lg px-3 py-2" style={{ background: "rgba(255,255,255,0.03)", color: t.media }}>
                      {c.texto}
                    </p>
                  </li>
                ))}
              </ul>
            </Seccion>
          )}
        </div>

        {/* Lateral de propiedades */}
        <aside className="p-4 sm:p-5 space-y-5 border-t md:border-t-0 md:border-l" style={{ borderColor: t.borde, background: "rgba(255,255,255,0.015)" }}>
          <Seccion titulo="Cliente">
            <select value={tarea.clienteId ?? ""} onChange={(e) => cambiar({ clienteId: e.target.value || null })} className="input-orion w-full rounded-lg px-2.5 py-1.5 text-sm" style={{ background: "rgba(255,255,255,0.04)" }}>
              <option value="">Sin cliente (interna)</option>
              {datos.clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </Seccion>

          <Seccion titulo="Estado">
            <select value={tarea.columnaId} onChange={(e) => cambiar({ columnaId: e.target.value, orden: Date.now() })} className="input-orion w-full rounded-lg px-2.5 py-1.5 text-sm" style={{ background: "rgba(255,255,255,0.04)" }}>
              {datos.tablero.columnas.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </Seccion>

          <Seccion titulo="Responsables">
            <div className="flex flex-col gap-1">
              {RESPONSABLES.map((r) => {
                const activo = tarea.responsables.includes(r.id)
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => cambiar({ responsables: alternar(tarea.responsables, r.id) })}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-left transition-colors"
                    style={activo ? { background: `${r.color}1c`, color: "#fff", boxShadow: `inset 0 0 0 1px ${r.color}60` } : { color: t.suave }}
                    aria-pressed={activo}
                  >
                    <Avatar id={r.id} tam={22} conBorde={false} />
                    <span className="flex-1 truncate">{r.nombre}</span>
                    {activo && <span className="text-xs" style={{ color: r.color }}>✓</span>}
                  </button>
                )
              })}
            </div>
          </Seccion>

          <Seccion titulo="Vence">
            <input
              type="date"
              value={tarea.vence ?? ""}
              onChange={(e) => cambiar({ vence: e.target.value || null })}
              className="input-orion w-full rounded-lg px-2.5 py-1.5 text-sm"
              style={ev === "vencida" ? { borderColor: "rgba(251,113,133,0.6)" } : undefined}
            />
            <div className="flex flex-wrap gap-1 mt-1.5">
              {[
                ["Hoy", hoy],
                ["Mañana", sumarDias(hoy, 1)],
                ["+1 sem", sumarDias(hoy, 7)],
              ].map(([n, f]) => (
                <button key={n} type="button" onClick={() => cambiar({ vence: f })} className="text-[11px] px-2 py-0.5 rounded-md hover:text-white" style={{ background: "rgba(255,255,255,0.04)", color: t.suave }}>
                  {n}
                </button>
              ))}
              {tarea.vence && (
                <button type="button" onClick={() => cambiar({ vence: null })} className="text-[11px] px-2 py-0.5 rounded-md hover:text-white" style={{ color: t.tenue }}>
                  Quitar
                </button>
              )}
            </div>
          </Seccion>

          <Seccion titulo="Prioridad">
            <div className="flex flex-wrap gap-1">
              {PRIORIDADES.map((p) => (
                <Chip key={p.id} activo={tarea.prioridad === p.id} onClick={() => cambiar({ prioridad: p.id })} color={p.color}>
                  {p.nombre}
                </Chip>
              ))}
            </div>
          </Seccion>

          <Seccion titulo="Área">
            <div className="flex flex-wrap gap-1">
              {AREAS.map((a) => (
                <Chip key={a.id} activo={tarea.area === a.id} onClick={() => cambiar({ area: a.id })} color={a.color}>
                  {a.nombre}
                </Chip>
              ))}
            </div>
          </Seccion>

          <Seccion titulo="Etiquetas">
            <div className="flex flex-wrap gap-1">
              {datos.tablero.etiquetas.map((e) => (
                <Chip key={e.id} activo={tarea.etiquetas.includes(e.id)} onClick={() => cambiar({ etiquetas: alternar(tarea.etiquetas, e.id) })} color={e.color}>
                  {e.nombre}
                </Chip>
              ))}
            </div>
          </Seccion>

          {esNueva ? (
            <button type="button" onClick={crear} className="w-full rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition hover:brightness-110" style={{ background: "linear-gradient(135deg,#e0642f,#c9521f)" }}>
              Crear tarea
            </button>
          ) : (
            <div className="pt-3 border-t space-y-1.5" style={{ borderColor: t.borde }}>
              <button
                type="button"
                onClick={() => {
                  crearTarea({ ...tarea, id: undefined, creado: undefined, actualizado: undefined, titulo: `${tarea.titulo} (copia)`, comentarios: [], orden: tarea.orden + 1 })
                  onCerrar()
                }}
                className="w-full text-left text-xs px-2 py-1.5 rounded-md hover:bg-white/5"
                style={{ color: t.suave }}
              >
                Duplicar tarea
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!confirm("¿Eliminar esta tarea? No se puede deshacer.")) return
                  borrarTarea(tarea.id)
                  onCerrar()
                }}
                className="w-full text-left text-xs px-2 py-1.5 rounded-md hover:bg-rose-500/10"
                style={{ color: "rgba(253,164,175,0.9)" }}
              >
                Eliminar tarea
              </button>
              <p className="text-[10px] px-2 pt-1" style={{ color: t.tenue }}>
                Creada {hace(tarea.creado)}
                {tarea.completada ? ` · terminada ${hace(tarea.completada)}` : ""}
              </p>
            </div>
          )}
        </aside>
      </div>
    </Modal>
  )
}
