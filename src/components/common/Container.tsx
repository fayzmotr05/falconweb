import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'article' | 'main'
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export default function Container({
  children,
  className,
  as: Component = 'div',
  size = 'lg',
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  }

  return (
    <Component
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8',
        sizes[size],
        className
      )}
    >
      {children}
    </Component>
  )
}
