'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import type { ThreeEvent } from '@react-three/fiber'
import { FONT, paintedTexture } from './canvas'
import { useJournal } from './useJournal'

const TAB_W = 0.075
const TAB_H = 0.15

// A paper index tab stuck to the edge of a leaf, half of it showing. Clicking
// it opens the journal at that section.
export function Tab({
  label,
  color,
  z,
  spread,
  onHover,
}: {
  label: string
  color: string
  z: number
  spread: number
  onHover: (pointer: boolean) => void
}) {
  const go = useJournal((s) => s.go)

  const [front, back] = useMemo(() => {
    const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.fillStyle = color
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      ctx.fillRect(0, 0, w, h * 0.08)
      ctx.save()
      ctx.translate(w * 0.58, h / 2)
      ctx.rotate(Math.PI / 2)
      ctx.fillStyle = 'rgba(20, 20, 20, 0.85)'
      ctx.font = `700 ${w * 0.36}px ${FONT.hand()}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(label, 0, 0)
      ctx.restore()
    }
    const f = paintedTexture(128, 256, draw)
    const b = paintedTexture(128, 256, draw)
    b.wrapS = THREE.RepeatWrapping
    b.repeat.x = -1
    b.offset.x = 1
    return [f, b]
  }, [label, color])

  const handlers = {
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      go(spread)
    },
    onPointerMove: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      onHover(true)
    },
    onPointerOut: () => onHover(false),
  }

  // Tucked a third of the way under the page edge.
  return (
    <group position={[TAB_W * 0.2, 0.0004, z]} rotation-x={-Math.PI / 2}>
      <mesh castShadow {...handlers}>
        <planeGeometry args={[TAB_W, TAB_H]} />
        <meshStandardMaterial
          map={front}
          roughness={0.75}
          side={THREE.FrontSide}
        />
      </mesh>
      <mesh {...handlers}>
        <planeGeometry args={[TAB_W, TAB_H]} />
        <meshStandardMaterial
          map={back}
          roughness={0.75}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
