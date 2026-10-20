/**
 * Llamadas del navegador al portal. Van contra `/api/it/portal/*` (mismo
 * origen), que es el puente hacia la API de Mintaka. Ver `app/api/it/portal`.
 */

export class ErrorPortal extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    mensaje: string,
  ) {
    super(mensaje)
    this.name = "ErrorPortal"
  }
}

async function pedir<T>(ruta: string, metodo: "GET" | "POST", cuerpo?: unknown): Promise<T> {
  let res: Response
  try {
    res = await fetch(`/api/it/portal/${ruta.replace(/^\/+/, "")}`, {
      method: metodo,
      headers: cuerpo !== undefined ? { "content-type": "application/json" } : undefined,
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new ErrorPortal(0, "SIN_CONEXION", "Se cortó la conexión. Fijate la red y probá de nuevo.")
  }

  const texto = await res.text()
  let datos: unknown = null
  if (texto) {
    try {
      datos = JSON.parse(texto)
    } catch {
      datos = null
    }
  }

  if (!res.ok) {
    const e = (datos ?? {}) as { error?: string; mensaje?: string }
    throw new ErrorPortal(
      res.status,
      e.error ?? "ERROR",
      e.mensaje ?? "No pudimos completar la operación.",
    )
  }

  return datos as T
}

export const portalGet = <T>(ruta: string) => pedir<T>(ruta, "GET")
export const portalPost = <T>(ruta: string, cuerpo?: unknown) => pedir<T>(ruta, "POST", cuerpo)

/** Traduce cualquier error a un texto mostrable. */
export function mensajeDeError(err: unknown): string {
  if (err instanceof ErrorPortal) return err.message
  return "No pudimos completar la operación. Probá de nuevo."
}
