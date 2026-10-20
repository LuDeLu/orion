"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { calcularTotales, subtotalItem } from "@/lib/facturacion/calculo"
import {
  ALICUOTAS,
  alicuota,
  COMPROBANTES,
  CONCEPTOS,
  CONDICIONES_IVA,
  CONDICIONES_VENTA,
  condicionIva as buscarCondicion,
  cuitValido,
  dinero,
  discriminaIva,
  fechaAr,
  hoyAr,
  letraSugerida,
  MONEDAS,
  numeroCbte,
  soloDigitos,
  TIPOS_DOC,
  tipoCbte,
  type ClaseCbte,
  type CondicionEmisor,
  type DatosComprobante,
  type Item,
  type Receptor,
} from "@/lib/facturacion/modelo"
import { Aviso, Boton, Campo, Entrada, Etiqueta, Icono, ICONOS, Segmentos, Selector, Tarjeta, tinta } from "./ui"

export interface Inicial {
  modo: "factura" | "presupuesto"
  clase?: ClaseCbte
  fce?: boolean
  datos?: Partial<DatosComprobante>
  presupuestoId?: string
  editarId?: string
  /** El receptor vino de un cliente del CRM sin datos fiscales: completarlo desde ARCA */
  buscarReceptor?: boolean
}

interface FacturaResumen {
  id: string
  tipo: number
  puntoVenta: number
  numero: number
  fecha: string
  cliente: string
  total: number
  moneda: string
}

interface Props {
  inicial: Inicial
  config: {
    condicionIva: CondicionEmisor
    entorno: "homologacion" | "produccion"
    puntoVenta: number
    validezPresupuesto: number
    tieneCbu: boolean
    arcaListo: boolean
  }
  clientes: Receptor[]
  facturas: FacturaResumen[]
}

// ── Fechas por defecto ───────────────────────────────────────────────────────

const sumarDias = (iso: string, dias: number) => new Date(new Date(iso).getTime() + dias * 864e5).toISOString().slice(0, 10)
const inicioMes = (iso: string) => `${iso.slice(0, 7)}-01`
const finMes = (iso: string) => {
  const [a, m] = iso.split("-").map(Number)
  return new Date(Date.UTC(a, m, 0)).toISOString().slice(0, 10)
}

const itemVacio = (): Item => ({ descripcion: "", cantidad: 1, unidad: "u.", precio: 0, bonificacion: 0, iva: 5 })
const receptorVacio: Receptor = { docTipo: 80, docNro: "", nombre: "", condicionIva: 5, domicilio: "", email: "" }

type Busqueda = { estado: "idle" | "buscando" | "ok" | "error"; mensaje?: string; fuente?: "arca" | "agenda" }

export function FormularioComprobante({ inicial, config, clientes, facturas }: Props) {
  const router = useRouter()
  const hoy = hoyAr()
  const esRI = config.condicionIva === "responsable_inscripto"

  const [modo, setModo] = useState(inicial.modo)
  const [clase, setClase] = useState<ClaseCbte>(inicial.clase ?? "factura")
  const [fce, setFce] = useState(!!inicial.fce)

  const d0 = inicial.datos ?? {}
  const [fecha, setFecha] = useState(d0.fecha ?? hoy)
  const [concepto, setConcepto] = useState<number>(d0.concepto ?? 2)
  const [servicioDesde, setServicioDesde] = useState(d0.servicioDesde ?? inicioMes(hoy))
  const [servicioHasta, setServicioHasta] = useState(d0.servicioHasta ?? finMes(hoy))
  const [vencimientoPago, setVencimientoPago] = useState(d0.vencimientoPago ?? sumarDias(hoy, 10))
  const [receptor, setReceptor] = useState<Receptor>(d0.receptor ?? receptorVacio)
  const [items, setItems] = useState<Item[]>(d0.items?.length ? d0.items : [itemVacio()])
  const [moneda, setMoneda] = useState(d0.moneda ?? "PES")
  const [cotizacion, setCotizacion] = useState<number>(d0.cotizacion ?? 1)
  const [condicionVenta, setCondicionVenta] = useState(d0.condicionVenta ?? "Transferencia bancaria")
  const [observaciones, setObservaciones] = useState(d0.observaciones ?? "")
  const [asociado, setAsociado] = useState(d0.asociado)
  const [anulacion, setAnulacion] = useState(false)
  const [validezDias, setValidezDias] = useState<number>(d0.validezDias ?? config.validezPresupuesto)
  const [preciosConIva, setPreciosConIva] = useState<boolean | null>(d0.preciosConIva ?? null)
  const [masOpciones, setMasOpciones] = useState(moneda !== "PES" || !!observaciones)

  const [busqueda, setBusqueda] = useState<Busqueda>({ estado: d0.receptor ? "ok" : "idle" })
  const [errores, setErrores] = useState<string[]>([])
  const [enviando, setEnviando] = useState<false | "guardar" | "vista">(false)
  const [confirmar, setConfirmar] = useState(false)

  // ── Derivados ──────────────────────────────────────────────────────────────

  const letra = esRI ? letraSugerida(config.condicionIva, receptor.condicionIva) : "C"
  const tipo = modo === "presupuesto" ? undefined : COMPROBANTES.find((c) => c.letra === letra && c.clase === clase && c.fce === fce)
  const discrimina = modo === "presupuesto" ? esRI : discriminaIva(letra)
  // B y presupuestos a consumidor final: lo natural es cargar el precio final
  const conIva = preciosConIva ?? (discrimina && letra !== "A" && letra !== "M")
  const totales = useMemo(() => calcularTotales(items, discrimina, conIva), [items, discrimina, conIva])
  const condicionesValidas = CONDICIONES_IVA.filter((c) => (modo === "presupuesto" ? true : c.letras.includes(letra)))
  const necesitaAsociado = modo === "factura" && (clase === "nc" || clase === "nd")
  const asociables = facturas.filter((f) => tipoCbte(f.tipo)?.letra === letra && tipoCbte(f.tipo)?.clase === "factura")
  const servicios = concepto !== 1
  const pideVto = modo === "factura" && ((servicios && !(fce && clase !== "factura")) || (fce && clase === "factura"))

  // ── Autocompletado del cliente ─────────────────────────────────────────────

  const ultimaBusqueda = useRef(d0.receptor && !inicial.buscarReceptor ? soloDigitos(d0.receptor.docNro) : "")
  async function buscarCliente(doc: string) {
    if (ultimaBusqueda.current === doc) return
    ultimaBusqueda.current = doc
    setBusqueda({ estado: "buscando" })
    try {
      const r = await fetch(`/api/admin/facturacion/padron?doc=${doc}`)
      const j = await r.json()
      if (!r.ok) throw new Error(j.error)
      setReceptor((prev) => ({ ...prev, ...j.cliente, email: j.cliente.email || prev.email }))
      setBusqueda({ estado: "ok", fuente: j.fuente, mensaje: j.aviso })
    } catch (e) {
      setBusqueda({ estado: "error", mensaje: (e as Error).message })
    }
  }

  useEffect(() => {
    const doc = soloDigitos(receptor.docNro)
    if ((receptor.docTipo === 80 || receptor.docTipo === 86) && doc.length === 11) {
      if (!cuitValido(doc)) {
        setBusqueda({ estado: "error", mensaje: "El CUIT no es válido: revisá los números" })
        return
      }
      const t = setTimeout(() => buscarCliente(doc), 250)
      return () => clearTimeout(t)
    }
    if (doc.length < 11) ultimaBusqueda.current = ""
  }, [receptor.docNro, receptor.docTipo])

  // Si cambia la letra y la condición del cliente ya no corresponde, se avisa en la validación
  useEffect(() => {
    if (moneda === "PES") setCotizacion(1)
  }, [moneda])

  async function traerCotizacion() {
    try {
      const r = await fetch(`/api/admin/facturacion/cotizacion?moneda=${moneda}`)
      const j = await r.json()
      if (!r.ok) throw new Error(j.error)
      setCotizacion(j.valor)
    } catch (e) {
      setErrores([`No se pudo traer la cotización de ARCA: ${(e as Error).message}`])
    }
  }

  function elegirCliente(c: Receptor) {
    ultimaBusqueda.current = soloDigitos(c.docNro)
    setReceptor({ ...receptorVacio, ...c })
    setBusqueda({ estado: "ok", fuente: "agenda" })
  }

  function elegirAsociado(id: string) {
    const f = facturas.find((x) => x.id === id)
    if (!f) return setAsociado(undefined)
    setAsociado({ tipo: f.tipo, puntoVenta: f.puntoVenta, numero: f.numero, fecha: f.fecha })
  }

  const actualizarItem = (i: number, cambio: Partial<Item>) => setItems((xs) => xs.map((x, j) => (j === i ? { ...x, ...cambio } : x)))

  // ── Envío ──────────────────────────────────────────────────────────────────

  function armarDatos(): DatosComprobante {
    return {
      tipo: tipo?.codigo ?? 0,
      fecha,
      concepto,
      servicioDesde: servicios ? servicioDesde : undefined,
      servicioHasta: servicios ? servicioHasta : undefined,
      vencimientoPago: pideVto ? vencimientoPago : undefined,
      receptor: receptor.docTipo === 99 ? { ...receptor, docNro: "0", condicionIva: 5 } : receptor,
      items,
      preciosConIva: conIva,
      moneda,
      cotizacion,
      condicionVenta,
      observaciones,
      asociado: necesitaAsociado ? asociado : undefined,
      anulacion,
      validezDias: modo === "presupuesto" ? validezDias : undefined,
    }
  }

  /** Chequeos rápidos para guiar antes de ir al servidor (que valida todo de nuevo). */
  function validarLocal(): string[] {
    const e: string[] = []
    if (modo === "factura" && !tipo) e.push(`No existe ese tipo de comprobante para la letra ${letra}`)
    if (receptor.docTipo !== 99 && !receptor.nombre.trim()) e.push("Falta el nombre del cliente")
    if (receptor.docTipo !== 99 && !soloDigitos(receptor.docNro)) e.push("Falta el documento del cliente")
    if (!items.some((it) => it.descripcion.trim())) e.push("Agregá al menos un ítem con descripción")
    if (!(totales.total > 0)) e.push("El total tiene que ser mayor a cero")
    if (necesitaAsociado && !asociado) e.push("Elegí el comprobante que ajusta esta nota")
    if (modo === "factura" && !buscarCondicion(receptor.condicionIva)?.letras.includes(letra))
      e.push("La condición frente al IVA del cliente no corresponde a este comprobante")
    if (modo === "factura" && fce && clase === "factura" && !config.tieneCbu) e.push("Cargá el CBU en Configuración para emitir FCE MiPyME")
    return e
  }

  async function vistaPrevia() {
    const ventana = window.open("", "_blank")
    setEnviando("vista")
    try {
      const r = await fetch("/api/admin/facturacion/vista-previa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos: armarDatos() }),
      })
      if (!r.ok) throw new Error((await r.json()).error)
      const url = URL.createObjectURL(await r.blob())
      if (ventana) ventana.location.href = url
      else window.open(url, "_blank")
    } catch (e) {
      ventana?.close()
      setErrores([(e as Error).message])
    } finally {
      setEnviando(false)
    }
  }

  function pedirEnvio() {
    const e = validarLocal()
    setErrores(e)
    if (e.length) return
    if (modo === "presupuesto") enviar()
    else setConfirmar(true)
  }

  async function enviar() {
    setConfirmar(false)
    setEnviando("guardar")
    setErrores([])
    try {
      const esP = modo === "presupuesto"
      const r = await fetch(esP ? "/api/admin/facturacion/presupuestos" : "/api/admin/facturacion/emitir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(esP ? { datos: armarDatos(), id: inicial.editarId } : { datos: armarDatos(), presupuestoId: inicial.presupuestoId }),
      })
      const j = await r.json()
      if (!r.ok) {
        setErrores(j.errores ?? [j.error ?? "No se pudo guardar"])
        return
      }
      router.push(`/admin/facturacion/${encodeURIComponent(j.id)}?nuevo=1`)
      router.refresh()
    } catch (e) {
      setErrores([`Error de conexión: ${(e as Error).message}`])
    } finally {
      setEnviando(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const nombreTipo = modo === "presupuesto" ? "Presupuesto" : (tipo?.nombre ?? "—")
  const bloqueado = modo === "factura" && !config.arcaListo

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">
      <div className="space-y-4 min-w-0">
        {/* Qué se emite */}
        <Tarjeta>
          <div className="flex flex-col gap-4">
            {!inicial.editarId && !inicial.presupuestoId && (
              <div className="flex flex-wrap items-center gap-3">
                <Segmentos
                  valor={modo}
                  onCambio={(v) => setModo(v)}
                  opciones={[
                    { valor: "factura", etiqueta: "Comprobante ARCA" },
                    { valor: "presupuesto", etiqueta: "Presupuesto" },
                  ]}
                />
              </div>
            )}
            {modo === "factura" && (
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5">
                <div>
                  <Etiqueta>Tipo</Etiqueta>
                  <Segmentos<ClaseCbte>
                    tam="sm"
                    valor={clase}
                    onCambio={(c) => {
                      setClase(c)
                      if (c === "recibo") setFce(false)
                    }}
                    opciones={[
                      { valor: "factura", etiqueta: "Factura" },
                      { valor: "nc", etiqueta: "Nota de crédito" },
                      { valor: "nd", etiqueta: "Nota de débito" },
                      { valor: "recibo", etiqueta: "Recibo", deshabilitado: letra === "M" },
                    ]}
                  />
                </div>
                {clase !== "recibo" && (
                  <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none pb-1.5" style={{ color: tinta.media }}>
                    <input type="checkbox" checked={fce} onChange={(e) => setFce(e.target.checked)} className="accent-[#e0642f] w-4 h-4" />
                    Factura de Crédito MiPyME
                  </label>
                )}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-base font-bold text-white"
                style={{ background: "rgba(224,100,47,0.18)", border: "1px solid rgba(224,100,47,0.4)" }}
              >
                {modo === "presupuesto" ? "X" : letra}
              </span>
              <span className="text-white font-semibold">{nombreTipo}</span>
              {modo === "factura" && (
                <span style={{ color: tinta.suave }}>
                  · Punto de venta {String(config.puntoVenta).padStart(5, "0")}
                  {esRI && ` · letra ${letra} por ser cliente ${buscarCondicion(receptor.condicionIva)?.nombre ?? ""}`}
                </span>
              )}
            </div>
            {fce && modo === "factura" && (
              <Aviso tono="info">
                La FCE MiPyME es obligatoria cuando el cliente es una empresa grande inscripta en el régimen y el monto supera el mínimo vigente.
                El cliente tiene 30 días para aceptarla o rechazarla en ARCA.
              </Aviso>
            )}
          </div>
        </Tarjeta>

        {/* Cliente */}
        <Tarjeta
          titulo="Cliente"
          accion={
            busqueda.estado === "ok" && busqueda.fuente ? (
              <span className="inline-flex items-center gap-1 text-xs" style={{ color: "rgba(110,231,183,0.9)" }}>
                <Icono d={ICONOS.check} className="w-3.5 h-3.5" />
                {busqueda.fuente === "arca" ? "Datos traídos de ARCA" : "De tu agenda"}
              </span>
            ) : null
          }
        >
          {clientes.length > 0 && !receptor.nombre && (
            <div className="mb-4">
              <Etiqueta>Clientes recientes</Etiqueta>
              <div className="flex flex-wrap gap-1.5">
                {clientes.slice(0, 8).map((c) => (
                  <button
                    key={`${c.docTipo}-${c.docNro}`}
                    type="button"
                    onClick={() => elegirCliente(c)}
                    className="rounded-full px-3 py-1 text-xs transition-colors hover:text-white"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: tinta.media }}
                  >
                    {c.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid sm:grid-cols-[140px_1fr] gap-3">
            <Campo etiqueta="Documento">
              <Selector
                value={receptor.docTipo}
                onChange={(e) => {
                  const docTipo = Number(e.target.value)
                  setReceptor((r) => ({ ...r, docTipo, ...(docTipo === 99 ? { docNro: "", nombre: "Consumidor Final", condicionIva: 5 } : {}) }))
                  setBusqueda({ estado: "idle" })
                }}
              >
                {TIPOS_DOC.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id === 99 ? "Consumidor final" : t.nombre}
                  </option>
                ))}
              </Selector>
            </Campo>
            {receptor.docTipo !== 99 ? (
              <Campo
                etiqueta={receptor.docTipo === 80 ? "CUIT — se completa solo" : "Número"}
                ayuda={busqueda.estado === "buscando" ? "Buscando en ARCA…" : undefined}
              >
                <div className="relative">
                  <Entrada
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder={receptor.docTipo === 80 ? "30-12345678-9" : ""}
                    value={receptor.docNro}
                    onChange={(e) => setReceptor((r) => ({ ...r, docNro: e.target.value }))}
                    onBlur={() => {
                      const d = soloDigitos(receptor.docNro)
                      if (d && d.length !== 11 && clientes.some((c) => c.docNro === d)) buscarCliente(d)
                    }}
                  />
                  {busqueda.estado === "buscando" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-[#e0642f] animate-spin" />
                  )}
                </div>
              </Campo>
            ) : (
              <div className="text-sm self-end pb-2" style={{ color: tinta.suave }}>
                Sin identificar. Si el monto supera el tope de ARCA para consumidores finales, hay que identificar al cliente.
              </div>
            )}
          </div>

          {busqueda.estado === "error" && <p className="text-xs mt-2" style={{ color: "rgba(253,164,175,0.95)" }}>{busqueda.mensaje} — podés completar los datos a mano.</p>}
          {busqueda.mensaje && busqueda.estado === "ok" && <p className="text-xs mt-2" style={{ color: "rgba(253,230,138,0.9)" }}>{busqueda.mensaje}</p>}

          {receptor.docTipo !== 99 && (
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <Campo etiqueta="Nombre o razón social" className="sm:col-span-2">
                <Entrada value={receptor.nombre} onChange={(e) => setReceptor((r) => ({ ...r, nombre: e.target.value }))} />
              </Campo>
              <Campo etiqueta="Condición frente al IVA">
                <Selector value={receptor.condicionIva} onChange={(e) => setReceptor((r) => ({ ...r, condicionIva: Number(e.target.value) }))}>
                  {condicionesValidas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                  {!condicionesValidas.some((c) => c.id === receptor.condicionIva) && (
                    <option value={receptor.condicionIva}>{buscarCondicion(receptor.condicionIva)?.nombre} (no válida para {letra})</option>
                  )}
                </Selector>
              </Campo>
              <Campo etiqueta="Email" ayuda="opcional">
                <Entrada type="email" value={receptor.email} onChange={(e) => setReceptor((r) => ({ ...r, email: e.target.value }))} />
              </Campo>
              <Campo etiqueta="Domicilio" className="sm:col-span-2">
                <Entrada value={receptor.domicilio} onChange={(e) => setReceptor((r) => ({ ...r, domicilio: e.target.value }))} />
              </Campo>
            </div>
          )}
        </Tarjeta>

        {/* Comprobante asociado (NC / ND) */}
        {necesitaAsociado && (
          <Tarjeta titulo={clase === "nc" ? "¿Qué factura corrige o anula?" : "¿Sobre qué factura es el débito?"}>
            {asociables.length ? (
              <Selector
                value={facturas.find((f) => asociado && f.tipo === asociado.tipo && f.numero === asociado.numero && f.puntoVenta === asociado.puntoVenta)?.id ?? ""}
                onChange={(e) => elegirAsociado(e.target.value)}
              >
                <option value="">Elegí un comprobante…</option>
                {asociables.map((f) => (
                  <option key={f.id} value={f.id}>
                    {tipoCbte(f.tipo)?.nombre} {numeroCbte(f.puntoVenta, f.numero)} · {fechaAr(f.fecha)} · {f.cliente} · {dinero(f.total, f.moneda)}
                  </option>
                ))}
              </Selector>
            ) : (
              <p className="text-sm" style={{ color: tinta.suave }}>No hay facturas {letra} emitidas en este entorno para asociar.</p>
            )}
            {fce && (
              <label className="inline-flex items-center gap-2 text-sm mt-3 cursor-pointer" style={{ color: tinta.media }}>
                <input type="checkbox" checked={anulacion} onChange={(e) => setAnulacion(e.target.checked)} className="accent-[#e0642f] w-4 h-4" />
                Es una anulación (la factura de crédito fue rechazada por el cliente)
              </label>
            )}
          </Tarjeta>
        )}

        {/* Detalle */}
        <Tarjeta titulo="Detalle">
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div>
              <Etiqueta>Concepto</Etiqueta>
              <Segmentos tam="sm" valor={concepto} onCambio={setConcepto} opciones={CONCEPTOS.map((c) => ({ valor: c.id as number, etiqueta: c.nombre }))} />
            </div>
            {discrimina && (
              <label className="inline-flex items-center gap-2 text-sm cursor-pointer select-none pb-1.5" style={{ color: tinta.media }}>
                <input type="checkbox" checked={conIva} onChange={(e) => setPreciosConIva(e.target.checked)} className="accent-[#e0642f] w-4 h-4" />
                Los precios incluyen IVA
              </label>
            )}
          </div>

          {/* Ítems: tarjetas en mobile, grilla en desktop */}
          <div className="space-y-2">
            <div
              className={`hidden md:grid gap-2 text-[10px] font-semibold uppercase tracking-widest px-1 ${discrimina ? "md:grid-cols-[minmax(0,1fr)_70px_120px_64px_84px_110px_32px]" : "md:grid-cols-[minmax(0,1fr)_70px_120px_64px_110px_32px]"}`}
              style={{ color: tinta.tenue }}
            >
              <span>Descripción</span>
              <span className="text-right">Cant.</span>
              <span className="text-right">Precio unit.</span>
              <span className="text-right">Bonif. %</span>
              {discrimina && <span>IVA</span>}
              <span className="text-right">Subtotal</span>
              <span />
            </div>
            {items.map((it, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 gap-2 p-3 md:p-0 rounded-lg md:rounded-none ${discrimina ? "md:grid-cols-[minmax(0,1fr)_70px_120px_64px_84px_110px_32px]" : "md:grid-cols-[minmax(0,1fr)_70px_120px_64px_110px_32px]"} md:items-center`}
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <Entrada
                  className="col-span-2 md:col-span-1"
                  placeholder="Ej.: Gestión de redes sociales — octubre"
                  aria-label="Descripción"
                  value={it.descripcion}
                  onChange={(e) => actualizarItem(i, { descripcion: e.target.value })}
                />
                <Entrada type="number" min={0} step="any" aria-label="Cantidad" className="text-right tabular" value={it.cantidad} onChange={(e) => actualizarItem(i, { cantidad: Number(e.target.value) })} />
                <Entrada type="number" min={0} step="0.01" aria-label="Precio unitario" className="text-right tabular" value={it.precio || ""} placeholder="0,00" onChange={(e) => actualizarItem(i, { precio: Number(e.target.value) })} />
                <Entrada type="number" min={0} max={100} step="any" aria-label="Bonificación" className="text-right tabular" value={it.bonificacion || ""} placeholder="0" onChange={(e) => actualizarItem(i, { bonificacion: Number(e.target.value) })} />
                {discrimina && (
                  <Selector aria-label="Alícuota de IVA" value={it.iva} onChange={(e) => actualizarItem(i, { iva: Number(e.target.value) })}>
                    {ALICUOTAS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre}
                      </option>
                    ))}
                  </Selector>
                )}
                <div className="text-right text-sm font-semibold text-white tabular self-center">{dinero(subtotalItem(it) / 100, moneda)}</div>
                <button
                  type="button"
                  onClick={() => setItems((xs) => (xs.length > 1 ? xs.filter((_, j) => j !== i) : [itemVacio()]))}
                  className="icon-btn justify-self-end"
                  aria-label="Quitar ítem"
                  title="Quitar ítem"
                >
                  <Icono d={ICONOS.basura} className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <Boton onClick={() => setItems((xs) => [...xs, { ...itemVacio(), iva: xs[xs.length - 1]?.iva ?? 5 }])} className="mt-1">
              <Icono d={ICONOS.mas} className="w-3.5 h-3.5" /> Agregar ítem
            </Boton>
          </div>
        </Tarjeta>

        {/* Fechas */}
        <Tarjeta titulo="Fechas">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Campo etiqueta={modo === "presupuesto" ? "Fecha" : "Emisión"}>
              <Entrada type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </Campo>
            {modo === "presupuesto" ? (
              <Campo etiqueta="Validez" ayuda={`hasta ${fechaAr(sumarDias(fecha, validezDias || 0))}`}>
                <div className="relative">
                  <Entrada type="number" min={1} value={validezDias} onChange={(e) => setValidezDias(Number(e.target.value))} className="pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: tinta.tenue }}>días</span>
                </div>
              </Campo>
            ) : null}
            {servicios && (
              <>
                <Campo etiqueta="Servicio desde">
                  <Entrada type="date" value={servicioDesde} onChange={(e) => setServicioDesde(e.target.value)} />
                </Campo>
                <Campo etiqueta="Servicio hasta">
                  <Entrada type="date" value={servicioHasta} onChange={(e) => setServicioHasta(e.target.value)} />
                </Campo>
              </>
            )}
            {pideVto && (
              <Campo etiqueta="Vence el pago">
                <Entrada type="date" value={vencimientoPago} onChange={(e) => setVencimientoPago(e.target.value)} />
              </Campo>
            )}
          </div>
          {modo === "factura" && (
            <p className="text-xs mt-3" style={{ color: tinta.tenue }}>
              ARCA acepta fecha de emisión hasta {servicios ? 10 : 5} días antes o después de hoy.
            </p>
          )}
        </Tarjeta>

        {/* Más opciones */}
        <Tarjeta
          titulo="Pago y observaciones"
          accion={
            <button type="button" onClick={() => setMasOpciones((v) => !v)} className="text-xs" style={{ color: "rgba(224,100,47,0.85)" }}>
              {masOpciones ? "Ocultar moneda" : "Cambiar moneda"}
            </button>
          }
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <Campo etiqueta="Condición de venta">
              <Selector value={condicionVenta} onChange={(e) => setCondicionVenta(e.target.value)}>
                {CONDICIONES_VENTA.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </Selector>
            </Campo>
            {masOpciones && (
              <div className="grid grid-cols-[1fr_1fr] gap-2">
                <Campo etiqueta="Moneda">
                  <Selector value={moneda} onChange={(e) => setMoneda(e.target.value)}>
                    {MONEDAS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </Selector>
                </Campo>
                {moneda !== "PES" && (
                  <Campo
                    etiqueta="Cotización"
                    ayuda={
                      config.arcaListo ? (
                        <button type="button" onClick={traerCotizacion} className="underline">
                          traer de ARCA
                        </button>
                      ) : undefined
                    }
                  >
                    <Entrada type="number" step="0.000001" min={0} value={cotizacion} onChange={(e) => setCotizacion(Number(e.target.value))} />
                  </Campo>
                )}
              </div>
            )}
            <Campo etiqueta="Observaciones" ayuda="se imprimen en el PDF" className="sm:col-span-2">
              <textarea
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                className="input-orion w-full rounded-lg px-3 py-2 text-sm resize-y"
                placeholder={modo === "presupuesto" ? "Alcance, plazos de entrega, forma de pago…" : "Orden de compra, referencia, período…"}
              />
            </Campo>
          </div>
        </Tarjeta>
      </div>

      {/* Resumen fijo */}
      <aside className="lg:sticky lg:top-20 space-y-3">
        <Tarjeta titulo="Resumen">
          <dl className="space-y-1.5 text-sm">
            {discrimina ? (
              <>
                <Fila etiqueta="Neto gravado" valor={dinero(totales.neto, moneda)} />
                {totales.ivas.map((a) => (
                  <Fila key={a.id} etiqueta={`IVA ${alicuota(a.id)?.nombre}`} valor={dinero(a.importe, moneda)} />
                ))}
                {totales.exento > 0 && <Fila etiqueta="Exento" valor={dinero(totales.exento, moneda)} />}
                {totales.noGravado > 0 && <Fila etiqueta="No gravado" valor={dinero(totales.noGravado, moneda)} />}
              </>
            ) : (
              <Fila etiqueta={`${items.filter((i) => i.descripcion).length} ítem(s)`} valor={dinero(totales.total, moneda)} />
            )}
          </dl>
          <div className="mt-3 pt-3 border-t flex items-baseline justify-between" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <span className="text-xs uppercase tracking-widest" style={{ color: tinta.suave }}>Total</span>
            <span className="text-2xl font-bold text-white tabular">{dinero(totales.total, moneda)}</span>
          </div>
          {moneda !== "PES" && cotizacion > 0 && (
            <p className="text-xs text-right mt-1 tabular" style={{ color: tinta.tenue }}>≈ {dinero(totales.total * cotizacion)}</p>
          )}

          {errores.length > 0 && (
            <div className="mt-4">
              <Aviso tono="error">
                <ul className="space-y-1 list-disc pl-4">
                  {errores.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </Aviso>
            </div>
          )}

          {bloqueado && (
            <div className="mt-4">
              <Aviso tono="alerta">
                Falta configurar ARCA para emitir. <a href="/admin/facturacion/configuracion" className="underline">Ir a Configuración</a>
              </Aviso>
            </div>
          )}

          <div className="mt-4 grid gap-2">
            <Boton variante="primario" onClick={pedirEnvio} disabled={!!enviando || bloqueado} className="w-full py-2.5">
              {enviando === "guardar" ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Icono d={modo === "presupuesto" ? ICONOS.check : ICONOS.rayo} />
              )}
              {modo === "presupuesto" ? (inicial.editarId ? "Guardar cambios" : "Guardar presupuesto") : `Emitir ${nombreTipo}`}
            </Boton>
            <Boton onClick={vistaPrevia} disabled={!!enviando} className="w-full">
              <Icono d={ICONOS.ojo} /> {enviando === "vista" ? "Generando…" : "Vista previa del PDF"}
            </Boton>
          </div>
          {modo === "factura" && config.entorno === "homologacion" && (
            <p className="text-[11px] mt-3 leading-relaxed" style={{ color: "rgba(253,230,138,0.8)" }}>
              Modo homologación: se emite contra el servidor de pruebas de ARCA, sin validez fiscal.
            </p>
          )}
        </Tarjeta>
      </aside>

      {/* Confirmación de emisión */}
      {confirmar && tipo && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" style={{ background: "rgba(4,3,14,0.75)", backdropFilter: "blur(4px)" }} role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl p-5" style={{ background: "#0e0c22", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3 className="text-lg font-bold text-white">¿Emitir {tipo.nombre}?</h3>
            <dl className="mt-4 space-y-1.5 text-sm">
              <Fila etiqueta="Cliente" valor={receptor.nombre || "Consumidor Final"} />
              <Fila etiqueta="Fecha" valor={fechaAr(fecha)} />
              <Fila etiqueta="Total" valor={dinero(totales.total, moneda)} fuerte />
            </dl>
            <p className="text-xs mt-4 leading-relaxed" style={{ color: tinta.suave }}>
              {config.entorno === "produccion"
                ? "Queda registrado en ARCA con validez fiscal. Una vez emitido no se puede borrar: solo se corrige con una nota de crédito."
                : "Es un comprobante de prueba (homologación), sin validez fiscal."}
            </p>
            <div className="mt-5 flex gap-2 justify-end">
              <Boton onClick={() => setConfirmar(false)}>Revisar</Boton>
              <Boton variante="primario" onClick={enviar}>
                <Icono d={ICONOS.rayo} /> Emitir
              </Boton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Fila({ etiqueta, valor, fuerte }: { etiqueta: string; valor: string; fuerte?: boolean }) {
  return (
    <div className="flex justify-between gap-3">
      <dt style={{ color: tinta.suave }}>{etiqueta}</dt>
      <dd className={`tabular text-right ${fuerte ? "font-bold text-white" : ""}`} style={fuerte ? undefined : { color: tinta.media }}>
        {valor}
      </dd>
    </div>
  )
}
