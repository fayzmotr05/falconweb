import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { gsap } from '@/animations/gsapConfig'
import { Container, SplitText } from '@/components/common'
import { SERVICES } from '@/constants/content'

// Service icon paths for SVG stroke animation
const iconPaths: Record<string, string[]> = {
  eld: [
    'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z',
    'M9 9h6v6H9V9z',
  ],
  shield: [
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  ],
  dispatch: [
    'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  ],
  fleet: [
    'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z',
    'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  ],
  document: [
    'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  ],
  integration: [
    'M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z',
  ],
}

// Gradient colors for each service
const serviceGradients = [
  { from: 'rgba(0, 212, 255, 0.2)', to: 'rgba(0, 180, 216, 0.05)' }, // cyan
  { from: 'rgba(16, 185, 129, 0.2)', to: 'rgba(5, 150, 105, 0.05)' }, // green
  { from: 'rgba(168, 85, 247, 0.2)', to: 'rgba(139, 92, 246, 0.05)' }, // purple
  { from: 'rgba(251, 146, 60, 0.2)', to: 'rgba(234, 88, 12, 0.05)' }, // orange
  { from: 'rgba(56, 189, 248, 0.2)', to: 'rgba(14, 165, 233, 0.05)' }, // sky
  { from: 'rgba(236, 72, 153, 0.2)', to: 'rgba(219, 39, 119, 0.05)' }, // pink
]

const serviceAccentColors = [
  '#00d4ff', // cyan
  '#10b981', // green
  '#a855f7', // purple
  '#fb923c', // orange
  '#38bdf8', // sky
  '#ec4899', // pink
]

// Service Slide Component
function ServiceSlide({
  service,
  index,
  isActive,
}: {
  service: { key: string; icon: string }
  index: number
  isActive: boolean
}) {
  const { t } = useTranslation()
  const iconRef = useRef<SVGSVGElement>(null)
  const paths = iconPaths[service.icon] || iconPaths.eld
  const gradient = serviceGradients[index % serviceGradients.length]
  const accentColor = serviceAccentColors[index % serviceAccentColors.length]

  useEffect(() => {
    if (!iconRef.current || !isActive) return

    const pathElements = iconRef.current.querySelectorAll('path')
    pathElements.forEach((path) => {
      const length = path.getTotalLength()
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      })
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.3,
      })
    })
  }, [isActive])

  return (
    <motion.div
      className="flex-shrink-0 flex items-center justify-center relative overflow-hidden"
      style={{ width: '100vw', height: '100vh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.3 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 50%, ${gradient.from} 0%, ${gradient.to} 50%, transparent 70%)`,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: accentColor,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Icon side */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-3xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                boxShadow: isActive ? `0 0 60px ${accentColor}40` : 'none',
              }}
            >
              {/* Pulsing ring */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2"
                  style={{ borderColor: accentColor }}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}

              {/* Animated SVG icon */}
              <svg
                ref={iconRef}
                className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40"
                fill="none"
                viewBox="0 0 24 24"
                style={{ color: accentColor }}
              >
                {paths.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                  />
                ))}
              </svg>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ x: 50, opacity: 0 }}
            animate={isActive ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Service number */}
            <motion.span
              className="inline-block text-8xl md:text-9xl font-bold opacity-10 mb-4"
              style={{ color: accentColor }}
            >
              0{index + 1}
            </motion.span>

            {/* Title */}
            <div className="mb-6">
              {isActive ? (
                <SplitText
                  as="h3"
                  animation="wave"
                  type="chars"
                  stagger={0.03}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary"
                >
                  {t(`services.${service.key}.title`)}
                </SplitText>
              ) : (
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary opacity-50">
                  {t(`services.${service.key}.title`)}
                </h3>
              )}
            </div>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-lg mx-auto lg:mx-0"
              initial={{ filter: 'blur(10px)', opacity: 0 }}
              animate={isActive ? { filter: 'blur(0px)', opacity: 1 } : { filter: 'blur(10px)', opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t(`services.${service.key}.description`)}
            </motion.p>

            {/* CTA */}
            <motion.div
              className="mt-8"
              initial={{ y: 20, opacity: 0 }}
              animate={isActive ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <button
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:gap-5"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
                  border: `1px solid ${accentColor}50`,
                  color: accentColor,
                }}
              >
                <span>Learn More</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </motion.div>
  )
}

export default function ServicesSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // GSAP handles ALL scroll-based horizontal movement (no Framer Motion conflict)
  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return

    const ctx = gsap.context(() => {
      // GSAP animates the container horizontally based on scroll
      gsap.to(containerRef.current, {
        x: () => `-${(SERVICES.length - 1) * window.innerWidth}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${(SERVICES.length - 1) * 100}%`,
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
          onUpdate: (self) => {
            const newIndex = Math.min(
              Math.floor(self.progress * SERVICES.length),
              SERVICES.length - 1
            )
            setActiveIndex(newIndex)
          },
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-navy-950 h-screen"
    >
      {/* Section header - absolute within pinned container */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-24 pb-8 bg-gradient-to-b from-navy-950 via-navy-950/90 to-transparent pointer-events-none">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <SplitText
              as="h2"
              animation="fadeUp"
              type="words"
              stagger={0.05}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4"
            >
              {t('services.title')}
            </SplitText>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </Container>
      </div>

      {/* Horizontal scroll container - absolute within pinned container */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: '100vw', height: '100vh' }}>
        {/* Regular div - GSAP handles horizontal movement via x transform */}
        <div
          ref={containerRef}
          className="flex"
          style={{ height: '100vh' }}
        >
          {SERVICES.map((service, index) => (
            <ServiceSlide
              key={service.key}
              service={service}
              index={index}
              isActive={index === activeIndex}
            />
          ))}
        </div>
      </div>

      {/* Progress indicators - absolute within pinned container */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        <div className="flex gap-2">
          {SERVICES.map((_, index) => (
            <motion.button
              key={index}
              className="relative w-3 h-3 rounded-full transition-all duration-300"
              style={{
                backgroundColor: index <= activeIndex
                  ? serviceAccentColors[index % serviceAccentColors.length]
                  : 'rgba(255, 255, 255, 0.2)',
              }}
              animate={{
                scale: index === activeIndex ? 1.5 : 1,
              }}
              onClick={() => {
                // Scroll to corresponding position
                if (sectionRef.current) {
                  const sectionTop = sectionRef.current.offsetTop
                  const sectionHeight = sectionRef.current.offsetHeight
                  const targetScroll = sectionTop + (index / SERVICES.length) * sectionHeight
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' })
                }
              }}
            >
              {index === activeIndex && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: serviceAccentColors[index % serviceAccentColors.length] }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.button>
          ))}
        </div>
        <span className="text-text-muted text-sm font-mono">
          {String(activeIndex + 1).padStart(2, '0')}/{String(SERVICES.length).padStart(2, '0')}
        </span>
      </div>

      {/* Scroll hint - absolute within pinned container */}
      <motion.div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center text-text-muted z-20"
        animate={{
          opacity: activeIndex < SERVICES.length - 1 ? 1 : 0,
          y: [0, 10, 0],
        }}
        transition={{
          opacity: { duration: 0.3 },
          y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        <span className="text-xs mb-2">Scroll to explore</span>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  )
}
