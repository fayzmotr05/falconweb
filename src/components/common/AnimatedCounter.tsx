import { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
  scramble?: boolean
  scrambleDuration?: number
}

// Check once at module level
const isMobileDevice = typeof window !== 'undefined' && (
  window.innerWidth < 768 ||
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0
)

export default function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className,
  scramble = true,
  scrambleDuration = 800,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(end.toLocaleString())
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const animateCount = useCallback(() => {
    const startTime = performance.now()

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutExpo = 1 - Math.pow(2, -10 * progress)
      const currentCount = Math.floor(end * easeOutExpo)

      setDisplayValue(currentCount.toLocaleString())

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      } else {
        setDisplayValue(end.toLocaleString())
      }
    }

    requestAnimationFrame(updateCount)
  }, [duration, end])

  // Ensure displayValue updates if end prop changes
  useEffect(() => {
    if (!hasAnimated) {
      setDisplayValue(end.toLocaleString())
    }
  }, [end, hasAnimated])

  // Fallback: Ensure number displays after 3 seconds
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!hasAnimated) {
        setDisplayValue(end.toLocaleString())
        setHasAnimated(true)
      }
    }, 3000)
    return () => clearTimeout(fallbackTimer)
  }, [end, hasAnimated])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          setDisplayValue('0')
          setTimeout(() => {
            // On mobile: always use simple count-up (no scramble/setInterval)
            if (isMobileDevice) {
              animateCount()
            } else if (scramble) {
              // Desktop: scramble animation
              const endStr = end.toLocaleString()
              const chars = '0123456789'
              const scrambleIterations = scrambleDuration / 30
              let iteration = 0

              const scrambleInterval = setInterval(() => {
                const progress = iteration / scrambleIterations
                const newDisplay = endStr
                  .split('')
                  .map((char, index) => {
                    if (!/\d/.test(char)) return char
                    const lockProgress = progress * endStr.length
                    if (index < lockProgress) return char
                    return chars[Math.floor(Math.random() * chars.length)]
                  })
                  .join('')

                setDisplayValue(newDisplay)
                iteration++

                if (iteration >= scrambleIterations) {
                  clearInterval(scrambleInterval)
                  setDisplayValue(endStr)
                }
              }, 30)
            } else {
              animateCount()
            }
          }, 50)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated, scramble, animateCount, end, scrambleDuration])

  return (
    <span
      ref={ref}
      className={cn('tabular-nums inline-block', className)}
    >
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}
