import { useState, useEffect } from 'react'

interface DeviceCapabilities {
  isMobile: boolean
  isTouchDevice: boolean
  prefersReducedMotion: boolean
  shouldReduceAnimations: boolean
}

export function useReducedMotion(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isMobile: false,
    isTouchDevice: false,
    prefersReducedMotion: false,
    shouldReduceAnimations: false,
  })

  useEffect(() => {
    const checkDevice = () => {
      // Check if touch device
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      // Check screen size for mobile
      const isMobile = window.innerWidth < 768

      // Check user preference for reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Should reduce animations if mobile OR touch OR user prefers reduced motion
      const shouldReduceAnimations = isMobile || isTouchDevice || prefersReducedMotion

      setCapabilities({
        isMobile,
        isTouchDevice,
        prefersReducedMotion,
        shouldReduceAnimations,
      })
    }

    // Initial check
    checkDevice()

    // Listen for resize events
    window.addEventListener('resize', checkDevice)

    // Listen for reduced motion preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
      motionQuery.removeEventListener('change', checkDevice)
    }
  }, [])

  return capabilities
}

// Export simplified animation values for mobile
export const mobileAnimationConfig = {
  // Reduced particle counts
  particleCount: 5,
  // Simplified transitions
  transitionDuration: 0.3,
  // Disable complex effects
  enableBlur: false,
  enable3D: false,
  enableParallax: false,
}

export const desktopAnimationConfig = {
  particleCount: 20,
  transitionDuration: 0.6,
  enableBlur: true,
  enable3D: true,
  enableParallax: true,
}
