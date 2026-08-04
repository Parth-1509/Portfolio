import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import projects from '../data/projects'
import ProjectModal from '../components/ProjectModal'
import { FiArrowUpRight, FiExternalLink, FiLock } from 'react-icons/fi'
import ProjectImage from '../components/ProjectImage'

gsap.registerPlugin(ScrollTrigger)

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

export default function Projects() {
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const cardsRef = useRef([])
  const [active, setActive] = useState(0)
  const [modalProject, setModalProject] = useState(null)
  const total = projects.length

  useEffect(() => {
    const radius = () => Math.min(window.innerWidth * 0.34, 420)
    const angleStep = 360 / total

    const applyCarousel = (raw) => {
      const r = radius()
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        let diff = i - raw
        diff = ((diff + total / 2) % total + total) % total - total / 2
        const angle = diff * angleStep

        const rad = (angle * Math.PI) / 180
        const z = Math.cos(rad) * r - r
        const x = Math.sin(rad) * r
        const isFront = Math.abs(diff) < 0.5

        gsap.set(card, {
          x,
          z,
          rotateY: -angle,
          opacity: gsap.utils.mapRange(0, 180, 1, 0, Math.abs(angle)),
          scale: isFront ? 1 : 0.82,
          filter: isFront ? 'blur(0px)' : 'blur(3px)',
          zIndex: Math.round(100 - Math.abs(angle)),
        })
      })
    }

    applyCarousel(0)

    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top top',
      end: () => `+=${window.innerHeight * (total - 1) * 1.2}`,
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const raw = self.progress * (total - 1)
        applyCarousel(raw)
        setActive(Math.round(raw))
      },
    })

    const onResize = () => applyCarousel(active)
    window.addEventListener('resize', onResize)

    return () => {
      st.kill()
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  const project = projects[active]

  const goTo = (i) => {
    const total_ = total
    const start = wrapRef.current.offsetTop
    const distance = window.innerHeight * (total_ - 1) * 1.2
    const targetY = start + (distance * i) / (total_ - 1)
    window.__lenis ? window.__lenis.scrollTo(targetY) : window.scrollTo(0, targetY)
  }

  return (
    <section id="projects" ref={wrapRef} className="relative h-screen w-full overflow-hidden bg-ink">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(201,168,118,0.06), transparent 70%)' }}
      />
      <div className="absolute top-20 sm:top-24 md:top-28 left-6 md:left-16 z-20">
        <p className="eyebrow mb-2">Selected Work</p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-bone">Projects</h2>
      </div>

      {/* nav dots - back to original, this is NOT the carousel */}
      <div className="absolute top-20 sm:top-24 md:top-28 right-6 md:right-16 z-20 flex flex-col items-end gap-2 sm:gap-3">
        {projects.map((p, i) => (
          <button
            key={p.id}
            data-cursor="grow"
            onClick={() => goTo(i)}
            className="flex items-center gap-3 group"
          >
            <span className={`font-mono text-xs transition-colors ${i === active ? 'text-bronze' : 'text-bone-dim'}`}>
              {p.index}
            </span>
            <span className={`h-px transition-all duration-500 ${i === active ? 'w-8 bg-bronze' : 'w-4 bg-line'}`} />
          </button>
        ))}
      </div>

      {/* this is the real 3D carousel — image goes here */}
      <div
        ref={trackRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1600px', paddingTop: '14vh', paddingBottom: '20vh' }}
      >
        <div className="relative w-[85vw] sm:w-[80vw] max-w-2xl h-[32vh] sm:h-[40vh] md:h-[46vh] md:max-w-3xl" style={{ transformStyle: 'preserve-3d' }}>
          {projects.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => (cardsRef.current[i] = el)}
              className="absolute inset-0 rounded-2xl sm:rounded-3xl overflow-hidden glass will-change-transform"
              style={{ background: COVERS[i % COVERS.length] }}
            >
              <ProjectImage images={p.images} alt={p.title} fill />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
{/* 
              <div className="absolute top-6 left-6 z-10">
                <span className="font-mono text-xs text-bronze">{p.index}</span>
              </div> */}
            </div>
          ))}
        </div>
      </div>

      {/* smooth crossfade: title + tags animate together as one unit, exit before enter */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-6 sm:px-10 md:px-16 pb-8 sm:pb-10 md:pb-14 pointer-events-none">
        <div className="max-w-xl mx-auto text-center pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-bone mb-4 sm:mb-5">{project.title}</h3>

              <div className="flex flex-wrap justify-center gap-2 mb-5 sm:mb-7">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-line text-bone-dim"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <button
              data-cursor="grow"
              onClick={() => setModalProject(project)}
              className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-bone hover:text-bronze hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 font-mono text-xs uppercase tracking-widest"
              style={glassBtn}
            >
              View Case <FiArrowUpRight />
            </button>

            {project.locked ? (
              <span
                className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-bone-dim font-mono text-xs uppercase tracking-widest cursor-not-allowed opacity-70"
                style={glassBtn}
                title="Not available"
              >
                <FiLock /> Locked
              </span>
            ) : (
              <a href={project.live}
                target="_blank"
                rel="noreferrer"
                data-cursor="grow"
                className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full text-ink hover:-translate-y-0.5 hover:scale-105 active:scale-95 transition-all duration-300 font-mono text-xs uppercase tracking-widest"
                style={glassBtnBronze}
              >
                <FiExternalLink /> Live Demo
              </a>
            )}
          </div>
        </div>
      </div>

      <ProjectModal project={modalProject} onClose={() => setModalProject(null)} />
    </section>
  )
}