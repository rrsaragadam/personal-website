'use client'

import { useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import {
  useFrame,
  type ThreeElements,
  type ThreeEvent,
} from '@react-three/fiber'
import { useLivery } from '@/features/livery/useLivery'
import { materials } from './materials'
import { Engraving } from './Engraving'
import { detent } from './detent'

// Resting, the lever leans away from the viewer; flipped, it leans toward them.
const UP = -0.55
const DOWN = 0.55

interface ToggleProps extends Omit<ThreeElements['group'], 'onClick'> {
  label: string
  on: boolean
  onFlip: () => void
}

// An aircraft-style bat toggle on a milled plate. Flip it and the lever snaps
// over and its lamp lights in the finish colour; it stays latched while its
// section is on screen.
export function Toggle({ label, on, onFlip, ...props }: ToggleProps) {
  const m = materials()
  const livery = useLivery((s) => s.livery)
  const lever = useRef<THREE.Group>(null)
  const lamp = useRef<THREE.MeshStandardMaterial>(null)
  const [hover, setHover] = useState(false)

  const flip = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    detent(1.4)
    onFlip()
  }

  useFrame((_, dt) => {
    const target = on ? DOWN : hover ? UP + 0.1 : UP
    if (lever.current) {
      lever.current.rotation.x +=
        (target - lever.current.rotation.x) *
        (1 - Math.exp(-dt * (on ? 30 : 14)))
    }
    if (lamp.current) {
      lamp.current.emissiveIntensity +=
        ((on ? 3 : 0.15) - lamp.current.emissiveIntensity) *
        (1 - Math.exp(-dt * 10))
      lamp.current.emissive.set(livery.accent[0])
    }
  })

  return (
    <group
      {...props}
      onClick={flip}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHover(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <RoundedBox
        args={[0.34, 0.03, 0.46]}
        radius={0.012}
        position={[0, 0.012, 0]}
        material={m.anodised}
      />
      {/* Lamp */}
      <mesh position={[0, 0.04, -0.16]}>
        <sphereGeometry args={[0.028, 24, 24]} />
        <meshStandardMaterial
          ref={lamp}
          color="#222"
          emissive={livery.accent[0]}
          emissiveIntensity={0.15}
          toneMapped={false}
        />
      </mesh>
      {/* Collar and lever */}
      <mesh position={[0, 0.05, 0]} material={m.aluminiumPolished}>
        <cylinderGeometry args={[0.065, 0.075, 0.05, 48]} />
      </mesh>
      <group ref={lever} position={[0, 0.07, 0]} rotation-x={UP}>
        <mesh position-y={0.13} material={m.aluminiumPolished}>
          <cylinderGeometry args={[0.03, 0.022, 0.26, 32]} />
        </mesh>
        <mesh position-y={0.265} material={m.aluminiumPolished}>
          <sphereGeometry args={[0.032, 32, 32]} />
        </mesh>
      </group>
      <Engraving text={label} position={[0, 0.002, 0.33]} />
    </group>
  )
}
