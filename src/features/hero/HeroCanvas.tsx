'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Pebble } from './Pebble'
import { Satellites } from './Satellites'
import { StudioLights } from './StudioLights'

// Scroll pose: 0 while the hero (or the closing footer) fills the screen, 1
// once the content sheet covers it. The sign says which way the object
// should leave: up when scrolling into the page, down when the footer is
// approaching from below.
function scrollPose() {
  const vh = window.innerHeight
  const max = document.documentElement.scrollHeight - vh
  const fromTop = window.scrollY / vh
  const fromBottom = (max - window.scrollY) / vh
  const nearTop = fromTop <= fromBottom
  return {
    p: THREE.MathUtils.clamp(nearTop ? fromTop : fromBottom, 0, 1),
    dir: nearTop ? 1 : -1,
  }
}

function Rig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const { p, dir } = scrollPose()
    const wide = viewport.aspect > 1.1
    // On wide screens the object sits right of the headline; on narrow ones
    // it floats above it.
    // The footer headline runs wider, so the object steps further right there.
    const baseX = wide
      ? Math.min(viewport.width * (dir > 0 ? 0.22 : 0.28), dir > 0 ? 2.4 : 3)
      : 0
    const baseY = wide ? 0.25 : 0.7
    const baseScale = (wide ? 0.78 : 0.6) * (dir > 0 ? 1 : 0.85)
    const k = 1 - Math.exp(-dt * 4)
    const t = state.clock.elapsedTime

    g.position.x = THREE.MathUtils.lerp(g.position.x, baseX, k)
    g.position.y = THREE.MathUtils.lerp(g.position.y, baseY + dir * p * 2.4, k)
    const s = baseScale * (1 - p * 0.35)
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, s, k))
    g.rotation.y = THREE.MathUtils.lerp(
      g.rotation.y,
      pointer.current.x * 0.45 + t * 0.08 + p * 1.2,
      k
    )
    g.rotation.x = THREE.MathUtils.lerp(
      g.rotation.x,
      pointer.current.y * 0.3 + dir * p * 0.6,
      k
    )
  })

  return <group ref={group}>{children}</group>
}

export function HeroCanvas() {
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.2], fov: 35 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.2
        }}
      >
        <StudioLights />
        <Rig>
          <Pebble reducedMotion={reducedMotion} />
          <Satellites reducedMotion={reducedMotion} />
        </Rig>
      </Canvas>
    </div>
  )
}
