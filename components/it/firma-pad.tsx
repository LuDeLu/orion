"use client"

import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"
import { Eraser } from "lucide-react"

/**
 * Pad de firma sobre canvas.
 *
 * Escrito a mano y no con una librería porque lo único que necesitamos es
 * capturar un trazo y sacar un PNG: traer una dependencia entera para eso
 * engorda el bundle del sitio público sin dar nada a cambio.
 *
 * La firma se dibuja a la resolución real de la pantalla (devicePixelRatio)
 * para que no salga pixelada en el PDF que después imprime el local.
 */

export interface FirmaPadHandle {
  /** dataURL PNG del trazo, o null si está vacío. */
  valor: () => string | null
  limpiar: () => void
  vacio: () => boolean
}

const ALTO = 180

export function FirmaPad({
  ref,
  etiqueta = "Firmá con el dedo o el mouse",
  onCambio,
}: {
  ref?: React.Ref<FirmaPadHandle>
  etiqueta?: string
  onCambio?: (tieneTrazo: boolean) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dibujando = useRef(false)
  const hayTrazo = useRef(false)
  const [vacio, setVacio] = useState(true)

  /** Reajusta el bitmap al ancho real del contenedor sin perder lo dibujado. */
  const ajustar = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ratio = window.devicePixelRatio || 1
    const ancho = canvas.clientWidth

    // Guardamos lo que había: cambiar width/height limpia el canvas.
    const previo = hayTrazo.current ? canvas.toDataURL() : null

    canvas.width = Math.round(ancho * ratio)
    canvas.height = Math.round(ALTO * ratio)

    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    // Tinta oscura siempre: la firma termina en un PDF sobre papel blanco.
    ctx.strokeStyle = "#14122e"

    if (previo) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, ancho, ALTO)
      img.src = previo
    }
  }, [])

  useEffect(() => {
    ajustar()
    window.addEventListener("resize", ajustar)
    return () => window.removeEventListener("resize", ajustar)
  }, [ajustar])

  const posicion = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const empezar = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    // El capture es para no perder el trazo si el dedo se va del canvas; si el
    // navegador no lo acepta, se dibuja igual.
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* seguimos sin capture */
    }
    dibujando.current = true
    const { x, y } = posicion(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const mover = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dibujando.current) return
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    const { x, y } = posicion(e)
    ctx.lineTo(x, y)
    ctx.stroke()

    if (!hayTrazo.current) {
      hayTrazo.current = true
      setVacio(false)
      onCambio?.(true)
    }
  }

  const terminar = () => {
    dibujando.current = false
  }

  const limpiar = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    hayTrazo.current = false
    setVacio(true)
    onCambio?.(false)
  }, [onCambio])

  useImperativeHandle(
    ref,
    () => ({
      valor: () => (hayTrazo.current ? (canvasRef.current?.toDataURL("image/png") ?? null) : null),
      limpiar,
      vacio: () => !hayTrazo.current,
    }),
    [limpiar],
  )

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/40">
          {etiqueta}
        </span>
        {!vacio && (
          <button
            type="button"
            onClick={limpiar}
            className="inline-flex items-center gap-1 text-xs font-medium text-foreground/50 transition-colors hover:text-foreground"
          >
            <Eraser className="h-3.5 w-3.5" />
            Borrar
          </button>
        )}
      </div>

      <div
        className="relative overflow-hidden rounded-xl"
        style={{ background: "#fcfbf9", border: "1px solid var(--hairline-strong)" }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={empezar}
          onPointerMove={mover}
          onPointerUp={terminar}
          onPointerLeave={terminar}
          onPointerCancel={terminar}
          // touch-none: sin esto, arrastrar el dedo scrollea la página en vez de firmar.
          className="block w-full cursor-crosshair touch-none"
          style={{ height: ALTO }}
          aria-label="Área para firmar"
        />
        {vacio && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-[#14122e]/25">
            Firmá acá
          </span>
        )}
        <span
          className="pointer-events-none absolute inset-x-8 bottom-9 border-b border-dashed"
          style={{ borderColor: "rgba(20,18,46,0.18)" }}
          aria-hidden
        />
      </div>
    </div>
  )
}
