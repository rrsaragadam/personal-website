'use client'

import { Float } from '@react-three/drei'
import { useLivery } from '@/features/livery/useLivery'

// Three small companions around the pebble: a polished aluminium ring (the
// Ive dial), a lacquered capsule in the livery's sheen colour, and a bead of
// the paint itself. They give the composition depth and a second accent.
export function Satellites({ reducedMotion }: { reducedMotion: boolean }) {
  const livery = useLivery((s) => s.livery)
  const speed = reducedMotion ? 0 : 1

  return (
    <>
      <Float speed={1.4 * speed} rotationIntensity={1.2} floatIntensity={1.4}>
        <mesh position={[-1.45, 1.15, -0.2]} rotation={[1.1, 0.3, 0.2]}>
          <torusGeometry args={[0.32, 0.075, 48, 128]} />
          <meshPhysicalMaterial
            color="#e9e9ee"
            metalness={1}
            roughness={0.18}
            clearcoat={1}
            envMapIntensity={1.4}
          />
        </mesh>
      </Float>
      <Float speed={1.1 * speed} rotationIntensity={1.6} floatIntensity={1.8}>
        <mesh position={[1.45, -0.95, 0.4]} rotation={[0.3, 0.2, 0.9]}>
          <capsuleGeometry args={[0.16, 0.42, 16, 48]} />
          <meshPhysicalMaterial
            color={livery.sheen}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={1.1}
          />
        </mesh>
      </Float>
      <Float speed={1.8 * speed} rotationIntensity={0.6} floatIntensity={2}>
        <mesh position={[-1.05, -1.2, 0.9]}>
          <sphereGeometry args={[0.14, 48, 48]} />
          <meshPhysicalMaterial
            color={livery.paint}
            roughness={0.1}
            metalness={0.3}
            clearcoat={1}
            iridescence={0.6}
          />
        </mesh>
      </Float>
    </>
  )
}
