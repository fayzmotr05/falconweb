import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { Container, SectionWrapper, SplitText } from '@/components/common'
import { COMPANY_INFO } from '@/constants/content'

interface FormData {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

// Google Apps Script Web App URL - Replace with your actual deployment URL
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'

// Particle system for background
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Array<{
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    alpha: number
  }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colors = ['#00d4ff', '#a855f7', '#10b981', '#f472b6']

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    // Initialize particles
    const particleCount = 80
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
      })
    }

    // Track mouse
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
    canvas.addEventListener('mousemove', handleMouseMove)

    let animationId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      particlesRef.current.forEach((particle) => {
        // Mouse attraction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 150) {
          const force = (150 - dist) / 150
          particle.vx += (dx / dist) * force * 0.02
          particle.vy += (dy / dist) * force * 0.02
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Damping
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Wrap around
        if (particle.x < 0) particle.x = canvas.offsetWidth
        if (particle.x > canvas.offsetWidth) particle.x = 0
        if (particle.y < 0) particle.y = canvas.offsetHeight
        if (particle.y > canvas.offsetHeight) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.alpha
        ctx.fill()

        // Draw connections
        particlesRef.current.forEach((other) => {
          const dx2 = other.x - particle.x
          const dy2 = other.y - particle.y
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

          if (dist2 < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = particle.color
            ctx.globalAlpha = (1 - dist2 / 100) * 0.2
            ctx.stroke()
          }
        })
      })

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity: 0.6 }}
    />
  )
}

// Magnetic input field
function MagneticInput({
  label,
  error,
  icon,
  ...props
}: {
  label: string
  error?: boolean
  icon: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 20 })
  const springY = useSpring(y, { stiffness: 300, damping: 20 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!inputRef.current) return
      const rect = inputRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      x.set((e.clientX - centerX) * 0.1)
      y.set((e.clientY - centerY) * 0.1)
    },
    [x, y]
  )

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className="relative"
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <label className="block text-sm font-medium text-text-secondary mb-2">
        {label}
      </label>
      <div className="relative">
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors duration-300"
          animate={{ color: isFocused ? '#00d4ff' : '#64748b' }}
        >
          {icon}
        </motion.div>
        <input
          ref={inputRef}
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full pl-12 pr-4 py-4 bg-navy-800/50 border-2 ${
            error ? 'border-red-500' : isFocused ? 'border-neon-cyan' : 'border-navy-700'
          } rounded-xl text-text-primary placeholder-text-muted focus:outline-none transition-all duration-300`}
        />
        {/* Focus glow */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            boxShadow: `0 0 ${isFocused ? '20px' : '0px'} rgba(0, 212, 255, ${isFocused ? '0.3' : '0'})`,
          }}
          animate={{
            opacity: isFocused ? 1 : 0,
          }}
        />
      </div>
    </motion.div>
  )
}

// Contact card with hover effects
function ContactCard({
  icon,
  label,
  value,
  href,
  accentColor,
  index,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href: string
  accentColor: string
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLAnchorElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })

  return (
    <motion.a
      ref={cardRef}
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block relative overflow-hidden"
    >
      <motion.div
        className="relative bg-navy-800/30 backdrop-blur-sm border rounded-2xl p-6"
        style={{ borderColor: isHovered ? `${accentColor}50` : 'rgba(51, 65, 85, 1)' }}
        animate={{
          y: isHovered ? -5 : 0,
          boxShadow: isHovered ? `0 20px 40px ${accentColor}20` : '0 0 0 transparent',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor}15, transparent 70%)`,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Floating animation */}
        <motion.div
          className="flex items-center gap-4 relative"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
        >
          {/* Icon */}
          <motion.div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: `${accentColor}15`,
              border: `1px solid ${accentColor}30`,
            }}
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
          >
            <div style={{ color: accentColor }}>{icon}</div>
          </motion.div>

          {/* Text */}
          <div>
            <p className="text-sm text-text-secondary mb-1">{label}</p>
            <motion.p
              className="text-xl font-bold transition-colors duration-300"
              style={{ color: isHovered ? accentColor : undefined }}
            >
              {value}
            </motion.p>
          </div>

          {/* Arrow */}
          <motion.div
            className="ml-auto"
            animate={{
              x: isHovered ? 5 : 0,
              opacity: isHovered ? 1 : 0.3,
            }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: accentColor }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Ripple effect on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ border: `2px solid ${accentColor}` }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.5, 0], scale: 1.1 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.div>
    </motion.a>
  )
}

// Success confetti
function SuccessConfetti() {
  const colors = ['#00d4ff', '#10b981', '#a855f7', '#f472b6', '#fb923c']

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: colors[i % colors.length],
            left: '50%',
            top: '50%',
          }}
          initial={{ opacity: 1, scale: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1, 1],
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 300 - 100,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut',
            delay: i * 0.02,
          }}
        />
      ))}
    </div>
  )
}

// Magnetic submit button
function MagneticButton({
  children,
  isLoading,
  disabled,
  type,
}: {
  children: React.ReactNode
  isLoading: boolean
  disabled: boolean
  type: 'submit' | 'button'
}) {
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 15 })
  const springY = useSpring(y, { stiffness: 200, damping: 15 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!buttonRef.current || disabled) return
      const rect = buttonRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      x.set((e.clientX - centerX) * 0.2)
      y.set((e.clientY - centerY) * 0.2)
    },
    [x, y, disabled]
  )

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full py-4 px-8 rounded-xl font-bold text-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      whileTap={{ scale: 0.98 }}
    >
      {/* Background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan bg-[length:200%_100%]"
        animate={{
          backgroundPosition: isHovered ? '100% 0%' : '0% 0%',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        animate={{
          boxShadow: isHovered
            ? '0 0 40px rgba(0, 212, 255, 0.5)'
            : '0 0 0px rgba(0, 212, 255, 0)',
        }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2 text-navy-950">
        {isLoading ? (
          <motion.div
            className="w-6 h-6 border-2 border-navy-950 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            {children}
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: isHovered ? 5 : 0 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </motion.svg>
          </>
        )}
      </span>
    </motion.button>
  )
}

export default function CTASection() {
  const { t } = useTranslation()
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const sectionRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(formRef, { once: true, margin: '-100px' })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setSubmitStatus('submitting')

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'Falcon Team Website',
        }),
      })

      setSubmitStatus('success')
      reset()
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  return (
    <SectionWrapper id="contact" spacing="xl">
      <div ref={sectionRef} className="relative min-h-screen">
        {/* Particle background */}
        <div className="absolute inset-0 overflow-hidden">
          <ParticleBackground />
        </div>

        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[150px]"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px]"
            animate={{
              x: [0, -40, 0],
              y: [0, -20, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-neon-green/5 rounded-full blur-[100px]"
            animate={{
              x: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          />
        </div>

        <Container>
          <div className="relative">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-16"
            >
              <SplitText
                as="h2"
                animation="fadeUp"
                type="words"
                stagger={0.05}
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4"
              >
                {t('cta.title')}
              </SplitText>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg text-text-secondary max-w-2xl mx-auto"
              >
                {t('cta.subtitle')}
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Contact Form */}
              <motion.div
                ref={formRef}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Success confetti */}
                <AnimatePresence>
                  {submitStatus === 'success' && <SuccessConfetti />}
                </AnimatePresence>

                <motion.div
                  className="bg-navy-900/50 backdrop-blur-sm border border-navy-700 rounded-3xl p-8"
                  animate={{
                    borderColor: submitStatus === 'success' ? '#10b981' : 'rgba(51, 65, 85, 1)',
                  }}
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <MagneticInput
                      label={`${t('cta.form.name')} *`}
                      type="text"
                      placeholder="John Doe"
                      error={!!errors.name}
                      {...register('name', { required: true })}
                      icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      }
                    />

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <MagneticInput
                        label={`${t('cta.form.email')} *`}
                        type="email"
                        placeholder="john@company.com"
                        error={!!errors.email}
                        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                        icon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        }
                      />
                      <MagneticInput
                        label={`${t('cta.form.phone')} *`}
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        error={!!errors.phone}
                        {...register('phone', { required: true })}
                        icon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        }
                      />
                    </div>

                    {/* Company */}
                    <MagneticInput
                      label={t('cta.form.company')}
                      type="text"
                      placeholder="Your Company LLC"
                      {...register('company')}
                      icon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      }
                    />

                    {/* Message */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        {t('cta.form.message')}
                      </label>
                      <textarea
                        rows={4}
                        {...register('message')}
                        className="w-full px-4 py-4 bg-navy-800/50 border-2 border-navy-700 rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-cyan transition-all duration-300 resize-none"
                        placeholder="Tell us about your needs..."
                      />
                    </div>

                    {/* Submit button */}
                    <MagneticButton
                      type="submit"
                      isLoading={submitStatus === 'submitting'}
                      disabled={submitStatus === 'submitting'}
                    >
                      {submitStatus === 'submitting' ? t('cta.form.submitting') : t('cta.form.submit')}
                    </MagneticButton>

                    {/* Status messages */}
                    <AnimatePresence>
                      {submitStatus === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 bg-neon-green/10 border border-neon-green/30 rounded-xl text-neon-green text-center"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {t('cta.form.success')}
                          </div>
                        </motion.div>
                      )}

                      {submitStatus === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-center"
                        >
                          {t('cta.form.error')}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </motion.div>
              </motion.div>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Phone */}
                <ContactCard
                  icon={
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  }
                  label={t('cta.contact.phone')}
                  value={COMPANY_INFO.phone}
                  href={COMPANY_INFO.phoneLink}
                  accentColor="#00d4ff"
                  index={0}
                />

                {/* Instagram */}
                <ContactCard
                  icon={
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  }
                  label={t('cta.contact.instagram')}
                  value={COMPANY_INFO.instagram}
                  href={COMPANY_INFO.instagramLink}
                  accentColor="#a855f7"
                  index={1}
                />

                {/* CEO Info */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="relative overflow-hidden"
                >
                  <motion.div
                    className="bg-gradient-to-br from-navy-800/50 to-navy-900/50 backdrop-blur-sm border border-navy-700 rounded-2xl p-6"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar with gradient border */}
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-cyan via-neon-purple to-neon-green p-0.5">
                          <div className="w-full h-full rounded-full bg-navy-900 flex items-center justify-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">
                            JS
                          </div>
                        </div>
                        {/* Online indicator */}
                        <motion.div
                          className="absolute -bottom-1 -right-1 w-5 h-5 bg-neon-green rounded-full border-2 border-navy-900"
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                      <div>
                        <p className="text-sm text-text-secondary mb-1">{t('footer.ceo')}</p>
                        <p className="text-xl font-bold text-text-primary">{COMPANY_INFO.ceo}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex items-center justify-center gap-6 pt-6"
                >
                  {['24/7', 'USA', 'Pro'].map((badge, i) => (
                    <motion.div
                      key={badge}
                      className="px-4 py-2 bg-navy-800/30 border border-navy-700 rounded-full text-sm text-text-secondary"
                      whileHover={{ scale: 1.1, borderColor: '#00d4ff' }}
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                      {badge}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </SectionWrapper>
  )
}
