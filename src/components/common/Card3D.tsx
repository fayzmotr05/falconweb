import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Card3DProps {
  children: ReactNode
  className?: string
  glowColor?: string
  tiltIntensity?: number
  flipOnView?: boolean
}

// Check once at module level
const isMobileDevice = typeof window !== 'undefined' && (
  window.innerWidth < 768 ||
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0
)

export default function Card3D({
  children,
  className = '',
  glowColor = 'rgba(0, 212, 255, 0.3)',
  tiltIntensity = 15,
  flipOnView = true,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 })
  const [isHovered, setIsHovered] = useState(false)

  // On mobile: render plain div, no 3D transforms or spring physics
  if (isMobileDevice) {
    return (
      <div className={cn('relative', className)}>
        {children}
      </div>
    )
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    const rotateX = -(mouseY / (rect.height / 2)) * tiltIntensity
    const rotateY = (mouseX / (rect.width / 2)) * tiltIntensity

    setTransform({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <motion.div
      ref={cardRef}
      initial={flipOnView ? { opacity: 0, scale: 0.95, y: 20 } : {}}
      whileInView={flipOnView ? { opacity: 1, scale: 1, y: 0 } : {}}
      viewport={{ once: true, margin: '0px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={cn('relative', className)}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{
          rotateX: transform.rotateX,
          rotateY: transform.rotateY,
          z: isHovered ? 50 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? `0 25px 50px -12px ${glowColor}, 0 0 30px ${glowColor}`
            : '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Card glow effect */}
        <motion.div
          className="absolute -inset-[1px] rounded-2xl opacity-0"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          style={{
            background: `linear-gradient(135deg, ${glowColor}, transparent 50%)`,
            filter: 'blur(8px)',
          }}
        />

        {children}
      </motion.div>
    </motion.div>
  )
}
