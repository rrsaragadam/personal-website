'use client'

import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { paintedTexture } from './canvas'
import { PAGE_H, PAGE_W } from './ink'
import type { Page, Spot } from './pages/types'
import { Tab } from './Tab'

export const LEAF_W = 0.9
export const LEAF_H = 1.4
const SEGMENTS = 36
const GAP = 0.0022
const DURATION = 0.95

export interface LeafProps {
  index: number
  count: number
  front: Page
  back: Page
  turned: boolean
  delay: number
  lift: number
  // The stack of loose pages under the leaves on each side, in metres.
  base: { left: number; right: number }
  kind: 'cover' | 'page'
  tab?: { label: string; color: string; z: number; spread: number }
  onSpot: (spot: Spot | null, side: 'front' | 'back') => void
  onHover: (pointer: boolean) => void
}

// One sheet of the journal, hinged at the spine. Turning it bends the paper:
// the free edge lags behind the fold, as a real page does when you lift it
// by the corner.
export function Leaf(props: LeafProps) {
  const { index, count, front, back, turned, delay, lift, base, kind, tab } =
    props

  const { geometry, frontTex, backTex, frontSpots, backSpots } = useMemo(() => {
    const frontSpots: Spot[] = []
    const backSpots: Spot[] = []
    const frontTex = paintedTexture(
      PAGE_W,
      PAGE_H,
      (ctx, w, h) => {
        frontSpots.length = 0
        front.paint(ctx, w, h, frontSpots)
      },
      front.images
    )
    const backTex = paintedTexture(
      PAGE_W,
      PAGE_H,
      (ctx, w, h) => {
        backSpots.length = 0
        back.paint(ctx, w, h, backSpots)
      },
      back.images
    )
    // Seen from above on the left, the back reads mirrored along the width.
    backTex.wrapS = THREE.RepeatWrapping
    backTex.repeat.x = -1
    backTex.offset.x = 1
    return {
      geometry: leafGeometry(),
      frontTex,
      backTex,
      frontSpots,
      backSpots,
    }
  }, [front, back])

  useEffect(
    () => () => {
      geometry.dispose()
      frontTex.dispose()
      backTex.dispose()
    },
    [geometry, frontTex, backTex]
  )

  const group = useRef<THREE.Group>(null)
  const tabRef = useRef<THREE.Group>(null)
  const anim = useRef({
    from: turned ? Math.PI : 0,
    to: turned ? Math.PI : 0,
    start: 0,
    angle: turned ? Math.PI : 0,
    lift: 0,
  })

  useEffect(() => {
    const a = anim.current
    a.from = a.angle
    a.to = turned ? Math.PI : 0
    a.start = performance.now() / 1000 + delay
  }, [turned, delay])

  useFrame((_, dt) => {
    const a = anim.current
    const t = Math.min(
      1,
      Math.max(0, (performance.now() / 1000 - a.start) / DURATION)
    )
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    a.lift += (lift - a.lift) * (1 - Math.exp(-dt * 8))
    const angle = a.from + (a.to - a.from) * eased + a.lift
    if (Math.abs(angle - a.angle) > 1e-5 || !geometry.userData.ready) {
      a.angle = angle
      bend(geometry, angle, kind === 'cover' ? 0.15 : 0.55)
      geometry.userData.ready = true
    }
    const g = group.current
    if (g) {
      // Settle on the right-hand stack before the turn, the left after.
      const k = Math.min(1, Math.max(0, angle / Math.PI))
      const right = base.right + (count - 1 - index) * GAP
      const left = base.left + index * GAP
      g.position.y = right + (left - right) * k
    }
    if (tabRef.current) {
      const {
        x,
        y,
        angle: edge,
      } = geometry.userData.tip as { x: number; y: number; angle: number }
      tabRef.current.position.set(x, y, 0)
      tabRef.current.rotation.z = edge
    }
  })

  const hit = (
    e: ThreeEvent<PointerEvent | MouseEvent>,
    side: 'front' | 'back'
  ) => {
    if (!e.uv) return null
    // On the back the texture runs mirrored.
    const u = side === 'front' ? e.uv.x : 1 - e.uv.x
    const px = u * PAGE_W
    const py = (1 - e.uv.y) * PAGE_H
    const spots = side === 'front' ? frontSpots : backSpots
    return (
      spots.find(
        (s) => px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h
      ) ?? null
    )
  }

  const handlers = (side: 'front' | 'back') => ({
    onClick: (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      props.onSpot(hit(e, side), side)
    },
    onPointerMove: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      props.onHover(true)
    },
    onPointerOut: () => props.onHover(false),
  })

  const paperProps =
    kind === 'cover'
      ? { roughness: 0.82, sheen: 0.25, sheenColor: '#e8c89a' }
      : { roughness: 0.95 }

  return (
    <group ref={group}>
      <mesh geometry={geometry} castShadow receiveShadow {...handlers('front')}>
        <meshPhysicalMaterial
          map={frontTex}
          side={THREE.FrontSide}
          {...paperProps}
        />
      </mesh>
      <mesh geometry={geometry} castShadow receiveShadow {...handlers('back')}>
        <meshPhysicalMaterial
          map={backTex}
          side={THREE.BackSide}
          {...paperProps}
        />
      </mesh>
      {tab && (
        <group ref={tabRef}>
          <Tab {...tab} onHover={props.onHover} />
        </group>
      )}
    </group>
  )
}

function leafGeometry() {
  const g = new THREE.BufferGeometry()
  const cols = SEGMENTS + 1
  const positions = new Float32Array(cols * 2 * 3)
  const uvs = new Float32Array(cols * 2 * 2)
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < 2; j++) {
      const k = i * 2 + j
      uvs[k * 2] = i / SEGMENTS
      uvs[k * 2 + 1] = j === 0 ? 1 : 0
    }
  }
  const index: number[] = []
  for (let i = 0; i < SEGMENTS; i++) {
    const a = i * 2
    const b = (i + 1) * 2
    // Wound so the front faces up while the leaf lies on the right.
    index.push(a, a + 1, b, b, a + 1, b + 1)
  }
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  g.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  g.setIndex(index)
  return g
}

// Lay the leaf out along an arc: at angle 0 it lies flat to the right of the
// spine, at π flat to the left. In between, the free edge trails the fold.
function bend(g: THREE.BufferGeometry, angle: number, curl: number) {
  const pos = g.attributes.position as THREE.BufferAttribute
  const dl = LEAF_W / SEGMENTS
  const lag = curl * Math.sin(Math.min(Math.PI, Math.max(0, angle)))
  let x = 0
  let y = 0
  let a = angle
  for (let i = 0; i <= SEGMENTS; i++) {
    const u = i / SEGMENTS
    a = angle - lag * u * u
    pos.setXYZ(i * 2, x, y, -LEAF_H / 2)
    pos.setXYZ(i * 2 + 1, x, y, LEAF_H / 2)
    x += Math.cos(a) * dl
    y += Math.sin(a) * dl
  }
  g.userData.tip = {
    x: pos.getX(SEGMENTS * 2),
    y: pos.getY(SEGMENTS * 2),
    angle: a,
  }
  pos.needsUpdate = true
  g.computeVertexNormals()
  g.computeBoundingSphere()
}
