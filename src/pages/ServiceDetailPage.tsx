import { useEffect } from 'react'
import { useParams, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Container, SectionWrapper } from '@/components/common'
import { SERVICES } from '@/constants/content'

const VALID_KEYS = SERVICES.map(s => s.key) as readonly string[]

export default function ServiceDetailPage() {
  const { serviceKey } = useParams<{ serviceKey: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (!serviceKey || !VALID_KEYS.includes(serviceKey)) {
    return <Navigate to="/" replace />
  }

  const title = t(`serviceDetail.${serviceKey}.title`)
  const subtitle = t(`serviceDetail.${serviceKey}.subtitle`)
  const features = t(`serviceDetail.${serviceKey}.features`, { returnObjects: true }) as Array<{
    title: string
    description: string
  }>

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate('/')
    setTimeout(() => {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate('/')
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  return (
    <>
      {/* Hero Section */}
      <SectionWrapper className="pt-32 pb-12" background="gradient">
        <Container>
          {/* Back navigation */}
          <motion.a
            href="/#services"
            onClick={handleBackClick}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-text-secondary hover:text-neon-cyan transition-colors mb-8"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('serviceDetail.backToServices')}
          </motion.a>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-text-primary mb-6"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-lg md:text-xl text-text-secondary max-w-3xl"
          >
            {subtitle}
          </motion.p>
        </Container>
      </SectionWrapper>

      {/* Features Grid */}
      <SectionWrapper spacing="md">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {Array.isArray(features) && features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-8 rounded-2xl bg-gradient-to-br from-navy-800/50 to-navy-900/50 backdrop-blur-sm border border-navy-700 hover:border-neon-cyan/40 transition-colors duration-300"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_30%_30%,rgba(0,212,255,0.08)_0%,transparent_70%)]" />

                <div className="relative">
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper background="darker" spacing="md">
        <Container>
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
            >
              {t('serviceDetail.cta.title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-text-secondary mb-8 max-w-2xl mx-auto text-lg"
            >
              {t('serviceDetail.cta.subtitle')}
            </motion.p>
            <motion.a
              href="/#contact"
              onClick={handleCTAClick}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center px-8 py-4 bg-neon-cyan text-navy-950 font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] transition-shadow duration-300"
            >
              {t('serviceDetail.cta.button')}
            </motion.a>
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
