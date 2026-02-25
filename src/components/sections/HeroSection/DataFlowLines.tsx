import { useEffect, useRef } from 'react'
import { gsap } from '@/animations/gsapConfig'

export default function DataFlowLines() {
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<gsap.core.Tween[]>([])

  useEffect(() => {
    if (!svgRef.current) return

    const paths = svgRef.current.querySelectorAll('.flow-path')
    const dots = svgRef.current.querySelectorAll('.flow-dot')

    paths.forEach((path) => {
      const length = (path as SVGPathElement).getTotalLength()
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      })

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: path,
          start: 'top 80%',
        },
      })
    })

    // Pause/resume dots based on visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animationRef.current.forEach((tween) => tween.play())
        } else {
          animationRef.current.forEach((tween) => tween.pause())
        }
      },
      { threshold: 0 }
    )

    if (svgRef.current) observer.observe(svgRef.current)

    // Animate dots along paths
    dots.forEach((dot, i) => {
      const tween = gsap.to(dot, {
        motionPath: {
          path: paths[i % paths.length] as SVGPathElement,
          align: paths[i % paths.length] as SVGPathElement,
          alignOrigin: [0.5, 0.5],
        },
        duration: 4,
        repeat: -1,
        ease: 'none',
        delay: i * 0.5,
      })
      animationRef.current.push(tween)
    })

    return () => {
      observer.disconnect()
      gsap.killTweensOf([paths, dots])
      animationRef.current = []
    }
  }, [])

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-neon-cyan)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-neon-cyan)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--color-neon-cyan)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Data flow paths - removed expensive feGaussianBlur filter */}
      <path
        className="flow-path"
        d="M 0 400 Q 300 350 600 400 T 1200 400"
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="2"
        opacity="0.4"
      />
      <path
        className="flow-path"
        d="M 0 300 Q 400 200 600 300 T 1200 250"
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Flowing dots */}
      <circle className="flow-dot" r="4" fill="var(--color-neon-cyan)" opacity="0.8" />
      <circle className="flow-dot" r="3" fill="var(--color-neon-cyan)" opacity="0.6" />
    </svg>
  )
}
