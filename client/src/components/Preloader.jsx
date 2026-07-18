import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Preloader({ onComplete }) {
  const rootRef = useRef(null)
  const numRef = useRef(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const counter = { val: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true)
        onComplete?.()
      },
    })

    tl.to(counter, {
      val: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (numRef.current) numRef.current.textContent = Math.floor(counter.val)
      },
    })
      .to('.preloader-bar', { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, '<')
      .to('.preloader-label', { opacity: 0, y: -10, duration: 0.4 })
      .to(rootRef.current, { yPercent: -100, duration: 0.9, ease: [0.76, 0, 0.24, 1] }, '+=0.1')

    return () => tl.kill()
  }, [onComplete])

  if (done) return null

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] bg-ink flex flex-col items-center justify-center"
    >
      <div className="preloader-label eyebrow mb-6">Parth Patel</div>
      <div className="font-display text-7xl md:text-9xl text-bone mb-8">
        <span ref={numRef}>0</span>
        <span className="text-bronze">%</span>
      </div>
      <div className="w-48 md:w-64 h-px bg-line overflow-hidden">
        <div className="preloader-bar h-full w-full bg-bronze origin-left scale-x-0" />
      </div>
    </div>
  )
}
