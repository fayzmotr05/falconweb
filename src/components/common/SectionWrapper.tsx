import { forwardRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  children: ReactNode
  className?: string
  id?: string
  background?: 'default' | 'darker' | 'gradient'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
}

const SectionWrapper = forwardRef<HTMLElement, SectionWrapperProps>(
  ({ children, className, id, background = 'default', spacing = 'lg' }, ref) => {
    const backgrounds = {
      default: 'bg-navy-950',
      darker: 'bg-navy-900',
      gradient: 'bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950',
    }

    const spacings = {
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-24',
      lg: 'py-20 md:py-32',
      xl: 'py-24 md:py-40',
    }

    return (
      <section
        ref={ref}
        id={id}
        className={cn(
          'relative overflow-hidden',
          backgrounds[background],
          spacings[spacing],
          className
        )}
      >
        {children}
      </section>
    )
  }
)

SectionWrapper.displayName = 'SectionWrapper'

export default SectionWrapper
