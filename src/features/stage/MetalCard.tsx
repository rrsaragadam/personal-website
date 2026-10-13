'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { PROFILE } from '@/content/profile'
import { offset, progress, ramp } from '@/features/film/scroll'
import { finishes } from '@/features/studio/finishes'
import { engravedSkin, engraving, tracked } from '@/features/studio/engrave'
import { MONO, SANS, SERIF } from '@/features/studio/textures'
import { pointer } from '@/features/studio/pointer'

const W = 1.7
const H = 1.07
const T = 0.02

// The last act: a calling card milled from a single piece of aluminium,
// laser-engraved. It rises into the light and settles facing you.
export function MetalCard() {
  const group = useRef<THREE.Group>(null)
  const viewport = useThree((s) => s.viewport)
  const portrait = viewport.aspect < 1
  const { blasted } = finishes()

  const skin = useMemo(() => {
    const email = PROFILE.links.find((l) => l.href.startsWith('mailto:'))
    const mask = engraving(1360, 856, (ctx, w, h) => {
      ctx.font = `800 92px ${SANS()}`
      ctx.fillText('RS', 84, 170)
      ctx.font = `italic 400 78px ${SERIF()}`
      ctx.fillText(PROFILE.name, 84, h - 250)
      ctx.font = `400 26px ${MONO()}`
      tracked(ctx, PROFILE.role.toUpperCase(), 88, h - 190, 8)
      tracked(
        ctx,
        (email?.href.replace('mailto:', '') ?? '').toUpperCase(),
        88,
        h - 84,
        5
      )
      ctx.textAlign = 'right'
      ctx.fillText('N°001', w - 84, 150)
      ctx.fillRect(84, h - 140, w - 168, 2)
    })
    return engravedSkin(mask, '#25262b')
  }, [])

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const o = offset('contact')
    const p = progress('contact')
    const rise = ramp(p, -0.6, 0.5)
    const t = clock.elapsedTime

    g.position.set(
      portrait ? 0 : viewport.width * 0.18,
      (portrait ? -viewport.height * 0.06 : 0) +
        (1 - rise) * -viewport.height * 0.9,
      0
    )
    g.rotation.set(
      -0.18 + (1 - rise) * -1.1 + pointer.y * -0.2,
      -0.32 + (1 - rise) * 0.5 + pointer.x * 0.3 + Math.sin(t * 0.3) * 0.04,
      0.04 + (1 - rise) * 0.3
    )
    g.scale.setScalar(portrait ? 0.62 : 1.15)
    g.visible = o > -1.2
  })

  return (
    <group ref={group}>
      <RoundedBox
        args={[W, H, T]}
        radius={0.008}
        smoothness={3}
        material={blasted}
        castShadow
      />
      <mesh position={[0, 0, T / 2 + 0.0008]} material={skin}>
        <planeGeometry args={[W, H]} />
      </mesh>
    </group>
  )
}
