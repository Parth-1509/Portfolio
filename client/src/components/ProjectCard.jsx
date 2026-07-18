import { useRef } from 'react'
import gsap from 'gsap'
import { FiArrowUpRight } from 'react-icons/fi'
import ProjectImage from './ProjectImage'


export default function ProjectCard({ project, onOpen }) {
  const cardRef = useRef(null)

  const handleMove = (e) => {
    const el = cardRef.current
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.5,
      ease: 'power3.out',
      transformPerspective: 800,
    })
  }

  const handleLeave = () => {
    gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => onOpen(project)}
      data-cursor="grow"
      className="glass group relative rounded-2xl p-8 flex flex-col justify-between h-[420px] cursor-pointer overflow-hidden will-change-transform"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201,168,118,0.14), transparent 70%)' }}
      />
      <div className="relative flex items-start justify-between">
        <span className="font-mono text-xs text-bronze">{project.index}</span>
        <FiArrowUpRight className="text-bone-dim group-hover:text-bronze group-hover:rotate-45 transition-all duration-300" size={20} />
      </div>

      <div className="relative">
        <h3 className="font-display text-3xl mb-3 text-bone">{project.title}</h3>
        <p className="text-bone-dim text-sm leading-relaxed mb-6">{project.tagline}</p>
        <div className="flex flex-wrap gap-2">
          {project.tech.slice(0, 3).map((t) => (
            <span key={t} className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-line text-bone-dim">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
