import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import useActiveSection from '../hooks/useActiveSection'

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

const glassPill = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 45%, rgba(201,168,118,0.06) 100%)',
  backdropFilter: 'blur(18px) saturate(180%)',
  WebkitBackdropFilter: 'blur(18px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow:
    'inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -6px 12px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.35)',
}

export default function Navbar() {
  const active = useActiveSection(LINKS.map((l) => l.id))
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id) => {
    setOpen(false)
    const el = document.getElementById(id)
    if (window.__lenis && el) {
      window.__lenis.scrollTo(el, { duration: 1.4 })
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Desktop / tablet pill nav — hidden below sm */}
      <nav
        className={`hidden sm:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 items-center gap-1 rounded-full px-2 py-2 transition-all duration-500 ${
          scrolled ? 'shadow-[0_8px_40px_rgba(0,0,0,0.5)]' : ''
        }`}
        style={glassPill}
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)' }}
        />

        {LINKS.map((link) => (
          <button
            key={link.id}
            data-cursor="grow"
            onClick={() => go(link.id)}
            className={`relative z-10 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
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
              />
            )}
            {link.label}
          </button>
        ))}
      </nav>

      {/* Mobile: compact menu button, top-right */}
      <button
        data-cursor="grow"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className={`sm:hidden fixed top-4 right-4 z-50 flex items-center justify-center w-11 h-11 rounded-full text-bone transition-all duration-300 ${
          scrolled ? 'shadow-[0_8px_40px_rgba(0,0,0,0.5)]' : ''
        }`}
        style={glassPill}
      >
        {open ? <FiX size={18} /> : <FiMenu size={18} />}
      </button>

      {/* Mobile: dropdown menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="sm:hidden fixed inset-0 z-40 bg-ink/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="sm:hidden fixed top-[4.5rem] right-4 left-4 z-50 rounded-3xl p-2 flex flex-col gap-1"
              style={glassPill}
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => go(link.id)}
                  className={`relative w-full text-left px-5 py-3 rounded-2xl text-sm font-mono uppercase tracking-widest transition-all duration-300 ${
                    active === link.id ? 'text-bone' : 'text-bone-dim hover:text-bone'
                  }`}
                  style={
                    active === link.id
                      ? {
                          background:
                            'linear-gradient(135deg, rgba(201,168,118,0.55) 0%, rgba(201,168,118,0.25) 50%, rgba(201,168,118,0.4) 100%)',
                          border: '1px solid rgba(255,255,255,0.3)',
                        }
                      : undefined
                  }
                >
                  {link.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}