import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

function Knot({ mouse, drag }) {
  const meshRef = useRef(null)
  const scrollRef = useRef(0)
  const restRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onScroll = () => {
      scrollRef.current = window.scrollY / (document.body.scrollHeight - window.innerHeight)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // rotation keeps spinning on its own, unaffected by dragging
    restRotation.current.x += delta * 0.15
    restRotation.current.y += delta * 0.2 + scrollRef.current * 0.01
    meshRef.current.rotation.x = restRotation.current.x
    meshRef.current.rotation.y = restRotation.current.y

    // base position: the normal mouse-parallax float
    const targetX = (mouse.current.x || 0) * 0.4
    const targetY = (mouse.current.y || 0) * 0.4

    // ease the drag offset back toward zero once released, so the knot
    // "comes back" to its natural spot instead of staying wherever it was dropped
    if (!drag.active.current) {
      drag.offset.current.x += (0 - drag.offset.current.x) * Math.min(1, delta * 3.5)
      drag.offset.current.y += (0 - drag.offset.current.y) * Math.min(1, delta * 3.5)
    }

    const finalTargetX = targetX + drag.offset.current.x
    const finalTargetY = -targetY + drag.offset.current.y

    meshRef.current.position.x += (finalTargetX - meshRef.current.position.x) * (drag.active.current ? 0.4 : 0.06)
    meshRef.current.position.y += (finalTargetY - meshRef.current.position.y) * (drag.active.current ? 0.4 : 0.06)
  })

  const onPointerDown = (e) => {
    e.stopPropagation()
    e.target.setPointerCapture(e.pointerId)
    drag.active.current = true
    drag.last.current = { x: e.clientX, y: e.clientY }
    document.body.style.cursor = 'grabbing'
  }

  const onPointerMove = (e) => {
    if (!drag.active.current) return
    const dx = e.clientX - drag.last.current.x
    const dy = e.clientY - drag.last.current.y
    drag.last.current = { x: e.clientX, y: e.clientY }
    // convert pixel movement to world-unit movement so it tracks the cursor 1:1-ish
    drag.offset.current.x += dx * 0.006
    drag.offset.current.y -= dy * 0.006
  }

  const onPointerUp = (e) => {
    drag.active.current = false
    e.target.releasePointerCapture?.(e.pointerId)
    document.body.style.cursor = 'grab'
  }

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh
        ref={meshRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerOver={() => (document.body.style.cursor = 'grab')}
        onPointerOut={() => {
          if (!drag.active.current) document.body.style.cursor = 'auto'
        }}
      >
        <torusKnotGeometry args={[1.1, 0.32, 220, 32]} />
        <meshStandardMaterial
          color="#c9973f"
          metalness={1}
          roughness={0.26}
          envMapIntensity={1.7}
        />
      </mesh>
    </Float>
  )
}

export default function FloatingObject({ className = '' }) {
  const mouse = useRef({ x: 0, y: 0 })
  const drag = useRef({
    active: { current: false },
    last: { current: { x: 0, y: 0 } },
    offset: { current: { x: 0, y: 0 } },
  }).current

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 4]} intensity={1.3} color="#ffe9c2" />
        <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#c9a876" />
        <pointLight position={[0, 3, 2]} intensity={0.4} color="#fff2dc" />
        <Knot mouse={mouse} drag={drag} />
        {/* sky-based preset — no buildings/architecture to reflect, unlike "city" or "apartment" */}
        <Environment preset="sunset" blur={0.9} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.85} luminanceSmoothing={0.6} intensity={0.25} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  )
}