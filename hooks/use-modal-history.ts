"use client"

import { useEffect, useCallback, useRef } from "react"

/**
 * Hook personalizado para manejar el historial del navegador en modales
 * Cuando el modal se abre, añade una entrada al historial
 * Cuando el usuario presiona "atrás", cierra el modal en lugar de navegar
 */
export function useModalHistory(isOpen: boolean, onClose: () => void) {
  const historyPushedRef = useRef(false)

  // Añadir entrada al historial cuando el modal se abre
  useEffect(() => {
    if (isOpen && !historyPushedRef.current) {
      // Añadir estado al historial
      window.history.pushState({ modal: true }, "")
      historyPushedRef.current = true
    }

    // Limpiar cuando el modal se cierra manualmente (no por back)
    if (!isOpen && historyPushedRef.current) {
      historyPushedRef.current = false
    }
  }, [isOpen])

  // Manejar el evento popstate (botón atrás del navegador)
  const handlePopState = useCallback(
    (event: PopStateEvent) => {
      if (isOpen && historyPushedRef.current) {
        // Prevenir la navegación y cerrar el modal
        event.preventDefault()
        onClose()
        historyPushedRef.current = false
      }
    },
    [isOpen, onClose],
  )

  // Añadir y limpiar el listener del evento popstate
  useEffect(() => {
    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)

      // Si el modal está abierto cuando se desmonta el componente,
      // volver atrás en el historial
      if (historyPushedRef.current && isOpen) {
        window.history.back()
        historyPushedRef.current = false
      }
    }
  }, [handlePopState, isOpen])
}
