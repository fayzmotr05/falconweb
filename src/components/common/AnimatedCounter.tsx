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

export default function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  className,
  scramble = true,
  scrambleDuration = 800,
}: AnimatedCounterProps) {
  // CRITICAL FIX: Initialize with actual value so numbers show immediately
  const [displayValue, setDisplayValue] = useState(end.toLocaleString())
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isScrambling, setIsScrambling] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  const animateCount = useCallback(() => {
    const startTime = performance.now()
    const startValue = 0

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function (ease-out-expo)
      const easeOutExpo = 1 - Math.pow(2, -10 * progress)
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutExpo)

      setDisplayValue(currentCount.toLocaleString())

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      } else {
        setDisplayValue(end.toLocaleString())
      }
    }

    requestAnimationFrame(updateCount)
  }, [duration, end])

  const startScrambleAnimation = useCallback(() => {
    setIsScrambling(true)
    const endStr = end.toLocaleString()
    const chars = '0123456789'
    const scrambleIterations = scrambleDuration / 30
    let iteration = 0

    const scrambleInterval = setInterval(() => {
      const progress = iteration / scrambleIterations

      // Generate scrambled string with increasing locked positions
      const newDisplay = endStr
        .split('')
        .map((char, index) => {
          // Non-digit characters (like commas) are revealed immediately
          if (!/\d/.test(char)) return char

          // Calculate which position should be locked
          const lockProgress = progress * endStr.length
          if (index < lockProgress) {
            return char
          }

          // Random digit for unlocked positions
          return chars[Math.floor(Math.random() * chars.length)]
        })
        .join('')

      setDisplayValue(newDisplay)
      iteration++

      if (iteration >= scrambleIterations) {
        clearInterval(scrambleInterval)
        setDisplayValue(endStr)
        setIsScrambling(false)
      }
    }, 30)
  }, [end, scrambleDuration])

  // Ensure displayValue updates if end prop changes
  useEffect(() => {
    if (!hasAnimated) {
      setDisplayValue(end.toLocaleString())
    }
  }, [end, hasAnimated])

  // Fallback: Ensure number displays after 3 seconds even if IntersectionObserver fails
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!hasAnimated) {
        setDisplayValue(end.toLocaleString())
        setHasAnimated(true) // Prevent future animation attempts
      }
    }, 3000)
    return () => clearTimeout(fallbackTimer)
  }, [end, hasAnimated])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          // Reset to 0 then animate for visual effect
          setDisplayValue('0')
          // Small delay before starting animation
          setTimeout(() => {
            if (scramble) {
              startScrambleAnimation()
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
  }, [hasAnimated, scramble, startScrambleAnimation, animateCount])

  return (
    <span
      ref={ref}
      className={cn(
        'tabular-nums inline-block',
        isScrambling && 'animate-pulse',
        className
      )}
    >
      {prefix}
      <span className="relative">
        {displayValue}
        {/* Glow effect during scramble */}
        {isScrambling && (
          <span
            className="absolute inset-0 blur-sm opacity-50"
            style={{ color: 'inherit' }}
          >
            {displayValue}
          </span>
        )}
      </span>
      {suffix}
    </span>
  )
}
