'use client'

import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import {
  useFrame,
  type ThreeElements,
  type ThreeEvent,
} from '@react-three/fiber'
import { useLivery } from '@/features/livery/useLivery'
import { materials } from './materials'
import { textTexture, MONO } from './textures'
import { detent } from './detent'

// Resting, the lever leans away from the viewer; flipped, it leans toward them.
const UP = -0.55
const DOWN = 0.55

interface ToggleProps extends Omit<ThreeElements['group'], 'onClick'> {
  label: string
  onFlip: () => void
}

// An aircraft-style bat toggle on a milled plate. Flip it and the lever snaps
// over, its lamp lights in the finish colour, and the page travels to the
// section on its engraved label; then it springs back.
export function Toggle({ label, onFlip, ...props }: ToggleProps) {
  const m = materials()
  const livery = useLivery((s) => s.livery)
  const lever = useRef<THREE.Group>(null)
  const lamp = useRef<THREE.MeshStandardMaterial>(null)
  const [on, setOn] = useState(false)
  const [hover, setHover] = useState(false)

  const engraving = useMemo(
    () =>
      textTexture(512, 112, (ctx, w, h) => {
        ctx.fillStyle = 'rgba(30,30,36,0.78)'
        ctx.font = `600 ${h * 0.5}px ${MONO}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(label.toUpperCase(), w / 2, h / 2)
      }),
    [label]
  )

  const flip = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (on) return
    setOn(true)
    detent(1.4)
    setTimeout(onFlip, 260)
    setTimeout(() => {
      setOn(false)
      detent(0.6)
    }, 1400)
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
      {/* Engraved label */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.031, 0.33]}>
        <planeGeometry args={[0.5, 0.11]} />
        <meshBasicMaterial map={engraving.tex} transparent toneMapped={false} />
      </mesh>
    </group>
  )
}
