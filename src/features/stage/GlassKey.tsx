'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { MeshTransmissionMaterial, RoundedBox } from '@react-three/drei'
import { offset, progress, ramp } from '@/features/film/scroll'
import { finishes } from '@/features/studio/finishes'
import { tracked } from '@/features/studio/engrave'
import { MONO, SANS, textTexture } from '@/features/studio/textures'
import { pointer } from '@/features/studio/pointer'

// The opening object: a thick slab of glass with an e-paper panel floating
// inside it, carrying the monogram. It turns slowly in the studio light,
// leans toward the cursor, and lifts away as the first act ends.
export function GlassKey() {
  const group = useRef<THREE.Group>(null)
  const viewport = useThree((s) => s.viewport)
  const portrait = viewport.aspect < 1

  const paper = useMemo(() => {
    const { tex } = textTexture(512, 512, (ctx, w, h) => {
      // E-paper: a warm grey with the faint mottle of microcapsules.
      ctx.fillStyle = '#cfcbc1'
      ctx.fillRect(0, 0, w, h)
      for (let i = 0; i < 4000; i++) {
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.035})`
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2)
      }
      ctx.fillStyle = '#16161a'
      ctx.font = `800 210px ${SANS()}`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText('RS', 44, 300)
      ctx.font = `400 22px ${MONO()}`
      tracked(ctx, 'RISHI SARAGADAM', 50, 410, 6)
      tracked(ctx, 'PRODUCT DESIGNER', 50, 446, 6)
      ctx.fillStyle = '#ff5b1f'
      ctx.beginPath()
      ctx.arc(w - 66, 410, 11, 0, Math.PI * 2)
      ctx.fill()
    })
    return tex
  }, [])

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const t = clock.elapsedTime
    const p = progress('intro')
    const away = ramp(p, 0.45, 1) + Math.max(0, offset('intro'))
    const arrive = ramp(t, 0.2, 2.6)

    const baseX = portrait ? 0 : viewport.width * 0.2
    const baseY = portrait ? -viewport.height * 0.06 : -0.05
    g.position.set(
      baseX + away * 0.6,
      baseY + (1 - arrive) * -0.6 + away * viewport.height * 0.9,
      away * 0.8
    )
    g.rotation.set(
      -0.12 + pointer.y * -0.18 + away * 0.9,
      -0.5 + Math.sin(t * 0.25) * 0.22 + pointer.x * 0.35 + away * 1.4,
      0.08 + Math.sin(t * 0.17) * 0.03
    )
    g.scale.setScalar((portrait ? 0.6 : 1) * (0.9 + 0.1 * arrive))
    g.visible = away < 1.6
  })

  const { polished } = finishes()

  return (
    <group ref={group}>
      <RoundedBox args={[1.0, 1.5, 0.24]} radius={0.11} smoothness={8}>
        <MeshTransmissionMaterial
          thickness={0.5}
          roughness={0}
          ior={1.48}
          chromaticAberration={0.05}
          anisotropicBlur={0.02}
          backside
          backsideThickness={0.3}
          samples={8}
          resolution={768}
          color="#f3f6f8"
          attenuationColor="#dfeae8"
          attenuationDistance={3}
        />
      </RoundedBox>
      {/* The e-paper panel, suspended mid-slab */}
      <mesh position={[0, 0.16, 0]}>
        <planeGeometry args={[0.66, 0.66]} />
        {/* E-paper is reflective, but a touch of self-light keeps it
            legible through the glass in a dark studio */}
        <meshStandardMaterial
          map={paper}
          emissiveMap={paper}
          emissive="#ffffff"
          emissiveIntensity={0.28}
          roughness={0.85}
        />
      </mesh>
      {/* A polished aluminium tongue where the key docks */}
      <RoundedBox
        args={[0.46, 0.1, 0.12]}
        radius={0.03}
        position={[0, -0.6, 0]}
        material={polished}
      />
    </group>
  )
}
