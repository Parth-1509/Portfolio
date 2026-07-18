import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const EXPRESSIONS = ['neutral', 'smile', 'grin', 'surprised', 'wink']

/**
 * Avatar that lives inside the portrait ring. It:
 *  - fills its parent (drop it into any sized/rounded container)
 *  - follows the cursor with its eyes, and glances around on its own
 *  - "notices" the cursor when it comes near the ring (surprised look)
 *  - reacts to scrolling (quick smile + bob)
 *  - blinks and cycles expressions
 *  - grins happily when the résumé button is clicked
 */
export default function AvatarFace() {
  const faceRef = useRef(null)
  const leftPupilRef = useRef(null)
  const rightPupilRef = useRef(null)
  const leftLidRef = useRef(null)
  const rightLidRef = useRef(null)
  const [expression, setExpression] = useState('neutral')

  const pointer = useRef({ x: -9999, y: -9999 })
  const noticing = useRef(false)

  // eyes track the cursor; glance around on their own when it's away
  useEffect(() => {
    const face = faceRef.current
    const maxOffset = 4.5
    let idleTl

    const lookAt = (clientX, clientY) => {
      const rect = face.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = clientX - cx
      const dy = clientY - cy
      const dist = Math.hypot(dx, dy) || 1
      const nx = (dx / dist) * Math.min(maxOffset, dist / 20)
      const ny = (dy / dist) * Math.min(maxOffset, dist / 20)

      gsap.to([leftPupilRef.current, rightPupilRef.current], {
        x: nx,
        y: ny,
        duration: 0.5,
        ease: 'power3.out',
      })
    }

    const onMove = (e) => {
      pointer.current = { x: e.clientX, y: e.clientY }
      idleTl && idleTl.pause()
      lookAt(e.clientX, e.clientY)
    }
    window.addEventListener('mousemove', onMove)

    // random glances around the room while nobody's moving the cursor
    idleTl = gsap.timeline({ repeat: -1 })
    for (let i = 0; i < 6; i++) {
      idleTl.to([leftPupilRef.current, rightPupilRef.current], {
        x: gsap.utils.random(-4.5, 4.5),
        y: gsap.utils.random(-3.5, 3.5),
        duration: gsap.utils.random(1.4, 2.4),
        ease: 'sine.inOut',
        delay: gsap.utils.random(0.4, 1.2),
      })
    }

    return () => {
      window.removeEventListener('mousemove', onMove)
      idleTl && idleTl.kill()
    }
  }, [])

  // notice the cursor when it comes near the ring
  useEffect(() => {
    const face = faceRef.current
    let raf
    const tick = () => {
      const rect = face.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const d = Math.hypot(pointer.current.x - cx, pointer.current.y - cy)
      const noticeRadius = rect.width * 1.4

      if (d < noticeRadius && !noticing.current) {
        noticing.current = true
        setExpression('surprised')
      } else if (d >= noticeRadius && noticing.current) {
        noticing.current = false
        setExpression('neutral')
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // react to scrolling
  useEffect(() => {
    let lastY = window.scrollY
    let idle
    const onScroll = () => {
      const dir = window.scrollY > lastY ? 1 : -1
      lastY = window.scrollY
      if (!noticing.current) setExpression('smile')
      gsap.fromTo(
        faceRef.current,
        { y: 0 },
        { y: dir * 5, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut' }
      )
      clearTimeout(idle)
      idle = setTimeout(() => {
        if (!noticing.current) setExpression('neutral')
      }, 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(idle)
    }
  }, [])

  // periodic blink
  useEffect(() => {
    let cancelled = false
    const blink = () => {
      if (cancelled) return
      gsap.to([leftLidRef.current, rightLidRef.current], {
        scaleY: 0.05,
        duration: 0.08,
        ease: 'power1.in',
        transformOrigin: 'center',
        yoyo: true,
        repeat: 1,
      })
      gsap.delayedCall(gsap.utils.random(2.5, 5.5), blink)
    }
    const first = gsap.delayedCall(gsap.utils.random(1, 3), blink)
    return () => {
      cancelled = true
      first.kill()
    }
  }, [])

  // random expression changes (paused while noticing the cursor)
  useEffect(() => {
    let cancelled = false
    const cycle = () => {
      if (cancelled) return
      if (!noticing.current) {
        const next = EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)]
        setExpression(next)
      }
      gsap.delayedCall(gsap.utils.random(2.5, 4.5), () => {
        if (cancelled) return
        if (!noticing.current) setExpression('neutral')
        gsap.delayedCall(gsap.utils.random(3, 6), cycle)
      })
    }
    const first = gsap.delayedCall(gsap.utils.random(2, 4), cycle)
    return () => {
      cancelled = true
      first.kill()
    }
  }, [])

  // happy reaction when the résumé button is clicked
  useEffect(() => {
    const onCheer = () => {
      setExpression('grin')
      // joyful pop + wiggle
      gsap.fromTo(
        faceRef.current,
        { scale: 1, rotate: 0 },
        {
          keyframes: [
            { scale: 1.18, rotate: -6, duration: 0.14 },
            { rotate: 6, duration: 0.14 },
            { scale: 1, rotate: 0, duration: 0.22, ease: 'back.out(3)' },
          ],
          ease: 'power2.out',
        }
      )
      gsap.delayedCall(1.4, () => {
        if (!noticing.current) setExpression('neutral')
      })
    }
    window.addEventListener('avatar-cheer', onCheer)
    return () => window.removeEventListener('avatar-cheer', onCheer)
  }, [])

  const mouthPath = {
    neutral: 'M 40 66 Q 50 68 60 66',
    smile: 'M 38 64 Q 50 76 62 64',
    grin: 'M 36 63 Q 50 80 64 63 Q 50 72 36 63',
    surprised: 'M 50 62 m -6 0 a 6 6 0 1 0 12 0 a 6 6 0 1 0 -12 0',
    wink: 'M 38 64 Q 50 76 62 64',
  }

  return (
    <div ref={faceRef} className="relative z-10 w-52 h-52 md:w-60 md:h-60">
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* eyes */}
        <g>
          {/* left eye */}
          <g ref={leftLidRef} style={{ transformOrigin: '32px 40px' }}>
            <circle cx="32" cy="40" r="7" fill="rgba(245,243,239,0.9)" />
            <circle
              ref={leftPupilRef}
              cx="32"
              cy="40"
              r={expression === 'wink' ? 0 : 3.2}
              fill="#0a0a0b"
              style={{ transition: 'r 0.15s ease' }}
            />
            {expression === 'wink' && (
              <line x1="26" y1="40" x2="38" y2="40" stroke="#0a0a0b" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>
          {/* right eye */}
          <g ref={rightLidRef} style={{ transformOrigin: '68px 40px' }}>
            <circle cx="68" cy="40" r="7" fill="rgba(245,243,239,0.9)" />
            <circle ref={rightPupilRef} cx="68" cy="40" r="3.2" fill="#0a0a0b" />
          </g>
        </g>

        {/* mouth */}
        <path
          d={mouthPath[expression]}
          stroke="rgba(245,243,239,0.85)"
          strokeWidth="3"
          strokeLinecap="round"
          fill={expression === 'surprised' ? 'rgba(245,243,239,0.85)' : 'none'}
        />
      </svg>
    </div>
  )
}