'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

// Things that live on the table with the journal: an enamel camp mug and a
// half-used pencil.
export function Props() {
  return (
    <>
      <Mug position={[2.1, 0, -1.3]} scale={0.8} />
      <Pencil position={[1.25, 0.022, 0.55]} rotation-y={0.35} />
    </>
  )
}

function Mug(props: React.ComponentProps<'group'>) {
  const body = useMemo(() => {
    const pts = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.36, 0),
      new THREE.Vector2(0.38, 0.02),
      new THREE.Vector2(0.4, 0.62),
      new THREE.Vector2(0.415, 0.64),
      new THREE.Vector2(0.4, 0.655),
      new THREE.Vector2(0.38, 0.64),
      new THREE.Vector2(0.37, 0.06),
      new THREE.Vector2(0, 0.06),
    ]
    return new THREE.LatheGeometry(pts, 64)
  }, [])

  return (
    <group {...props}>
      <mesh geometry={body} castShadow receiveShadow>
        <meshPhysicalMaterial
          color="#f1efe8"
          roughness={0.25}
          clearcoat={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Navy enamel rim */}
      <mesh position={[0, 0.645, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.4, 0.016, 12, 64]} />
        <meshPhysicalMaterial color="#1f3557" roughness={0.3} clearcoat={0.8} />
      </mesh>
      {/* Coffee */}
      <mesh position={[0, 0.5, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.385, 48]} />
        <meshPhysicalMaterial color="#2a160b" roughness={0.08} clearcoat={1} />
      </mesh>
      <mesh position={[0.43, 0.36, 0]} rotation-z={Math.PI / 2} castShadow>
        <torusGeometry args={[0.15, 0.03, 12, 32, Math.PI]} />
        <meshPhysicalMaterial
          color="#f1efe8"
          roughness={0.25}
          clearcoat={0.8}
        />
      </mesh>
    </group>
  )
}

function Pencil(props: React.ComponentProps<'group'>) {
  return (
    <group {...props} rotation-z={Math.PI / 2}>
      <mesh castShadow>
        <cylinderGeometry args={[0.022, 0.022, 1.1, 6]} />
        <meshStandardMaterial color="#e3a72f" roughness={0.45} />
      </mesh>
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.004, 0.1, 6]} />
        <meshStandardMaterial color="#e8cfa4" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.655, 0]}>
        <coneGeometry args={[0.004, 0.012, 6]} />
        <meshStandardMaterial color="#333" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.58, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.024, 0.06, 16]} />
        <meshStandardMaterial color="#b9b9b5" metalness={1} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.635, 0]} castShadow>
        <cylinderGeometry args={[0.022, 0.022, 0.05, 16]} />
        <meshStandardMaterial color="#e48a8a" roughness={0.8} />
      </mesh>
    </group>
  )
}
