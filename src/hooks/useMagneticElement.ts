import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'

interface MagneticOptions {
  strength?: number // How much the element moves toward cursor
  ease?: number // Smoothing factor (0-1)
  maxDistance?: number // Maximum distance to trigger effect
}

export function useMagneticElement<T extends HTMLElement>(options: MagneticOptions = {}) {
  const elementRef = useRef<T>(null)
  const { strength = 0.3, ease = 0.1, maxDistance = 100 } = options

  const position = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const animationFrame = useRef<number>(0)

  const lerp = useCallback((start: number, end: number, factor: number) => {
    return start + (end - start) * factor
  }, [])

  const animate = useCallback(() => {
    position.current.x = lerp(position.current.x, target.current.x, ease)
    position.current.y = lerp(position.current.y, target.current.y, ease)

    if (elementRef.current) {
      gsap.set(elementRef.current, {
        x: position.current.x,
        y: position.current.y,
      })
    }

    animationFrame.current = requestAnimationFrame(animate)
  }, [ease, lerp])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

      if (distance < maxDistance) {
        target.current.x = distanceX * strength
        target.current.y = distanceY * strength
      }
    }

    const handleMouseLeave = () => {
      target.current.x = 0
      target.current.y = 0
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    animationFrame.current = requestAnimationFrame(animate)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [strength, maxDistance, animate])

  return elementRef
}

export default useMagneticElement
