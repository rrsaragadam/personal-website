'use client'

import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import {
  useFrame,
  type ThreeElements,
  type ThreeEvent,
} from '@react-three/fiber'
import { materials } from './materials'
import { textTexture, MONO, SANS } from './textures'
import { useConsole } from './useConsole'
import { detent } from './detent'

// The Luce key: a slab of glass over an e-ink panel. Tap it for contact
// details; it rises while the contact screen is up.
export function KeyFob(props: ThreeElements['group']) {
  const m = materials()
  const active = useConsole((s) => s.mode === 'contact')
  const setMode = useConsole((s) => s.setMode)
  const group = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)

  const ink = useMemo(
    () =>
      textTexture(320, 512, (ctx, w, h) => {
        ctx.fillStyle = '#e7e6e1'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#16161a'
        ctx.font = `600 ${w * 0.3}px ${SANS}`
        ctx.textAlign = 'center'
        ctx.fillText('RS', w / 2, h * 0.5)
        ctx.font = `500 ${w * 0.055}px ${MONO}`
        ctx.fillStyle = 'rgba(22,22,26,0.6)'
        ctx.fillText('CONTACT', w / 2, h * 0.86)
      }),
    []
  )

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    detent(1.2)
    setMode('contact')
  }

  useFrame((_, dt) => {
    if (group.current) {
      const y = active ? 0.14 : hover ? 0.06 : 0
      group.current.position.y +=
        (y - group.current.position.y) * (1 - Math.exp(-dt * 10))
    }
  })

  return (
    <group {...props}>
      <group
        ref={group}
        onClick={onClick}
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
          args={[0.56, 0.03, 0.86]}
          radius={0.012}
          position-y={0.015}
          material={m.anodised}
        />
        <mesh rotation-x={-Math.PI / 2} position-y={0.032}>
          <planeGeometry args={[0.46, 0.74]} />
          <meshBasicMaterial map={ink.tex} color="#d8d7d2" toneMapped={false} />
        </mesh>
        <RoundedBox
          args={[0.56, 0.05, 0.86]}
          radius={0.02}
          position-y={0.06}
          material={m.glass}
        />
      </group>
    </group>
  )
}
