// Module-level mobile detection (checked once at load)
export const isMobile = typeof window !== 'undefined' && (
  window.innerWidth < 768 ||
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0
)

// Animation presets — return empty object on mobile (elements render visible immediately)
export const fadeInUp = isMobile ? {} : {
  initial: { opacity: 0, y: 30 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: '-100px' } as const,
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
}

export const fadeIn = isMobile ? {} : {
  initial: { opacity: 0 } as const,
  whileInView: { opacity: 1 } as const,
  viewport: { once: true } as const,
  transition: { delay: 0.3, duration: 0.6 },
}
