import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useInView } from 'framer-motion'
import { Container, SectionWrapper, SplitText } from '@/components/common'

// TODO: Replace with actual team member photos
// Photos should be 400x400px square, placed in /public/team/ folder
const TEAM_MEMBERS = [
  {
    name: 'Team Member 1',
    role: 'Position',
    image: '/team/member1.jpg', // Add actual photo here
  },
  {
    name: 'Team Member 2',
    role: 'Position',
    image: '/team/member2.jpg', // Add actual photo here
  },
  {
    name: 'Team Member 3',
    role: 'Position',
    image: '/team/member3.jpg', // Add actual photo here
  },
  // Add more team members as needed
]

interface TeamMemberCardProps {
  member: typeof TEAM_MEMBERS[0]
  index: number
}

function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })

  // Extract initials for fallback
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      {/* Card container */}
      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-800/50 to-navy-900/50 backdrop-blur-sm border border-navy-700 p-8"
        whileHover={{ y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient accent on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={false}
        />

        {/* Photo with gradient border */}
        <div className="relative mx-auto w-40 h-40 mb-6">
          {/* Animated gradient border */}
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green p-1"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="w-full h-full rounded-full bg-navy-900" />
          </motion.div>

          {/* Photo placeholder */}
          <motion.div
            className="absolute inset-1 rounded-full bg-gradient-to-br from-navy-700 to-navy-800 flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {/* Image with fallback to initials */}
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide broken image and show initials
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
            {/* Initials fallback (always rendered, hidden when image loads) */}
            <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">
              {initials}
            </span>
          </motion.div>
        </div>

        {/* Name and role */}
        <div className="text-center relative z-10">
          <motion.h3
            className="text-xl font-bold text-text-primary mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {member.name}
          </motion.h3>
          <motion.p
            className="text-text-secondary"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {member.role}
          </motion.p>
        </div>

        {/* Decorative accent line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={false}
        />
      </motion.div>
    </motion.div>
  )
}

export default function TeamSection() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <SectionWrapper id="team" className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial from-neon-purple/5 via-transparent to-transparent opacity-30" />
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <Container>
        <div ref={sectionRef} className="relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <SplitText
              type="chars"
              animation="fadeUp"
              stagger={0.03}
              delay={0}
              trigger="inView"
              as="h2"
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
            >
              {t('team.title')}
            </SplitText>
            <SplitText
              type="words"
              animation="fadeIn"
              stagger={0.05}
              delay={0.2}
              trigger="inView"
              className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto"
            >
              {t('team.subtitle')}
            </SplitText>
          </div>

          {/* Team grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <TeamMemberCard key={index} member={member} index={index} />
            ))}
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}
