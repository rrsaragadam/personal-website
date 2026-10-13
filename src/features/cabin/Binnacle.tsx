'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import { LIVERIES, type Livery } from '@/features/livery/liveries'
import { useLivery } from '@/features/livery/useLivery'
import { materials } from '@/features/console/materials'
import { MONO, SANS, textTexture } from '@/features/console/textures'
import {
  ITEM_COUNT,
  useConsole,
  type Mode,
} from '@/features/console/useConsole'
import { litAmount, useIgnition } from '@/features/console/useIgnition'

const W = 0.46
const H = 0.15
const DIALS = [
  { x: -0.15, r: 0.05 },
  { x: 0, r: 0.066 },
  { x: 0.15, r: 0.05 },
]
const ARC = THREE.MathUtils.degToRad(150)

const GEAR: Record<Mode, [string, string]> = {
  home: ['N', 'Ready'],
  projects: ['1', 'Projects'],
  work: ['2', 'Work'],
  reading: ['3', 'Reading'],
  about: ['4', 'About'],
  contact: ['K', 'Contact'],
}

type Draw = (ctx: CanvasRenderingContext2D, s: number) => void

// Ticks around a dial face, every `n`th one long. `from`/`to` are clockwise
// angles from twelve o'clock.
function ticks(
  ctx: CanvasRenderingContext2D,
  s: number,
  count: number,
  { from = -Math.PI, to = Math.PI, major = 5, colour = '#f2f2f5' } = {}
) {
  const c = s / 2
  const full = Math.abs(to - from - Math.PI * 2) < 1e-3
  const steps = full ? count : count - 1
  for (let i = 0; i < count; i++) {
    const a = from + ((to - from) * i) / Math.max(1, steps) - Math.PI / 2
    const long = i % major === 0
    ctx.strokeStyle = long ? colour : 'rgba(242,242,245,0.35)'
    ctx.lineWidth = long ? s * 0.012 : s * 0.006
    const r1 = c * 0.94
    const r2 = c * (long ? 0.8 : 0.87)
    ctx.beginPath()
    ctx.moveTo(c + Math.cos(a) * r1, c + Math.sin(a) * r1)
    ctx.lineTo(c + Math.cos(a) * r2, c + Math.sin(a) * r2)
    ctx.stroke()
  }
}

function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  colour: string,
  font = MONO,
  weight = 500
) {
  ctx.fillStyle = colour
  ctx.font = `${weight} ${size}px ${font}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
}

// Each dial is two OLED layers a few millimetres apart (scale behind,
// numerals in front) so they shift against each other as you move, the way
// the Luce cluster's stacked panels do.
function Dial({
  r,
  back,
  front,
  children,
}: {
  r: number
  back: Draw
  front: Draw
  children?: React.ReactNode
}) {
  const m = materials()
  const startedAt = useIgnition((s) => s.startedAt)
  const layers = useMemo(
    () => [
      textTexture(512, 512, (ctx, s) => back(ctx, s)),
      textTexture(512, 512, (ctx, s) => front(ctx, s)),
    ],
    // Repainted below; created once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  useEffect(() => {
    layers[0].repaint((ctx, s) => back(ctx, s))
    layers[1].repaint((ctx, s) => front(ctx, s))
  }, [back, front, layers])

  const mats = useRef<THREE.MeshBasicMaterial[]>([])
  useFrame(() => {
    const lit = litAmount(startedAt, 0.25, 0.8)
    for (const mat of mats.current) mat?.color.setScalar(lit)
  })

  const capAngle = 0.5
  const capR = r / Math.sin(capAngle)

  return (
    <group>
      {/* Black well */}
      <mesh position-z={-0.012}>
        <circleGeometry args={[r, 64]} />
        <meshBasicMaterial color="#030304" />
      </mesh>
      {layers.map((l, i) => (
        <mesh key={i} position-z={i ? -0.004 : -0.011}>
          <circleGeometry args={[r * 0.98, 64]} />
          <meshBasicMaterial
            ref={(mat) => {
              if (mat) mats.current[i] = mat
            }}
            map={l.tex}
            transparent
            toneMapped={false}
          />
        </mesh>
      ))}
      {children}
      {/* Polished bezel and a convex lens */}
      <mesh position-z={0.012} material={m.aluminiumPolished}>
        <torusGeometry args={[r + 0.002, 0.0035, 20, 96]} />
      </mesh>
      <mesh
        position-z={0.012 - capR * Math.cos(capAngle)}
        rotation-x={Math.PI / 2}
        material={m.glass}
      >
        <sphereGeometry args={[capR, 64, 12, 0, Math.PI * 2, 0, capAngle]} />
      </mesh>
    </group>
  )
}

function Needle({
  length,
  width,
  colour,
  needle,
}: {
  length: number
  width: number
  colour: string
  needle: React.RefObject<THREE.Group | null>
}) {
  return (
    <group ref={needle} position-z={0.001}>
      <mesh position-y={length * 0.4}>
        <boxGeometry args={[width, length, 0.0015]} />
        <meshBasicMaterial color={colour} toneMapped={false} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} position-z={0.002}>
        <cylinderGeometry args={[width * 2.4, width * 2.4, 0.004, 24]} />
        <meshStandardMaterial color="#d9dbe0" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  )
}

// The driver's cluster: a milled aluminium face with three round cut-outs,
// mounted on the steering column. Left reads the section like a gear
// indicator, the centre needle shows how far through it you are (after a
// full 360° sweep at start-up), and the right shows the finish.
export function Binnacle(props: ThreeElements['group']) {
  const m = materials()
  const mode = useConsole((s) => s.mode)
  const index = useConsole((s) => s.index)
  const livery = useLivery((s) => s.livery)
  const startedAt = useIgnition((s) => s.startedAt)
  const accent = livery.accent[0]
  const centre = useRef<THREE.Group>(null)
  const right = useRef<THREE.Group>(null)
  const needleAngle = useRef(-ARC)
  const finishAngle = useRef(0)

  const face = useMemo(() => {
    const shape = new THREE.Shape()
    const rr = H / 2
    shape.absarc(-W / 2 + rr, 0, rr, Math.PI / 2, (Math.PI * 3) / 2, false)
    shape.absarc(W / 2 - rr, 0, rr, -Math.PI / 2, Math.PI / 2, false)
    for (const d of DIALS) {
      const hole = new THREE.Path()
      hole.absarc(d.x, 0, d.r + 0.004, 0, Math.PI * 2, true)
      shape.holes.push(hole)
    }
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.012,
      bevelEnabled: true,
      bevelThickness: 0.003,
      bevelSize: 0.003,
      bevelSegments: 4,
      curveSegments: 64,
    })
  }, [])

  const count = ITEM_COUNT[mode]
  const [gear, gearName] = GEAR[mode]

  const leftBack = useMemo<Draw>(
    () => (ctx, s) => {
      ctx.fillStyle = '#060608'
      ctx.fillRect(0, 0, s, s)
      ticks(ctx, s, 60)
    },
    []
  )
  const leftFront = useMemo<Draw>(
    () => (ctx, s) => {
      label(ctx, gear, s / 2, s * 0.47, s * 0.36, accent, SANS, 600)
      label(ctx, gearName.toUpperCase(), s / 2, s * 0.72, s * 0.065, '#cfd0d6')
    },
    [gear, gearName, accent]
  )

  const centreBack = useMemo<Draw>(
    () => (ctx, s) => {
      ctx.fillStyle = '#060608'
      ctx.fillRect(0, 0, s, s)
      ticks(ctx, s, 41, { from: -ARC, to: ARC, major: 10 })
      // One lacquered mark per item in this section.
      const c = s / 2
      for (let i = 0; i < count; i++) {
        const a = -ARC + (2 * ARC * i) / Math.max(1, count - 1) - Math.PI / 2
        ctx.fillStyle = accent
        ctx.beginPath()
        ctx.arc(
          c + Math.cos(a) * c * 0.7,
          c + Math.sin(a) * c * 0.7,
          s * 0.016,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
    },
    [count, accent]
  )
  const centreFront = useMemo<Draw>(
    () => (ctx, s) => {
      const n = (v: number) => String(v).padStart(2, '0')
      label(
        ctx,
        count > 1 ? n(index + 1) : '—',
        s / 2,
        s * 0.68,
        s * 0.12,
        '#f2f2f5'
      )
      label(
        ctx,
        count > 1 ? `OF ${n(count)}` : 'RS',
        s / 2,
        s * 0.79,
        s * 0.045,
        'rgba(242,242,245,0.55)'
      )
    },
    [index, count]
  )

  const rightBack = useMemo<Draw>(
    () => (ctx, s) => {
      ctx.fillStyle = '#060608'
      ctx.fillRect(0, 0, s, s)
      ticks(ctx, s, 48, { major: 8 })
      const c = s / 2
      LIVERIES.forEach((l: Livery, i) => {
        const a = (i / LIVERIES.length) * Math.PI * 2 - Math.PI / 2
        ctx.fillStyle = l.paint
        ctx.beginPath()
        ctx.arc(
          c + Math.cos(a) * c * 0.66,
          c + Math.sin(a) * c * 0.66,
          s * (l.id === livery.id ? 0.04 : 0.026),
          0,
          Math.PI * 2
        )
        ctx.fill()
      })
    },
    [livery]
  )
  const rightFront = useMemo<Draw>(
    () => (ctx, s) => {
      label(ctx, livery.code, s / 2, s * 0.43, s * 0.11, '#f2f2f5', MONO, 600)
      label(ctx, livery.name.toUpperCase(), s / 2, s * 0.58, s * 0.05, accent)
    },
    [livery, accent]
  )

  useFrame((_, dt) => {
    const lit = litAmount(startedAt, 0.25, 0.8) > 0.01
    if (centre.current) centre.current.visible = lit
    if (right.current) right.current.visible = lit
    const since = startedAt ? (performance.now() - startedAt) / 1000 : 0
    const k = 1 - Math.exp(-dt * 6)
    const target = count > 1 ? -ARC + (2 * ARC * index) / (count - 1) : -ARC
    if (startedAt && since > 0.4 && since < 1.9) {
      // A full turn of the dial, easing in and out.
      const p = (since - 0.4) / 1.5
      needleAngle.current =
        -ARC + Math.PI * 2 * (0.5 - Math.cos(p * Math.PI) / 2)
    } else if (since >= 1.9) {
      needleAngle.current += (target - needleAngle.current) * k
    }
    if (centre.current) centre.current.rotation.z = -needleAngle.current

    const fi = LIVERIES.indexOf(livery)
    const ft = (fi / LIVERIES.length) * Math.PI * 2
    let d = ft - finishAngle.current
    d = Math.atan2(Math.sin(d), Math.cos(d))
    finishAngle.current += d * k
    if (right.current) right.current.rotation.z = -finishAngle.current
  })

  return (
    <group {...props}>
      {/* Housing */}
      <RoundedBox
        args={[W + 0.03, H + 0.03, 0.06]}
        radius={0.03}
        smoothness={6}
        position-z={-0.035}
        material={m.anodised}
      />
      <mesh geometry={face} position-z={-0.004} material={m.aluminium} />
      <group position-x={DIALS[0].x}>
        <Dial r={DIALS[0].r} back={leftBack} front={leftFront} />
      </group>
      <group position-x={DIALS[1].x}>
        <Dial r={DIALS[1].r} back={centreBack} front={centreFront}>
          <Needle
            length={DIALS[1].r * 0.95}
            width={0.0022}
            colour="#e8e9ee"
            needle={centre}
          />
        </Dial>
      </group>
      <group position-x={DIALS[2].x}>
        <Dial r={DIALS[2].r} back={rightBack} front={rightFront}>
          <Needle
            length={DIALS[2].r * 0.55}
            width={0.0018}
            colour={accent}
            needle={right}
          />
        </Dial>
      </group>
    </group>
  )
}
