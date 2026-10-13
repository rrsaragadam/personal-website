'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import { useLivery } from '@/features/livery/useLivery'
import { materials } from '@/features/console/materials'
import { MONO, textTexture } from '@/features/console/textures'
import { litAmount, useIgnition } from '@/features/console/useIgnition'

// The multigraph: a small watch on the display's shoulder, with three
// anodised hands over a minimal dial. Here it simply keeps the visitor's
// local time.
export function Multigraph({
  r = 0.03,
  ...props
}: ThreeElements['group'] & { r?: number }) {
  const m = materials()
  const livery = useLivery((s) => s.livery)
  const startedAt = useIgnition((s) => s.startedAt)
  const hours = useRef<THREE.Group>(null)
  const minutes = useRef<THREE.Group>(null)
  const seconds = useRef<THREE.Group>(null)
  const faceMat = useRef<THREE.MeshBasicMaterial>(null)

  const face = useMemo(
    () =>
      textTexture(512, 512, (ctx, s) => {
        const c = s / 2
        ctx.fillStyle = '#0b0b0e'
        ctx.fillRect(0, 0, s, s)
        for (let i = 0; i < 60; i++) {
          const a = (i / 60) * Math.PI * 2
          const big = i % 15 === 0
          const mid = i % 5 === 0
          ctx.strokeStyle = big
            ? '#f2f2f5'
            : mid
              ? 'rgba(242,242,245,0.7)'
              : 'rgba(242,242,245,0.25)'
          ctx.lineWidth = big ? 10 : mid ? 5 : 2.5
          const r2 = c * (big ? 0.74 : mid ? 0.8 : 0.86)
          ctx.beginPath()
          ctx.moveTo(c + Math.sin(a) * c * 0.92, c - Math.cos(a) * c * 0.92)
          ctx.lineTo(c + Math.sin(a) * r2, c - Math.cos(a) * r2)
          ctx.stroke()
        }
        ctx.fillStyle = 'rgba(242,242,245,0.5)'
        ctx.font = `500 ${s * 0.055}px ${MONO}`
        ctx.textAlign = 'center'
        ctx.fillText('RS · 01', c, c * 1.4)
      }),
    []
  )

  useFrame(() => {
    const d = new Date()
    const s = d.getSeconds() + d.getMilliseconds() / 1000
    const mi = d.getMinutes() + s / 60
    const h = (d.getHours() % 12) + mi / 60
    if (hours.current) hours.current.rotation.z = -(h / 12) * Math.PI * 2
    if (minutes.current) minutes.current.rotation.z = -(mi / 60) * Math.PI * 2
    if (seconds.current)
      seconds.current.rotation.z = -(Math.floor(s) / 60) * Math.PI * 2
    faceMat.current?.color.setScalar(0.25 + litAmount(startedAt, 0.4) * 0.75)
  })

  const hand = (
    ref: React.RefObject<THREE.Group | null>,
    length: number,
    width: number,
    colour: string,
    z: number
  ) => (
    <group ref={ref} position-z={z}>
      <mesh position-y={length / 2 - length * 0.15}>
        <boxGeometry args={[width, length, 0.0012]} />
        <meshStandardMaterial
          color={colour}
          metalness={0.6}
          roughness={0.35}
          emissive={colour}
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  )

  return (
    <group {...props}>
      <mesh rotation-x={Math.PI / 2} position-z={-0.006} material={m.aluminium}>
        <cylinderGeometry args={[r + 0.006, r + 0.008, 0.016, 64]} />
      </mesh>
      <mesh position-z={0.0025}>
        <circleGeometry args={[r, 64]} />
        <meshBasicMaterial ref={faceMat} map={face.tex} toneMapped={false} />
      </mesh>
      {hand(hours, r * 0.55, 0.0024, '#d9dbe0', 0.0035)}
      {hand(minutes, r * 0.85, 0.0018, '#d9dbe0', 0.0045)}
      {hand(seconds, r * 0.9, 0.0008, livery.accent[0], 0.0055)}
      <mesh position-z={0.006}>
        <circleGeometry args={[0.0022, 24]} />
        <meshStandardMaterial color="#d9dbe0" metalness={1} roughness={0.2} />
      </mesh>
      <mesh position-z={0.0035} material={m.aluminiumPolished}>
        <torusGeometry args={[r + 0.001, 0.0025, 16, 96]} />
      </mesh>
      <mesh position-z={0.007} material={m.glass}>
        <circleGeometry args={[r, 64]} />
      </mesh>
    </group>
  )
}
