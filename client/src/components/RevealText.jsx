import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Splits text into characters or words and reveals them with a stagger,
 * either on mount (immediate) or on scroll into view.
 */
export default function RevealText({
  text,
  as: Tag = 'span',
  className = '',
  mode = 'chars',
  trigger = 'scroll',
  delay = 0,
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const units = el.querySelectorAll('.reveal-unit')

    const anim = gsap.fromTo(
      units,
      { yPercent: 120, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power4.out',
        stagger: mode === 'chars' ? 0.02 : 0.08,
        delay,
        scrollTrigger:
          trigger === 'scroll'
            ? { trigger: el, start: 'top 85%' }
            : undefined,
      }
    )

    return () => anim.scrollTrigger && anim.scrollTrigger.kill()
  }, [mode, trigger, delay])

  const units = mode === 'chars' ? text.split('') : text.split(' ')

  return (
    <Tag ref={containerRef} className={className}>
      {units.map((unit, i) => (
        <span className="reveal-mask" key={i}>
          <span className=" w-full  reveal-unit inline-block will-change-transform">
            {unit === ' ' ? '\u00A0' : unit}
            {mode === 'words' && i < units.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}
