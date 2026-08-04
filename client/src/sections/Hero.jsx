import { useRef, Suspense, lazy } from 'react'
import RevealText from '../components/RevealText'
import MagneticButton from '../components/MagneticButton'
import SceneErrorBoundary from '../components/SceneErrorBoundary'
import { FiArrowDown } from 'react-icons/fi'
import ResumeButton from '../components/ResumeButton'

const FloatingObject = lazy(() => import('../three/FloatingObject'))

export default function Hero() {
  const sectionRef = useRef(null)

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* floating 3D object — right-side accent, out of the way of the text */}
      <SceneErrorBoundary>
        <Suspense fallback={null}>
          <FloatingObject className="absolute top-0 right-0 w-full h-full  md:right-[-10%]" />
        </Suspense>
      </SceneErrorBoundary>

      {/* soft vignette on the left so text stays legible even if the knot drifts that way */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.65) 35%, transparent 62%)',
        }}
      />

      {/* content — left-aligned, vertically centered */}
      <div className="relative z-10 h-full w-full flex flex-col justify-center px-6 sm:px-10 md:px-16 pt-20 md:pt-0">
        <div className="max-w-xl text-left">
          <p className="eyebrow mb-6">Full Stack Web Developer</p>

          <RevealText
            text="PARTH"
            as="h1"
            trigger="none"
            mode="chars"
            className="font-display font-light leading-[0.9] text-[13vw] sm:text-[10vw] md:text-[7vw] tracking-[-0.02em] text-bone block drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
          />
          <RevealText
            text="PATEL"
            as="h1"
            trigger="none"
            delay={0.3}
            mode="chars"
            className="font-display italic font-light leading-[0.9] text-[13vw] sm:text-[10vw] md:text-[7vw] tracking-[-0.02em] text-bronze block drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
          />

          <p className="mt-8 md:mt-10 text-bone-dim text-base md:text-lg font-light leading-relaxed max-w-md drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            I design and build full-stack products where every interaction is
            considered — from the database schema to the last pixel of easing.
          </p>

          <MagneticButton
            className="mt-10"
           
          >
            <ResumeButton href="/Parth_Patel Resume.pdf" />
          </MagneticButton>
        </div>
      </div>

      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-bone-dim font-mono text-[10px] uppercase tracking-widest">
        Scroll
        <span className="w-px h-6 md:h-8 bg-line" />
      </div>
    </section>
  )
}