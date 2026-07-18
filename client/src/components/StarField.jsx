import { useEffect, useRef } from 'react'

const STAR_COUNT = 260
const BASE_SPEED = 0.0011 // slow ambient forward drift when idle
const SCROLL_FACTOR = 0.00085 // how much scroll velocity accelerates the warp
const TRAIL_LENGTH = 14 // how far the streak stretches behind each star (scales with speed)

export default function StarField() {
  const canvasRef = useRef(null)
  const velocityRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    // spawn stars away from dead-center — a star with x,y ≈ 0 stays near the
    // screen center at every depth and never leaves via the bounds check,
    // so it just pulses into a big blob. Giving every star a minimum radius
    // from center avoids that pileup.
    const makeStar = () => {
      const angle = Math.random() * Math.PI * 2
      const minDist = Math.min(w, h) * 0.06
      const dist = minDist + Math.random() * Math.max(w, h) * 0.75
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        z: Math.random() * 1 + 0.05, // 0.05 (near) -> 1.05 (far)
      }
    }

    const stars = Array.from({ length: STAR_COUNT }, makeStar)
    let raf

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#0a0a0b'
      ctx.fillRect(0, 0, w, h)

      // stars always fly toward the camera. scrolling down speeds up the warp;
      // scrolling up does nothing (never reverses) — so we only take positive
      // velocity into the boost.
      const boost = Math.max(0, velocityRef.current) * SCROLL_FACTOR
      const speed = BASE_SPEED + boost
      // ease the tracked velocity back toward 0 so the warp settles after scrolling stops
      velocityRef.current *= 0.9

      const cx = w / 2
      const cy = h / 2

      for (const s of stars) {
        s.z -= speed
        if (s.z <= 0.02) {
          // star passed the camera flying forward — respawn far away
          Object.assign(s, makeStar())
          s.z = 1.05
        }

        const sx = cx + s.x / s.z
        const sy = cy + s.y / s.z

        if (sx < 0 || sx > w || sy < 0 || sy > h) {
          Object.assign(s, makeStar())
          s.z = 1.05
          continue
        }

        const size = Math.max(0.2, (1 - s.z) * 2.4)
        const alpha = Math.min(1, (1 - s.z) * 0.9 + 0.1)

        // streak / "breach" trail: draw from where the star was a few z-steps
        // deeper (further away) to where it is now. The gap grows with speed,
        // so the faster the warp the longer the line stretches behind the star.
        const trailZ = Math.min(1.05, s.z + speed * TRAIL_LENGTH)
        const tx = cx + s.x / trailZ
        const ty = cy + s.y / trailZ

        ctx.beginPath()
        ctx.strokeStyle = `rgba(201,168,118,${alpha * 0.7})`
        ctx.lineWidth = Math.max(0.5, size * 0.8)
        ctx.lineCap = 'round'
        ctx.moveTo(tx, ty)
        ctx.lineTo(sx, sy)
        ctx.stroke()

        ctx.beginPath()
        ctx.fillStyle = `rgba(201,168,118,${alpha})`
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    // prefer Lenis's velocity (smooth, already-normalized) if available, else fall back to raw scroll delta
    let lastY = window.scrollY
    const onNativeScroll = () => {
      const y = window.scrollY
      velocityRef.current = y - lastY
      lastY = y
    }

    let unsubscribeLenis = null
    const tryHookLenis = () => {
      if (window.__lenis) {
        const handler = ({ velocity }) => {
          velocityRef.current = velocity
        }
        window.__lenis.on('scroll', handler)
        unsubscribeLenis = () => window.__lenis && window.__lenis.off('scroll', handler)
      } else {
        window.addEventListener('scroll', onNativeScroll, { passive: true })
      }
    }
    // Lenis initializes in a separate hook; give it a tick to attach
    const t = setTimeout(tryHookLenis, 50)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onNativeScroll)
      if (unsubscribeLenis) unsubscribeLenis()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
