import * as THREE from 'three'

// A hard-stepped gradient ramp for MeshToonMaterial — gives the flat, banded
// "comic" shading (no smooth falloff). Shared across grass / ground / desk.
export function makeToonGradient(steps = 4): THREE.DataTexture {
  const data = new Uint8Array(steps * 4)
  for (let i = 0; i < steps; i++) {
    const v = Math.round((i / (steps - 1)) * 255)
    data[i * 4] = v
    data[i * 4 + 1] = v
    data[i * 4 + 2] = v
    data[i * 4 + 3] = 255
  }
  const tex = new THREE.DataTexture(data, steps, 1, THREE.RGBAFormat)
  tex.minFilter = THREE.NearestFilter
  tex.magFilter = THREE.NearestFilter
  tex.generateMipmaps = false
  tex.needsUpdate = true
  return tex
}

// OutlineEffect reads this per-material flag. Use it to suppress ink lines on
// dense/huge meshes (grass blades, the ground dome) where outlines add noise.
export function disableOutline(mat: THREE.Material) {
  mat.userData.outlineParameters = { visible: false }
  return mat
}

// Tune the ink line on a per-material basis (thicker for hero objects).
export function setOutline(
  mat: THREE.Material,
  thickness: number,
  color: [number, number, number] = [0, 0, 0]
) {
  mat.userData.outlineParameters = { thickness, color, alpha: 1, visible: true }
  return mat
}
