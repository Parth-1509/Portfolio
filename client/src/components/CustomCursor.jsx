import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    let ringX = 0, ringY = 0

    const move = (e) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY })
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power3.out' })
    }

    const grow = () => {
      gsap.to(ring, { width: 70, height: 70, background: 'rgba(201,168,118,0.12)', borderColor: 'rgba(201,168,118,0.6)' })
    }
    const shrink = () => {
      gsap.to(ring, { width: 40, height: 40, background: 'transparent', borderColor: 'rgba(245,243,239,0.4)' })
    }

    window.addEventListener('mousemove', move)
    document.querySelectorAll('[data-cursor="grow"]').forEach((el) => {
      el.addEventListener('mouseenter', grow)
      el.addEventListener('mouseleave', shrink)
    })

    return () => {
      window.removeEventListener('mousemove', move)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  )
}
