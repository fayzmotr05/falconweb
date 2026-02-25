import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Global page scroll progress - RAF-throttled
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let rafId = 0
    let ticking = false

    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(Math.min(1, Math.max(0, scrollProgress)))
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(updateProgress)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return progress
}

// Section-specific scroll progress
export function useSectionProgress<T extends HTMLElement>() {
  const sectionRef = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          setProgress(self.progress)
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return { sectionRef, progress }
}

// Pinned section progress
export function usePinnedProgress<T extends HTMLElement>(scrollDistance: string = '200%') {
  const containerRef = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${scrollDistance}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          setProgress(self.progress)
        },
      })
    })

    return () => ctx.revert()
  }, [scrollDistance])

  return { containerRef, progress }
}

export default useScrollProgress
