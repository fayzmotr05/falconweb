import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { gsap } from '@/animations/gsapConfig'
import { Container, SectionWrapper, SplitText } from '@/components/common'
import { TIMELINE } from '@/constants/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Milestone Card Component
function MilestoneCard({
  item,
  index,
  isActive,
  isPast,
}: {
  item: { year: string; key: string }
  index: number
  isActive: boolean
  isPast: boolean
}) {
  const { t } = useTranslation()
  const cardRef = useRef<HTMLDivElement>(null)

  const glowColors = [
    'rgba(0, 212, 255, 0.5)', // cyan
    'rgba(56, 189, 248, 0.5)', // sky
    'rgba(139, 92, 246, 0.5)', // violet
    'rgba(168, 85, 247, 0.5)', // purple
    'rgba(236, 72, 153, 0.5)', // pink
  ]

  const currentGlow = glowColors[index % glowColors.length]

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={{
        opacity: isActive || isPast ? 1 : 0.3,
        x: 0,
        scale: isActive ? 1.02 : 1,
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`relative bg-navy-800/50 backdrop-blur-sm border rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-500 ${
          isActive
            ? 'border-neon-cyan/50 shadow-lg'
            : isPast
              ? 'border-navy-600'
              : 'border-navy-700/50'
        }`}
        style={{
          boxShadow: isActive ? `0 0 30px ${currentGlow}` : undefined,
        }}
      >
        {/* Active glow effect */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            style={{
              background: `radial-gradient(circle at center, ${currentGlow}, transparent 70%)`,
            }}
          />
        )}

        {/* Year badge */}
        <motion.span
          className={`inline-block px-4 py-2 text-lg font-bold rounded-full mb-4 ${
            isActive
              ? 'text-neon-cyan bg-neon-cyan/20'
              : isPast
                ? 'text-text-secondary bg-navy-700/50'
                : 'text-text-muted bg-navy-800/50'
          }`}
          animate={{
            scale: isActive ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: isActive ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          {item.year}
        </motion.span>

        <h3
          className={`text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 ${
            isActive ? 'text-text-primary' : isPast ? 'text-text-secondary' : 'text-text-muted'
          }`}
        >
          {t(`timeline.${item.key}.title`)}
        </h3>

        <p
          className={`transition-colors duration-300 ${
            isActive ? 'text-text-secondary' : 'text-text-muted'
          }`}
        >
          {t(`timeline.${item.key}.description`)}
        </p>

        {/* Achievement icon for past items */}
        {isPast && !isActive && (
          <motion.div
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <svg className="w-5 h-5 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default function TimelineSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { shouldReduceAnimations } = useReducedMotion()

  // Scroll progress for this section - track when section enters and leaves viewport
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Background gradient based on progress
  const bgGradient = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [
      'radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)',
      'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
      'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
    ]
  )

  // Update active index based on scroll progress through the section
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const newIndex = Math.min(
        Math.floor(progress * TIMELINE.length),
        TIMELINE.length - 1
      )
      setActiveIndex(newIndex)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  // Animate path drawing based on scroll
  useEffect(() => {
    if (!pathRef.current) return

    const path = pathRef.current
    const pathLength = path.getTotalLength()

    // Set initial state
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    })

    // Update path on scroll progress change
    const unsubscribe = smoothProgress.on('change', (progress) => {
      gsap.set(path, {
        strokeDashoffset: pathLength * (1 - progress),
      })
    })

    return () => unsubscribe()
  }, [smoothProgress])

  return (
    <SectionWrapper ref={sectionRef} id="about" spacing="lg" className="!overflow-visible">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: bgGradient }}
      />

      {/* Floating year numbers in background - only on desktop for performance */}
      {!shouldReduceAnimations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          {TIMELINE.map((item, index) => (
            <motion.div
              key={`bg-${item.year}`}
              className="absolute text-[200px] font-bold text-navy-800/20 select-none"
              style={{
                left: `${15 + index * 20}%`,
                top: `${10 + (index % 3) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: activeIndex === index ? 0.15 : 0.05,
              }}
              transition={{
                y: {
                  duration: 4 + index,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                opacity: { duration: 0.5 },
              }}
            >
              {item.year}
            </motion.div>
          ))}
        </div>
      )}

      <div ref={containerRef} className="relative flex flex-col overflow-visible">
        <Container>
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8 md:mb-10"
          >
            <SplitText
              as="h2"
              animation="fadeUp"
              type="words"
              stagger={0.05}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4"
            >
              {t('timeline.title')}
            </SplitText>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-text-secondary max-w-2xl mx-auto"
            >
              {t('timeline.subtitle')}
            </motion.p>
          </motion.div>

          {/* Progress indicator */}
          <div className="flex justify-center gap-3 mb-6">
            {TIMELINE.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= activeIndex ? 'bg-neon-cyan' : 'bg-navy-700'
                }`}
                animate={{
                  width: index === activeIndex ? 32 : 12,
                  scale: index === activeIndex ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  scale: {
                    duration: 1.5,
                    repeat: index === activeIndex ? Infinity : 0,
                    ease: 'easeInOut',
                  },
                }}
              />
            ))}
          </div>

          <div className="relative max-w-5xl mx-auto overflow-visible">
            {/* Central timeline path */}
            <svg
              className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-8 hidden md:block"
              viewBox="0 0 32 800"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="timelineGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(0, 212, 255, 1)" />
                  <stop offset="50%" stopColor="rgba(139, 92, 246, 1)" />
                  <stop offset="100%" stopColor="rgba(168, 85, 247, 1)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Background line */}
              <line x1="16" y1="0" x2="16" y2="800" stroke="var(--color-navy-700)" strokeWidth="2" />
              {/* Animated glowing line */}
              <path
                ref={pathRef}
                d="M 16 0 L 16 800"
                fill="none"
                stroke="url(#timelineGradient2)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow)"
              />
            </svg>

            {/* Timeline items */}
            <div className="space-y-8 md:space-y-12">
              {TIMELINE.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Connector dot */}
                  <motion.div
                    className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-6 h-6 rounded-full z-10"
                    animate={{
                      backgroundColor: index <= activeIndex ? '#00d4ff' : '#1e293b',
                      scale: index === activeIndex ? [1, 1.3, 1] : 1,
                      boxShadow:
                        index === activeIndex
                          ? ['0 0 0px rgba(0, 212, 255, 0)', '0 0 20px rgba(0, 212, 255, 0.8)', '0 0 0px rgba(0, 212, 255, 0)']
                          : 'none',
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: index === activeIndex ? Infinity : 0,
                      ease: 'easeInOut',
                    }}
                    style={{
                      border: '3px solid',
                      borderColor: index <= activeIndex ? '#00d4ff' : '#334155',
                    }}
                  />

                  {/* Content card */}
                  <div className="flex-1 ml-12 md:ml-0">
                    <MilestoneCard
                      item={item}
                      index={index}
                      isActive={index === activeIndex}
                      isPast={index < activeIndex}
                    />
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>

        </Container>
      </div>
    </SectionWrapper>
  )
}
