'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import type { Livery } from '@/features/livery/liveries'
import { useLivery } from '@/features/livery/useLivery'
import { PROFILE } from '@/content/profile'
import { materials } from './materials'
import { textTexture, MONO, SANS } from './textures'
import { useIgnition } from './useIgnition'

const W = 1.5
const H = 0.92

function drawScreen(l: Livery) {
  return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = '#060608'
    ctx.fillRect(0, 0, w, h)
    // The finish itself, as a soft swatch of its gradient.
    const g = ctx.createRadialGradient(
      w * 0.78,
      h * 0.42,
      10,
      w * 0.78,
      h * 0.42,
      h * 0.7
    )
    g.addColorStop(0, l.gradient[2])
    g.addColorStop(0.35, l.paint)
    g.addColorStop(0.75, l.gradient[1])
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    const x = w * 0.07
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = `500 ${h * 0.05}px ${MONO}`
    ctx.fillText('FINISH  ·  ' + l.code, x, h * 0.17)
    ctx.fillStyle = '#ffffff'
    ctx.font = `600 ${h * 0.15}px ${SANS}`
    const [a, b] = l.name.split(' ')
    ctx.fillText(a, x, h * 0.42)
    ctx.fillText(b ?? '', x, h * 0.58)
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.fillRect(x, h * 0.74, w * 0.86, 2)
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.font = `500 ${h * 0.05}px ${SANS}`
    ctx.fillText(PROFILE.name, x, h * 0.86)
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.fillText(PROFILE.role, w - x, h * 0.86)
    ctx.textAlign = 'left'
  }
}

// The centre screen: a glass-covered OLED that names the current finish and
// fades up at ignition.
export function Display(props: ThreeElements['group']) {
  const m = materials()
  const livery = useLivery((s) => s.livery)
  const startedAt = useIgnition((s) => s.startedAt)
  const screen = useRef<THREE.MeshBasicMaterial>(null)

  const tex = useMemo(
    () => textTexture(1024, 628, drawScreen(useLivery.getState().livery)),
    []
  )
  useEffect(() => tex.repaint(drawScreen(livery)), [livery, tex])

  useFrame(() => {
    const t = (performance.now() - startedAt) / 1000
    const b = THREE.MathUtils.clamp((t - 0.3) / 0.8, 0, 1)
    screen.current?.color.setScalar(0.08 + 0.92 * b * b)
  })

  return (
    <group {...props}>
      <RoundedBox
        args={[W + 0.08, 0.04, H + 0.08]}
        radius={0.02}
        position-y={0.01}
        material={m.anodised}
      />
      <mesh rotation-x={-Math.PI / 2} position-y={0.032}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial ref={screen} map={tex.tex} toneMapped={false} />
      </mesh>
      <RoundedBox
        args={[W + 0.08, 0.02, H + 0.08]}
        radius={0.01}
        position-y={0.045}
        material={m.glass}
      />
    </group>
  )
}
