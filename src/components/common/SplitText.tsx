import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

interface SplitTextProps {
  children: ReactNode
  className?: string
  type?: 'chars' | 'words' | 'lines'
  animation?: 'fadeUp' | 'fadeIn' | 'slideUp' | 'wave' | 'glitch'
  duration?: number
  stagger?: number
  delay?: number
  trigger?: 'load' | 'inView'
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
}

// Check once at module level
const isMobileDevice = typeof window !== 'undefined' && (
  window.innerWidth < 768 ||
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0
)

export default function SplitText({
  children,
  className = '',
  type = 'chars',
  animation = 'fadeUp',
  duration = 0.6,
  stagger = 0.02,
  delay = 0,
  trigger = 'inView',
  as: Tag = 'div',
}: SplitTextProps) {
  const elementRef = useRef<HTMLElement>(null)
  const splitRef = useRef<SplitType | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // On mobile: simple fade-in only, skip SplitType and 3D transforms
    if (isMobileDevice) {
      gsap.set(element, { opacity: 0, y: 20 })

      const ctx = gsap.context(() => {
        const scrollConfig = trigger === 'inView' ? {
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        } : {}

        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: trigger === 'load' ? delay : 0,
          ease: 'power2.out',
          ...scrollConfig,
        })
      })

      return () => ctx.revert()
    }

    // Desktop: full split text animation
    splitRef.current = new SplitType(element, {
      types: type === 'chars' ? 'chars,words' : type === 'words' ? 'words' : 'lines',
    })

    const targets = type === 'chars'
      ? splitRef.current.chars
      : type === 'words'
        ? splitRef.current.words
        : splitRef.current.lines

    if (!targets || targets.length === 0) return

    // Animation configurations
    const animations: Record<string, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
      fadeUp: {
        from: { opacity: 0, y: 40, rotationX: -40 },
        to: { opacity: 1, y: 0, rotationX: 0, ease: 'power3.out' },
      },
      fadeIn: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1, ease: 'power2.out' },
      },
      slideUp: {
        from: { yPercent: 100, opacity: 0 },
        to: { yPercent: 0, opacity: 1, ease: 'power3.out' },
      },
      wave: {
        from: { opacity: 0, y: 20, scale: 0.5, rotation: -10 },
        to: { opacity: 1, y: 0, scale: 1, rotation: 0, ease: 'elastic.out(1, 0.5)' },
      },
      glitch: {
        from: { opacity: 0, x: () => gsap.utils.random(-20, 20), skewX: 20 },
        to: { opacity: 1, x: 0, skewX: 0, ease: 'power2.out' },
      },
    }

    const { from, to } = animations[animation] || animations.fadeUp

    // Set initial state
    gsap.set(targets, from)

    // Create animation
    const ctx = gsap.context(() => {
      const scrollConfig = trigger === 'inView' ? {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      } : {}

      gsap.to(targets, {
        ...to,
        duration,
        stagger: {
          each: stagger,
          from: animation === 'wave' ? 'center' : 'start',
        },
        delay: trigger === 'load' ? delay : 0,
        ...scrollConfig,
      })
    })

    return () => {
      ctx.revert()
      splitRef.current?.revert()
    }
  }, [type, animation, duration, stagger, delay, trigger])

  return (
    <Tag
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`${className}`}
      style={isMobileDevice ? undefined : { perspective: '1000px' }}
    >
      {children}
    </Tag>
  )
}
