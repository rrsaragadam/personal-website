'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

// Seated to the domed grass surface near the desk sides (lower than the dome's peak).
const GROUND_Y = -1.5

// Low-poly rounded rock: an icosahedron with per-vertex noise displacement,
// flat-shaded for a stylized clay look. Geometry is built once per rock.
function makeRockGeometry(seed: number, radius: number) {
  const geo = new THREE.IcosahedronGeometry(radius, 1)
  const pos = geo.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const n =
      Math.sin(v.x * 3.1 + seed) * 0.18 +
      Math.cos(v.y * 2.7 + seed * 1.7) * 0.14 +
      Math.sin(v.z * 3.5 + seed * 0.5) * 0.12
    v.multiplyScalar(1 + n)
    v.y *= 0.8 // squash slightly so rocks sit low
    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geo.computeVertexNormals()
  return geo
}

interface RockDef {
  position: [number, number, number]
  radius: number
  seed: number
  rotation: number
  color: string
}

const ROCKS: RockDef[] = [
  { position: [-3.6, GROUND_Y + 0.1, 1.2], radius: 0.4, seed: 1.3, rotation: 0.4, color: '#8a8782' },
  { position: [-3.0, GROUND_Y + 0.05, 1.9], radius: 0.26, seed: 4.1, rotation: 1.1, color: '#9a958d' },
  { position: [3.7, GROUND_Y + 0.12, 1.0], radius: 0.46, seed: 2.7, rotation: 2.2, color: '#807d78' },
  { position: [3.2, GROUND_Y + 0.04, 1.7], radius: 0.22, seed: 5.5, rotation: 0.8, color: '#979289' },
  { position: [-3.9, GROUND_Y + 0.06, -0.6], radius: 0.3, seed: 3.3, rotation: 1.7, color: '#8f8b84' },
  { position: [3.9, GROUND_Y + 0.07, -0.4], radius: 0.28, seed: 6.2, rotation: 0.2, color: '#888580' },
]

export function Rocks() {
  const rocks = useMemo(
    () => ROCKS.map((r) => ({ ...r, geo: makeRockGeometry(r.seed, r.radius) })),
    []
  )
  return (
    <group>
      {rocks.map((r, i) => (
        <mesh
          key={i}
          geometry={r.geo}
          position={r.position}
          rotation-y={r.rotation}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={r.color} roughness={0.95} metalness={0} flatShading />
        </mesh>
      ))}
    </group>
  )
}
