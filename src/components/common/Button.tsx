import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, isLoading, disabled, ...props }, ref) => {
    const baseStyles = `
      relative inline-flex items-center justify-center gap-2
      font-semibold rounded-lg transition-all duration-300
      focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950
      disabled:opacity-50 disabled:cursor-not-allowed
      overflow-hidden
    `

    const variants = {
      primary: `
        bg-neon-cyan text-navy-950
        hover:bg-neon-cyan-light hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]
        active:scale-[0.98]
      `,
      secondary: `
        bg-navy-700 text-text-primary border border-navy-600
        hover:bg-navy-600 hover:border-neon-cyan/50
        active:scale-[0.98]
      `,
      outline: `
        bg-transparent text-neon-cyan border-2 border-neon-cyan
        hover:bg-neon-cyan/10 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]
        active:scale-[0.98]
      `,
      ghost: `
        bg-transparent text-text-secondary
        hover:text-neon-cyan hover:bg-navy-800/50
      `,
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
        {/* Shimmer effect on hover */}
        <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
