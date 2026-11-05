"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { Cliente } from "@/lib/facturacion/documentos"
import { CONDICIONES_IVA, condicionIva, cuitValido, formatoCuit, soloDigitos, TIPOS_DOC, tipoDoc } from "@/lib/facturacion/modelo"
import { Aviso, Boton, BotonLink, Campo, Entrada, Icono, ICONOS, Selector, Tarjeta, tinta } from "./ui"

type Ficha = Omit<Cliente, "actualizado">

const fichaVacia: Ficha = { docTipo: 80, docNro: "", nombre: "", condicionIva: 6, domicilio: "", email: "", alias: "", notas: "" }
const clave = (c: Pick<Cliente, "docTipo" | "docNro">) => `${c.docTipo}-${soloDigitos(c.docNro)}`

type Estado = { tono: "ok" | "error" | "alerta"; texto: string } | null

async function pedir<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, init)
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j.errores?.join(" · ") ?? j.error ?? "Error inesperado")
  return j as T
}

export function AgendaClientes({ inicial, editarClave }: { inicial: Cliente[]; editarClave?: string }) {
  const [clientes, setClientes] = useState(inicial)
  const [q, setQ] = useState("")
  const [ficha, setFicha] = useState<Ficha | null>(null)
  const [claveAnterior, setClaveAnterior] = useState<string | undefined>()
  const [buscando, setBuscando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [origen, setOrigen] = useState<"arca" | null>(null)
  const [estado, setEstado] = useState<Estado>(null)
  const ultimoCuit = useRef("")
  const formRef = useRef<HTMLDivElement>(null)

  // ?editar=<clave>: abre la ficha directamente (viene de la cuenta corriente)
  useEffect(() => {
    const c = editarClave ? inicial.find((x) => clave(x) === editarClave) : undefined
    if (c) abrir(c)
  }, [])

  const visibles = useMemo(() => {
    const t = q.trim().toLowerCase()
    const td = soloDigitos(t)
    if (!t) return clientes
    return clientes.filter(
      (c) =>
        [c.alias, c.nombre, c.email, c.notas].join(" ").toLowerCase().includes(t) || (td.length >= 3 && soloDigitos(c.docNro).includes(td)),
    )
  }, [clientes, q])

  const set = <K extends keyof Ficha>(k: K, v: Ficha[K]) => setFicha((f) => (f ? { ...f, [k]: v } : f))

  function abrir(c?: Cliente) {
    setEstado(null)
    setOrigen(null)
    setFicha(c ? { ...fichaVacia, ...c } : { ...fichaVacia })
    setClaveAnterior(c ? clave(c) : undefined)
    ultimoCuit.current = c ? soloDigitos(c.docNro) : ""
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }))
  }

  async function traerDeArca(doc: string) {
    ultimoCuit.current = doc
    setBuscando(true)
    setEstado(null)
    try {
      const j = await pedir<{ fuente: "arca" | "agenda"; cliente: Ficha; aviso?: string }>(`/api/admin/facturacion/padron?doc=${doc}`)
      // Los datos fiscales vienen de ARCA; alias, notas y email quedan como estaban
      setFicha((f) => (f ? { ...f, nombre: j.cliente.nombre, condicionIva: j.cliente.condicionIva, domicilio: j.cliente.domicilio, email: f.email || j.cliente.email } : f))
      setOrigen(j.fuente === "arca" ? "arca" : null)
      if (j.aviso) setEstado({ tono: "alerta", texto: `ARCA no respondió (${j.aviso}). Se usaron los datos guardados.` })
    } catch (e) {
      setOrigen(null)
      setEstado({ tono: "error", texto: `${(e as Error).message} Podés completar los datos a mano.` })
    } finally {
      setBuscando(false)
    }
  }

  // CUIT completo y válido → se consulta ARCA solo
  useEffect(() => {
    if (!ficha || ![80, 86].includes(ficha.docTipo)) return
    const d = soloDigitos(ficha.docNro)
    if (d.length !== 11 || !cuitValido(d) || d === ultimoCuit.current) return
    const t = setTimeout(() => traerDeArca(d), 300)
    return () => clearTimeout(t)
  }, [ficha?.docNro, ficha?.docTipo])

  async function guardar() {
    if (!ficha) return
    setGuardando(true)
    setEstado(null)
    try {
      const { cliente } = await pedir<{ cliente: Cliente }>("/api/admin/facturacion/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cliente: ficha, claveAnterior }),
      })
      setClientes((cs) => [cliente, ...cs.filter((c) => clave(c) !== clave(cliente) && clave(c) !== claveAnterior)])
      setFicha(null)
      setEstado({ tono: "ok", texto: `${cliente.alias || cliente.nombre} guardado en la agenda.` })
    } catch (e) {
      setEstado({ tono: "error", texto: (e as Error).message })
    } finally {
      setGuardando(false)
    }
  }

  async function borrar(c: Cliente) {
    if (!confirm(`¿Borrar a ${c.alias || c.nombre} de la agenda? Las facturas ya emitidas no se tocan.`)) return
    try {
      await pedir(`/api/admin/facturacion/clientes?clave=${encodeURIComponent(clave(c))}`, { method: "DELETE" })
      setClientes((cs) => cs.filter((x) => clave(x) !== clave(c)))
      if (ficha && claveAnterior === clave(c)) setFicha(null)
    } catch (e) {
      setEstado({ tono: "error", texto: (e as Error).message })
    }
  }

  const docEsCuit = ficha ? [80, 86].includes(ficha.docTipo) : false
  const cuitMal = ficha && docEsCuit && soloDigitos(ficha.docNro).length === 11 && !cuitValido(ficha.docNro)

  return (
    <div className="space-y-5">
      {estado && !ficha && <Aviso tono={estado.tono}>{estado.texto}</Aviso>}

      {ficha && (
        <div ref={formRef} className="scroll-mt-24">
          <Tarjeta
            titulo={claveAnterior ? `Editar ${ficha.alias || ficha.nombre || "cliente"}` : "Nuevo cliente"}
            accion={
              origen === "arca" ? (
                <span className="inline-flex items-center gap-1 text-xs" style={{ color: "rgba(110,231,183,0.9)" }}>
                  <Icono d={ICONOS.check} className="w-3.5 h-3.5" />
                  Datos fiscales de ARCA
                </span>
              ) : null
            }
          >
            <div className="grid sm:grid-cols-[150px_1fr_auto] gap-3 items-end">
              <Campo etiqueta="Documento">
                <Selector value={ficha.docTipo} onChange={(e) => set("docTipo", Number(e.target.value))}>
                  {TIPOS_DOC.filter((t) => t.id !== 99).map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </Selector>
              </Campo>
              <Campo etiqueta={docEsCuit ? "Número — los datos se traen de ARCA" : "Número"} ayuda={buscando ? "Consultando ARCA…" : undefined}>
                <Entrada
                  inputMode="numeric"
                  autoComplete="off"
                  autoFocus={!claveAnterior}
                  placeholder={docEsCuit ? "30-12345678-9" : ""}
                  value={ficha.docNro}
                  onChange={(e) => set("docNro", e.target.value)}
                />
              </Campo>
              {docEsCuit && (
                <Boton
                  onClick={() => traerDeArca(soloDigitos(ficha.docNro))}
                  disabled={buscando || !cuitValido(ficha.docNro)}
                  title="Volver a traer razón social, domicilio y condición de IVA desde ARCA"
                >
                  <Icono d={ICONOS.deshacer} className="w-3.5 h-3.5" />
                  {buscando ? "Consultando…" : "Actualizar de ARCA"}
                </Boton>
              )}
            </div>
            {cuitMal && <p className="text-xs mt-2" style={{ color: "rgba(253,164,175,0.95)" }}>El CUIT no es válido: revisá los números.</p>}
            {estado && <div className="mt-3"><Aviso tono={estado.tono}>{estado.texto}</Aviso></div>}

            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <Campo etiqueta="Razón social (la que sale en la factura)" className="sm:col-span-2">
                <Entrada value={ficha.nombre} onChange={(e) => set("nombre", e.target.value)} />
              </Campo>
              <Campo etiqueta="Alias / nombre de fantasía" ayuda="solo lo ves vos en el panel">
                <Entrada placeholder="Ej.: Café Lumbre" value={ficha.alias ?? ""} onChange={(e) => set("alias", e.target.value)} />
              </Campo>
              <Campo etiqueta="Condición frente al IVA">
                <Selector value={ficha.condicionIva} onChange={(e) => set("condicionIva", Number(e.target.value))}>
                  {CONDICIONES_IVA.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </Selector>
              </Campo>
              <Campo etiqueta="Domicilio fiscal" className="sm:col-span-2">
                <Entrada value={ficha.domicilio} onChange={(e) => set("domicilio", e.target.value)} />
              </Campo>
              <Campo etiqueta="Email" ayuda="para mandarle las facturas">
                <Entrada type="email" value={ficha.email} onChange={(e) => set("email", e.target.value)} />
              </Campo>
              <Campo etiqueta="Notas" ayuda="opcional">
                <Entrada placeholder="Ej.: factura a fin de mes, abono redes" value={ficha.notas ?? ""} onChange={(e) => set("notas", e.target.value)} />
              </Campo>
            </div>

            <div className="flex flex-wrap justify-end gap-2 mt-5">
              <Boton onClick={() => setFicha(null)}>Cancelar</Boton>
              <Boton variante="primario" onClick={guardar} disabled={guardando || buscando}>
                <Icono d={ICONOS.check} />
                {guardando ? "Guardando…" : "Guardar cliente"}
              </Boton>
            </div>
          </Tarjeta>
        </div>
      )}

      <Tarjeta>
        <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center justify-between mb-4">
          <div className="relative sm:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: tinta.tenue }}>
              <Icono d={ICONOS.buscar} className="w-3.5 h-3.5" />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por alias, razón social o CUIT…"
              aria-label="Buscar clientes"
              className="input-orion w-full rounded-lg pl-9 pr-3 py-2 text-sm"
            />
          </div>
          {!ficha && (
            <Boton variante="primario" onClick={() => abrir()}>
              <Icono d={ICONOS.mas} />
              Nuevo cliente
            </Boton>
          )}
        </div>

        {visibles.length === 0 ? (
          <div className="text-center py-10 text-sm" style={{ color: tinta.suave }}>
            {clientes.length === 0 ? (
              <>
                Todavía no hay clientes. Cargá uno con su CUIT y los datos se completan desde ARCA.
                <br />
                Los clientes a los que les facturás también se guardan solos acá.
              </>
            ) : (
              "Ningún cliente coincide con la búsqueda."
            )}
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {visibles.map((c) => (
              <li key={clave(c)} className="py-3 flex flex-col sm:flex-row sm:items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="min-w-0 flex-1">
                  <a href={`/admin/facturacion/clientes/${encodeURIComponent(clave(c))}`} className="block text-sm font-medium text-white truncate hover:underline">
                    {c.alias || c.nombre}
                  </a>
                  <p className="text-xs truncate" style={{ color: tinta.suave }}>
                    {c.alias && <span style={{ color: tinta.media }}>{c.nombre} · </span>}
                    {tipoDoc(c.docTipo)} {[80, 86].includes(c.docTipo) ? formatoCuit(c.docNro) : c.docNro} · {condicionIva(c.condicionIva)?.nombre ?? "—"}
                  </p>
                  {(c.email || c.notas) && (
                    <p className="text-xs truncate mt-0.5" style={{ color: tinta.tenue }}>
                      {[c.email, c.notas].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <BotonLink href={`/admin/facturacion/nuevo?receptor=${encodeURIComponent(clave(c))}`} variante="secundario" className="!px-3 !py-1.5 !text-xs">
                    <Icono d={ICONOS.recibo} className="w-3.5 h-3.5" />
                    Facturar
                  </BotonLink>
                  <Boton onClick={() => abrir(c)} className="!px-2.5 !py-1.5" aria-label={`Editar ${c.alias || c.nombre}`} title="Editar">
                    <Icono d={ICONOS.lapiz} className="w-3.5 h-3.5" />
                  </Boton>
                  <Boton variante="peligro" onClick={() => borrar(c)} className="!px-2.5 !py-1.5" aria-label={`Borrar ${c.alias || c.nombre}`} title="Borrar">
                    <Icono d={ICONOS.basura} className="w-3.5 h-3.5" />
                  </Boton>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>
    </div>
  )
}
