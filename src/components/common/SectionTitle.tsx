import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface SectionTitleProps {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export default function SectionTitle({
  title,
  subtitle,
  align = 'center',
  className,
  titleClassName,
  subtitleClassName,
}: SectionTitleProps) {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className={cn('mb-12 md:mb-16', alignments[align], className)}>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4',
          titleClassName
        )}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'text-lg md:text-xl text-text-secondary max-w-3xl',
            align === 'center' && 'mx-auto',
            subtitleClassName
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
