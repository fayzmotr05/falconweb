import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PageLoaderProps {
  onComplete?: () => void
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const loaderRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading progress
    const duration = 2000
    const startTime = Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = Math.min((elapsed / duration) * 100, 100)
      setProgress(newProgress)

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress)
      }
    }

    requestAnimationFrame(updateProgress)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      // Animate out
      const tl = gsap.timeline({
        onComplete: () => {
          setIsLoading(false)
          onComplete?.()
        },
      })

      tl.to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
      })
        .to(logoRef.current, {
          scale: 1.2,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.in',
        }, '-=0.1')
        .to(loaderRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power3.inOut',
        }, '-=0.2')
    }
  }, [progress, onComplete])

  // Animate logo on mount
  useEffect(() => {
    const logo = logoRef.current
    if (!logo) return

    gsap.fromTo(logo,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }
    )

    // Pulse animation
    gsap.to(logo, {
      boxShadow: '0 0 60px rgba(0, 212, 255, 0.8)',
      repeat: -1,
      yoyo: true,
      duration: 1,
      ease: 'sine.inOut',
    })
  }, [])

  if (!isLoading) return null

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[10000] bg-navy-950 flex flex-col items-center justify-center"
    >
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-cyan/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '-0.5s' }} />
      </div>

      {/* Logo */}
      <div
        ref={logoRef}
        className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-cyan-dark flex items-center justify-center mb-8"
        style={{ boxShadow: '0 0 40px rgba(0, 212, 255, 0.5)' }}
      >
        <span className="text-4xl font-bold text-navy-950">F</span>

        {/* Rotating ring */}
        <div className="absolute inset-0 rounded-2xl border-2 border-neon-cyan/30 animate-spin" style={{ animationDuration: '3s' }} />
        <div className="absolute -inset-2 rounded-3xl border border-neon-cyan/20 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />
      </div>

      {/* Text */}
      <div ref={textRef} className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Falcon Team</h1>
        <p className="text-text-secondary text-sm">Loading experience...</p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-navy-800 rounded-full overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress text */}
      <div className="mt-4 text-text-muted text-sm font-mono">
        {Math.round(progress)}%
      </div>
    </div>
  )
}
