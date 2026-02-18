import { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSection from '@/components/sections/HeroSection'

const StatsSection = lazy(() => import('@/components/sections/StatsSection'))
const TimelineSection = lazy(() => import('@/components/sections/TimelineSection'))
const ServicesSection = lazy(() => import('@/components/sections/ServicesSection'))
const PlatformsSection = lazy(() => import('@/components/sections/PlatformsSection'))
const ClientsSection = lazy(() => import('@/components/sections/ClientsSection'))
const MissionSection = lazy(() => import('@/components/sections/MissionSection'))
const WhyUsSection = lazy(() => import('@/components/sections/WhyUsSection'))
const CTASection = lazy(() => import('@/components/sections/CTASection'))

export default function HomePage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        const el = document.getElementById(hash.substring(1))
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [hash])

  return (
    <>
      <HeroSection />
      <Suspense fallback={null}>
        <StatsSection />
        <TimelineSection />
        <ServicesSection />
        <PlatformsSection />
        <ClientsSection />
        <MissionSection />
        <WhyUsSection />
        <CTASection />
      </Suspense>
    </>
  )
}
