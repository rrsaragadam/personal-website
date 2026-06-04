'use client'

import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { Laptop } from './objects/Laptop'
import { CRTMonitor } from './objects/CRTMonitor'
import { IPad } from './objects/IPad'
import { Books } from './objects/Books'
import { Headphones } from './objects/Headphones'
import { Phone } from './objects/Phone'
import { makeToonGradient, setOutline } from '@/lib/toon'

// Begin downloading object models before they mount (covered by the Canvas Suspense).
;['laptop', 'crt', 'tablet', 'books', 'headphones', 'phone'].forEach((m) =>
  useGLTF.preload(`/models/${m}.glb`)
)

// Flat, comic-book table: solid warm fills + bold ink outlines, no wood grain.
const WOOD_COLOR = '#c2702f'
const LEG_COLOR = '#9c531f'
const TOON_GRAD = makeToonGradient(3)

// Sized to just hold the objects: books/laptop/monitor/tablet span ~ -2.4..2.2 in x.
const TOP_W = 5.4
const TOP_D = 2.3

function DeskTop() {
  return (
    <mesh position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[TOP_W, 0.16, TOP_D]} />
      <meshToonMaterial
        ref={(m: THREE.MeshToonMaterial | null) => { if (m) setOutline(m, 0.006) }}
        color={WOOD_COLOR}
        gradientMap={TOON_GRAD}
      />
    </mesh>
  )
}

function DeskLegs() {
  // Long, inset legs that drop from the desk underside into the grass (feet
  // hidden by the dome) — a tall comic table, not a low bench.
  const legPositions: [number, number, number][] = [
    [-2.35, -0.85, -0.85],
    [2.35, -0.85, -0.85],
    [-2.35, -0.85, 0.85],
    [2.35, -0.85, 0.85],
  ]
  return (
    <>
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.17, 1.65, 0.17]} />
          <meshToonMaterial
            ref={(m: THREE.MeshToonMaterial | null) => { if (m) setOutline(m, 0.0055) }}
            color={LEG_COLOR}
            gradientMap={TOON_GRAD}
          />
        </mesh>
      ))}
    </>
  )
}

function DeskMat() {
  return (
    <mesh position={[-0.3, 0.085, 0.36]} receiveShadow>
      <boxGeometry args={[2.4, 0.012, 1.2]} />
      <meshToonMaterial
        ref={(m: THREE.MeshToonMaterial | null) => { if (m) setOutline(m, 0.004) }}
        color="#3fa35d"
        gradientMap={TOON_GRAD}
      />
    </mesh>
  )
}

export function Desk() {
  return (
    <group>
      <DeskTop />
      <DeskLegs />
      <DeskMat />
      <Books />
      <Headphones />
      <Laptop />
      <Phone />
      <IPad />
      <CRTMonitor />
    </group>
  )
}
