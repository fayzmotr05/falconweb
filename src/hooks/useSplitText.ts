import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import SplitType from 'split-type'

interface SplitTextOptions {
  type?: 'chars' | 'words' | 'lines'
  animation?: 'fadeUp' | 'fadeIn' | 'slideUp' | 'scramble' | 'wave'
  duration?: number
  stagger?: number
  delay?: number
  ease?: string
  trigger?: 'load' | 'inView'
}

export function useSplitText<T extends HTMLElement>(options: SplitTextOptions = {}) {
  const elementRef = useRef<T>(null)
  const splitRef = useRef<SplitType | null>(null)

  const {
    type = 'chars',
    animation = 'fadeUp',
    duration = 0.8,
    stagger = 0.02,
    delay = 0,
    ease = 'power3.out',
    trigger = 'inView',
  } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Split the text
    splitRef.current = new SplitType(element, {
      types: type === 'chars' ? 'chars,words' : type === 'words' ? 'words' : 'lines',
    })

    const targets = type === 'chars'
      ? splitRef.current.chars
      : type === 'words'
        ? splitRef.current.words
        : splitRef.current.lines

    if (!targets) return

    // Set initial state based on animation type
    const getInitialState = () => {
      switch (animation) {
        case 'fadeUp':
          return { opacity: 0, y: 50, rotateX: -90 }
        case 'fadeIn':
          return { opacity: 0 }
        case 'slideUp':
          return { y: '100%', opacity: 0 }
        case 'wave':
          return { opacity: 0, y: 20, scale: 0.8 }
        case 'scramble':
          return { opacity: 0 }
        default:
          return { opacity: 0, y: 50 }
      }
    }

    const getAnimateState = () => {
      switch (animation) {
        case 'fadeUp':
          return { opacity: 1, y: 0, rotateX: 0 }
        case 'fadeIn':
          return { opacity: 1 }
        case 'slideUp':
          return { y: '0%', opacity: 1 }
        case 'wave':
          return { opacity: 1, y: 0, scale: 1 }
        case 'scramble':
          return { opacity: 1 }
        default:
          return { opacity: 1, y: 0 }
      }
    }

    gsap.set(targets, getInitialState())

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: trigger === 'inView' ? {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none none',
        } : undefined,
        delay: trigger === 'load' ? delay : 0,
      })

      if (animation === 'wave') {
        tl.to(targets, {
          ...getAnimateState(),
          duration,
          stagger: {
            each: stagger,
            from: 'start',
          },
          ease: 'back.out(1.7)',
        })
      } else {
        tl.to(targets, {
          ...getAnimateState(),
          duration,
          stagger,
          ease,
        })
      }
    })

    return () => {
      ctx.revert()
      splitRef.current?.revert()
    }
  }, [type, animation, duration, stagger, delay, ease, trigger])

  return elementRef
}

// Scramble text effect (like decoding)
export function useScrambleText<T extends HTMLElement>(finalText: string, options: { duration?: number; delay?: number } = {}) {
  const elementRef = useRef<T>(null)
  const { duration = 1.5, delay = 0 } = options

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let iteration = 0
    let interval: ReturnType<typeof setInterval>

    const scramble = () => {
      element.innerText = finalText
        .split('')
        .map((_, index) => {
          if (index < iteration) {
            return finalText[index]
          }
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join('')

      if (iteration >= finalText.length) {
        clearInterval(interval)
      }

      iteration += 1 / 3
    }

    const timeout = setTimeout(() => {
      interval = setInterval(scramble, 30)
    }, delay * 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [finalText, duration, delay])

  return elementRef
}

export default useSplitText
