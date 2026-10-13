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
import { useIgnition } from './useIgnition'
import { detent } from './detent'

// The Luce key: a slab of glass over an e-ink panel. Tap it to start the
// console again.
export function KeyFob(props: ThreeElements['group']) {
  const m = materials()
  const start = useIgnition((s) => s.start)
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
        ctx.fillText('TAP TO START', w / 2, h * 0.86)
      }),
    []
  )

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    detent(1.2)
    start()
  }

  useFrame((_, dt) => {
    if (group.current) {
      const y = hover ? 0.06 : 0
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
        <mesh rotation-x={-Math.PI / 2} position-y={0.03}>
          <planeGeometry args={[0.46, 0.74]} />
          <meshStandardMaterial map={ink.tex} roughness={0.9} />
        </mesh>
        <RoundedBox
          args={[0.56, 0.08, 0.86]}
          radius={0.035}
          position-y={0.04}
          material={m.glassSlab}
        />
      </group>
    </group>
  )
}
