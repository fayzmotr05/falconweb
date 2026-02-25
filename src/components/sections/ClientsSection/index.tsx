import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import { Container, SectionWrapper, SplitText, AnimatedCounter, Card3D } from '@/components/common'
import { CLIENT_SEGMENTS } from '@/constants/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Professional detailed SVG icons with multiple paths for visual richness
const iconPaths: Record<string, string[]> = {
  truck: [
    // Main cargo body
    'M2 11V8a2 2 0 012-2h7v7H4a2 2 0 01-2-2z',
    // Cabin
    'M11 6h3.5a2 2 0 011.8 1.1l1.5 3.4a2 2 0 01.2.9V14a2 2 0 01-2 2h-5V6z',
    // Cabin window
    'M13 8h2l1.2 2.7H13V8z',
    // Left wheel outer
    'M6 18a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
    // Left wheel inner hub
    'M6 16.5a1 1 0 100-2 1 1 0 000 2z',
    // Right wheel outer
    'M16 18a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
    // Right wheel inner hub
    'M16 16.5a1 1 0 100-2 1 1 0 000 2z',
    // Undercarriage
    'M8.5 15.5h5',
    // Cargo detail lines
    'M4 8h4M4 10h3',
    // Front grille
    'M17 12v1',
  ],
  fleet: [
    // Main building outline
    'M4 21V8l8-5 8 5v13',
    // Building base
    'M2 21h20',
    // Left windows
    'M7 10h2v2H7zM7 14h2v2H7z',
    // Right windows
    'M15 10h2v2h-2zM15 14h2v2h-2z',
    // Center windows
    'M11 10h2v2h-2z',
    // Door
    'M10 21v-5h4v5',
    // Door knob
    'M13 18.5h.5',
    // Roof antenna
    'M12 3v2',
    // Roof detail
    'M8 5l4-2 4 2',
    // Side pillars
    'M5 8v13M19 8v13',
  ],
  globe: [
    // Main circle
    'M12 2a10 10 0 100 20 10 10 0 000-20z',
    // Horizontal latitude lines
    'M2 12h20',
    'M4 7h16',
    'M4 17h16',
    // Vertical longitude curve
    'M12 2c-2.8 2.8-4 6.3-4 10s1.2 7.2 4 10',
    'M12 2c2.8 2.8 4 6.3 4 10s-1.2 7.2-4 10',
    // Location marker
    'M12 9a2 2 0 100 4 2 2 0 000-4z',
    'M12 6v1',
    // Connection dots
    'M5.5 5.5l.5.5',
    'M18.5 18.5l.5.5',
    // Satellite arcs
    'M3 9c2-1 4-1.5 6-1.5',
    'M15 16.5c2 0 4-.5 6-1.5',
  ],
}

// Client Segment Card Component
function ClientSegmentCard({
  segment,
  index,
}: {
  segment: { key: string; icon: string }
  index: number
}) {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const paths = iconPaths[segment.icon] || iconPaths.truck
  const accentColors = ['#00d4ff', '#a855f7', '#10b981']
  const accentColor = accentColors[index % accentColors.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ perspective: '1000px' }}
    >
      <Card3D glowColor={`${accentColor}40`} tiltIntensity={8} flipOnView={false}>
        <div
          className="h-full bg-navy-800/30 backdrop-blur-sm border border-navy-700 rounded-2xl p-4 sm:p-6 overflow-hidden transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            borderColor: isHovered ? `${accentColor}50` : undefined,
          }}
        >
          {/* Icon with stroke animation */}
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
            style={{
              backgroundColor: `${accentColor}15`,
              boxShadow: isHovered ? `0 0 30px ${accentColor}30` : 'none',
            }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" style={{ color: accentColor }}>
              {paths.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  // Main structural paths (first 3) are thicker, details are thinner
                  strokeWidth={i < 3 ? 1.5 : 1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6 + i * 0.08,
                    delay: index * 0.15 + i * 0.1,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </svg>
          </div>

          <h3
            className="text-xl font-bold mb-2 transition-colors duration-300"
            style={{ color: isHovered ? accentColor : undefined }}
          >
            {t(`clients.${segment.key}.title`)}
          </h3>
          <p className="text-text-secondary text-sm">
            {t(`clients.${segment.key}.description`)}
          </p>
        </div>
      </Card3D>
    </motion.div>
  )
}

// Case Study Showcase Component
function CaseStudyShowcase() {
  const { t } = useTranslation()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [showCelebration, setShowCelebration] = useState(false)
  const { shouldReduceAnimations } = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        if (isInView) setTimeout(() => setShowCelebration(true), 1500)
      }}
    >
      <div className="relative bg-gradient-to-br from-navy-800/50 via-navy-900/50 to-navy-800/50 border border-neon-green/30 rounded-3xl p-6 sm:p-8 md:p-12 overflow-hidden">
        {/* Animated background */}
        <div
          className="absolute top-0 right-0 w-64 h-64 bg-neon-green/10 rounded-full blur-[40px] opacity-15"
        />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-cyan/10 rounded-full blur-[30px] opacity-10" />

        {/* Celebration particles - disabled on mobile for performance */}
        {showCelebration && !shouldReduceAnimations && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 2 === 0 ? '#10b981' : '#00d4ff',
                  left: '50%',
                  top: '50%',
                }}
                initial={{ opacity: 1, scale: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0, 1, 1],
                  x: (Math.random() - 0.5) * 300,
                  y: (Math.random() - 0.5) * 200,
                }}
                transition={{
                  duration: 1.5,
                  ease: 'easeOut',
                  delay: i * 0.02,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/30 mb-6"
            animate={showCelebration ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <motion.svg
              className="w-4 h-4 text-neon-green"
              fill="currentColor"
              viewBox="0 0 20 20"
              animate={showCelebration ? { rotate: [0, 360] } : {}}
              transition={{ duration: 0.5 }}
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </motion.svg>
            <span className="text-sm font-medium text-neon-green">{t('clients.caseStudy.title')}</span>
          </motion.div>

          <p className="text-lg text-text-secondary mb-8">
            {t('clients.caseStudy.description')}
          </p>

          {/* Numbers comparison */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
            <motion.div
              className="text-center"
              initial={{ x: -50, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-red-400 line-through opacity-60">
                <AnimatedCounter end={40000} prefix="$" duration={2000} scramble={true} />
              </div>
              <p className="text-text-muted mt-1">Original Fine</p>
            </motion.div>

            <motion.div
              className="flex items-center"
              animate={isInView ? { scale: [0, 1.2, 1] } : {}}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <svg className="w-10 h-10 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ x: 50, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.div
                className="text-4xl md:text-5xl font-bold text-neon-green"
                animate={showCelebration ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <AnimatedCounter end={8000} prefix="$" duration={2000} scramble={true} />
              </motion.div>
              <p className="text-text-muted mt-1">After Our Help</p>
            </motion.div>

            <motion.div
              className="mt-4 md:mt-0 md:ml-8"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 1.2, duration: 0.5, type: 'spring' }}
            >
              <motion.div
                className="px-6 py-3 bg-neon-green/20 border border-neon-green/40 rounded-xl"
                animate={showCelebration ? {
                  boxShadow: ['0 0 0px rgba(16, 185, 129, 0)', '0 0 30px rgba(16, 185, 129, 0.5)', '0 0 0px rgba(16, 185, 129, 0)'],
                } : {}}
                transition={{ duration: 1, repeat: showCelebration ? 3 : 0 }}
              >
                <span className="text-2xl font-bold text-neon-green">
                  {t('clients.caseStudy.savings')}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ClientsSection() {
  const { t } = useTranslation()

  return (
    <SectionWrapper spacing="lg">
      <Container>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <SplitText
            as="h2"
            animation="fadeUp"
            type="words"
            stagger={0.05}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4"
          >
            {t('clients.title')}
          </SplitText>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            {t('clients.subtitle')}
          </motion.p>
        </motion.div>

        {/* Client segments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {CLIENT_SEGMENTS.map((segment, index) => (
            <ClientSegmentCard key={segment.key} segment={segment} index={index} />
          ))}
        </div>

        {/* Case Study Showcase */}
        <CaseStudyShowcase />
      </Container>
    </SectionWrapper>
  )
}
