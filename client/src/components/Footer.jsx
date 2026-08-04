import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { socials } from '../data/about'

const iconFor = (label) => {
  switch (label) {
    case 'GitHub': return <FaGithub />
    case 'LinkedIn': return <FaLinkedin />
    case 'Email': return <FaEnvelope />
    default: return null
  }
}

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-line px-6 md:px-16 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
      <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-bone-dim">
        © {new Date().getFullYear()} Parth Patel — Full Stack Web Developer
      </p>

      <div className="flex items-center gap-4 sm:gap-5">
        {socials
          .filter((s) => ['GitHub', 'LinkedIn', 'Email'].includes(s.label))
          .map((s) => (
            
            <a href={s.href}
            key={s.label}
              target={s.label === 'Email' ? undefined : '_blank'}
              rel={s.label === 'Email' ? undefined : 'noreferrer'}
              data-cursor="grow"
              aria-label={s.label}
              className="flex items-center justify-center w-9 h-9 rounded-full border border-line text-bone-dim hover:text-bronze hover:border-bronze transition-colors duration-300 text-base"
            >
              {iconFor(s.label)}
            </a>
          ))}
      </div>
    </footer>
  )
}