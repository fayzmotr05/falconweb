import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
}

interface ParticleFieldProps {
  particleCount?: number
  colors?: string[]
  maxSize?: number
  minSize?: number
  speed?: number
  connectionDistance?: number
  className?: string
}

export default function ParticleField({
  particleCount = 40,  // Reduced from 80 for better performance
  colors = ['#00d4ff', '#a855f7', '#22c55e'],
  maxSize = 3,
  minSize = 1,
  speed = 0.5,
  connectionDistance = 100,  // Reduced from 150 for better performance
  className = '',
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>(0)

  const initParticles = useCallback((width: number, height: number) => {
    // Further reduce particles on mobile for better performance
    const isMobile = window.innerWidth < 768
    const adjustedCount = isMobile ? Math.floor(particleCount / 2) : particleCount

    particlesRef.current = Array.from({ length: adjustedCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * (maxSize - minSize) + minSize,
      alpha: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  }, [particleCount, colors, maxSize, minSize, speed])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(10, 15, 28, 0.1)'
    ctx.fillRect(0, 0, width, height)

    const particles = particlesRef.current
    const mouse = mouseRef.current

    // Update and draw particles
    particles.forEach((particle, i) => {
      // Mouse attraction
      const dx = mouse.x - particle.x
      const dy = mouse.y - particle.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < 200) {
        const force = (200 - dist) / 200 * 0.02
        particle.vx += dx * force
        particle.vy += dy * force
      }

      // Update position
      particle.x += particle.vx
      particle.y += particle.vy

      // Friction
      particle.vx *= 0.99
      particle.vy *= 0.99

      // Boundary bounce
      if (particle.x < 0 || particle.x > width) particle.vx *= -1
      if (particle.y < 0 || particle.y > height) particle.vy *= -1

      // Keep in bounds
      particle.x = Math.max(0, Math.min(width, particle.x))
      particle.y = Math.max(0, Math.min(height, particle.y))

      // Draw particle (removed shadow blur for better performance)
      ctx.save()
      ctx.globalAlpha = particle.alpha
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Draw connections (optimized with squared distance)
      const connectionDistSquared = connectionDistance * connectionDistance
      let connectionCount = 0
      const MAX_CONNECTIONS = 3  // Limit connections per particle

      for (let j = i + 1; j < particles.length && connectionCount < MAX_CONNECTIONS; j++) {
        const other = particles[j]
        const cdx = particle.x - other.x
        const cdy = particle.y - other.y
        const cdistSquared = cdx * cdx + cdy * cdy

        if (cdistSquared < connectionDistSquared) {
          // Only calculate sqrt when we need to draw
          const cdist = Math.sqrt(cdistSquared)
          ctx.save()
          ctx.globalAlpha = (1 - cdist / connectionDistance) * 0.2
          ctx.strokeStyle = particle.color
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(other.x, other.y)
          ctx.stroke()
          ctx.restore()
          connectionCount++
        }
      }
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [connectionDistance])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initParticles(canvas.width, canvas.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initParticles, animate])

  // Add visibility check to pause animation when offscreen
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = 0
        } else if (entry.isIntersecting && !animationRef.current) {
          animate()
        }
      },
      { threshold: 0 }
    )

    observer.observe(canvas)

    return () => observer.disconnect()
  }, [animate])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ background: 'transparent' }}
    />
  )
}
