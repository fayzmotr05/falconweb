export default function AnimatedGrid() {
  // Generate grid dots - reduced from 20x20 (400) to 10x10 (100)
  const gridSize = 10
  const dots = []
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      dots.push({ x: (i / gridSize) * 100, y: (j / gridSize) * 100, id: `${i}-${j}` })
    }
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black 0%, transparent 70%)',
      }}
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 via-navy-950 to-navy-950" />

      {/* Grid dots - CSS animation instead of 400 GSAP tweens */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-neon-cyan)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-neon-cyan)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {dots.map((dot) => (
          <circle
            key={dot.id}
            className="grid-dot"
            cx={`${dot.x}%`}
            cy={`${dot.y}%`}
            r="1.5"
            fill="var(--color-neon-cyan)"
            opacity="0.15"
          />
        ))}
      </svg>

      {/* Simplified gradient orbs - static, no animate-float */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[40px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-[40px]" />
    </div>
  )
}
