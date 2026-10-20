"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

/**
 * Medición de visitas propia (ver lib/analitica.ts). Sin cookies: la sesión se
 * marca en sessionStorage solo para saber si una página es la de entrada.
 * Para no contar las visitas propias: /admin → Dashboard → "No contar este navegador".
 */
const SESION = "orion_ses"
const SIN_MEDIR = "orion_no_medir"
const INACTIVIDAD = 30 * 60_000

function enviar(datos: Record<string, unknown>) {
  const cuerpo = JSON.stringify(datos)
  try {
    if (navigator.sendBeacon?.("/api/v", new Blob([cuerpo], { type: "text/plain" }))) return
  } catch {}
  fetch("/api/v", { method: "POST", body: cuerpo, keepalive: true }).catch(() => {})
}

function desactivada() {
  try {
    return localStorage.getItem(SIN_MEDIR) === "1" || navigator.webdriver
  } catch {
    return false
  }
}

/** true si arranca una sesión nueva (primera página o más de 30 min sin actividad). */
function esEntrada(): boolean {
  try {
    const ultima = Number(sessionStorage.getItem(SESION) ?? 0)
    sessionStorage.setItem(SESION, String(Date.now()))
    return !ultima || Date.now() - ultima > INACTIVIDAD
  } catch {
    return !document.referrer || !document.referrer.includes(location.host)
  }
}

function eventoDeEnlace(href: string): string | null {
  if (/wa\.me|whatsapp\.com/i.test(href)) return "whatsapp"
  if (href.startsWith("mailto:")) return "email"
  if (href.startsWith("tel:")) return "telefono"
  if (/instagram|linkedin|facebook|tiktok|behance|youtube/i.test(href)) return "redes"
  return null
}

export function Analitica() {
  const ruta = usePathname()
  const inicio = useRef(Date.now())
  const rutaActual = useRef(ruta)

  // Página vista en cada cambio de ruta
  useEffect(() => {
    if (!ruta || ruta.startsWith("/admin") || desactivada()) return
    rutaActual.current = ruta
    inicio.current = Date.now()
    const q = new URLSearchParams(location.search)
    enviar({
      tipo: "vista",
      ruta,
      // Un link de campaña o el QR arrancan una visita nueva (como en Google Analytics)
      entrada: esEntrada() || q.has("utm_source") || q.get("qr") === "1",
      ref: document.referrer,
      utm: { source: q.get("utm_source") ?? undefined, medium: q.get("utm_medium") ?? undefined, campaign: q.get("utm_campaign") ?? undefined },
      qr: q.get("qr") === "1",
      idioma: navigator.language,
    })
    return () => {
      const segundos = Math.round((Date.now() - inicio.current) / 1000)
      if (segundos > 1) enviar({ tipo: "salida", ruta, segundos })
    }
  }, [ruta])

  // Tiempo en la última página al cerrar o cambiar de pestaña, y clics de contacto
  useEffect(() => {
    if (desactivada()) return
    const alOcultar = () => {
      if (document.visibilityState !== "hidden" || rutaActual.current?.startsWith("/admin")) return
      const segundos = Math.round((Date.now() - inicio.current) / 1000)
      if (segundos > 1) enviar({ tipo: "salida", ruta: rutaActual.current, segundos })
      inicio.current = Date.now()
    }
    const alClic = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null
      if (!a || rutaActual.current?.startsWith("/admin")) return
      const ev = eventoDeEnlace(a.getAttribute("href") ?? "")
      if (ev) enviar({ tipo: "evento", ruta: rutaActual.current, evento: ev })
    }
    document.addEventListener("visibilitychange", alOcultar)
    document.addEventListener("click", alClic, { capture: true })
    return () => {
      document.removeEventListener("visibilitychange", alOcultar)
      document.removeEventListener("click", alClic, { capture: true })
    }
  }, [])

  return null
}
