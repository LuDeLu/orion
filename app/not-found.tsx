import { NotFoundContent } from "@/components/not-found-content"

/**
 * 404 con la misma cáscara que el resto del sitio: header, footer y salidas
 * claras. Un link roto no puede terminar en una pantalla sin retorno.
 */
export default function NotFound() {
  return <NotFoundContent />
}
