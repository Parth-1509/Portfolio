import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function ExperiencePhotos({ photos, interval = 4000 }) {
  const [index, setIndex] = useState(0)
  const imgRefs = useRef([])

  useEffect(() => {
    if (photos.length < 2) return
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % photos.length)
    }, interval)
    return () => clearInterval(timer)
  }, [photos.length, interval])

  useEffect(() => {
    imgRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.to(el, {
        opacity: i === index ? 1 : 0,
        scale: i === index ? 1 : 1.05,
        duration: 1.1,
        ease: 'power2.inOut',
      })
    })
  }, [index])

  return (
    <div
      className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5]"
      style={{ maxWidth: '500px', maxHeight: '500px' }}
    >
            <div
      className="absolute inset-0 rounded-2xl sm:rounded-3xl w-full overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 45%, rgba(201,168,118,0.08) 100%)',
        backdropFilter: 'blur(14px) saturate(160%)',
        WebkitBackdropFilter: 'blur(14px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow:
          'inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -6px 10px rgba(0,0,0,0.25), 0 12px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(201,168,118,0.06)',
      }}
    >
      {photos.map((src, i) => (
        <img
          key={i}
          ref={(el) => (imgRefs.current[i] = el)}
          src={src}
          alt="Development workspace"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: i === 0 ? 1 : 0 }}
        />
      ))}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(115deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 30%)',
          mixBlendMode: 'overlay',
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }}
      />
    </div>

      {photos.length > 1 && (
        <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {photos.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: i === index ? '20px' : '6px',
                background: i === index ? '#c9a876' : 'rgba(255,255,255,0.25)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}