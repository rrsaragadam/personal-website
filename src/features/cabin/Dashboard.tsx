'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLivery } from '@/features/livery/useLivery'
import { materials } from '@/features/console/materials'

const BASE = new THREE.Color('#0f1014')

// The cabin as one clean volume: a long leather dashboard, a machined trim
// line that runs its full width, and a centre tunnel. The leather takes a
// faint tint from the finish.
// A rounded leather member running between two points.
function Beam({
  from,
  to,
}: {
  from: [number, number, number]
  to: [number, number, number]
}) {
  const m = materials()
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = b.clone().sub(a)
    return {
      position: a.clone().add(b).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dir.clone().normalize()
      ),
      length: dir.length(),
    }
  }, [from, to])
  return (
    <mesh position={position} quaternion={quaternion} material={m.leather}>
      <capsuleGeometry args={[0.07, length, 8, 32]} />
    </mesh>
  )
}

// Side profile of the dashboard: x runs toward the nose, y is height.
function dashProfile() {
  const s = new THREE.Shape()
  s.moveTo(0.04, 0.6)
  s.lineTo(0.04, 0.64)
  s.quadraticCurveTo(0.04, 0.715, -0.012, 0.72)
  s.quadraticCurveTo(-0.03, 0.73, 0.0, 0.77)
  s.quadraticCurveTo(0.08, 0.86, 0.45, 0.865)
  s.lineTo(1.1, 0.82)
  s.lineTo(1.1, 0.0)
  // Down into the footwell, under a knee recess.
  s.lineTo(0.42, 0.0)
  s.lineTo(0.42, 0.42)
  s.quadraticCurveTo(0.42, 0.52, 0.2, 0.55)
  s.lineTo(0.04, 0.6)
  return new THREE.ExtrudeGeometry(s, {
    depth: 3.2,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.03,
    bevelSegments: 8,
    curveSegments: 32,
  })
}

export function Dashboard() {
  const m = materials()
  const livery = useLivery((s) => s.livery)
  const tint = useMemo(
    () => BASE.clone().lerp(new THREE.Color(livery.paint), 0.03),
    [livery]
  )
  const profile = useMemo(() => dashProfile(), [])
  const trim = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: livery.accent[0],
        emissive: livery.accent[0],
        emissiveIntensity: 0.35,
        roughness: 0.4,
      }),
    [livery]
  )

  useFrame((_, dt) => {
    m.leather.color.lerp(tint, 1 - Math.exp(-dt * 3))
  })

  return (
    <group>
      {/* One continuous profile, extruded across the cabin: fascia, a
          rolled lip toward the driver, and a long top under the glass */}
      <mesh
        geometry={profile}
        rotation-y={Math.PI / 2}
        position-x={-1.3}
        material={m.leather}
      />
      {/* Polished bead along the lip, with a hairline of the finish */}
      <mesh
        position={[0.3, 0.715, 0.012]}
        rotation-z={Math.PI / 2}
        material={m.aluminiumPolished}
      >
        <cylinderGeometry args={[0.006, 0.006, 3.1, 24]} />
      </mesh>
      <mesh position={[0.3, 0.704, 0.01]} material={trim}>
        <boxGeometry args={[3.1, 0.0025, 0.012]} />
      </mesh>

      {/* A-pillars: they frame the windscreen at the edges
          of the view, so the cabin reads as a space around you */}
      <Beam from={[-0.78, 0.84, -0.9]} to={[-0.62, 1.58, -0.12]} />
      <Beam from={[1.38, 0.84, -0.9]} to={[1.22, 1.58, -0.12]} />

      {/* Floor */}
      <mesh position={[0.3, 0.02, 0.2]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[3.2, 2]} />
        <meshStandardMaterial color="#0b0b0d" roughness={0.9} />
      </mesh>

      {/* Centre tunnel between the seats */}
      <RoundedBox
        args={[0.24, 0.68, 0.78]}
        radius={0.06}
        smoothness={6}
        position={[0.38, 0.34, 0.2]}
        material={m.leather}
      />
    </group>
  )
}
