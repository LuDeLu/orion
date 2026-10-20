import { conAdmin } from "@/lib/admin-api"
import { borrarCertificado, cargarCertificado, certificadoActual, credenciales, estadoCertificado, generarCsr } from "@/lib/facturacion/arca"
import { consultarPersona, domicilioCompleto, SERVICIO_PADRON } from "@/lib/facturacion/arca/padron"
import { dummy, puntosDeVenta, ultimoAutorizado } from "@/lib/facturacion/arca/wsfe"
import { guardarConfig, leerConfig } from "@/lib/facturacion/config"
import { ErrorValidacion } from "@/lib/facturacion/emitir"
import { usaRedis } from "@/lib/kv"
import { COMPROBANTES, letrasEmisor } from "@/lib/facturacion/modelo"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const mensaje = (e: unknown) => (e as Error).message

export async function GET() {
  return conAdmin(async () => {
    const cfg = await leerConfig()
    return { config: cfg, certificado: await estadoCertificado(cfg.entorno), almacenamiento: usaRedis ? "redis" : "local" }
  })
}

export async function POST(req: Request) {
  return conAdmin(async () => {
    const body = await req.json()
    const cfg = await leerConfig()

    switch (body.accion) {
      case "csr":
        return generarCsr(cfg, body.alias)

      case "crt":
        return { crt: await certificadoActual(cfg.entorno) }

      case "certificado":
        await cargarCertificado(cfg, String(body.cert ?? ""), body.clave ? String(body.clave) : undefined)
        return { certificado: await estadoCertificado(cfg.entorno) }

      case "borrar":
        await borrarCertificado(cfg.entorno)
        return { certificado: await estadoCertificado(cfg.entorno) }

      // Trae del padrón los datos del emisor y los guarda en la configuración
      case "autocompletar": {
        const p = await consultarPersona(await credenciales(SERVICIO_PADRON, cfg), cfg.cuit)
        const config = await guardarConfig({
          razonSocial: p.nombre,
          domicilio: domicilioCompleto(p),
          condicionIva: p.condicionIva === 1 ? "responsable_inscripto" : p.condicionIva === 4 ? "exento" : "monotributo",
          categoriaMonotributo: p.categoriaMonotributo ?? "",
          actividad: p.actividad ?? cfg.actividad,
        })
        return { config, persona: p }
      }

      // Diagnóstico paso a paso, sin cortar en el primer error
      case "probar": {
        const pasos: { nombre: string; ok: boolean; detalle: string }[] = []
        try {
          const d = await dummy(cfg.entorno)
          const ok = d.app === "OK" && d.db === "OK" && d.auth === "OK"
          pasos.push({ nombre: "Servidores de ARCA", ok, detalle: ok ? "Funcionando" : `App ${d.app} · Base ${d.db} · Auth ${d.auth}` })
        } catch (e) {
          pasos.push({ nombre: "Servidores de ARCA", ok: false, detalle: mensaje(e) })
        }
        try {
          const cred = await credenciales("wsfe", cfg)
          const hasta = new Date(cred.vence).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" })
          pasos.push({ nombre: "Autenticación (wsfe)", ok: true, detalle: `Acceso válido hasta ${hasta}` })
          try {
            const puntos = await puntosDeVenta(cred)
            const activo = puntos.find((p) => p.numero === cfg.puntoVenta && !p.baja && !p.bloqueado)
            pasos.push({
              nombre: "Punto de venta",
              ok: cfg.entorno === "homologacion" || !!activo,
              detalle: activo
                ? `PV ${cfg.puntoVenta} habilitado (${activo.sistema})`
                : puntos.length
                  ? `El PV ${cfg.puntoVenta} no está habilitado. Disponibles: ${puntos.map((p) => p.numero).join(", ")}`
                  : cfg.entorno === "homologacion"
                    ? "En homologación no hace falta dar de alta puntos de venta"
                    : "No hay puntos de venta para Web Services. Creá uno en ARCA → Administración de puntos de venta y domicilios",
            })
          } catch (e) {
            pasos.push({ nombre: "Punto de venta", ok: false, detalle: mensaje(e) })
          }
          try {
            const tipos = COMPROBANTES.filter((c) => letrasEmisor(cfg.condicionIva).includes(c.letra) && !c.fce && c.clase === "factura")
            const res = await Promise.all(
              tipos.map(async (t) => `${t.nombre}: último N° ${await ultimoAutorizado(cred, cfg.puntoVenta, t.codigo)}`),
            )
            pasos.push({ nombre: "Numeración", ok: true, detalle: res.join(" · ") })
          } catch (e) {
            pasos.push({ nombre: "Numeración", ok: false, detalle: mensaje(e) })
          }
        } catch (e) {
          pasos.push({ nombre: "Autenticación (wsfe)", ok: false, detalle: mensaje(e) })
        }
        try {
          const p = await consultarPersona(await credenciales(SERVICIO_PADRON, cfg), cfg.cuit)
          pasos.push({ nombre: "Padrón (autocompletar CUIT)", ok: true, detalle: `${p.nombre} · ${p.condicionIvaNombre}` })
        } catch (e) {
          pasos.push({ nombre: "Padrón (autocompletar CUIT)", ok: false, detalle: mensaje(e) })
        }
        return { pasos }
      }

      default:
        throw new ErrorValidacion(["Acción desconocida"])
    }
  })
}
