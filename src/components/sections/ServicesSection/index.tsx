import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Container, SectionWrapper, SplitText } from '@/components/common'
import { SERVICES } from '@/constants/content'

// Service icon paths for SVG
const iconPaths: Record<string, string[]> = {
  eld: [
    'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z',
    'M9 9h6v6H9V9z',
  ],
  shield: [
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  ],
  document: [
    'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  ],
  accounting: [
    'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z',
  ],
}

// Single accent color for all services (cyan/blue)
const ACCENT_COLOR = '#00d4ff'

function ServiceCard({ service, index }: { service: { key: string; icon: string }; index: number }) {
  const { t } = useTranslation()
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })
  const paths = iconPaths[service.icon] || iconPaths.eld

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/services/${service.key}`} className="group block h-full">
        <motion.div
          className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-navy-800/50 to-navy-900/50 backdrop-blur-sm border border-navy-700 overflow-hidden"
          whileHover={{ y: -8, borderColor: ACCENT_COLOR }}
          transition={{ duration: 0.3 }}
        >
          {/* Gradient overlay on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `radial-gradient(circle at 30% 30%, ${ACCENT_COLOR}15 0%, transparent 70%)` }}
          />

          {/* Icon */}
          <div
            className="relative w-16 h-16 mb-6 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${ACCENT_COLOR}20, ${ACCENT_COLOR}05)` }}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              style={{ color: ACCENT_COLOR }}
            >
              {paths.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                />
              ))}
            </svg>
          </div>

          {/* Content */}
          <div className="relative">
            <h3 className="text-xl font-bold text-text-primary mb-3">
              {t(`services.${service.key}.title`)}
            </h3>
            <p className="text-text-secondary leading-relaxed">
              {t(`services.${service.key}.description`)}
            </p>
          </div>

          {/* Learn More indicator */}
          <div className="relative mt-4 flex items-center gap-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: ACCENT_COLOR }}>
            {t('serviceDetail.learnMore')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{ background: `linear-gradient(90deg, ${ACCENT_COLOR}, transparent)` }}
            initial={{ scaleX: 0, originX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  )
}

export default function ServicesSection() {
  const { t } = useTranslation()

  return (
    <SectionWrapper id="services" className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-neon-cyan/5 via-transparent to-transparent opacity-30" />

      <Container>
        {/* Section header */}
        <div className="text-center mb-16">
          <SplitText
            as="h2"
            animation="fadeUp"
            type="words"
            stagger={0.05}
            trigger="inView"
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
          >
            {t('services.title')}
          </SplitText>
          <SplitText
            type="words"
            animation="fadeIn"
            stagger={0.03}
            delay={0.2}
            trigger="inView"
            className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto"
          >
            {t('services.subtitle')}
          </SplitText>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.key} service={service} index={index} />
          ))}
        </div>
      </Container>
    </SectionWrapper>
  )
}
