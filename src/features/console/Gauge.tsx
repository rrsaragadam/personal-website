'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import { useLivery } from '@/features/livery/useLivery'
import { materials } from './materials'
import { textTexture, MONO } from './textures'
import { useIgnition } from './useIgnition'
import { useConsole } from './useConsole'

const SWEEP = THREE.MathUtils.degToRad(135)
const MAX = 8

function drawFace(accent: string) {
  return (ctx: CanvasRenderingContext2D, w: number) => {
    const c = w / 2
    ctx.fillStyle = '#07070a'
    ctx.beginPath()
    ctx.arc(c, c, c, 0, Math.PI * 2)
    ctx.fill()
    // Ticks: majors carry numerals, the top of the range is the accent.
    for (let i = 0; i <= MAX * 4; i++) {
      const v = i / 4
      const a = -Math.PI / 2 - SWEEP + (v / MAX) * SWEEP * 2
      const major = i % 4 === 0
      const red = v >= MAX - 1.5
      ctx.strokeStyle = red
        ? accent
        : major
          ? '#f2f2f5'
          : 'rgba(242,242,245,0.45)'
      ctx.lineWidth = major ? 7 : 3
      const r1 = c * 0.9
      const r2 = c * (major ? 0.76 : 0.83)
      ctx.beginPath()
      ctx.moveTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1)
      ctx.lineTo(c + Math.cos(a) * r2, c + Math.sin(a) * r2)
      ctx.stroke()
      if (major) {
        ctx.fillStyle = red ? accent : '#f2f2f5'
        ctx.font = `500 ${c * 0.13}px ${MONO}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(
          String(v),
          c + Math.cos(a) * c * 0.62,
          c + Math.sin(a) * c * 0.62
        )
      }
    }
    ctx.fillStyle = 'rgba(242,242,245,0.5)'
    ctx.font = `500 ${c * 0.08}px ${MONO}`
    ctx.textAlign = 'center'
    ctx.fillText('× 1000 / MIN', c, c * 1.45)
  }
}

// An analog needle over an OLED face, as in the Luce cluster. It sweeps the
// full range at ignition, idles with a faint tremor, and blips whenever the
// knobs click or a switch is thrown.
export function Gauge({
  radius: R = 0.4,
  ...props
}: ThreeElements['group'] & { radius?: number }) {
  const m = materials()
  const livery = useLivery((s) => s.livery)
  const startedAt = useIgnition((s) => s.startedAt)
  const needle = useRef<THREE.Group>(null)
  const value = useRef(0)
  const blipAt = useRef(-1e9)

  const face = useMemo(
    () =>
      textTexture(512, 512, drawFace(useLivery.getState().livery.accent[0])),
    []
  )
  useEffect(() => {
    face.repaint(drawFace(livery.accent[0]))
    blipAt.current = performance.now()
  }, [livery, face])

  const mode = useConsole((s) => s.mode)
  const index = useConsole((s) => s.index)
  useEffect(() => {
    blipAt.current = performance.now()
  }, [mode, index])

  useFrame((state, dt) => {
    const now = performance.now()
    const sinceStart = (now - startedAt) / 1000
    const sinceBlip = (now - blipAt.current) / 1000
    let target = 0.9 + Math.sin(state.clock.elapsedTime * 7) * 0.03
    // Ignition: rise to the redline, then fall back to idle.
    if (sinceStart < 0.6) target = MAX * (sinceStart / 0.6)
    else if (sinceStart < 1.5)
      target = THREE.MathUtils.lerp(MAX, 0.9, (sinceStart - 0.6) / 0.9)
    if (sinceBlip < 0.5) target += 2.6 * Math.sin((sinceBlip / 0.5) * Math.PI)
    value.current += (target - value.current) * (1 - Math.exp(-dt * 12))
    if (needle.current)
      needle.current.rotation.z = SWEEP - (value.current / MAX) * SWEEP * 2
  })

  return (
    <group {...props}>
      {/* Bezel */}
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={0.05}
        material={m.aluminiumPolished}
      >
        <torusGeometry args={[R + 0.02, 0.035, 32, 128]} />
      </mesh>
      <mesh position-y={0.015} material={m.anodised}>
        <cylinderGeometry args={[R + 0.05, R + 0.05, 0.03, 96]} />
      </mesh>
      {/* Face and needle share the face's plane */}
      <group rotation-x={-Math.PI / 2} position-y={0.032}>
        <mesh>
          <circleGeometry args={[R, 96]} />
          <meshBasicMaterial map={face.tex} toneMapped={false} />
        </mesh>
        <group ref={needle} position-z={0.012}>
          <mesh position-y={R * 0.38}>
            <boxGeometry args={[0.014, R * 0.9, 0.006]} />
            <meshBasicMaterial color={livery.accent[0]} toneMapped={false} />
          </mesh>
        </group>
        <mesh position-z={0.02}>
          <cylinderGeometry args={[0.045, 0.045, 0.02, 32]} />
          <meshStandardMaterial
            color="#1a1a1f"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      </group>
      {/* Glass */}
      <mesh position-y={0.06} material={m.glass}>
        <cylinderGeometry args={[R + 0.01, R + 0.01, 0.02, 96]} />
      </mesh>
    </group>
  )
}
