import { useScrollProgress } from '@/hooks/useScrollProgress'

export default function ScrollProgress() {
  const progress = useScrollProgress()

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-navy-900/50">
      <div
        className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green transition-all duration-75"
        style={{
          width: `${progress * 100}%`,
          boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
        }}
      />
    </div>
  )
}
