import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiGithub, FiExternalLink, FiLock } from 'react-icons/fi'

export default function ProjectModal({ project, onClose }) {
  const COVERS = [
  'radial-gradient(circle at 30% 20%, #3a2f1f, #0a0a0b 65%)',
  'radial-gradient(circle at 70% 30%, #1f2a3a, #0a0a0b 65%)',
  'radial-gradient(circle at 50% 70%, #2a1f3a, #0a0a0b 65%)',
]

const glassBtn = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 45%, rgba(201,168,118,0.08) 100%)',
  backdropFilter: 'blur(14px) saturate(160%)',
  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.2)',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -4px 8px rgba(0,0,0,0.25), 0 4px 14px rgba(0,0,0,0.35)',
  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
}

const glassBtnBronze = {
  background: 'linear-gradient(135deg, rgba(201,168,118,0.85) 0%, rgba(201,168,118,0.55) 50%, rgba(201,168,118,0.7) 100%)',
  backdropFilter: 'blur(14px) saturate(160%)',
  WebkitBackdropFilter: 'blur(14px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.3)',
  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -4px 8px rgba(0,0,0,0.15), 0 4px 16px rgba(201,168,118,0.4)',
}

  return (
    
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-16"
          onClick={onClose}
        >
          <motion.div
            initial={{ clipPath: 'inset(15% 15% 15% 15% round 24px)', opacity: 0 }}
            animate={{ clipPath: 'inset(0% 0% 0% 0% round 24px)', opacity: 1 }}
            exit={{ clipPath: 'inset(15% 15% 15% 15% round 24px)', opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl p-8 md:p-14"
          >
            <button
              onClick={onClose}
              data-cursor="grow"
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-line flex items-center justify-center text-bone hover:text-bronze hover:border-bronze transition-colors"
            >
              <FiX />
            </button>

            <span className="font-mono text-xs text-bronze">{project.index}</span>
            <h2 className="font-display text-4xl md:text-6xl mt-4 mb-6 text-bone">{project.title}</h2>
            <p className="text-bone-dim text-base md:text-lg leading-relaxed max-w-2xl mb-8">
              {project.tagline}
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {project.tech.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06 }}
                  className="font-mono text-[11px] uppercase tracking-wider px-4 py-2 rounded-full border border-line text-bone-dim"
                >
                  {t}
                </motion.span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">

              <a href={project.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="grow"
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-line text-bone hover:border-bronze hover:text-bronze transition-colors font-mono text-xs uppercase tracking-widest"
              >
                <FiGithub /> Code
              </a>

              {project.locked ? (
                <span
                  className="flex items-center gap-2 px-6 py-3 rounded-full border border-line text-bone-dim font-mono text-xs uppercase tracking-widest cursor-not-allowed opacity-70"
                  title="Not available"
                >
                  <FiLock /> Locked
                </span>
              ) : (

                <a href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="grow"
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-ink hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 font-mono text-xs uppercase tracking-widest"
                  style={glassBtnBronze}
                >
                  <FiExternalLink /> Live Demo
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}