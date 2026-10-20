"use client"

import { useRouter } from "next/navigation"
import { useState, type ReactNode } from "react"
import type { ConfigFacturacion } from "@/lib/facturacion/config"
import type { EstadoCertificado } from "@/lib/facturacion/arca"
import { fechaAr, formatoCuit } from "@/lib/facturacion/modelo"
import { Aviso, Boton, Campo, Entrada, Icono, ICONOS, Segmentos, Selector, Tarjeta, tinta } from "./ui"

interface Props {
  configInicial: ConfigFacturacion
  certInicial: EstadoCertificado
  almacenamiento: "redis" | "local"
  cuitFijo: boolean
  enVercel: boolean
}

type Paso = { nombre: string; ok: boolean; detalle: string }

async function api<T>(url: string, metodo: "POST" | "PUT", cuerpo: unknown): Promise<T> {
  const r = await fetch(url, { method: metodo, headers: { "Content-Type": "application/json" }, body: JSON.stringify(cuerpo) })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(j.errores?.join(" · ") ?? j.error ?? "Error inesperado")
  return j as T
}

function descargar(nombre: string, contenido: string) {
  const url = URL.createObjectURL(new Blob([contenido], { type: "application/octet-stream" }))
  const a = Object.assign(document.createElement("a"), { href: url, download: nombre })
  a.click()
  URL.revokeObjectURL(url)
}

/** Lee un .crt/.key. Si viene en binario (DER, típico de algunos .cer), lo pasa a PEM. */
async function leerArchivo(f: File, tipo: "crt" | "key"): Promise<string> {
  const bytes = new Uint8Array(await f.arrayBuffer())
  const texto = new TextDecoder().decode(bytes)
  if (texto.includes("-----BEGIN")) return texto
  if (tipo === "key") return texto // el servidor explica el error
  let bin = ""
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  const b64 = btoa(bin).match(/.{1,64}/g)?.join("\n") ?? ""
  return `-----BEGIN CERTIFICATE-----\n${b64}\n-----END CERTIFICATE-----\n`
}

/** Zona para soltar o elegir un archivo. */
function ZonaArchivo({
  etiqueta,
  ayuda,
  accept,
  tipo,
  archivo,
  onArchivo,
}: {
  etiqueta: string
  ayuda: string
  accept: string
  tipo: "crt" | "key"
  archivo: { nombre: string } | null
  onArchivo: (nombre: string, contenido: string) => void
}) {
  const [encima, setEncima] = useState(false)
  const tomar = async (f?: File | null) => f && onArchivo(f.name, await leerArchivo(f, tipo))
  return (
    <label
      onDragOver={(e) => {
        e.preventDefault()
        setEncima(true)
      }}
      onDragLeave={() => setEncima(false)}
      onDrop={(e) => {
        e.preventDefault()
        setEncima(false)
        tomar(e.dataTransfer.files?.[0])
      }}
      className="flex flex-col items-center justify-center text-center gap-1.5 rounded-xl px-4 py-5 cursor-pointer transition-colors border border-dashed"
      style={{
        borderColor: archivo ? "rgba(52,211,153,0.45)" : encima ? "rgba(224,100,47,0.7)" : "rgba(255,255,255,0.14)",
        background: archivo ? "rgba(52,211,153,0.06)" : encima ? "rgba(224,100,47,0.08)" : "rgba(255,255,255,0.02)",
      }}
    >
      <input type="file" accept={accept} className="sr-only" onChange={(e) => tomar(e.target.files?.[0])} />
      <span
        className="w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold"
        style={archivo ? { background: "rgba(52,211,153,0.15)", color: "#34d399" } : { background: "rgba(224,100,47,0.12)", color: "#f4aa82" }}
      >
        {archivo ? <Icono d={ICONOS.check} className="w-4 h-4" /> : `.${tipo}`}
      </span>
      <span className="text-sm font-medium text-white">{etiqueta}</span>
      <span className="text-xs break-all" style={{ color: archivo ? "rgba(110,231,183,0.9)" : tinta.tenue }}>
        {archivo ? archivo.nombre : ayuda}
      </span>
    </label>
  )
}

export function PanelConfiguracion({ configInicial, certInicial, almacenamiento, cuitFijo, enVercel }: Props) {
  const router = useRouter()
  const [cfg, setCfg] = useState(configInicial)
  const [guardada, setGuardada] = useState(configInicial)
  const [cert, setCert] = useState(certInicial)
  const [ocupado, setOcupado] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState<{ tono: "ok" | "error" | "info"; texto: ReactNode } | null>(null)
  const [pasos, setPasos] = useState<Paso[] | null>(null)
  const [pedido, setPedido] = useState<{ csr: string; clave: string } | null>(null)
  const [crt, setCrt] = useState<{ nombre: string; contenido: string } | null>(null)
  const [key, setKey] = useState<{ nombre: string; contenido: string } | null>(null)
  const [reemplazar, setReemplazar] = useState(false)

  const homo = cfg.entorno === "homologacion"
  const cambios = JSON.stringify(cfg) !== JSON.stringify(guardada)
  const certOk = cert.tieneCertificado && cert.tieneClave && cert.parOk !== false && (cert.certificado?.diasRestantes ?? -1) >= 0
  const base = `orion-${cfg.cuit}-${cfg.entorno}`

  const set = <K extends keyof ConfigFacturacion>(k: K, v: ConfigFacturacion[K]) => setCfg((c) => ({ ...c, [k]: v }))

  async function correr(nombre: string, fn: () => Promise<void>) {
    setOcupado(nombre)
    setMensaje(null)
    try {
      await fn()
    } catch (e) {
      setMensaje({ tono: "error", texto: (e as Error).message })
    } finally {
      setOcupado(null)
    }
  }

  const guardar = (extra: Partial<ConfigFacturacion> = {}) =>
    correr("guardar", async () => {
      const nueva = await api<ConfigFacturacion>("/api/admin/facturacion/config", "PUT", { ...cfg, ...extra })
      setCfg(nueva)
      setGuardada(nueva)
      setMensaje({ tono: "ok", texto: "Configuración guardada." })
      router.refresh()
    })

  /** Cambiar de entorno cambia de certificado: se guarda y se recarga el estado. */
  const cambiarEntorno = (entorno: ConfigFacturacion["entorno"]) =>
    correr("entorno", async () => {
      const nueva = await api<ConfigFacturacion>("/api/admin/facturacion/config", "PUT", { ...cfg, entorno })
      setCfg(nueva)
      setGuardada(nueva)
      const r = await fetch("/api/admin/facturacion/arca").then((x) => x.json())
      setCert(r.certificado)
      setPasos(null)
      router.refresh()
    })

  const generarCsr = () =>
    correr("csr", async () => {
      const r = await api<{ csr: string; clave: string }>("/api/admin/facturacion/arca", "POST", { accion: "csr" })
      setPedido(r)
      setReemplazar(true)
      descargar(`${base}.csr`, r.csr)
      setCert((c) => ({ ...c, clavePendiente: true }))
    })

  const subirCertificado = () =>
    correr("cert", async () => {
      if (!crt) throw new Error("Elegí el archivo .crt")
      const r = await api<{ certificado: EstadoCertificado }>("/api/admin/facturacion/arca", "POST", {
        accion: "certificado",
        cert: crt.contenido,
        clave: key?.contenido,
      })
      setCert(r.certificado)
      setCrt(null)
      setKey(null)
      setPedido(null)
      setReemplazar(false)
      setMensaje({ tono: "ok", texto: "Certificado y clave cargados. Ahora autorizá los servicios y probá la conexión." })
    })

  const bajarCrt = () =>
    correr("crt", async () => {
      const r = await api<{ crt: string | null }>("/api/admin/facturacion/arca", "POST", { accion: "crt" })
      if (r.crt) descargar(`${cfg.entorno}.crt`, r.crt)
    })

  const probar = () =>
    correr("probar", async () => {
      const r = await api<{ pasos: Paso[] }>("/api/admin/facturacion/arca", "POST", { accion: "probar" })
      setPasos(r.pasos)
    })

  const autocompletar = () =>
    correr("auto", async () => {
      const r = await api<{ config: ConfigFacturacion }>("/api/admin/facturacion/arca", "POST", { accion: "autocompletar" })
      setCfg(r.config)
      setGuardada(r.config)
      setMensaje({ tono: "ok", texto: "Datos del emisor completados desde el padrón de ARCA. Revisalos y completá lo que falte." })
      router.refresh()
    })

  const borrar = () =>
    confirm("¿Quitar el certificado y la clave de este entorno? Vas a tener que volver a cargarlos para facturar.") &&
    correr("borrar", async () => {
      const r = await api<{ certificado: EstadoCertificado }>("/api/admin/facturacion/arca", "POST", { accion: "borrar" })
      setCert(r.certificado)
      setPasos(null)
    })

  const portal = homo
    ? { nombre: "WSASS – Autogestión Certificados Homologación", servicio: "WSASS" }
    : { nombre: "Administración de Certificados Digitales", servicio: "Administración de Certificados Digitales" }

  return (
    <div className="space-y-4">
      {almacenamiento === "local" && (
        <Aviso tono={enVercel ? "error" : "info"}>
          {enVercel ? (
            <>
              <b>Falta la base de datos.</b> En Vercel → Storage → Marketplace agregá <b>Upstash Redis</b> y conectalo a este proyecto
              (crea <code>KV_REST_API_URL</code> y <code>KV_REST_API_TOKEN</code>). Sin eso no se guardan facturas ni el certificado.
            </>
          ) : (
            <>
              Modo local: los datos se guardan en <code>.data/panel.json</code>. En producción usá Upstash Redis
              (<code>KV_REST_API_URL</code> / <code>KV_REST_API_TOKEN</code>).
            </>
          )}
        </Aviso>
      )}

      {mensaje && <Aviso tono={mensaje.tono}>{mensaje.texto}</Aviso>}

      {/* Entorno */}
      <Tarjeta titulo="Entorno de ARCA">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="text-sm" style={{ color: tinta.media }}>
            CUIT emisor <b className="text-white tabular">{formatoCuit(cfg.cuit)}</b>
            <span className="block text-xs mt-0.5" style={{ color: tinta.tenue }}>
              {homo ? "Homologación: servidor de pruebas, sin validez fiscal. Ideal para probar todo antes." : "Producción: los comprobantes tienen validez fiscal."}
            </span>
          </div>
          <Segmentos
            valor={cfg.entorno}
            onCambio={(v) => {
              if (v === "produccion" && !confirm("¿Pasar a PRODUCCIÓN? Desde ahí las facturas tienen validez fiscal. Necesitás un certificado de producción.")) return
              cambiarEntorno(v)
            }}
            opciones={[
              { valor: "homologacion", etiqueta: "Homologación" },
              { valor: "produccion", etiqueta: "Producción" },
            ]}
          />
        </div>
      </Tarjeta>

      {/* Certificado: par .crt + .key */}
      <Tarjeta
        titulo={`Certificado digital (${homo ? "homologación" : "producción"})`}
        accion={
          cert.origen ? (
            <span className="text-xs" style={{ color: tinta.tenue }}>
              {cert.origen === "env" ? "desde variables ARCA_CERT / ARCA_KEY" : cert.origen === "archivos" ? `desde arca/${cfg.entorno}.crt + .key` : "cargado en el panel (cifrado)"}
            </span>
          ) : null
        }
      >
        {cert.parOk === false && (
          <div className="mb-4">
            <Aviso tono="error">
              El .crt y la .key {cert.origen === "archivos" ? `de la carpeta arca/ (${cfg.entorno}.crt y ${cfg.entorno}.key)` : cert.origen === "env" ? "de ARCA_CERT / ARCA_KEY" : "cargados"} no son
              pareja: son de pedidos distintos.{" "}
              {cert.origen === "archivos"
                ? "Reemplazá esos archivos por el par correcto, o borralos para cargarlo desde el panel."
                : cert.origen === "env"
                  ? "Corregí las variables en Vercel."
                  : "Subí el par correcto."}
            </Aviso>
          </div>
        )}

        {cert.parOk === false && (cert.origen === "archivos" || cert.origen === "env") ? null : certOk && cert.certificado && !reemplazar ? (
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}>
                <Icono d={ICONOS.check} className="w-4 h-4" />
              </span>
              <div className="text-sm min-w-0" style={{ color: tinta.media }}>
                <p className="text-white font-medium">.crt y .key activos · alias “{cert.certificado.sujeto}”</p>
                <p className="text-xs mt-0.5" style={{ color: tinta.suave }}>
                  Emitido por {cert.certificado.emisor} · vence el {fechaAr(cert.certificado.vence)} ({cert.certificado.diasRestantes} días)
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Boton variante="primario" onClick={probar} disabled={!!ocupado}>
                {ocupado === "probar" ? "Probando…" : "Probar conexión con ARCA"}
              </Boton>
              <Boton
                onClick={() => setReemplazar(true)}
                disabled={!!ocupado || cert.origen !== "panel"}
                title={cert.origen !== "panel" ? "Se cambia reemplazando los archivos o variables de origen" : ""}
              >
                Reemplazar .crt y .key
              </Boton>
              <Boton onClick={bajarCrt} disabled={!!ocupado}>Descargar .crt</Boton>
              {cert.origen === "panel" && (
                <Boton variante="peligro" onClick={borrar} disabled={!!ocupado}>Quitar</Boton>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Camino corto: ya tienen el par */}
            <div>
              <p className="text-sm text-white font-medium">Subí el certificado y su clave</p>
              <p className="text-xs mt-0.5 mb-3" style={{ color: tinta.suave }}>
                Los dos archivos que usa cualquier sistema de facturación: el <code>.crt</code> que entrega ARCA y la <code>.key</code> con la que se pidió.
                {pedido || cert.clavePendiente ? " Como generaste el pedido acá, la .key ya está guardada: alcanza con el .crt." : ""}
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <ZonaArchivo
                  etiqueta="Certificado"
                  ayuda="Soltá el .crt acá o tocá para elegirlo"
                  accept=".crt,.pem,.cer,.txt"
                  tipo="crt"
                  archivo={crt}
                  onArchivo={(nombre, contenido) => setCrt({ nombre, contenido })}
                />
                <ZonaArchivo
                  etiqueta={pedido || cert.clavePendiente ? "Clave privada (opcional)" : "Clave privada"}
                  ayuda="Soltá la .key acá (sin contraseña)"
                  accept=".key,.pem,.txt"
                  tipo="key"
                  archivo={key}
                  onArchivo={(nombre, contenido) => setKey({ nombre, contenido })}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Boton variante="primario" onClick={subirCertificado} disabled={!crt || (!key && !pedido && !cert.clavePendiente) || !!ocupado}>
                  {ocupado === "cert" ? "Verificando…" : "Cargar .crt y .key"}
                </Boton>
                {reemplazar && certOk && (
                  <Boton
                    onClick={() => {
                      setReemplazar(false)
                      setCrt(null)
                      setKey(null)
                    }}
                  >
                    Cancelar
                  </Boton>
                )}
                <span className="text-[11px]" style={{ color: tinta.tenue }}>
                  Se verifica que sean pareja, del CUIT {cfg.cuit} y de {homo ? "homologación" : "producción"}. La clave se guarda cifrada.
                </span>
              </div>
            </div>

            {/* Camino largo: todavía no tienen certificado */}
            <details className="rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }} open={!!pedido}>
              <summary className="cursor-pointer text-sm text-white font-medium">¿Todavía no tenés certificado? Generalo desde acá</summary>
              <ol className="space-y-4 mt-4">
                <PasoGuia n={1} titulo="Generá la clave y el pedido" hecho={!!pedido || cert.clavePendiente}>
                  <p>
                    Se crean la <code>.key</code> (queda guardada cifrada) y el pedido <code>.csr</code> para ARCA. Bajate también la .key: es tu
                    respaldo para usar el mismo par en otro sistema.
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Boton variante="secundario" onClick={generarCsr} disabled={!!ocupado}>
                      {ocupado === "csr" ? "Generando…" : pedido || cert.clavePendiente ? "Generar otro pedido" : "Generar .csr y .key"}
                    </Boton>
                    {pedido && (
                      <>
                        <Boton onClick={() => descargar(`${base}.csr`, pedido.csr)}>Descargar .csr</Boton>
                        <Boton onClick={() => descargar(`${base}.key`, pedido.clave)}>Descargar .key</Boton>
                      </>
                    )}
                  </div>
                  {pedido && (
                    <p className="text-[11px] mt-2" style={{ color: "rgba(253,230,138,0.9)" }}>
                      Guardá la .key en un lugar seguro y no la subas a GitHub: quien la tenga puede facturar a tu nombre.
                    </p>
                  )}
                </PasoGuia>
                <PasoGuia n={2} titulo="Subí el .csr en ARCA y descargá el .crt">
                  <p>
                    Entrá a <b>arca.gob.ar</b> con tu clave fiscal → <b>{portal.nombre}</b>
                    {homo ? " (si no lo tenés, agregalo desde el Administrador de Relaciones)" : ""}.{" "}
                    {homo
                      ? "Creá un alias nuevo, pegá el contenido del .csr y guardá el certificado como .crt."
                      : "Agregá un alias (ej. orionfacturacion), subí el .csr y descargá el .crt."}
                  </p>
                </PasoGuia>
                <PasoGuia n={3} titulo="Subí el .crt arriba">
                  <p>La .key ya quedó guardada al generar el pedido, así que alcanza con el .crt.</p>
                </PasoGuia>
              </ol>
            </details>

            <p className="text-[11px]" style={{ color: tinta.tenue }}>
              En tu compu también podés dejar el par en la carpeta <code>arca/</code> del proyecto como <code>{cfg.entorno}.crt</code> y{" "}
              <code>{cfg.entorno}.key</code> (no se sube a GitHub). En Vercel cargalos acá.
            </p>
          </div>
        )}

        <div className="mt-5 pt-4 border-t text-sm space-y-2" style={{ borderColor: "rgba(255,255,255,0.06)", color: tinta.suave }}>
          <p className="text-white text-sm font-medium">Autorizaciones en ARCA (una sola vez por certificado)</p>
          <p>
            {homo ? (
              <>En <b>WSASS</b> → “Crear autorización a servicio”: autorizá el alias del certificado para <code>wsfe</code> y para <code>ws_sr_constancia_inscripcion</code>.</>
            ) : (
              <>
                En <b>Administrador de Relaciones de Clave Fiscal</b> → Nueva relación → ARCA → WebServices: agregá <b>Facturación Electrónica</b> (wsfe) y{" "}
                <b>Consulta de Constancia de Inscripción</b> (ws_sr_constancia_inscripcion), y como representante elegí el alias del certificado.
              </>
            )}
          </p>
          {!homo && (
            <p>
              Y en <b>Administración de puntos de venta y domicilios</b> creá un punto de venta del tipo{" "}
              <b>“Factura Electrónica – {cfg.condicionIva === "monotributo" ? "Monotributo – " : ""}Web Services”</b> y cargá su número abajo.
            </p>
          )}
        </div>

        {pasos && (
          <ul className="mt-4 space-y-2">
            {pasos.map((p) => (
              <li key={p.nombre} className="flex items-start gap-2.5 text-sm">
                <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: p.ok ? "rgba(52,211,153,0.15)" : "rgba(251,113,133,0.15)", color: p.ok ? "#34d399" : "#fb7185" }}>
                  <Icono d={p.ok ? ICONOS.check : ICONOS.cruz} className="w-3.5 h-3.5" />
                </span>
                <div className="min-w-0">
                  <p className="text-white">{p.nombre}</p>
                  <p className="text-xs break-words" style={{ color: tinta.suave }}>{p.detalle}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Tarjeta>

      {/* Emisor */}
      <Tarjeta
        titulo="Datos del emisor (se imprimen en los PDF)"
        accion={
          <Boton variante="secundario" onClick={autocompletar} disabled={!certOk || !!ocupado} title={certOk ? "" : "Primero cargá el certificado"}>
            {ocupado === "auto" ? "Consultando…" : "Autocompletar desde ARCA"}
          </Boton>
        }
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <Campo etiqueta="CUIT" ayuda={cuitFijo ? "fijado por ARCA_CUIT" : undefined}>
            <Entrada value={cfg.cuit} disabled={cuitFijo} onChange={(e) => set("cuit", e.target.value)} />
          </Campo>
          <Campo etiqueta="Condición frente al IVA">
            <Selector value={cfg.condicionIva} onChange={(e) => set("condicionIva", e.target.value as ConfigFacturacion["condicionIva"])}>
              <option value="monotributo">Monotributo (Factura C)</option>
              <option value="responsable_inscripto">Responsable Inscripto (A, B, M)</option>
              <option value="exento">IVA Exento (Factura C)</option>
            </Selector>
          </Campo>
          <Campo etiqueta="Razón social / Nombre" className="sm:col-span-2">
            <Entrada value={cfg.razonSocial} onChange={(e) => set("razonSocial", e.target.value)} placeholder="Como figura en ARCA" />
          </Campo>
          <Campo etiqueta="Nombre de fantasía">
            <Entrada value={cfg.nombreFantasia} onChange={(e) => set("nombreFantasia", e.target.value)} />
          </Campo>
          {cfg.condicionIva === "monotributo" && (
            <Campo etiqueta="Categoría de monotributo">
              <Entrada value={cfg.categoriaMonotributo} onChange={(e) => set("categoriaMonotributo", e.target.value)} placeholder="Ej.: D" />
            </Campo>
          )}
          <Campo etiqueta="Domicilio comercial" className="sm:col-span-2">
            <Entrada value={cfg.domicilio} onChange={(e) => set("domicilio", e.target.value)} />
          </Campo>
          <Campo etiqueta="Ingresos Brutos">
            <Entrada value={cfg.iibb} onChange={(e) => set("iibb", e.target.value)} placeholder="N° o “Exento” / “CM”" />
          </Campo>
          <Campo etiqueta="Inicio de actividades">
            <Entrada type="date" value={cfg.inicioActividades} onChange={(e) => set("inicioActividades", e.target.value)} />
          </Campo>
          <Campo etiqueta="Email">
            <Entrada value={cfg.email} onChange={(e) => set("email", e.target.value)} />
          </Campo>
          <Campo etiqueta="Teléfono">
            <Entrada value={cfg.telefono} onChange={(e) => set("telefono", e.target.value)} />
          </Campo>
          <Campo etiqueta="Web">
            <Entrada value={cfg.web} onChange={(e) => set("web", e.target.value)} />
          </Campo>
        </div>
      </Tarjeta>

      {/* Preferencias */}
      <Tarjeta titulo="Preferencias">
        <div className="grid sm:grid-cols-2 gap-3">
          <Campo etiqueta="Punto de venta" ayuda="el de Web Services">
            <Entrada type="number" min={1} max={99998} value={cfg.puntoVenta} onChange={(e) => set("puntoVenta", Number(e.target.value))} />
          </Campo>
          <Campo etiqueta="Validez de presupuestos" ayuda="días">
            <Entrada type="number" min={1} value={cfg.validezPresupuesto} onChange={(e) => set("validezPresupuesto", Number(e.target.value))} />
          </Campo>
          <Campo etiqueta="CBU" ayuda="para FCE MiPyME">
            <Entrada inputMode="numeric" value={cfg.cbu} onChange={(e) => set("cbu", e.target.value)} />
          </Campo>
          <Campo etiqueta="Alias CBU">
            <Entrada value={cfg.alias} onChange={(e) => set("alias", e.target.value)} />
          </Campo>
          <Campo etiqueta="Datos para el pago" ayuda="se imprimen en el PDF" className="sm:col-span-2">
            <textarea
              rows={3}
              value={cfg.datosPago}
              onChange={(e) => set("datosPago", e.target.value)}
              placeholder={"Banco …  ·  CBU …  ·  Alias …\nMercado Pago: …"}
              className="input-orion w-full rounded-lg px-3 py-2 text-sm resize-y"
            />
          </Campo>
          <Campo etiqueta="Leyenda al pie" className="sm:col-span-2">
            <Entrada value={cfg.leyendaPie} onChange={(e) => set("leyendaPie", e.target.value)} />
          </Campo>
        </div>
      </Tarjeta>

      <div className="sticky bottom-4 flex justify-end">
        <Boton variante="primario" onClick={() => guardar()} disabled={!cambios || !!ocupado} className="shadow-lg shadow-black/40 px-5 py-2.5">
          {ocupado === "guardar" ? "Guardando…" : cambios ? "Guardar cambios" : "Sin cambios"}
        </Boton>
      </div>
    </div>
  )
}

function PasoGuia({ n, titulo, hecho, children }: { n: number; titulo: string; hecho?: boolean; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
        style={hecho ? { background: "rgba(52,211,153,0.15)", color: "#34d399" } : { background: "rgba(224,100,47,0.15)", color: "#f4aa82" }}
      >
        {hecho ? <Icono d={ICONOS.check} className="w-3.5 h-3.5" /> : n}
      </span>
      <div className="min-w-0 text-sm" style={{ color: tinta.suave }}>
        <p className="text-white font-medium mb-1">{titulo}</p>
        {children}
      </div>
    </li>
  )
}
