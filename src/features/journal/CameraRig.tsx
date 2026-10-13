'use client'

import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { LEAF_H, LEAF_W } from './Leaf'
import { useJournal } from './useJournal'

const eye = new THREE.Vector3()
const look = new THREE.Vector3()

// Seated at the table. Closed, you look across the journal to the forest;
// open, you lean over it until the spread fills your view. The cursor moves
// your head a little.
export function CameraRig() {
  const { camera, size } = useThree()
  const spread = useJournal((s) => s.spread)
  const side = useJournal((s) => s.side)
  const pointer = useRef({ x: 0, y: 0 })
  const current = useRef<{ eye: THREE.Vector3; look: THREE.Vector3 } | null>(
    null
  )

  useFrame((state, dt) => {
    const cam = camera as THREE.PerspectiveCamera
    const aspect = size.width / size.height
    const portrait = aspect < 1
    pointer.current.x +=
      (state.pointer.x - pointer.current.x) * (1 - Math.exp(-dt * 3))
    pointer.current.y +=
      (state.pointer.y - pointer.current.y) * (1 - Math.exp(-dt * 3))

    if (spread === 0) {
      // Low and across the table, so the treeline shows above the far edge.
      const d = portrait ? 4.4 : 2.7
      look.set(LEAF_W / 2 + (portrait ? 0 : -0.1), 0, -0.1)
      eye.set(look.x - 0.35, d * 0.3, look.z + d)
    } else {
      // Over the spread, far enough back to frame it with a margin.
      const width = portrait ? LEAF_W * 1.12 : LEAF_W * 2 * 1.14
      const height = LEAF_H * 1.16
      const fov = THREE.MathUtils.degToRad(cam.fov)
      const fit = Math.max(height, width / aspect) / (2 * Math.tan(fov / 2))
      const cx = portrait ? (side === 'left' ? -LEAF_W / 2 : LEAF_W / 2) : 0
      look.set(cx, 0, 0.02)
      // Tilted a little toward you, as if sitting, not hovering.
      eye.set(cx, fit * 0.96, 0.02 + fit * 0.28)
    }
    eye.x += pointer.current.x * 0.06
    eye.z -= pointer.current.y * 0.04

    if (!current.current)
      current.current = { eye: eye.clone(), look: look.clone() }
    const c = current.current
    const k = 1 - Math.exp(-dt * 2.4)
    c.eye.lerp(eye, k)
    c.look.lerp(look, k)
    cam.position.copy(c.eye)
    cam.lookAt(c.look)
  })

  return null
}
