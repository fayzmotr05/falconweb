import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Container, SectionWrapper } from '@/components/common'
import { VALUES } from '@/constants/content'
import { isMobile, fadeInUp, fadeIn } from '@/lib/motion'

// Icon paths for stroke animation
const iconPaths: Record<string, string[]> = {
  clock: [
    'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  ],
  heart: [
    'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  ],
  shield: [
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  ],
  lightbulb: [
    'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  ],
}

const valueColors = ['#00d4ff', '#f472b6', '#10b981', '#a855f7']

// Animated Value Card with SVG stroke animation
function ValueCard({
  value,
  index,
  isActive,
}: {
  value: { key: string; icon: string }
  index: number
  isActive: boolean
}) {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const paths = iconPaths[value.icon] || iconPaths.clock
  const accentColor = valueColors[index % valueColors.length]

  return (
    <motion.div
      {...(isMobile ? {} : {
        initial: { opacity: 0, y: 50, scale: 0.8 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, margin: '-50px' },
        transition: {
          duration: 0.8,
          delay: index * 0.15,
          ease: [0.16, 1, 0.3, 1],
        },
      })}
      className="group text-center relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection line to center */}
      <motion.div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-20 hidden lg:block"
        style={{ backgroundColor: `${accentColor}30` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isActive ? 1 : 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      />

      {/* Icon container */}
      <motion.div
        className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
        style={{
          backgroundColor: `${accentColor}15`,
          border: `1px solid ${accentColor}40`,
        }}
        animate={{
          scale: isHovered ? 1.1 : 1,
          boxShadow: isHovered ? `0 0 40px ${accentColor}40` : `0 0 0px ${accentColor}00`,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated icon */}
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" style={{ color: accentColor }}>
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              {...(isMobile ? {} : {
                initial: { pathLength: 0 },
                whileInView: { pathLength: 1 },
                viewport: { once: true },
                transition: { duration: 1.5, delay: index * 0.2 + 0.3, ease: 'easeInOut' },
              })}
            />
          ))}
        </svg>

        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ border: `2px solid ${accentColor}` }}
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: isActive ? [0, 0.5, 0] : 0,
            scale: isActive ? [1, 1.3, 1.5] : 1,
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl blur-xl"
          style={{ backgroundColor: accentColor }}
          animate={{
            opacity: isHovered ? 0.3 : 0.1,
          }}
        />
      </motion.div>

      {/* Title */}
      <motion.h3
        className="text-xl font-bold mb-3 transition-colors duration-300"
        style={{ color: isHovered ? accentColor : undefined }}
      >
        {t(`mission.values.${value.key}.title`)}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="text-text-secondary text-sm leading-relaxed"
        {...(isMobile ? {} : {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { delay: index * 0.15 + 0.4, duration: 0.6 },
        })}
      >
        {t(`mission.values.${value.key}.description`)}
      </motion.p>

      {/* Index number */}
      <motion.div
        className="absolute -top-4 -right-4 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold opacity-50"
        style={{
          backgroundColor: `${accentColor}20`,
          color: accentColor,
          border: `1px solid ${accentColor}30`,
        }}
        {...(isMobile ? {} : {
          initial: { scale: 0, opacity: 0 },
          whileInView: { scale: 1, opacity: 0.5 },
          viewport: { once: true },
          transition: { delay: index * 0.15 + 0.6, type: 'spring' },
        })}
      >
        {(index + 1).toString().padStart(2, '0')}
      </motion.div>
    </motion.div>
  )
}

// Central connecting element
function CenterGlow() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
      {/* Central orb */}
      <motion.div
        className="relative w-24 h-24"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Core */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green opacity-30 blur-xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner glow */}
        <div className="absolute inset-4 rounded-full bg-navy-900/80 backdrop-blur-sm border border-navy-700 flex items-center justify-center">
          <motion.div
            className="w-4 h-4 rounded-full bg-neon-cyan"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Connection lines to each corner */}
      {[45, 135, 225, 315].map((angle, i) => (
        <motion.div
          key={angle}
          className="absolute w-32 h-0.5 origin-left"
          style={{
            left: '50%',
            top: '50%',
            transform: `rotate(${angle}deg)`,
            background: `linear-gradient(90deg, ${valueColors[i]}50, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
        />
      ))}
    </div>
  )
}

export default function MissionSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Background gradient shift based on scroll
  const gradientProgress = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <SectionWrapper background="gradient" spacing="lg">
      <div ref={sectionRef} className="relative overflow-hidden">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% ${gradientProgress}%, rgba(0, 212, 255, 0.1) 0%, transparent 50%)`,
          }}
        />

        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-neon-cyan/5 rounded-full blur-[40px]" />
          <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-neon-purple/5 rounded-full blur-[40px]" />
        </div>
        <Container>
          {/* Section header */}
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              {t('mission.title')}
            </h2>
            <motion.p
              {...fadeIn}
              className="text-lg text-text-secondary max-w-2xl mx-auto"
            >
              {t('mission.subtitle')}
            </motion.p>
          </motion.div>

          {/* Values grid with central connection */}
          <div className="relative">
            {/* Center glow (desktop only) */}
            <CenterGlow />

            {/* Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {VALUES.map((value, index) => (
                <ValueCard
                  key={value.key}
                  value={value}
                  index={index}
                  isActive={isInView}
                />
              ))}
            </div>
          </div>

          {/* Bottom accent */}
          <motion.div
            className="mt-16 flex justify-center"
            {...(isMobile ? {} : {
              initial: { opacity: 0, scale: 0.8 },
              whileInView: { opacity: 1, scale: 1 },
              viewport: { once: true },
              transition: { delay: 0.8, duration: 0.6 },
            })}
          >
            <div className="flex items-center gap-4">
              {valueColors.map((color, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </Container>
      </div>
    </SectionWrapper>
  )
}
