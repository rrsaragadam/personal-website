'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { PROJECTS } from '@/content/projects'
import { offset, progress, ramp } from '@/features/film/scroll'
import { anodised, finishes } from '@/features/studio/finishes'
import { engravedSkin, engraving, tracked } from '@/features/studio/engrave'
import { BASE_ACCENT, useAccent } from '@/features/studio/useAccent'
import { MONO, SANS } from '@/features/studio/textures'
import { pointer } from '@/features/studio/pointer'

const W = 0.52
const H = 2.1
const T = 0.035
// Where the rivet passes through each chip, measured from its centre.
const PIVOT = -H / 2 + 0.2

interface Chip {
  finish: string
  code: string
  number?: string
  title?: string
  year?: string
}

// The deck: plain sample chips either side, your projects in the middle.
const BLANKS: Chip[] = [
  { finish: '#8d8f96', code: 'TI-04' },
  { finish: '#3a3b42', code: 'GR-09' },
  { finish: '#c9b48f', code: 'CH-02' },
  { finish: '#6d7f86', code: 'SL-07' },
  { finish: '#2b2c33', code: 'NX-01' },
]
const CHIPS: Chip[] = [
  BLANKS[0],
  BLANKS[1],
  ...PROJECTS.map((p, i) => ({
    finish: p.finish,
    code: p.code,
    number: String(i + 1).padStart(2, '0'),
    title: p.title,
    year: p.year,
  })),
  BLANKS[2],
  BLANKS[3],
  BLANKS[4],
]
const FIRST = 2

// Holds on each project for most of its stretch of scroll, then turns to
// the next, the way a detent holds a dial.
function focusFor(p: number) {
  const n = PROJECTS.length
  const x = Math.min(n - 1, Math.max(0, p * n - 0.5))
  const i = Math.floor(x)
  return FIRST + i + ramp(x - i, 0.3, 0.7)
}

// The projects act: a fan of anodised aluminium sample chips on a polished
// rivet. Scrolling turns the fan; the chip in focus swings out toward you
// and its colour floods the studio.
export function SampleFan() {
  const group = useRef<THREE.Group>(null)
  const chips = useRef<(THREE.Group | null)[]>([])
  const viewport = useThree((s) => s.viewport)
  const portrait = viewport.aspect < 1
  const setAccent = useAccent((s) => s.setAccent)
  const { polished } = finishes()

  useFrame(() => {
    const g = group.current
    if (!g) return
    const o = offset('projects')
    const f = focusFor(progress('projects'))

    g.position.set(
      portrait ? 0 : -viewport.width * 0.2,
      (portrait ? -0.2 : -1.0) - o * viewport.height * 1.1,
      0
    )
    g.rotation.set(
      -0.2 + pointer.y * -0.08,
      0.32 + pointer.x * 0.16 + o * 0.4,
      0
    )
    g.scale.setScalar(portrait ? 0.62 : 0.95)
    g.visible = Math.abs(o) < 1.2

    chips.current.forEach((chip, i) => {
      if (!chip) return
      const d = i - f
      const near = Math.max(0, 1 - Math.abs(d))
      // Fan out from the focused chip, leaving a gap around it.
      chip.rotation.z =
        -0.05 - d * 0.12 - Math.sign(d) * 0.12 * Math.min(1, Math.abs(d))
      chip.position.z = i * T * 1.05 + near * 0.32
      chip.position.y = near * 0.12
    })

    const focused = Math.round(f)
    setAccent(Math.abs(o) < 0.5 ? CHIPS[focused].finish : BASE_ACCENT)
  })

  return (
    <group ref={group}>
      {CHIPS.map((chip, i) => (
        <group key={chip.code} ref={(el) => void (chips.current[i] = el)}>
          <SampleChip chip={chip} />
        </group>
      ))}
      {/* The rivet */}
      <mesh rotation-x={Math.PI / 2} position={[0, 0, CHIPS.length * T * 0.5]}>
        <cylinderGeometry
          args={[0.07, 0.07, CHIPS.length * T * 1.2 + 0.5, 48]}
        />
        <primitive object={polished} attach="material" />
      </mesh>
    </group>
  )
}

function SampleChip({ chip }: { chip: Chip }) {
  const material = useMemo(() => anodised(chip.finish), [chip.finish])
  const mask = useMemo(
    () =>
      engraving(256, 1024, (ctx, w, h) => {
        // Rivet hole countersink ring
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(w / 2, h - 98, 46, 0, Math.PI * 2)
        ctx.stroke()
        ctx.font = `500 26px ${MONO()}`
        tracked(ctx, chip.code, 30, 64, 5)
        if (chip.number) {
          ctx.textAlign = 'right'
          ctx.fillText(chip.number, w - 30, 64)
          ctx.textAlign = 'left'
        }
        if (chip.title) {
          ctx.save()
          ctx.translate(w / 2 + 24, h - 190)
          ctx.rotate(-Math.PI / 2)
          ctx.font = `700 64px ${SANS()}`
          ctx.fillText(chip.title, 0, 0)
          ctx.font = `400 24px ${MONO()}`
          tracked(ctx, chip.year ?? '', 0, 52, 6)
          ctx.restore()
        }
        // Fine hairline rule under the code
        ctx.fillRect(30, 86, w - 60, 2)
      }),
    [chip]
  )
  // Lasering anodised metal burns through the dye to bright aluminium.
  const skin = useMemo(() => engravedSkin(mask, '#d6d7db'), [mask])

  return (
    <group position={[0, -PIVOT, 0]}>
      <RoundedBox
        args={[W, H, T]}
        radius={0.016}
        smoothness={4}
        material={material}
        castShadow
        receiveShadow
      />
      <mesh position={[0, 0, T / 2 + 0.0008]} material={skin}>
        <planeGeometry args={[W, H]} />
      </mesh>
    </group>
  )
}
