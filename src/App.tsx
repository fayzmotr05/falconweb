import { lazy, Suspense } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import CustomCursor from '@/components/common/CustomCursor'
import ScrollProgress from '@/components/common/ScrollProgress'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

// Lazy-load below-the-fold sections for faster initial load
const StatsSection = lazy(() => import('@/components/sections/StatsSection'))
const TimelineSection = lazy(() => import('@/components/sections/TimelineSection'))
const ServicesSection = lazy(() => import('@/components/sections/ServicesSection'))
const PlatformsSection = lazy(() => import('@/components/sections/PlatformsSection'))
const ClientsSection = lazy(() => import('@/components/sections/ClientsSection'))
const MissionSection = lazy(() => import('@/components/sections/MissionSection'))
const WhyUsSection = lazy(() => import('@/components/sections/WhyUsSection'))
const CTASection = lazy(() => import('@/components/sections/CTASection'))

function App() {
  // Initialize smooth scrolling
  useSmoothScroll()

  return (
    <>
      {/* Custom cursor (desktop only) */}
      <CustomCursor />

      {/* Scroll progress indicator */}
      <ScrollProgress />

      <div className="min-h-screen bg-navy-950">
        <Header />
        <main>
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
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
