import { useEffect, useRef, useState } from 'react'

/**
 * Crossfades between two (or more) images on an interval.
 *
 * Standalone usage:   <ProjectImage images={project.images} alt={project.title} />
 * Inside a shaped card the parent already controls (e.g. rounded-3xl overflow-hidden):
 *                      <ProjectImage images={project.images} alt={project.title} fill />
 */
export default function ProjectImage({
  images = [],
  alt = '',
  interval = 3000,   // ms between transitions
  duration = 900,    // ms the fade itself takes
  fill = false,       // true = absolute inset-0, no own aspect-ratio/border-radius
  className = '',
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const timerRef = useRef(null)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  }, [])

  useEffect(() => {
    if (images.length < 2 || prefersReducedMotion.current) return

    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timerRef.current)
  }, [images, interval])

  if (!images.length) return null

  return (
    <div
      className={`project-image ${fill ? 'project-image--fill' : ''} ${className}`}
      style={{ '--fade-duration': `${duration}ms` }}
    >
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={alt}
          className={`project-image__layer ${i === activeIndex ? 'is-active' : ''}`}
          loading={i === 0 ? 'eager' : 'lazy'}
        />
      ))}

      <style>{`
        .project-image {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          border-radius: 12px;
          background: #111;
        }

        .project-image--fill {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          aspect-ratio: unset;
          border-radius: 0;
        }

        .project-image__layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fit;
          opacity: 0;
          transform: scale(1.02);
          transition:
            opacity var(--fade-duration) ease,
            transform var(--fade-duration) ease;
          will-change: opacity, transform;
        }

        .project-image__layer.is-active {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>
    </div>
  )
}