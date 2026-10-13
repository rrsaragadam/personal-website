'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { useLivery } from '@/features/livery/useLivery'

// The hero object: a soft, machined pebble in deep clearcoat. The surface
// breathes slowly, and its paint eases toward the active livery each frame so
// a finish change reads as a respray rather than a swap.
export function Pebble({ reducedMotion }: { reducedMotion: boolean }) {
  const material = useRef<THREE.MeshPhysicalMaterial>(null)
  const livery = useLivery((s) => s.livery)
  const target = useRef(new THREE.Color())

  useFrame((_, dt) => {
    const m = material.current
    if (!m) return
    target.current.set(livery.paint)
    const k = 1 - Math.exp(-dt * 3)
    m.color.lerp(target.current, k)
    m.metalness = THREE.MathUtils.lerp(m.metalness, livery.metalness, k)
  })

  return (
    <mesh scale={[1.18, 0.94, 1.02]} castShadow>
      <sphereGeometry args={[1, 160, 160]} />
      <MeshDistortMaterial
        ref={(m) => {
          material.current = m
        }}
        color={livery.paint}
        distort={reducedMotion ? 0.12 : 0.26}
        speed={reducedMotion ? 0 : 1.2}
        roughness={0.22}
        metalness={livery.metalness}
        clearcoat={1}
        clearcoatRoughness={0.08}
        iridescence={0.55}
        iridescenceIOR={1.35}
        iridescenceThicknessRange={[120, 480]}
        envMapIntensity={1.25}
      />
    </mesh>
  )
}
