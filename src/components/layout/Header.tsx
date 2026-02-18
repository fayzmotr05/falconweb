import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Container, Button, FalconLogo } from '@/components/common'
import { languages, type LanguageCode } from '@/i18n/config'
import { COMPANY_INFO } from '@/constants/content'

function useHashNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (hash: string, callback?: () => void) => {
    callback?.()
    if (location.pathname === '/') {
      const el = document.getElementById(hash)
      el?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }
}

export default function Header() {
  const { t, i18n } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const hashNav = useHashNav()

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
    { hash: 'services', label: t('nav.services') },
    { hash: 'about', label: t('nav.about') },
    { hash: 'contact', label: t('nav.contact') },
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
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <FalconLogo size={40} animated={false} />
            </motion.div>
            <span className="text-xl font-bold text-text-primary hidden sm:block">
              {COMPANY_INFO.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.hash}
                href={`/#${link.hash}`}
                onClick={(e) => {
                  e.preventDefault()
                  hashNav(link.hash)
                }}
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
              onClick={() => hashNav('contact')}
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
                    key={link.hash}
                    href={`/#${link.hash}`}
                    onClick={(e) => {
                      e.preventDefault()
                      hashNav(link.hash, () => setIsMobileMenuOpen(false))
                    }}
                    className="text-text-secondary hover:text-neon-cyan transition-colors py-2"
                  >
                    {link.label}
                  </a>
                ))}
                <Button
                  variant="primary"
                  className="w-full mt-2"
                  onClick={() => {
                    hashNav('contact', () => setIsMobileMenuOpen(false))
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
