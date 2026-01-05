import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface CursorState {
  isHovering: boolean
  isClicking: boolean
  cursorText: string
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    cursorText: '',
  })

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = cursorDotRef.current
    if (!cursor || !dot) return

    // Hide default cursor
    document.body.style.cursor = 'none'

    let mouseX = 0
    let mouseY = 0
    let cursorX = 0
    let cursorY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      // Smooth follow effect
      cursorX += (mouseX - cursorX) * 0.15
      cursorY += (mouseY - cursorY) * 0.15

      gsap.set(cursor, {
        x: cursorX - cursor.offsetWidth / 2,
        y: cursorY - cursor.offsetHeight / 2,
      })

      gsap.set(dot, {
        x: mouseX - 4,
        y: mouseY - 4,
      })

      requestAnimationFrame(animate)
    }

    // Handle hover states
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.matches('a, button, [data-cursor="pointer"], input, textarea, select')
      const cursorText = target.getAttribute('data-cursor-text') || ''

      if (isInteractive) {
        setState(prev => ({ ...prev, isHovering: true, cursorText }))
      }
    }

    const handleMouseLeave = () => {
      setState(prev => ({ ...prev, isHovering: false, cursorText: '' }))
    }

    const handleMouseDown = () => {
      setState(prev => ({ ...prev, isClicking: true }))
    }

    const handleMouseUp = () => {
      setState(prev => ({ ...prev, isClicking: false }))
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    animate()

    return () => {
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Update cursor size on state change
  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    if (state.isClicking) {
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.1,
        ease: 'power2.out',
      })
    } else if (state.isHovering) {
      gsap.to(cursor, {
        scale: 2,
        duration: 0.3,
        ease: 'power2.out',
      })
    } else {
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [state.isHovering, state.isClicking])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null
  }

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: '40px',
          height: '40px',
        }}
      >
        <div
          className={`
            w-full h-full rounded-full border-2 border-white
            transition-colors duration-200
            ${state.isHovering ? 'bg-white/20' : 'bg-transparent'}
          `}
        />
        {state.cursorText && (
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-medium whitespace-nowrap">
            {state.cursorText}
          </span>
        )}
      </div>

      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
      />
    </>
  )
}
