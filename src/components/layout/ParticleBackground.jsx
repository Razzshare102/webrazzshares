import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animId
    let lastTime = 0
    const FPS_CAP = 40
    const FRAME_MS = 1000 / FPS_CAP

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }

    class Particle {
      constructor() { this.reset() }
      reset() {
        this.x       = Math.random() * canvas.width
        this.y       = canvas.height + Math.random() * 100
        this.vx      = (Math.random() - 0.5) * 0.4
        this.vy      = -(Math.random() * 0.4 + 0.15)
        this.radius  = Math.random() * 1.2 + 0.4
        this.opacity = Math.random() * 0.45 + 0.08
        this.color   = Math.random() > 0.55 ? '0,212,255' : '124,58,237'
        this.life    = 0
        this.maxLife = Math.random() * 350 + 180
      }
      update() {
        this.x += this.vx
        this.y += this.vy
        this.life++
        if (this.life < 50)                      this.opacity = (this.life / 50) * 0.45
        else if (this.life > this.maxLife - 50)  this.opacity = ((this.maxLife - this.life) / 50) * 0.45
        if (this.life >= this.maxLife || this.y < -10) this.reset()
      }
      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`
        ctx.fill()
      }
    }

    resize()

    // Static twinkling stars
    const stars = Array.from({ length: 120 }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      radius:  Math.random() * 0.8,
      opacity: Math.random() * 0.4 + 0.05,
      phase:   Math.random() * Math.PI * 2,
    }))

    // Floating particles
    const particles = Array.from({ length: 50 }, () => new Particle())

    const animate = (now) => {
      animId = requestAnimationFrame(animate)
      if (now - lastTime < FRAME_MS) return
      lastTime = now

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Stars
      stars.forEach(s => {
        s.phase += 0.015
        const a = s.opacity * (0.6 + 0.4 * Math.sin(s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${a})`
        ctx.fill()
      })

      // Particles + connecting lines
      particles.forEach(p => { p.update(); p.draw() })

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 90) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0,212,255,${0.04 * (1 - dist / 90)})`
            ctx.lineWidth = 0.4
            ctx.stroke()
          }
        }
      }
    }

    animId = requestAnimationFrame(animate)

    const onResize = () => {
      resize()
      stars.forEach(s => { s.x = Math.random() * canvas.width; s.y = Math.random() * canvas.height })
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
