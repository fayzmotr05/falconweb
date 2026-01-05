import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ParallaxOptions {
  speed?: number // Negative = slower than scroll, Positive = faster
  direction?: 'vertical' | 'horizontal'
  start?: string
  end?: string
  scrub?: boolean | number
}

export function useParallax<T extends HTMLElement>(options: ParallaxOptions = {}) {
  const elementRef = useRef<T>(null)
  const {
    speed = -50,
    direction = 'vertical',
    start = 'top bottom',
    end = 'bottom top',
    scrub = true,
  } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const movement = direction === 'vertical'
      ? { y: speed }
      : { x: speed }

    const ctx = gsap.context(() => {
      gsap.to(element, {
        ...movement,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start,
          end,
          scrub,
        },
      })
    })

    return () => ctx.revert()
  }, [speed, direction, start, end, scrub])

  return elementRef
}

// Multi-layer parallax hook
export function useMultiLayerParallax(layerCount: number, baseSpeed: number = 20) {
  const layerRefs = Array.from({ length: layerCount }, () => useRef<HTMLDivElement>(null))

  useEffect(() => {
    const ctx = gsap.context(() => {
      layerRefs.forEach((ref, index) => {
        if (!ref.current) return

        // Each layer moves at a different speed
        // Layer 0 (background) is slowest, highest index is fastest
        const speed = baseSpeed * (index + 1) * -1

        gsap.to(ref.current, {
          y: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    })

    return () => ctx.revert()
  }, [layerCount, baseSpeed])

  return layerRefs
}

export default useParallax
