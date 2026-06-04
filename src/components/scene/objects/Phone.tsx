'use client'

export function Phone() {
  return (
    <group position={[0.65, 0.085, 0.52]} rotation-y={0.3}>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.32, 0.625, 0.04]} />
        <meshStandardMaterial color="#1a1a1e" roughness={0.15} metalness={0.6} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0, 0.021]}>
        <boxGeometry args={[0.29, 0.58, 0.001]} />
        <meshStandardMaterial
          color="#0d1117"
          emissive="#0a1535"
          emissiveIntensity={0.6}
          roughness={0.05}
        />
      </mesh>

      {/* Home indicator */}
      <mesh position={[0, -0.24, 0.022]}>
        <boxGeometry args={[0.08, 0.004, 0.001]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Camera notch */}
      <mesh position={[0, 0.265, 0.022]}>
        <boxGeometry args={[0.07, 0.018, 0.001]} />
        <meshStandardMaterial color="#0d1117" roughness={0.5} />
      </mesh>

      {/* Side buttons */}
      <mesh position={[0.162, 0.05, 0]}>
        <boxGeometry args={[0.004, 0.08, 0.025]} />
        <meshStandardMaterial color="#2a2a2e" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.162, -0.06, 0]}>
        <boxGeometry args={[0.004, 0.055, 0.025]} />
        <meshStandardMaterial color="#2a2a2e" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  )
}
