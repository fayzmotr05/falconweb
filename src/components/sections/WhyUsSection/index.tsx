import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Container, SectionWrapper, SplitText } from '@/components/common'
import { ADVANTAGES } from '@/constants/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Icon paths for stroke animation
const iconPaths: Record<string, string[]> = {
  headset: [
    'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
  ],
  server: [
    'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
  ],
  cog: [
    'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
    'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  ],
  lock: [
    'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  ],
  award: [
    'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  ],
  check: [
    'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  ],
}

const accentColors = ['#00d4ff', '#10b981', '#a855f7', '#fb923c', '#f472b6', '#38bdf8']

// Checkmark animation component
function AnimatedCheckmark({ isChecked, color }: { isChecked: boolean; color: string }) {
  return (
    <motion.div
      className="relative w-6 h-6"
      initial={{ scale: 0 }}
      animate={{ scale: isChecked ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <motion.path
          d="M5 13l4 4L19 7"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isChecked ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
      </svg>
      {/* Success ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `2px solid ${color}` }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: isChecked ? [1, 1.5, 2] : 0.5,
          opacity: isChecked ? [0.8, 0.4, 0] : 0,
        }}
        transition={{ duration: 0.6 }}
      />
    </motion.div>
  )
}

// Individual checklist item
function ChecklistItem({
  advantage,
  index,
  isChecked,
  onCheck,
}: {
  advantage: { key: string; icon: string }
  index: number
  isChecked: boolean
  onCheck: () => void
}) {
  const { t } = useTranslation()
  const itemRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(itemRef, { once: true, margin: '-20%' })
  const [isHovered, setIsHovered] = useState(false)
  const paths = iconPaths[advantage.icon] || iconPaths.check
  const accentColor = accentColors[index % accentColors.length]

  // Auto-check when scrolled into view
  useEffect(() => {
    if (isInView && !isChecked) {
      const timer = setTimeout(() => {
        onCheck()
      }, index * 200 + 300)
      return () => clearTimeout(timer)
    }
  }, [isInView, isChecked, index, onCheck])

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection line to next item */}
      {index < ADVANTAGES.length - 1 && (
        <motion.div
          className="absolute left-5 top-16 w-0.5 h-8 bg-gradient-to-b from-navy-600 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isChecked ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        />
      )}

      <motion.div
        className="relative flex items-start gap-4 p-5 rounded-2xl transition-all duration-500 overflow-hidden"
        style={{
          backgroundColor: isChecked ? `${accentColor}10` : 'rgba(15, 23, 42, 0.3)',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: isChecked ? `${accentColor}40` : 'rgba(51, 65, 85, 1)',
        }}
        animate={{
          x: isHovered ? 10 : 0,
          boxShadow: isChecked
            ? `0 0 30px ${accentColor}20`
            : '0 0 0px transparent',
        }}
      >
        {/* Background glow when checked */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 0% 50%, ${accentColor}15, transparent 50%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isChecked ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Checkbox area */}
        <div className="flex-shrink-0 relative">
          {/* Icon background */}
          <motion.div
            className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundColor: `${accentColor}15`,
              border: `1px solid ${accentColor}30`,
            }}
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
          >
            {/* Animated icon */}
            {!isChecked && (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" style={{ color: accentColor }}>
                {paths.map((d, i) => (
                  <motion.path
                    key={i}
                    d={d}
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                  />
                ))}
              </svg>
            )}

            {/* Checkmark overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-navy-900/80">
              <AnimatedCheckmark isChecked={isChecked} color={accentColor} />
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 relative">
          <motion.h3
            className="text-lg font-semibold mb-1 transition-colors duration-300"
            style={{ color: isChecked ? accentColor : undefined }}
          >
            {t(`whyUs.advantages.${advantage.key}.title`)}
          </motion.h3>
          <motion.p
            className="text-text-secondary text-sm"
            animate={{ opacity: isChecked ? 1 : 0.7 }}
          >
            {t(`whyUs.advantages.${advantage.key}.description`)}
          </motion.p>
        </div>

        {/* Index badge */}
        <motion.div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: isChecked ? accentColor : `${accentColor}20`,
            color: isChecked ? '#0f172a' : accentColor,
          }}
          animate={{
            scale: isChecked ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {index + 1}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Progress counter component
function ProgressCounter({ checked, total }: { checked: number; total: number }) {
  const allChecked = checked === total

  return (
    <motion.div
      className="flex items-center justify-center gap-4 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 px-6 py-3 bg-navy-800/50 border border-navy-700 rounded-full">
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: i < checked ? accentColors[i % accentColors.length] : '#334155',
              }}
              animate={{
                scale: i < checked ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            />
          ))}
        </div>

        {/* Counter text */}
        <div className="ml-3 border-l border-navy-600 pl-3">
          <motion.span
            className="text-2xl font-bold"
            style={{ color: allChecked ? '#10b981' : '#00d4ff' }}
            animate={{
              scale: allChecked ? [1, 1.2, 1] : 1,
            }}
          >
            {checked}
          </motion.span>
          <span className="text-text-muted">/{total}</span>
        </div>

        {/* Completion badge */}
        <AnimatePresence>
          {allChecked && (
            <motion.div
              initial={{ opacity: 0, scale: 0, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              className="ml-2 px-3 py-1 bg-neon-green/20 border border-neon-green/40 rounded-full"
            >
              <span className="text-sm font-medium text-neon-green">Complete!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Celebration particles
function CelebrationParticles({ show }: { show: boolean }) {
  if (!show) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: accentColors[i % accentColors.length],
            left: '50%',
            top: '30%',
          }}
          initial={{ opacity: 1, scale: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1, 1],
            x: (Math.random() - 0.5) * 600,
            y: (Math.random() - 0.5) * 400,
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: 2,
            ease: 'easeOut',
            delay: i * 0.02,
          }}
        />
      ))}
    </div>
  )
}

export default function WhyUsSection() {
  const { t } = useTranslation()
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set())
  const [showCelebration, setShowCelebration] = useState(false)
  const { shouldReduceAnimations } = useReducedMotion()

  const handleCheck = (index: number) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev)
      newSet.add(index)

      // Trigger celebration when all checked
      if (newSet.size === ADVANTAGES.length && !showCelebration) {
        setTimeout(() => setShowCelebration(true), 300)
      }

      return newSet
    })
  }

  return (
    <SectionWrapper background="darker" spacing="lg">
      <div className="relative">
        {/* Celebration particles - disabled on mobile for performance */}
        {!shouldReduceAnimations && <CelebrationParticles show={showCelebration} />}

        {/* Background decorations - disabled on mobile */}
        {!shouldReduceAnimations && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[150px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-[150px]"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.4, 0.3] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
          </div>
        )}

        <Container size="md">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8"
          >
            <SplitText
              as="h2"
              animation="fadeUp"
              type="words"
              stagger={0.05}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4"
            >
              {t('whyUs.title')}
            </SplitText>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-text-secondary max-w-2xl mx-auto"
            >
              {t('whyUs.subtitle')}
            </motion.p>
          </motion.div>

          {/* Progress counter */}
          <ProgressCounter checked={checkedItems.size} total={ADVANTAGES.length} />

          {/* Checklist items */}
          <div className="space-y-4 relative">
            {ADVANTAGES.map((advantage, index) => (
              <ChecklistItem
                key={advantage.key}
                advantage={advantage}
                index={index}
                isChecked={checkedItems.has(index)}
                onCheck={() => handleCheck(index)}
              />
            ))}
          </div>

          {/* All complete message */}
          <AnimatePresence>
            {showCelebration && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 text-center"
              >
                <motion.div
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border border-neon-green/40 rounded-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(16, 185, 129, 0.2)',
                      '0 0 40px rgba(16, 185, 129, 0.4)',
                      '0 0 20px rgba(16, 185, 129, 0.2)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.svg
                    className="w-8 h-8 text-neon-green"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </motion.svg>
                  <span className="text-xl font-bold text-neon-green">
                    All Advantages Unlocked!
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </div>
    </SectionWrapper>
  )
}
