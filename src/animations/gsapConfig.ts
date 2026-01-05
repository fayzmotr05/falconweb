import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP)

// Default animation settings
export const ANIMATION_DEFAULTS = {
  duration: 1,
  ease: 'power3.out',
} as const

// Easing presets
export const EASINGS = {
  smooth: 'power2.inOut',
  snapIn: 'power3.out',
  snapOut: 'power3.in',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  expo: 'expo.out',
} as const

// Common animation configurations
export const fadeInUp = {
  y: 50,
  opacity: 0,
  duration: 0.8,
  ease: EASINGS.snapIn,
}

export const fadeInLeft = {
  x: -50,
  opacity: 0,
  duration: 0.8,
  ease: EASINGS.snapIn,
}

export const fadeInRight = {
  x: 50,
  opacity: 0,
  duration: 0.8,
  ease: EASINGS.snapIn,
}

export const scaleIn = {
  scale: 0.8,
  opacity: 0,
  duration: 0.6,
  ease: EASINGS.bounce,
}

// ScrollTrigger defaults
export const defaultScrollTrigger = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none reverse',
}

// Create staggered animation
export function createStaggeredAnimation(
  elements: string | Element[],
  fromVars: gsap.TweenVars,
  stagger: number = 0.1
) {
  return gsap.from(elements, {
    ...fromVars,
    stagger,
    scrollTrigger: {
      trigger: elements,
      ...defaultScrollTrigger,
    },
  })
}

// Create scroll-triggered timeline
export function createScrollTimeline(
  trigger: string | Element,
  config?: ScrollTrigger.Vars
) {
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      ...defaultScrollTrigger,
      ...config,
    },
  })
}

// Utility to refresh ScrollTrigger after dynamic content
export function refreshScrollTrigger() {
  ScrollTrigger.refresh()
}

// Cleanup function for components
export function killScrollTriggers(scope?: string | Element) {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (!scope || trigger.vars.trigger === scope) {
      trigger.kill()
    }
  })
}

export { gsap, ScrollTrigger, useGSAP }
