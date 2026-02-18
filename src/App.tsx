import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CustomCursor from '@/components/common/CustomCursor'
import ScrollProgress from '@/components/common/ScrollProgress'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import HomePage from '@/pages/HomePage'

const ServiceDetailPage = lazy(() => import('@/pages/ServiceDetailPage'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function App() {
  useSmoothScroll()

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <ScrollToTop />

      <div className="min-h-screen bg-navy-950">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/services/:serviceKey"
              element={
                <Suspense fallback={null}>
                  <ServiceDetailPage />
                </Suspense>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
