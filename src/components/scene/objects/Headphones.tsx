'use client'

const HEADPHONE_COLOR = '#e8e0d5'
const CUSHION_COLOR = '#c8b89a'
const ACCENT_COLOR = '#d4a853'

export function Headphones() {
  return (
    <group position={[-1.55, 0.12, 0.55]} rotation-y={-0.3}>
      {/* Headband arc */}
      <mesh rotation-z={Math.PI / 2} rotation-x={0.15}>
        <torusGeometry args={[0.38, 0.055, 12, 32, Math.PI]} />
        <meshStandardMaterial color={HEADPHONE_COLOR} roughness={0.3} metalness={0.4} />
      </mesh>

      {/* Left ear cup */}
      <group position={[-0.38, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.09, 24]} />
          <meshStandardMaterial color={HEADPHONE_COLOR} roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.055, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.02, 24]} />
          <meshStandardMaterial color={CUSHION_COLOR} roughness={0.9} metalness={0} />
        </mesh>
        <mesh position={[0, -0.055, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.008, 24]} />
          <meshStandardMaterial color={ACCENT_COLOR} roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* Right ear cup */}
      <group position={[0.38, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.09, 24]} />
          <meshStandardMaterial color={HEADPHONE_COLOR} roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.055, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.02, 24]} />
          <meshStandardMaterial color={CUSHION_COLOR} roughness={0.9} metalness={0} />
        </mesh>
        <mesh position={[0, -0.055, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.008, 24]} />
          <meshStandardMaterial color={ACCENT_COLOR} roughness={0.4} metalness={0.6} />
        </mesh>
      </group>

      {/* Headband padding */}
      <mesh rotation-z={Math.PI / 2} rotation-x={0.15} position={[0, 0.01, 0]}>
        <torusGeometry args={[0.36, 0.03, 8, 24, Math.PI * 0.75]} />
        <meshStandardMaterial color={CUSHION_COLOR} roughness={0.9} />
      </mesh>
    </group>
  )
}
