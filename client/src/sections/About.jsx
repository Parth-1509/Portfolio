import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiNodedotjs,
  SiReact,
  SiMongodb,
  SiExpress,
  SiMysql,
  SiGithub,
} from 'react-icons/si'
import { skills, stats, bio } from '../data/about'
import AnimatedCounter from '../components/AnimatedCounter'
import AvatarFace from '../components/AvatarFace'
import ResumeButton from '../components/ResumeButton'

gsap.registerPlugin(ScrollTrigger)

const ICONS = {
  html5: SiHtml5,
  css3: SiCss,
  javascript: SiJavascript,
  nodedotjs: SiNodedotjs,
  react: SiReact,
  mongodb: SiMongodb,
  express: SiExpress,
  mysql: SiMysql,
  github: SiGithub,
}

export default function About() {
  const sectionRef = useRef(null)
  const orbitRef = useRef(null)
  const badgeRefs = useRef([])
  const [radius, setRadius] = useState(190)
  const [brokenLogos, setBrokenLogos] = useState({})

  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth
      if (w < 480) setRadius(110)
      else if (w < 640) setRadius(135)
      else if (w < 768) setRadius(165)
      else if (w < 1024) setRadius(175)
      else setRadius(190)
    }
    updateRadius()
    window.addEventListener('resize', updateRadius)
    return () => window.removeEventListener('resize', updateRadius)
  }, [])

  useEffect(() => {
    gsap.to(orbitRef.current, {
      rotate: 360,
      duration: 40,
      repeat: -1,
      ease: 'none',
    })

    gsap.to(badgeRefs.current, {
      rotate: -360,
      duration: 40,
      repeat: -1,
      ease: 'none',
    })

    gsap.fromTo(
      sectionRef.current.querySelectorAll('.fade-up'),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      }
    )
  }, [])

  const INVERT_LOGOS = ['Express', 'GitHub']

  return (
    <section id="about" ref={sectionRef} className="relative min-h-screen  w-full px-6 md:px-16 py-28 md:py-36 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 30%, rgba(201,168,118,0.2) 100%)' }}
      />
      <div className="mb-5">
        <p className="eyebrow mb-4">Skills</p>
        <h2 className="font-display text-5xl md:text-7xl text-bone">About</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="flex flex-col items-center gap-10 fade-up">
          <div className="relative flex items-center justify-center h-[300px] sm:h-[380px] md:h-[440px] lg:h-[500px] w-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full glass overflow-hidden flex items-center justify-center">
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(160deg, #1a1a1c, #0a0a0b 60%)',
                }}
              />
              <AvatarFace />
            </div>

            <div ref={orbitRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] lg:w-[480px] lg:h-[480px]">
              {skills
                .filter((s) => !brokenLogos[s.name])
                .map((s, i) => {
                const angle = (i / skills.length) * Math.PI * 2
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius
                const needsInvert = INVERT_LOGOS.includes(s.name)
                return (
                  <span
                    key={s.name}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <span
                      ref={(el) => (badgeRefs.current[i] = el)}
                      title={s.name}
                      className="flex items-center justify-center shrink-0 w-11 h-11 sm:w-12 sm:h-12 md:w-[52px] md:h-[52px] lg:w-14 lg:h-14 rounded-full"
                      style={{
                        background: 'rgba(201,168,118,0.12)',
                        border: '1px solid rgba(201,168,118,0.35)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 20px rgba(201,168,118,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
                      }}
                    >
                      <img
                        src={s.logo}
                        alt={s.name}
                        width={26}
                        height={26}
                        className="w-[26px] h-[26px] sm:w-[28px] sm:h-[28px] md:w-[29px] md:h-[29px] lg:w-[30px] lg:h-[30px]"
                        onError={() =>
                          setBrokenLogos((prev) => ({ ...prev, [s.name]: true }))
                        }
                        style={{
                          objectFit: 'contain',
                          filter: needsInvert
                            ? 'invert(1) brightness(1.4) drop-shadow(0 0 6px rgba(255,255,255,0.15))'
                            : 'saturate(1.4) brightness(1.15) drop-shadow(0 0 6px rgba(255,255,255,0.15))',
                        }}
                      />
                    </span>
                  </span>
                )
              })}
            </div>
          </div>

        </div>

        <div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-bone mb-8 fade-up">
            Craft, on both sides of the stack.
          </h2>
          {bio.map((p, i) => (
            <p key={i} className="text-bone-dim text-base leading-relaxed mb-5 max-w-lg fade-up">
              {p}
            </p>
          ))}

          <div className="grid grid-cols-2 gap-6 md:gap-8 mt-10">
            {stats.map((stat) => (
              <div key={stat.label} className="fade-up">
                <AnimatedCounter
                  value={stat.value}
                  decimals={stat.decimals ?? 0}
                  className="font-display text-3xl md:text-4xl text-bronze"
                />
                <p className="text-bone-dim text-xs font-mono uppercase tracking-widest mt-2">{stat.label}</p>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  )
}