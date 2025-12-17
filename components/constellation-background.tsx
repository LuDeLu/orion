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
  active: boolean
}

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let stars: Star[] = []
    let shootingStars: ShootingStar[] = []
    let raf: number
    let lastShootingStarTime = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createStars()
    }

    const createStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 8000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random() * 0.5 + 0.2,
        twinkle: Math.random() * 1000,
      }))
    }

    const createShootingStar = () => {
      const startFromTop = Math.random() > 0.5
      const star: ShootingStar = {
        x: startFromTop ? Math.random() * canvas.width : canvas.width * 0.8 + Math.random() * canvas.width * 0.2,
        y: startFromTop ? Math.random() * canvas.height * 0.3 : Math.random() * canvas.height * 0.5,
        vx: -3 - Math.random() * 2,
        vy: 2 + Math.random() * 2,
        length: 40 + Math.random() * 30,
        opacity: 1,
        active: true,
      }
      shootingStars.push(star)
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Connections
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x
          const dy = stars[i].y - stars[j].y
          const d = Math.sqrt(dx * dx + dy * dy)

          if (d < 150) {
            ctx.strokeStyle = `rgba(247,215,133,${(1 - d / 150) * 0.06})`
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
        const pulse = Math.sin(Date.now() * 0.0003 + s.twinkle) * 0.1 + 0.9

        const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
        glow.addColorStop(0, `rgba(247,215,133,${s.a * pulse * 0.4})`)
        glow.addColorStop(1, "rgba(247,215,133,0)")

        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(240,240,235,${s.a})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })

      shootingStars = shootingStars.filter((star) => {
        if (!star.active) return false

        star.x += star.vx
        star.y += star.vy
        star.opacity -= 0.01

        if (star.opacity <= 0 || star.x < -100 || star.y > canvas.height + 100) {
          star.active = false
          return false
        }

        // Gradiente para el rastro
        const gradient = ctx.createLinearGradient(star.x, star.y, star.x - star.vx * 5, star.y - star.vy * 5)
        gradient.addColorStop(0, `rgba(247, 215, 133, ${star.opacity * 0.8})`)
        gradient.addColorStop(0.5, `rgba(247, 215, 133, ${star.opacity * 0.4})`)
        gradient.addColorStop(1, "rgba(247, 215, 133, 0)")

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(star.x - star.vx * 8, star.y - star.vy * 8)
        ctx.stroke()

        // Punto brillante al frente
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, 2, 0, Math.PI * 2)
        ctx.fill()

        return true
      })

      const now = Date.now()
      if (now - lastShootingStarTime > 8000 + Math.random() * 7000) {
        createShootingStar()
        lastShootingStarTime = now
      }

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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none -z-20" style={{ opacity: 0.3 }} />
}
