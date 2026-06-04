'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

export interface FitOptions {
  // Scale so the largest of the three dimensions equals this. Orientation-proof —
  // preferred for arbitrary models so a thin standing object never blows up.
  fitMax?: number
  // Scale the model so its larger horizontal footprint (X or Z) equals this.
  fitWidth?: number
  // Scale the model so its height (Y) equals this. Ignored if fitWidth is set.
  fitHeight?: number
  // World Y of the surface the model should rest on; the model's min-Y lands here.
  surfaceY?: number
  // Extra vertical nudge applied after seating (e.g. to sink into grass).
  yOffset?: number
  // Orientation applied BEFORE measuring/seating, so lay-flat/stand rotations
  // re-seat correctly on the surface. [x, y, z] radians.
  rotation?: [number, number, number]
}

// Loads a GLB, returns a normalized clone (own materials, shadows on, auto-fit + seated).
// Render with <primitive object={model} />. Only call this from a component that is
// conditionally mounted (USE_GLTF === true) so a missing file never suspends the scene.
export function useModel(url: string, opts: FitOptions = {}) {
  const { scene } = useGLTF(url)
  const { fitMax, fitWidth, fitHeight, surfaceY, yOffset, rotation } = opts
  const [rx, ry, rz] = rotation ?? [0, 0, 0]

  return useMemo(() => {
    const root = scene.clone(true)
    root.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      mesh.receiveShadow = true
      const m = mesh.material
      if (Array.isArray(m)) mesh.material = m.map((mm) => mm.clone())
      else if (m) mesh.material = (m as THREE.Material).clone()
    })

    // Apply orientation first, then measure the rotated bounds so seating is correct.
    root.rotation.set(rx, ry, rz)
    root.updateMatrixWorld(true)

    const box = new THREE.Box3().setFromObject(root)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    let s = 1
    if (fitMax) {
      const maxDim = Math.max(size.x, size.y, size.z)
      if (maxDim > 0) s = fitMax / maxDim
    } else if (fitWidth) {
      const maxHoriz = Math.max(size.x, size.z)
      if (maxHoriz > 0) s = fitWidth / maxHoriz
    } else if (fitHeight && size.y > 0) {
      s = fitHeight / size.y
    }

    // Seat the rotated, scaled model: recenter horizontally, drop min-Y onto surfaceY.
    const wrap = new THREE.Group()
    wrap.add(root)
    root.scale.setScalar(s)
    root.position.x = -center.x * s
    root.position.z = -center.z * s
    root.position.y = (surfaceY ?? 0) - box.min.y * s + (yOffset ?? 0)

    return wrap
  }, [scene, fitMax, fitWidth, fitHeight, surfaceY, yOffset, rx, ry, rz])
}

// Gather standard materials and prime emissive so the hover tween is visible.
export function collectHoverMaterials(root: THREE.Object3D) {
  const mats: THREE.MeshStandardMaterial[] = []
  root.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    list.forEach((m) => {
      const std = m as THREE.MeshStandardMaterial
      if (std && 'emissive' in std) {
        std.emissive = std.emissive ?? new THREE.Color('#ffffff')
        std.emissive.set('#ffffff')
        std.emissiveIntensity = 0
        mats.push(std)
      }
    })
  })
  return mats
}

export const preloadModel = (url: string) => useGLTF.preload(url)
