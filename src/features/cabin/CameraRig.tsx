'use client'

import { useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useConsole } from '@/features/console/useConsole'
import { useIgnition } from '@/features/console/useIgnition'
import { LANDSCAPE, PORTRAIT, type Pose } from './layout'
import { pointer } from './pointer'

const eye = new THREE.Vector3()
const look = new THREE.Vector3()
const normal = new THREE.Vector3()

// The visitor's head. It settles into the driver's seat when the key docks,
// leans in to read the control display whenever a section is open, and
// drifts a little with the mouse so the cabin has real depth.
export function CameraRig({
  focus,
}: {
  // The display's framing box: an object at its centre, facing out, with
  // `userData.width` and `userData.height` in metres.
  focus: RefObject<THREE.Object3D | null>
}) {
  const { camera, size } = useThree()
  const mode = useConsole((s) => s.mode)
  const started = useIgnition((s) => s.startedAt > 0)
  const current = useRef<{ eye: THREE.Vector3; look: THREE.Vector3 } | null>(
    null
  )

  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera
    const aspect = size.width / size.height
    const L = aspect < 1 ? PORTRAIT : LANDSCAPE
    const pose: Pose = started ? L.home : L.arrival
    let fov = pose.fov
    let sway = 1

    if (mode !== 'home' && focus.current) {
      // Square up to the display, just far enough back to see all of it.
      const f = focus.current
      f.getWorldPosition(look)
      normal.set(0, 0, 1).transformDirection(f.matrixWorld)
      const { width, height } = f.userData as { width: number; height: number }
      fov = aspect < 1 ? 50 : 40
      const t = Math.tan(THREE.MathUtils.degToRad(fov / 2))
      const d = Math.max(height / (2 * t), width / (2 * t * aspect))
      eye.copy(look).addScaledVector(normal, d)
      sway = 0.25
    } else {
      eye.set(...pose.eye)
      look.set(...pose.target)
    }
    eye.x += pointer.x * 0.035 * sway
    eye.y -= pointer.y * 0.02 * sway

    if (!current.current) {
      current.current = { eye: eye.clone(), look: look.clone() }
      cam.fov = fov
    }
    const c = current.current
    const k = 1 - Math.exp(-dt * (started ? 2.6 : 1.2))
    c.eye.lerp(eye, k)
    c.look.lerp(look, k)
    cam.position.copy(c.eye)
    cam.lookAt(c.look)
    cam.fov += (fov - cam.fov) * k
    cam.updateProjectionMatrix()
  })

  return null
}
