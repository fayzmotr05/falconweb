import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import StatsSection from '@/components/sections/StatsSection'
import TimelineSection from '@/components/sections/TimelineSection'
import ServicesSection from '@/components/sections/ServicesSection'
import PlatformsSection from '@/components/sections/PlatformsSection'
import ClientsSection from '@/components/sections/ClientsSection'
import MissionSection from '@/components/sections/MissionSection'
// import TeamSection from '@/components/sections/TeamSection'
import WhyUsSection from '@/components/sections/WhyUsSection'
import CTASection from '@/components/sections/CTASection'
import CustomCursor from '@/components/common/CustomCursor'
import ScrollProgress from '@/components/common/ScrollProgress'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'

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
          <StatsSection />
          <TimelineSection />
          <ServicesSection />
          <PlatformsSection />
          <ClientsSection />
          <MissionSection />
          {/* <TeamSection /> */}
          <WhyUsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
