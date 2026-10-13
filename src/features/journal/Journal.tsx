'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { LEAVES } from './spreads'
import { SECTIONS } from './sections'
import { Leaf, LEAF_H, LEAF_W } from './Leaf'
import { useJournal } from './useJournal'
import { paintedTexture } from './canvas'
import { kraft } from './ink'
import type { Spot } from './pages/types'

// The page block under the printed leaves: forty-odd blank pages that sit
// on the right when closed and shift left as you read.
const BLOCK = 0.022

// The whole journal: the leaves, the block of blank pages beneath them, the
// back cover, two staples in the fold and a ribbon marker.
export function Journal() {
  const spread = useJournal((s) => s.spread)
  const { go, next, prev, open } = useJournal.getState()
  const [hoverCover, setHoverCover] = useState(false)

  // Stagger multi-page jumps so the leaves fan over one after another.
  const previous = useRef(spread)
  const delays = useMemo(() => {
    const from = previous.current
    previous.current = spread
    return LEAVES.map((_, i) => {
      const order = spread > from ? i - from : from - 1 - i
      return Math.max(0, order) * 0.08
    })
  }, [spread])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') useJournal.getState().next()
      if (e.key === 'ArrowLeft') useJournal.getState().prev()
      if (e.key === 'Escape') useJournal.getState().close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const setPointer = (on: boolean) => {
    document.body.style.cursor = on ? 'pointer' : ''
  }

  const onSpot =
    (index: number) => (spot: Spot | null, side: 'front' | 'back') => {
      if (spread === 0) return open()
      if (spot?.action.type === 'link') {
        window.open(
          spot.action.href,
          spot.action.href.startsWith('mailto:') ? '_self' : '_blank',
          'noopener'
        )
        return
      }
      if (spot?.action.type === 'spread') return go(spot.action.to)
      // Clicking a page turns it: right-hand pages forward, left-hand back.
      if (side === 'front' && index >= spread) next()
      else prev()
    }

  const fraction = spread / LEAVES.length
  const base = {
    right: BLOCK * (1 - fraction) + 0.004,
    left: BLOCK * fraction + 0.004,
  }

  const backCover = useMemo(
    () => paintedTexture(512, 797, (ctx, w, h) => kraft(ctx, w, h, 101)),
    []
  )
  const edges = useMemo(() => pageEdges(), [])

  return (
    <group rotation-y={0.0}>
      {/* Back cover */}
      <mesh
        position={[LEAF_W / 2, 0.001, 0]}
        rotation-x={-Math.PI / 2}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[LEAF_W, LEAF_H]} />
        <meshStandardMaterial map={backCover} roughness={0.85} />
      </mesh>
      {/* Blank page blocks, either side of the fold */}
      <PageBlock x={LEAF_W / 2} height={BLOCK * (1 - fraction)} edges={edges} />
      <PageBlock x={-LEAF_W / 2} height={BLOCK * fraction} edges={edges} />

      {LEAVES.map((leaf, i) => {
        const section = SECTIONS.find((s) => s.spread === i + 1)
        const tabIndex = section ? SECTIONS.indexOf(section) : -1
        return (
          <Leaf
            key={i}
            index={i}
            count={LEAVES.length}
            front={leaf.front}
            back={leaf.back}
            turned={i < spread}
            delay={delays[i]}
            lift={i === 0 && spread === 0 && hoverCover ? 0.1 : 0}
            base={base}
            kind={i === 0 ? 'cover' : 'page'}
            tab={
              section
                ? {
                    label: section.label,
                    color: section.color,
                    z: -LEAF_H / 2 + 0.16 + tabIndex * 0.2,
                    spread: section.spread,
                  }
                : undefined
            }
            onSpot={onSpot(i)}
            onHover={(on) => {
              setPointer(on)
              if (i === 0) setHoverCover(on)
            }}
          />
        )
      })}

      <Staples
        height={BLOCK + 0.006 + LEAVES.length * 0.0022}
        visible={spread > 0}
      />
    </group>
  )
}

function PageBlock({
  x,
  height,
  edges,
}: {
  x: number
  height: number
  edges: THREE.Texture
}) {
  if (height <= 0) return null
  return (
    <mesh position={[x, 0.002 + height / 2, 0]} castShadow receiveShadow>
      <boxGeometry args={[LEAF_W - 0.004, height, LEAF_H - 0.004]} />
      <meshStandardMaterial attach="material-0" map={edges} roughness={0.95} />
      <meshStandardMaterial attach="material-1" map={edges} roughness={0.95} />
      <meshStandardMaterial
        attach="material-2"
        color="#efe6d2"
        roughness={0.95}
      />
      <meshStandardMaterial
        attach="material-3"
        color="#efe6d2"
        roughness={0.95}
      />
      <meshStandardMaterial attach="material-4" map={edges} roughness={0.95} />
      <meshStandardMaterial attach="material-5" map={edges} roughness={0.95} />
    </mesh>
  )
}

// Stacked page edges: fine cream lines with slightly darker gaps.
function pageEdges() {
  return paintedTexture(256, 64, (ctx, w, h) => {
    ctx.fillStyle = '#e9dfca'
    ctx.fillRect(0, 0, w, h)
    for (let y = 0; y < h; y += 2) {
      ctx.fillStyle = `rgba(120, 100, 70, ${0.12 + Math.random() * 0.12})`
      ctx.fillRect(0, y, w, 1)
    }
  })
}

// Saddle-stitched: two staples through the fold of the centre spread.
function Staples({ height, visible }: { height: number; visible: boolean }) {
  return (
    <group visible={visible}>
      {[-0.4, 0.4].map((z) => (
        <mesh key={z} position={[0, height, z]} castShadow>
          <boxGeometry args={[0.006, 0.003, 0.12]} />
          <meshStandardMaterial color="#c9cbd0" metalness={1} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}
