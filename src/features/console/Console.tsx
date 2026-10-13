'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { materials } from './materials'
import { Dial } from './Dial'
import { Display } from './Display'
import { Gauge } from './Gauge'
import { Toggle } from './Toggle'
import { KeyFob } from './KeyFob'
import { useIgnition } from './useIgnition'

const SECTIONS = [
  { id: 'projects', label: 'Projects' },
  { id: 'work', label: 'Work' },
  { id: 'reading', label: 'Reading' },
  { id: 'about', label: 'About' },
]

const WIDTH = 6 // panel plus key, for fitting to the viewport

const go = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

// The hero object: a milled aluminium console in the spirit of the Luce
// centre panel, with a glass screen, a finish dial, an analog gauge, a row of
// toggles for navigation and a glass key.
export function Console() {
  const m = materials()
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()
  const start = useIgnition((s) => s.start)

  useEffect(() => {
    const t = setTimeout(start, 350)
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      clearTimeout(t)
      window.removeEventListener('pointermove', onMove)
    }
  }, [start])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const wide = viewport.aspect > 1.15
    const scale = wide
      ? Math.min((viewport.width * 0.6) / WIDTH, 1)
      : (viewport.width * 0.94) / WIDTH
    const x = wide ? viewport.width * 0.15 : -0.3 * scale
    const y = wide ? -viewport.height * 0.1 : -viewport.height * 0.2
    const scroll = THREE.MathUtils.clamp(
      window.scrollY / window.innerHeight,
      0,
      1
    )
    const k = 1 - Math.exp(-dt * 5)
    const t = state.clock.elapsedTime

    g.scale.setScalar(scale)
    g.position.set(x, y + Math.sin(t * 0.8) * 0.03 + scroll * 0.6, 0)
    g.rotation.x +=
      (0.98 + pointer.current.y * 0.06 + scroll * 0.35 - g.rotation.x) * k
    g.rotation.y += (pointer.current.x * 0.1 - 0.12 - g.rotation.y) * k
    g.rotation.z += (-pointer.current.x * 0.02 - g.rotation.z) * k
  })

  return (
    <group ref={group}>
      {/* Milled body with a chamfered edge */}
      <RoundedBox
        args={[4.4, 0.2, 2.4]}
        radius={0.1}
        smoothness={6}
        position-y={-0.1}
        material={m.aluminium}
      />
      <Dial position={[-1.5, 0, -0.38]} />
      <Display position={[0.05, 0, -0.38]} />
      <Gauge position={[1.55, 0, -0.38]} />
      {SECTIONS.map((s, i) => (
        <Toggle
          key={s.id}
          label={s.label}
          position={[-1.2 + i * 0.8, 0, 0.55]}
          onFlip={() => go(s.id)}
        />
      ))}
      <KeyFob position={[2.7, -0.05, 0.95]} rotation-y={-0.3} />
    </group>
  )
}
