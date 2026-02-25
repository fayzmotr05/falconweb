import { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Container, Button, ParticleField, SplitText } from '@/components/common'
import AnimatedGrid from './AnimatedGrid'
import DataFlowLines from './DataFlowLines'
import { COMPANY_INFO } from '@/constants/content'
import { useReducedMotion } from '@/hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const { shouldReduceAnimations } = useReducedMotion()

  const [isLoaded, setIsLoaded] = useState(false)

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Entrance animations for non-split elements
  useEffect(() => {
    if (!isLoaded) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })

      // Badge animation
      tl.fromTo(badgeRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
      )

      // Buttons animation
      tl.fromTo(buttonsRef.current?.children || [],
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
        '-=0.3'
      )

      // Contact info animation
      tl.fromTo(contactRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.2'
      )

      // Scroll indicator
      tl.fromTo(scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.3'
      )
    })

    return () => ctx.revert()
  }, [isLoaded])

  // Pinned scroll effect - content fades/scales on scroll (desktop only)
  useEffect(() => {
    if (shouldReduceAnimations) return

    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const ctx = gsap.context(() => {
      // Parallax exit animation
      gsap.to(content, {
        y: -100,
        opacity: 0,
        scale: 0.9,
        filter: 'blur(10px)',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Scroll indicator fades faster
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        y: -30,
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '30% top',
          scrub: 1,
        },
      })
    })

    return () => ctx.revert()
  }, [shouldReduceAnimations])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-950"
    >
      {/* Layer 1: Particle field - desktop only */}
      {!shouldReduceAnimations && (
        <div className="absolute inset-0 z-0">
          <ParticleField
            particleCount={60}
            colors={['#00d4ff', '#a855f7', '#22c55e']}
            connectionDistance={120}
            speed={0.3}
          />
        </div>
      )}

      {/* Layer 2: Gradient orbs - simplified on mobile (no blur filter) */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {shouldReduceAnimations ? (
          <>
            <div className="absolute top-1/4 left-1/4 w-[280px] h-[280px] rounded-full bg-neon-cyan/5" />
            <div className="absolute bottom-1/4 right-1/4 w-[240px] h-[240px] rounded-full bg-neon-purple/5" />
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[60px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-purple/10 rounded-full blur-[50px]" />
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-neon-green/5 rounded-full blur-[40px]" />
          </>
        )}
      </div>

      {/* Layer 3: Animated grid - only on desktop */}
      {!shouldReduceAnimations && (
        <div className="absolute inset-0 z-[2]">
          <AnimatedGrid />
        </div>
      )}

      {/* Layer 4: Data flow lines - only on desktop */}
      {!shouldReduceAnimations && (
        <div className="absolute inset-0 z-[3]">
          <DataFlowLines />
        </div>
      )}

      {/* Layer 5: Content (fixed until scroll) */}
      <Container className="relative z-10 pt-24 pb-16">
        <div ref={contentRef} className="max-w-5xl mx-auto text-center">
          {/* Badge with glow */}
          <div ref={badgeRef} className="mb-8 opacity-0">
            <span className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-navy-800/60 border border-neon-cyan/30 text-sm text-text-secondary backdrop-blur-sm shadow-lg shadow-neon-cyan/10">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-green" />
              </span>
              Trusted by 300+ trucking companies
            </span>
          </div>

          {/* Main headline with split text animation */}
          <div className="mb-4">
            <SplitText
              as="h1"
              type="words"
              animation="fadeUp"
              duration={0.8}
              stagger={0.05}
              delay={0.8}
              trigger="load"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-tight"
            >
              {t('hero.title')}
            </SplitText>
          </div>

          {/* Highlighted text with special animation */}
          <div className="mb-8">
            <SplitText
              as="h2"
              type="chars"
              animation="wave"
              duration={0.6}
              stagger={0.03}
              delay={1.4}
              trigger="load"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gradient-cyan leading-tight"
            >
              {t('hero.titleHighlight')}
            </SplitText>
          </div>

          {/* Subtitle with fade animation */}
          <div className="mb-12">
            <SplitText
              as="p"
              type="words"
              animation="fadeIn"
              duration={0.5}
              stagger={0.02}
              delay={2}
              trigger="load"
              className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto"
            >
              {t('hero.subtitle')}
            </SplitText>
          </div>

          {/* CTA buttons with magnetic effect */}
          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 opacity-0">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto group relative overflow-hidden"
              data-cursor="pointer"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10">{t('hero.cta.consultation')}</span>
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan bg-[length:200%_100%] animate-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto relative overflow-hidden group"
              data-cursor="pointer"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10 group-hover:text-navy-950 transition-colors duration-300">{t('hero.cta.learnMore')}</span>
              <div className="absolute inset-0 bg-neon-cyan scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto relative overflow-hidden group"
              data-cursor="pointer"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10 group-hover:text-navy-950 transition-colors duration-300">{t('hero.cta.quote')}</span>
              <div className="absolute inset-0 bg-neon-purple scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Button>
          </div>

          {/* Contact quick info */}
          <div ref={contactRef} className="flex flex-col sm:flex-row items-center justify-center gap-6 text-text-secondary opacity-0">
            <a
              href={COMPANY_INFO.phoneLink}
              className="flex items-center gap-2 hover:text-neon-cyan transition-colors group"
              data-cursor="pointer"
            >
              <div className="p-2 rounded-lg bg-navy-800/50 group-hover:bg-neon-cyan/20 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="font-medium">{COMPANY_INFO.phone}</span>
            </a>
            <div className="hidden sm:block w-px h-6 bg-navy-700" />
            <a
              href={COMPANY_INFO.instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-neon-purple transition-colors group"
              data-cursor="pointer"
            >
              <div className="p-2 rounded-lg bg-navy-800/50 group-hover:bg-neon-purple/20 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <span className="font-medium">{COMPANY_INFO.instagram}</span>
            </a>
          </div>
        </div>

        {/* Enhanced scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0"
        >
          <div className="flex flex-col items-center gap-3 text-text-muted group cursor-pointer p-4 -m-4"
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-xs uppercase tracking-[0.2em] font-medium">Scroll</span>
            <div className="relative w-7 h-12 rounded-full border-2 border-navy-600 group-hover:border-neon-cyan transition-colors flex items-start justify-center p-1.5">
              {/* Animated dot */}
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-bounce" style={{ animationDuration: '1.5s' }} />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-neon-cyan/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-950 to-transparent pointer-events-none z-20" />
    </section>
  )
}
