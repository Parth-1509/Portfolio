import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import experience from '../data/experience'
import ExperiencePhotos from '../components/ExperiencePhotos'

// swap these for your real filenames in src/assets
import photo1 from '../assets/1.jpg'
import photo2 from '../assets/2.jpg'
import photo3 from '../assets/3.jpg'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const sectionRef = useRef(null)
  const lineRef = useRef(null)
  const itemsRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 0.6,
        },
      }
    )

    const items = itemsRef.current.querySelectorAll('.timeline-item')
    items.forEach((item) => {
      gsap.fromTo(
        item,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 80%' },
        }
      )
    })
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="  relative min-h-screen w-full px-6 md:px-16 py-20 md:py-36 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 30%, rgba(201,168,118,0.2) 100%)' }}
      />
      <div className="mb-10 md:mb-16">
        <p className="eyebrow mb-4">Career</p>
        <h2 className="font-display text-4xl sm:text-5xl md:text-7xl text-bone">Experience</h2>
      </div>
      <div className='flex flex-col lg:flex-row gap-12 lg:gap-0'>

        <div className="flex justify-between w-full ">
          <div className="relative max-w-3xl w-full" ref={itemsRef}>
            <div className="absolute left-[18px] md:left-[22px] top-2 bottom-2 w-px bg-line">
              <div ref={lineRef} className="w-full h-full bg-bronze origin-top" />
            </div>

            <div className="flex flex-col gap-12 md:gap-16 w-full">
              {experience.map((exp) => (
                <div key={exp.id} className="timeline-item relative pl-12 md:pl-16 ">
                  <div
                    className="absolute left-0 top-1 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-mono text-[10px] text-bronze overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 45%, rgba(201,168,118,0.08) 100%)',
                      backdropFilter: 'blur(14px) saturate(160%)',
                      WebkitBackdropFilter: 'blur(14px) saturate(160%)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      boxShadow:
                        'inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -6px 10px rgba(0,0,0,0.25), 0 6px 16px rgba(0,0,0,0.35), 0 0 0 1px rgba(201,168,118,0.06)',
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(115deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 30%)',
                        mixBlendMode: 'overlay',
                      }}
                    />
                    <span className="relative z-10">{exp.logo}</span>
                  </div>
                  <p className="font-mono text-xs text-bronze mb-2 tracking-widest uppercase">{exp.range}</p>
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl text-bone mb-1">{exp.role}</h3>
                  <p className="text-bone-dim text-sm mb-3">{exp.company}</p>
                  <p className="text-bone-dim text-sm leading-relaxed max-w-xl">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
        <div className="flex lg:sticky h-fit justify-center lg:justify-end w-full lg:top-24">
          <ExperiencePhotos photos={[photo1, photo2, photo3]} interval={4000} />
        </div>
      </div>
    </section>
  )
}