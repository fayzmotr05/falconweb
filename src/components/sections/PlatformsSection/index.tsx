import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import { Container, SectionWrapper, Card3D } from '@/components/common'
import { INTEGRATIONS } from '@/constants/content'
import { isMobile, fadeInUp, fadeIn } from '@/lib/motion'

// 3D Dashboard Mockup Component
function DashboardMockup({
  type,
  isHovered,
  accentColor,
}: {
  type: 'sba' | 'securePath'
  isHovered: boolean
  accentColor: string
}) {
  return (
    <motion.div
      className="relative bg-navy-950/80 rounded-xl p-4 border border-navy-700 overflow-hidden"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: isHovered ? -5 : 0,
        rotateY: isHovered ? (type === 'sba' ? 5 : -5) : 0,
        z: isHovered ? 50 : 0,
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Screen reflection */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
        animate={{
          opacity: isHovered ? 0.1 : 0.05,
        }}
      />

      {/* Window controls */}
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          className="w-3 h-3 rounded-full bg-red-500"
          animate={{ scale: isHovered ? 1.2 : 1 }}
        />
        <motion.div
          className="w-3 h-3 rounded-full bg-yellow-500"
          animate={{ scale: isHovered ? 1.2 : 1, transition: { delay: 0.05 } }}
        />
        <motion.div
          className="w-3 h-3 rounded-full bg-green-500"
          animate={{ scale: isHovered ? 1.2 : 1, transition: { delay: 0.1 } }}
        />
        <div className="flex-1" />
        <a
          href={type === 'sba' ? 'https://clearpatheld.com' : 'https://securepatheld.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-text-muted font-mono hover:text-neon-cyan transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {type === 'sba' ? 'clearpatheld.com' : 'securepatheld.com'}
        </a>
      </div>

      {type === 'sba' ? (
        // SBA Dashboard - ELD Tracking System
        <div className="space-y-3">
          {/* Stats row with actual numbers */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Active', value: '47', color: '#10b981' },
              { label: 'Routes', value: '12', color: '#00d4ff' },
              { label: 'Alerts', value: '3', color: '#f59e0b' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-2 rounded-lg"
                style={{ backgroundColor: `${stat.color}15` }}
                animate={{ opacity: isHovered ? 1 : 0.7 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="text-lg font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-[10px] text-text-muted">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Mini map with animated truck dots */}
          <div className="h-20 rounded-lg bg-navy-800/50 relative overflow-hidden">
            {/* Animated dots representing trucks */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: '#10b981',
                  left: `${15 + i * 22}%`,
                  top: `${25 + (i % 2) * 40}%`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 80">
              <motion.path
                d="M20 50 Q60 20, 100 45 T180 30"
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
                strokeDasharray="4 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isHovered ? 1 : 0.5 }}
                transition={{ duration: 1 }}
              />
            </svg>
            {/* Map grid lines */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute w-full h-px bg-gray-500 top-1/3" />
              <div className="absolute w-full h-px bg-gray-500 top-2/3" />
              <div className="absolute h-full w-px bg-gray-500 left-1/3" />
              <div className="absolute h-full w-px bg-gray-500 left-2/3" />
            </div>
          </div>

          {/* Bottom stats bar */}
          <div className="flex items-center justify-between text-[10px] text-text-muted px-1">
            <span>Miles: 2,450</span>
            <span>ETA: 4h 23m</span>
            <span>Status: On Time</span>
          </div>
        </div>
      ) : (
        // Secure Path Dashboard - Safety & Compliance System
        <div className="space-y-3">
          {/* Compliance meters with progress bars */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'HOS', value: 98, color: '#10b981' },
              { label: 'Safety', value: 94, color: '#00d4ff' },
              { label: 'Docs', value: 100, color: '#a855f7' },
              { label: 'Inspect', value: 87, color: '#f59e0b' },
            ].map((meter, i) => (
              <motion.div
                key={i}
                className="p-2 rounded-lg border"
                style={{
                  borderColor: `${meter.color}30`,
                  backgroundColor: `${meter.color}08`,
                }}
                animate={{
                  borderColor: isHovered ? `${meter.color}50` : `${meter.color}30`,
                }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-text-muted">{meter.label}</span>
                  <span className="text-xs font-bold" style={{ color: meter.color }}>
                    {meter.value}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 rounded-full bg-navy-700">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: meter.color }}
                    initial={{ width: 0 }}
                    animate={{ width: isHovered ? `${meter.value}%` : '60%' }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Driver status row */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-8 rounded-lg bg-navy-800/50 flex items-center px-2 gap-2">
              {/* Status indicator */}
              <motion.div
                className="w-2 h-2 rounded-full bg-neon-green"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[10px] text-text-muted">Driver: On Duty</span>
            </div>
            <motion.div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}30` }}
              animate={{ rotate: isHovered ? 90 : 0 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={accentColor}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
          </div>

          {/* Time remaining bar */}
          <div className="text-[10px] px-1">
            <div className="flex justify-between text-text-muted mb-1">
              <span>Drive Time</span>
              <span>6h 42m left</span>
            </div>
            <div className="h-1 rounded-full bg-navy-700">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon-green to-neon-cyan"
                initial={{ width: 0 }}
                animate={{ width: isHovered ? '40%' : '30%' }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Platform Card Component
function PlatformCard({
  platformKey,
  accentColor,
  index,
}: {
  platformKey: 'sba' | 'securePath'
  accentColor: string
  index: number
}) {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={cardRef}
      initial={isMobile ? undefined : { opacity: 0, y: 50, rotateY: index === 0 ? -15 : 15 }}
      animate={isMobile ? undefined : (isInView ? { opacity: 1, y: 0, rotateY: 0 } : {})}
      transition={isMobile ? undefined : { duration: 0.8, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={isMobile ? undefined : { perspective: '1000px' }}
    >
      <Card3D
        glowColor={`${accentColor}40`}
        tiltIntensity={10}
        flipOnView={false}
      >
        <div
          className="relative bg-gradient-to-br from-navy-800/80 to-navy-900/80 border border-navy-700 rounded-3xl p-6 sm:p-8 overflow-hidden transition-all duration-500"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            borderColor: isHovered ? `${accentColor}50` : undefined,
          }}
        >
          {/* Animated glow */}
          <motion.div
            className="absolute -top-20 rounded-full blur-[80px] w-40 h-40"
            style={{
              backgroundColor: accentColor,
              left: index === 0 ? '-5rem' : 'auto',
              right: index === 1 ? '-5rem' : 'auto',
            }}
            animate={{
              opacity: isHovered ? 0.3 : 0.15,
              scale: isHovered ? 1.2 : 1,
            }}
          />

          {/* Platform badge */}
          <motion.div
            className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: `${accentColor}15`,
              border: `1px solid ${accentColor}40`,
            }}
            animate={{
              scale: isHovered ? 1.05 : 1,
            }}
          >
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: accentColor }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <span className="text-sm font-medium" style={{ color: accentColor }}>
              Own Platform
            </span>
          </motion.div>

          {/* Logo + Title */}
          <div className="relative flex items-center gap-3 mb-3">
            <img
              src={platformKey === 'sba' ? '/clearpath-logo.jpg' : '/securepath-logo.svg'}
              alt={t(`platforms.${platformKey}.title`)}
              className="h-10 w-10 object-contain rounded-lg"
            />
            <h3 className="text-3xl font-bold text-text-primary">
              {t(`platforms.${platformKey}.title`)}
            </h3>
          </div>
          <p className="relative text-text-secondary mb-6">
            {t(`platforms.${platformKey}.description`)}
          </p>

          {/* 3D Dashboard */}
          <DashboardMockup
            type={platformKey}
            isHovered={isHovered}
            accentColor={accentColor}
          />

          {/* Connection lines to integrations */}
          {isHovered && (
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-8"
              style={{ backgroundColor: accentColor }}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 0.5 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      </Card3D>
    </motion.div>
  )
}

export default function PlatformsSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <SectionWrapper background="darker" spacing="lg">
      <div ref={sectionRef} className="relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[60px]" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-[60px]" />
        </div>

        <Container>
          {/* Section header */}
          <motion.div
            {...fadeInUp}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              {t('platforms.title')}
            </h2>
            <motion.p
              {...fadeIn}
              className="text-lg text-text-secondary max-w-2xl mx-auto"
            >
              {t('platforms.subtitle')}
            </motion.p>
          </motion.div>

          {/* Platform cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-12 sm:mb-16">
            <PlatformCard platformKey="sba" accentColor="#00d4ff" index={0} />
            <PlatformCard platformKey="securePath" accentColor="#a855f7" index={1} />
          </div>

          {/* Integrations */}
          <motion.div
            {...(isMobile ? {} : {
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: '-100px' },
              transition: { duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
            })}
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {t('platforms.integrations.title')}
              </h3>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {INTEGRATIONS.map((integration, index) => (
                <motion.div
                  key={integration}
                  {...(isMobile ? {} : {
                    initial: { opacity: 0, scale: 0.8, y: 20 },
                    whileInView: { opacity: 1, scale: 1, y: 0 },
                    viewport: { once: true },
                    transition: { duration: 0.4, delay: index * 0.05 },
                  })}
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                    boxShadow: '0 10px 30px rgba(0, 212, 255, 0.2)',
                  }}
                  className="px-6 py-3 bg-navy-800/50 border border-navy-700 rounded-xl text-text-secondary cursor-pointer transition-colors hover:border-neon-cyan/50 hover:text-neon-cyan"
                >
                  {integration}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </div>
    </SectionWrapper>
  )
}
