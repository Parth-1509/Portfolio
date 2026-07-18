import { useRef } from 'react'
import gsap from 'gsap'

const PARTICLE_COLORS = ['#f6e2b0', '#e0be78', '#c9a876', '#ffffff']

/**
 * 3D résumé download button. On click it:
 *  - bursts a spray of bronze particles out from the button
 *  - dispatches `avatar-cheer` so the AvatarFace grins happily
 * The link still downloads /resume.pdf normally.
 */
export default function ResumeButton({ href = '/resume.pdf', className = '' }) {
  const btnRef = useRef(null)

  const burst = () => {
    // tell the avatar to smile big
    window.dispatchEvent(new Event('avatar-cheer'))

    const rect = btnRef.current.getBoundingClientRect()
    const originX = rect.left + rect.width / 2
    const originY = rect.top + rect.height / 2
    const COUNT = 22

    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement('span')
      const s = gsap.utils.random(5, 10)
      p.style.cssText = `
        position: fixed;
        left: ${originX - s / 2}px;
        top: ${originY - s / 2}px;
        width: ${s}px;
        height: ${s}px;
        border-radius: 50%;
        background: ${PARTICLE_COLORS[i % PARTICLE_COLORS.length]};
        box-shadow: 0 0 8px rgba(201,168,118,0.8);
        pointer-events: none;
        z-index: 9999;
        will-change: transform, opacity;
      `
      document.body.appendChild(p)

      const angle = (i / COUNT) * Math.PI * 2 + gsap.utils.random(-0.35, 0.35)
      const dist = gsap.utils.random(70, 160)

      gsap.to(p, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - gsap.utils.random(0, 40), // slight upward pop
        scale: gsap.utils.random(0.3, 1.3),
        opacity: 0,
        duration: gsap.utils.random(0.6, 1.15),
        ease: 'power2.out',
        onComplete: () => p.remove(),
      })
    }
  }

  return (
    <span className={className}>
      <a
        ref={btnRef}
        href={href}
        download
        onClick={burst}
        className="btn-3d"
      >
        <span className="btn-3d__shadow" aria-hidden="true" />
        <span className="btn-3d__edge" aria-hidden="true" />
        <span className="btn-3d__face">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
         Résumé
        </span>
      </a>
    </span>
  )
}
