import { useEffect, useState } from 'react'
import useActiveSection from '../hooks/useActiveSection'

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const active = useActiveSection(LINKS.map((l) => l.id))
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id) => {
    const el = document.getElementById(id)
    if (window.__lenis && el) {
      window.__lenis.scrollTo(el, { duration: 1.4 })
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-full px-2 py-2 transition-all duration-500 ${
        scrolled ? 'shadow-[0_8px_40px_rgba(0,0,0,0.5)]' : ''
      }`}
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 45%, rgba(201,168,118,0.06) 100%)',
        backdropFilter: 'blur(18px) saturate(180%)',
        WebkitBackdropFilter: 'blur(18px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow:
          'inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -6px 12px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.35)',
      }}
    >
      {/* sheen */}
      {/* <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 40%)',
          mixBlendMode: 'overlay',
        }}
      /> */}
      {/* thin rim */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)' }}
      />

      {LINKS.map((link) => (
        <button
          key={link.id}
          data-cursor="grow"
          onClick={() => go(link.id)}
          className={`relative z-10 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 ${
            active === link.id ? 'text-bone' : 'text-bone-dim hover:text-bone'
          }`}
        >
          {active === link.id && (
            <span
              className="absolute inset-0 rounded-full -z-10 overflow-hidden"
              style={{
                background:
                  'linear-gradient(135deg, rgba(201,168,118,0.55) 0%, rgba(201,168,118,0.25) 50%, rgba(201,168,118,0.4) 100%)',
                backdropFilter: 'blur(10px) saturate(180%)',
                WebkitBackdropFilter: 'blur(10px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow:
                  'inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -4px 8px rgba(0,0,0,0.2), 0 4px 14px rgba(201,168,118,0.4)',
              }}
            >
              {/* sheen on the pill */}
              {/*  */}
            </span>
          )}
          {link.label}
        </button>
      ))}
    </nav>
  )
}