import { useEffect, useRef, useState } from 'react'

/**
 * Counts up from 0 to `value` once it scrolls into view.
 * `value` may be a number (5) or a string with a suffix ("40+", "99%").
 * Pass `decimals` to keep fractional precision (e.g. 8.37 -> decimals={2}).
 */
export default function AnimatedCounter({ value, className = '', duration = 1600, decimals = 0 }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState((0).toFixed(decimals))

  // split "40+" -> target 40, suffix "+"
  const target = parseFloat(String(value)) || 0
  const suffix = String(value).replace(/[0-9.]/g, '')

  useEffect(() => {
    const el = ref.current
    let raf
    let started = false

    const run = () => {
      const start = performance.now()
      const step = (now) => {
        const t = Math.min(1, (now - start) / duration)
        // easeOutExpo for a snappy finish
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
        setDisplay((eased * target).toFixed(decimals) + suffix)
        if (t < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true
          run()
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    if (el) io.observe(el)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, suffix, duration, decimals])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}