import { useLocation, useNavigate } from 'react-router-dom'

interface NavLinkProps {
  hash: string
  className?: string
  onClick?: () => void
  children: React.ReactNode
}

export default function NavLink({ hash, className, onClick, children }: NavLinkProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onClick?.()

    if (location.pathname === '/') {
      const el = document.getElementById(hash)
      el?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(hash)
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  return (
    <a href={`/#${hash}`} className={className} onClick={handleClick}>
      {children}
    </a>
  )
}
