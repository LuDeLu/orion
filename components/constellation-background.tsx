"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  r: number
  a: number
  twinkle: number
}

interface ShootingStar {
  x: number
  y: number
  vx: number
  vy: number
  length: number
  opacity: number
}

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let stars: Star[] = []
    let connections: Array<{ a: number; b: number; alpha: number }> = []
    let shootingStars: ShootingStar[] = []
    let raf = 0
    let lastShootingStarTime = 0
    let nextShootingDelay = 4000 + Math.random() * 4000
    let running = true
    let lastFrame = 0
    const targetFps = 30
    const minFrameMs = 1000 / targetFps

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      createStars(w, h)
    }

    const createStars = (w: number, h: number) => {
      // Densidad casi original: 1 estrella cada 9000 px²
      const count = Math.min(280, Math.floor((w * h) / 9000))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random() * 0.5 + 0.25,
        twinkle: Math.random() * 1000,
      }))

      // Precomputar conexiones — las estrellas son estáticas
      connections = []
      const maxDist = 150
      const maxDistSq = maxDist * maxDist
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x
          const dy = stars[i].y - stars[j].y
          const dSq = dx * dx + dy * dy
          if (dSq < maxDistSq) {
            const d = Math.sqrt(dSq)
            connections.push({ a: i, b: j, alpha: (1 - d / maxDist) * 0.06 })
          }
        }
      }
    }

    const createShootingStar = () => {
      const fromTop = Math.random() > 0.5
      shootingStars.push({
        x: fromTop ? Math.random() * window.innerWidth : window.innerWidth * 0.8 + Math.random() * window.innerWidth * 0.2,
        y: fromTop ? Math.random() * window.innerHeight * 0.3 : Math.random() * window.innerHeight * 0.5,
        vx: -3 - Math.random() * 2,
        vy: 2 + Math.random() * 2,
        length: 40 + Math.random() * 30,
        opacity: 1,
      })
    }

    const draw = (now: number) => {
      if (!running) return
      raf = requestAnimationFrame(draw)

      // Cap fps
      if (now - lastFrame < minFrameMs) return
      lastFrame = now

      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      // Conexiones precomputadas — agrupadas por alpha aproximada para minimizar cambios de strokeStyle
      ctx.lineWidth = 0.5
      for (let k = 0; k < connections.length; k++) {
        const c = connections[k]
        ctx.strokeStyle = `rgba(247,215,133,${c.alpha})`
        ctx.beginPath()
        ctx.moveTo(stars[c.a].x, stars[c.a].y)
        ctx.lineTo(stars[c.b].x, stars[c.b].y)
        ctx.stroke()
      }

      // Estrellas: halo + core (sin radial gradients caros)
      const t = now * 0.0003
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        const pulse = Math.sin(t + s.twinkle) * 0.15 + 0.9

        // Halo dorado tenue (un solo arc en vez de radial gradient)
        ctx.fillStyle = `rgba(247,215,133,${s.a * pulse * 0.18})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2)
        ctx.fill()

        // Core blanco
        ctx.fillStyle = `rgba(240,240,235,${s.a * pulse})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      // Shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i]
        star.x += star.vx
        star.y += star.vy
        star.opacity -= 0.012

        if (star.opacity <= 0 || star.x < -100 || star.y > h + 100) {
          shootingStars.splice(i, 1)
          continue
        }

        // Trail
        const grad = ctx.createLinearGradient(star.x, star.y, star.x - star.vx * 8, star.y - star.vy * 8)
        grad.addColorStop(0, `rgba(247, 215, 133, ${star.opacity * 0.9})`)
        grad.addColorStop(1, "rgba(247, 215, 133, 0)")
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(star.x - star.vx * 8, star.y - star.vy * 8)
        ctx.stroke()

        // Punta brillante
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2)
        ctx.fill()
      }

      if (!reduced && now - lastShootingStarTime > nextShootingDelay) {
        createShootingStar()
        lastShootingStarTime = now
        nextShootingDelay = 4000 + Math.random() * 5000
      }
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        lastFrame = 0
        raf = requestAnimationFrame(draw)
      }
    }

    resize()
    window.addEventListener("resize", resize)
    document.addEventListener("visibilitychange", onVisibility)

    if (reduced) {
      draw(performance.now())
      running = false
      cancelAnimationFrame(raf)
    } else {
      // Trigger initial shooting star at ~3s to feel "alive" desde el principio
      lastShootingStarTime = performance.now() - (nextShootingDelay - 3000)
      raf = requestAnimationFrame(draw)
    }

    return () => {
      running = false
      window.removeEventListener("resize", resize)
      document.removeEventListener("visibilitychange", onVisibility)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-20" style={{ opacity: 0.55 }} />
}
