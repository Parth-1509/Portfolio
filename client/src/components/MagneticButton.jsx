import { useRef } from 'react'
import gsap from 'gsap'

export default function MagneticButton({ as: Tag = 'button', className = '', style, children, strength = 0.4, ...props }) {
  const ref = useRef(null)
  const quickX = useRef(null)
  const quickY = useRef(null)

  const ensureQuick = () => {
    if (!quickX.current) {
      quickX.current = gsap.quickTo(ref.current, 'x', { duration: 0.5, ease: 'power3.out' })
      quickY.current = gsap.quickTo(ref.current, 'y', { duration: 0.5, ease: 'power3.out' })
    }
  }

  const onMouseMove = (e) => {
    if (!ref.current) return
    ensureQuick()
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    quickX.current(relX * strength)
    quickY.current(relY * strength)
  }

  const onMouseLeave = () => {
    ensureQuick()
    quickX.current(0)
    quickY.current(0)
  }

  return (
    <Tag
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Tag>
  )
}