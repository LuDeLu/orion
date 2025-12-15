"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  r: number
  a: number
  twinkle: number
}

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let stars: Star[] = []
    let raf: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createStars()
    }

    const createStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 28000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.4,
        a: Math.random() * 0.5 + 0.4,
        twinkle: Math.random() * 1000,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Connections
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x
          const dy = stars[i].y - stars[j].y
          const d = Math.sqrt(dx * dx + dy * dy)

          if (d < 160) {
            ctx.strokeStyle = `rgba(247,215,133,${(1 - d / 160) * 0.12})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(stars[i].x, stars[i].y)
            ctx.lineTo(stars[j].x, stars[j].y)
            ctx.stroke()
          }
        }
      }

      // Stars
      stars.forEach((s) => {
        const pulse = Math.sin(Date.now() * 0.001 + s.twinkle) * 0.15 + 0.85

        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 6)
        glow.addColorStop(0, `rgba(247,215,133,${s.a * pulse})`)
        glow.addColorStop(1, "rgba(247,215,133,0)")

        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(245,245,240,${s.a})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener("resize", resize)
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.35 }}
    />
  )
}
