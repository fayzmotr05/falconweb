import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Container, Button } from '@/components/common'
import { languages, type LanguageCode } from '@/i18n/config'
import { COMPANY_INFO } from '@/constants/content'

export default function Header() {
  const { t, i18n } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const changeLanguage = (lng: LanguageCode) => {
    i18n.changeLanguage(lng)
    setIsLangMenuOpen(false)
  }

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0]

  const navLinks = [
    { href: '#services', label: t('nav.services') },
    { href: '#about', label: t('nav.about') },
    { href: '#contact', label: t('nav.contact') },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
        isScrolled
          ? 'bg-navy-950/90 backdrop-blur-lg border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-cyan-dark flex items-center justify-center font-bold text-navy-950 text-xl transition-transform group-hover:scale-105">
              F
            </div>
            <span className="text-xl font-bold text-text-primary hidden sm:block">
              {COMPANY_INFO.name}
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-neon-cyan transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800/50 border border-navy-700 hover:border-neon-cyan/50 transition-colors text-sm"
              >
                <span className="font-medium">{currentLang.flag}</span>
                <svg
                  className={cn(
                    'w-4 h-4 transition-transform',
                    isLangMenuOpen && 'rotate-180'
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full right-0 mt-2 bg-navy-800 border border-navy-700 rounded-lg overflow-hidden shadow-xl min-w-[140px]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={cn(
                          'w-full px-4 py-2.5 text-left text-sm hover:bg-navy-700 transition-colors flex items-center gap-2',
                          i18n.language === lang.code
                            ? 'text-neon-cyan bg-navy-700/50'
                            : 'text-text-secondary'
                        )}
                      >
                        <span className="font-medium">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Button - Desktop */}
            <Button
              variant="primary"
              size="sm"
              className="hidden md:flex"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('nav.getConsultation')}
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-neon-cyan"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-navy-800"
            >
              <div className="flex flex-col gap-4 pt-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-text-secondary hover:text-neon-cyan transition-colors py-2"
                  >
                    {link.label}
                  </a>
                ))}
                <Button
                  variant="primary"
                  className="w-full mt-2"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {t('nav.getConsultation')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  )
}
