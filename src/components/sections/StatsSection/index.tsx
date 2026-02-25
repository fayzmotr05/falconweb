import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { Container, SectionWrapper, AnimatedCounter, Card3D } from '@/components/common'
import { STATS } from '@/constants/content'


// Animated SVG icon component with stroke animation
function AnimatedIcon({ iconKey, isVisible }: { iconKey: string; isVisible: boolean }) {
  const pathRef = useRef<SVGPathElement>(null)
  const path2Ref = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (isVisible && pathRef.current) {
      const path = pathRef.current
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

      if (path2Ref.current) {
        const path2 = path2Ref.current
        const length2 = path2.getTotalLength()

        gsap.set(path2, {
          strokeDasharray: length2,
          strokeDashoffset: length2,
        })

        gsap.to(path2, {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: 'power2.out',
          delay: 0.5,
        })
      }
    }
  }, [isVisible])

  const iconPaths: Record<string, { d: string; d2?: string }> = {
    clients: {
      d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    },
    trucks: {
      d: 'M8 7h8m-8 4h8m-8 4h4m4.5 3.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-11 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
      d2: 'M13 17V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2m14 0h1a2 2 0 002-2v-4a2 2 0 00-2-2h-3l-2-3h-4v9',
    },
    years: {
      d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    team: {
      d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    },
  }

  const icon = iconPaths[iconKey] || iconPaths.clients

  return (
    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24">
      <path
        ref={pathRef}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d={icon.d}
      />
      {icon.d2 && (
        <path
          ref={path2Ref}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d={icon.d2}
        />
      )}
    </svg>
  )
}

// Stat Card component with 3D effects
function StatCard({ stat, index }: { stat: { readonly key: string; readonly value: number; readonly suffix: string }; index: number }) {
  const { t } = useTranslation()
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })
  const [isHovered, setIsHovered] = useState(false)

  const glowColors = [
    'rgba(0, 212, 255, 0.3)', // cyan
    'rgba(168, 85, 247, 0.3)', // purple
    'rgba(16, 185, 129, 0.3)', // green
    'rgba(251, 146, 60, 0.3)', // orange
  ]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card3D
        glowColor={glowColors[index % glowColors.length]}
        tiltIntensity={12}
        flipOnView={false}
      >
        <div
          className="relative bg-navy-800/50 backdrop-blur-sm border border-navy-700 rounded-2xl p-4 sm:p-6 md:p-8 text-center overflow-hidden transition-all duration-500"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            borderColor: isHovered ? glowColors[index % glowColors.length].replace('0.3', '0.5') : undefined,
          }}
        >
          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, currentColor 1px, transparent 1px),
                  linear-gradient(to bottom, currentColor 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
                animation: isHovered ? 'pulse 1.5s ease-in-out infinite' : 'none',
              }}
            />
          </div>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
              opacity: isHovered ? 0.15 : 0,
            }}
            style={{
              background: `radial-gradient(circle at center, ${glowColors[index % glowColors.length]}, transparent 70%)`,
            }}
          />

          {/* Pulse ring on hover */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-2xl border"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{ borderColor: glowColors[index % glowColors.length] }}
            />
          )}

          {/* Icon */}
          <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-navy-700/50 text-neon-cyan mb-4 sm:mb-6 overflow-hidden">
            {/* Icon glow */}
            <motion.div
              className="absolute inset-0 rounded-xl"
              animate={{
                boxShadow: isHovered
                  ? `inset 0 0 20px ${glowColors[index % glowColors.length]}`
                  : 'none',
              }}
            />
            <AnimatedIcon iconKey={stat.key} isVisible={isInView} />
          </div>

          {/* Number with scramble effect */}
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3">
            <AnimatedCounter
              end={stat.value}
              suffix={stat.suffix}
              duration={2000}
              scramble={true}
              scrambleDuration={1000}
              className="text-neon-cyan"
            />
          </div>

          {/* Label */}
          <motion.div
            className="text-text-secondary text-sm md:text-base font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.15 + 0.5, duration: 0.5 }}
          >
            {t(`stats.${stat.key}`)}
          </motion.div>
        </div>
      </Card3D>
    </motion.div>
  )
}

export default function StatsSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  return (
    <SectionWrapper id="stats" background="darker" spacing="lg">
      <div ref={sectionRef} className="relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[50px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-[40px]" />
        </div>
        <Container>
          {/* Section header with split text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              {t('stats.title')}
            </h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-text-secondary max-w-2xl mx-auto"
            >
              {t('stats.subtitle')}
            </motion.p>
          </motion.div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {STATS.map((stat, index) => (
              <StatCard key={stat.key} stat={stat} index={index} />
            ))}
          </div>
        </Container>
      </div>
    </SectionWrapper>
  )
}
